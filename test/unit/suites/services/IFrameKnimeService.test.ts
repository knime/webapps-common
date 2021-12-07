import { IFrameKnimeService, JsonDataService } from 'src/services';
import { extensionConfig } from 'test/mocks';

jest.mock('src/constants', () => ({
    JSON_RPC_VERSION: '2.0',
    UI_EXT_POST_MESSAGE_PREFIX: 'prefix',
    UI_EXT_POST_MESSAGE_TIMEOUT: 10
}));

import { UI_EXT_POST_MESSAGE_PREFIX, JSON_RPC_VERSION } from 'src/constants';

describe('IFrameKnimeService', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('initialization', () => {
        it('Creates IFrameKnimeService', () => {
            const eventListenerSpy = jest.spyOn(window, 'addEventListener');
            const postSpy = jest.spyOn(window, 'postMessage');

            new IFrameKnimeService();
            expect(eventListenerSpy).toHaveBeenCalledWith('message', expect.any(Function));
            expect(postSpy).toHaveBeenCalledWith(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`
                },
                '*'
            );
        });

        it('registers extension config', () => {
            const knimeService = new IFrameKnimeService();
            expect(knimeService.extensionConfig).toBe(null);
            const testMessage = {
                data: {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: extensionConfig
                }
            };
            (knimeService as any).onMessageFromParent(/* eslint-disable-line no-extra-parens */
                testMessage as MessageEvent
            );
            expect(knimeService.extensionConfig).toStrictEqual(extensionConfig);
        });
    });

    describe('postMessage communication', () => {
        let knimeService, onInitSpy, onJsonRpcResponseSpy;

        beforeEach(() => {
            knimeService = new IFrameKnimeService();
            onInitSpy = jest.spyOn(knimeService, 'onInit');
            onJsonRpcResponseSpy = jest.spyOn(knimeService, 'onJsonRpcResponse');
        });

        it('onMessageFromParent does nothing if called with unsupported prefix', () => {
            (knimeService as any).onMessageFromParent({ /* eslint-disable-line no-extra-parens */

                data: {
                    type: `unsupported_prefix:jsonrpcResponse`,
                    payload: extensionConfig
                }
            } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onJsonRpcResponseSpy).not.toHaveBeenCalled();
        });

        it('onMessageFromParent does nothing if called with unsupported type', () => {
            (knimeService as any).onMessageFromParent({ /* eslint-disable-line no-extra-parens */

                data: {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:unsupported_type`,
                    payload: extensionConfig
                }
            } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onJsonRpcResponseSpy).not.toHaveBeenCalled();
        });

        it('onMessageFromParent handles async post requests with differing IDs', () => {
            const requestId = 2;
            const data = {
                payload: {
                    response: JSON.stringify({
                        result: [1, 1, 2],
                        id: 3
                    }),
                    requestId
                },
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`
            };
            knimeService.executeServiceCall({
                id: requestId
            });

            /* eslint-disable-next-line no-extra-parens */
            (knimeService as any).onMessageFromParent({ data } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onJsonRpcResponseSpy).toHaveBeenCalledWith({ ...data });
        });

        it('returns error if request takes too long', async () => {
            expect(await knimeService.executeServiceCall({ id: 2 })).toEqual(
                '{"error":{"message":"Request with id 2 aborted due to timeout.","code":"req-timeout"},"result":null}'
            );
        });

        it('executes service calls', () => {
            const postSpy = jest.spyOn(window, 'postMessage');
            const testMessage = {
                data: {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: extensionConfig
                }
            };

            (knimeService as any).onMessageFromParent(/* eslint-disable-line no-extra-parens */
                testMessage as MessageEvent
            );
            const knimeJsonDataService = new JsonDataService(knimeService);
            knimeJsonDataService.data();


            expect(postSpy).toHaveBeenCalledWith(
                {
                    payload: {
                        id: 2,
                        jsonrpc: JSON_RPC_VERSION,
                        method: 'NodeService.callNodeDataService',
                        params: [
                            'knime workflow',
                            'root:10',
                            '123',
                            'view',
                            'data',
                            '{"jsonrpc":"2.0","method":"getData","params":[],"id":1}'
                        ]
                    },
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`
                },
                '*'
            );
        });
    });
});
