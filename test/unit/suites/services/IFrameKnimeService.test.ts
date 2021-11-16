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
            let eventListenerSpy = jest.spyOn(window, 'addEventListener');
            let postSpy = jest.spyOn(window, 'postMessage');

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
            let testMessage = {
                data: {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: extensionConfig
                }
            };

            knimeService.onMessageReceived(testMessage as MessageEvent);
            expect(knimeService.extensionConfig).toStrictEqual(extensionConfig);
        });

        describe('working with services', () => {
            let knimeService;

            beforeEach(() => {
                knimeService = new IFrameKnimeService();
                expect(knimeService.extensionConfig).toBe(null);
                let testMessage = {
                    data: {
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                        payload: extensionConfig
                    }
                };
                knimeService.onMessageReceived(testMessage as MessageEvent);
            });

            it('onMessageReceived returns false if called with unsupported prefix', () => {
                knimeService = new IFrameKnimeService();

                const spy = jest.spyOn(knimeService, 'onMessageReceived');
                knimeService.onMessageReceived({
                    data: {
                        type: `unsupported_prefix:jsonrpcResponse`,
                        payload: extensionConfig
                    }
                } as MessageEvent);

                expect(spy).toHaveReturnedWith(null);
            });

            it('onMessageReceived throws error if called with unsupported type', () => {
                knimeService = new IFrameKnimeService();

                const spy = jest.spyOn(knimeService, 'onMessageReceived');

                knimeService.onMessageReceived({
                    data: {
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:unsupported_type`,
                        payload: extensionConfig
                    }
                } as MessageEvent);

                expect(spy).toHaveReturnedWith(false);
            });

            it('onMessageReceived with supported prefix and type returns true ', () => {
                knimeService = new IFrameKnimeService();

                knimeService.executeServiceCall({
                    id: 2
                });

                const spy = jest.spyOn(knimeService, 'onMessageReceived');

                knimeService.onMessageReceived({
                    data: {
                        payload: JSON.stringify({
                            result: JSON.stringify([1, 1, 2]),
                            id: 2
                        }),
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`
                    }
                } as MessageEvent);

                expect(spy).toHaveReturnedWith(true);
            });

            it('returns error object if request takes too long', async () => {
                knimeService = new IFrameKnimeService();

                expect(
                    await knimeService.executeServiceCall({
                        id: 2
                    })
                ).toEqual({
                    error: {
                        message: 'Request with id: 2 rejected due to timeout.',
                        code: 'req-timeout'
                    },
                    result: null
                });
            });

            it('executes service calls', () => {
                let postSpy = jest.spyOn(window, 'postMessage');
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
});
