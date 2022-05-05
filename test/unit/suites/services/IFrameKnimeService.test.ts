import { IFrameKnimeService, JsonDataService } from 'src/services';
import { NodeServices, DataServiceTypes, SelectionModes } from 'src/types';
import { extensionConfig } from 'test/mocks';
import { KnimeUtils } from 'src';

const { UI_EXT_POST_MESSAGE_PREFIX } = KnimeUtils;

jest.mock('src/constants', () => ({ UI_EXT_POST_MESSAGE_TIMEOUT: 10 }));

describe('IFrameKnimeService', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

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
            (knimeService as any).onMessageFromParent({ data: {
                type: `unsupported_prefix:callServiceResponse`,
                payload: extensionConfig
            } } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onCallServiceResponseSpy).not.toHaveBeenCalled();
        });

        it('onMessageFromParent does nothing if called with unsupported type', () => {
            (knimeService as any).onMessageFromParent({ data: {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:unsupported_type`,
                payload: extensionConfig
            } } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onCallServiceResponseSpy).not.toHaveBeenCalled();
        });

        it('calls KnimeService onJsonRpcNotification on received :jsonrpcNotification event', () => {
            const notification = {
                jsonrpc: '2.0.',
                method: NodeServices.CALL_NODE_SELECTION_SERVICE,
                params: [{
                    projectId: '001',
                    workflowId: '001',
                    nodeId: '0',
                    mode: SelectionModes.ADD,
                    keys: ['Row1', 'Row2']
                }]
            };

            (knimeService as any).onMessageFromParent({ /* eslint-disable-line no-extra-parens */
                data: {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:serviceNotification`,
                    payload: { data: notification }
                }
            } as MessageEvent);

            expect(onServiceNotificationSpy).toBeCalledWith({ data: notification });
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
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                '{"jsonrpc":"2.0","method":"getData","params":[],"id":1}'
            ]);

            /* eslint-disable-next-line no-extra-parens */
            (knimeService as any).onMessageFromParent({ data } as MessageEvent);

            expect(onInitSpy).not.toHaveBeenCalled();
            expect(onCallServiceResponseSpy).toHaveBeenCalledWith({ ...data });
        });

        it('handles error if request takes too long', () => {
            jest.useFakeTimers();
            const knimeService = new IFrameKnimeService();
            knimeService.extensionConfig = extensionConfig;
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            (knimeService as any).executeServiceCall({ id: 2 });
            jest.runAllTimers();
            expect(sendErrorSpy).toHaveBeenCalledWith({
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                code: '408',
                message: 'Request with id 2 aborted due to timeout.',
                subtitle: 'Request Timeout',
                type: 'error'
            });
            jest.clearAllTimers();
            jest.useRealTimers();
        });

        it('handles errors for responses without matching requests', () => {
            const knimeService = new IFrameKnimeService();
            knimeService.extensionConfig = extensionConfig;
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            (knimeService as any).onMessageFromParent({ data: {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:callServiceResponse`,
                payload: extensionConfig
            } } as MessageEvent);
            expect(sendErrorSpy).toHaveBeenCalledWith({
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                code: '404',
                message: 'Received callService response for non-existing pending request with id undefined',
                subtitle: 'Request not found',
                type: 'error'
            });
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
                        NodeServices.CALL_NODE_DATA_SERVICE,
                        DataServiceTypes.DATA,
                        expect.stringContaining('getData')
                    ]
                },
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:callService`
            }, '*');
        });
    });
});
