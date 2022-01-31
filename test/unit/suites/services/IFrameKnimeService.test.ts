import { IFrameKnimeService, JsonDataService } from 'src/services';
import { NodeServiceMethods, DataServiceTypes, SelectionServiceTypes } from 'src/types';
import { extensionConfig } from 'test/mocks';
import { KnimeUtils } from 'src';

const { UI_EXT_POST_MESSAGE_PREFIX } = KnimeUtils;

jest.mock('src/constants', () => ({ UI_EXT_POST_MESSAGE_TIMEOUT: 10 }));

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

        it('waits for extentionConfig is resolved in waitForInitialization', async () => {
            const knimeService = new IFrameKnimeService();
            (knimeService as any).onInit({ payload: extensionConfig });
            await expect(knimeService.waitForInitialization()).resolves.toBe(undefined);
        });
    });

    describe('postMessage communication', () => {
        let knimeService, onInitSpy, onCallServiceResponseSpy, onServiceNotificationSpy;

        beforeEach(() => {
            knimeService = new IFrameKnimeService();
            onInitSpy = jest.spyOn(knimeService, 'onInit');
            onCallServiceResponseSpy = jest.spyOn(knimeService, 'onCallServiceResponse');
            onServiceNotificationSpy = jest.spyOn(knimeService, 'onServiceNotification');
        });

        it('onMessageFromParent does nothing if called with unsupported prefix', () => {
            (knimeService as any).onMessageFromParent({ /* eslint-disable-line no-extra-parens */

                data: {
                    type: `unsupported_prefix:callServiceResponse`,
                    payload: extensionConfig
                }
            } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onCallServiceResponseSpy).not.toHaveBeenCalled();
        });

        it('onMessageFromParent does nothing if called with unsupported type', () => {
            (knimeService as any).onMessageFromParent({ /* eslint-disable-line no-extra-parens */

                data: {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:unsupported_type`,
                    payload: extensionConfig
                }
            } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onCallServiceResponseSpy).not.toHaveBeenCalled();
        });

        it('Calls KnimeService onJsonRpcNotification on received :jsonrpcNotification event', () => {
            const notification = {
                jsonrpc: '2.0.',
                method: NodeServiceMethods.CALL_NODE_SELECTION_SERVICE,
                params: [{
                    projectId: '001',
                    workflowId: '001',
                    nodeId: '0',
                    mode: SelectionServiceTypes.ADD,
                    keys: ['Row1', 'Row2']
                }]
            };

            (knimeService as any).onMessageFromParent({ /* eslint-disable-line no-extra-parens */
                data: {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:serviceNotification`,
                    payload: notification
                }
            } as MessageEvent);

            expect(onServiceNotificationSpy).toBeCalledWith(notification);
        });

        it('onMessageFromParent handles async post requests with differing IDs', () => {
            const requestId = 1;
            const data = {
                payload: {
                    response: JSON.stringify({
                        result: [1, 1, 2],
                        id: 2
                    }),
                    requestId
                },
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:callServiceResponse`
            };
            knimeService.executeServiceCall([
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                '{"jsonrpc":"2.0","method":"getData","params":[],"id":1}'
            ]);

            /* eslint-disable-next-line no-extra-parens */
            (knimeService as any).onMessageFromParent({ data } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onCallServiceResponseSpy).toHaveBeenCalledWith({ ...data });
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


            expect(postSpy).toHaveBeenCalledWith({
                payload: {
                    requestId: expect.any(Number),
                    serviceParams: [
                        NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                        DataServiceTypes.DATA,
                        expect.stringContaining('getData')
                    ]
                },
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:callService`
            }, '*');
        });
    });
});
