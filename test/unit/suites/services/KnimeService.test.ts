import { JsonDataService } from 'src/services';
import { KnimeService } from 'src/services/KnimeService';
import { NodeServices, DataServiceTypes, EventTypes, ServiceParameters } from 'src/types';
import { AlertTypes } from 'src/types/AlertTypes';
import { extensionConfig } from 'test/mocks/extensionConfig';

describe('KnimeService', () => {
    const invalidEvent = 'CustomEvent' as keyof typeof EventTypes;

    describe('initialization', () => {
        it('Creates KnimeService', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(knimeService).toHaveProperty('extensionConfig');

            expect(knimeService.extensionConfig).toEqual(extensionConfig);
        });

        it('has a serviceId getter', () => {
            const knimeService = new KnimeService(extensionConfig);
            expect(knimeService.serviceId).toEqual('123.knime workflow.root:10.view');
        });
    });

    describe('callService', () => {
        it('Throws error if extension config not provided', async () => {
            const knimeService = new KnimeService(null, null, jest.fn());
            const response = await knimeService.callService(
                [NodeServices.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            );
            expect(response).toStrictEqual({
                error: {
                    code: undefined,
                    message: 'Cannot call service without extension config',
                    nodeId: 'MISSING',
                    nodeInfo: {},
                    subtitle: 'Missing extension config',
                    type: 'error'
                }
            });
        });

        it('Throws error if callable service not provided', async () => {
            const knimeService = new KnimeService(extensionConfig, null, jest.fn());
            const response = await knimeService.callService(
                [NodeServices.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            );
            expect(response).toStrictEqual({
                error: {
                    code: undefined,
                    message: 'Callable service is not available',
                    nodeId: extensionConfig.nodeId,
                    nodeInfo: extensionConfig.nodeInfo,
                    subtitle: 'Service not found',
                    type: 'error'
                }
            });
        });

        it('Returns the results of successful service calls', async () => {
            const result = 'test';
            const serviceParams =
                [NodeServices.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, ''] as ServiceParameters;
            const callableMock = jest.fn().mockReturnValue(Promise.resolve(new Promise(res => res({ result }))));
            const knimeService = new KnimeService(extensionConfig, callableMock);
            const testResult = await knimeService.callService(serviceParams);
            expect(callableMock).toHaveBeenCalledWith(...serviceParams);
            expect(testResult).toBe(result);
        });
    });

    describe('pushNotification', () => {
        it('Throws error if extension config not provided', async () => {
            const knimeService = new KnimeService(null, null, jest.fn());

            const response = await knimeService.pushNotification({ agent: '007', method: EventTypes.DataEvent });
            expect(response).toStrictEqual({
                error: {
                    code: undefined,
                    message: 'Cannot push notification without extension config',
                    nodeId: 'MISSING',
                    nodeInfo: {},
                    subtitle: 'Missing extension config',
                    type: 'error'
                }
            });
        });

        it('Throws error if push notification not provided', async () => {
            const knimeService = new KnimeService(extensionConfig);

            const response = await knimeService.pushNotification({ agent: '007', method: EventTypes.DataEvent });
            expect(response).toStrictEqual({
                error: {
                    code: undefined,
                    message: 'Push notification is not available',
                    nodeId: extensionConfig.nodeId,
                    nodeInfo: extensionConfig.nodeInfo,
                    subtitle: 'Push notification failed',
                    type: 'error'
                }
            });
        });

        it('Pushes notifications successfully', () => {
            const callableMock = jest.fn();
            const pushNotificationMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callableMock, pushNotificationMock);
            const testEvent = { agent: '007', method: EventTypes.DataEvent };
            knimeService.pushNotification(testEvent);
            expect(pushNotificationMock).toHaveBeenCalledWith({
                callerId: '123.knime workflow.root:10.view',
                ...testEvent
            });
        });
    });

    describe('event handling', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('Adds event callback with addNotificationCallback', () => {
            const knime = new KnimeService();

            const callback = () => {};

            knime.addNotificationCallback(EventTypes.SelectionEvent, callback);

            expect(knime.notificationCallbacksMap.get(EventTypes.SelectionEvent)[0]).toEqual(callback);
        });

        it('Removes notification callback with removeNotificationCallback', () => {
            const knime = new KnimeService();

            const callback = () => {};

            knime.addNotificationCallback(EventTypes.SelectionEvent, callback);
            knime.removeNotificationCallback(EventTypes.SelectionEvent, callback);

            expect(knime.notificationCallbacksMap.get(EventTypes.SelectionEvent).length === 0);
        });

        it('Resets notification callbacks by type with resetNotificationCallbacksByType', () => {
            const knime = new KnimeService();

            knime.addNotificationCallback(EventTypes.SelectionEvent, () => {});
            expect(knime.notificationCallbacksMap.get(EventTypes.SelectionEvent).length === 1);
            knime.resetNotificationCallbacksByType(EventTypes.SelectionEvent);

            expect(knime.notificationCallbacksMap.get(EventTypes.SelectionEvent).length === 0);
        });

        it('Resets all notification callbacks with resetNotificationCallbacks', () => {
            const knime = new KnimeService();

            knime.addNotificationCallback(EventTypes.SelectionEvent, () => {});
            expect(knime.notificationCallbacksMap.size === 1);
            knime.resetNotificationCallbacks();

            expect(knime.notificationCallbacksMap.size === 0);
        });

        it('Calls notification callback when a notification with correct type was received', () => {
            const knime = new KnimeService();
            const callback = jest.fn();

            knime.addNotificationCallback(EventTypes.SelectionEvent, callback);
            knime.onServiceNotification({
                method: EventTypes.SelectionEvent
            } as any);

            expect(callback).toHaveBeenCalledWith({
                method: EventTypes.SelectionEvent
            });
        });

        it(`Doesn't call notification callback when a notification with different type was received`, () => {
            const knime = new KnimeService();
            const callback = jest.fn();

            knime.addNotificationCallback(EventTypes.SelectionEvent, callback);
            knime.onServiceNotification({
                method: invalidEvent
            } as any);

            expect(callback).not.toHaveBeenCalledWith({
                method: invalidEvent
            });
        });
    });

    describe('error handling', () => {
        const mockError = {
            code: '007',
            message: 'Shaken, not stirred.'
        };

        it('creates default alert', () => {
            const knimeService = new KnimeService(extensionConfig);
            const defaultAlert = knimeService.createAlert({});
            expect(defaultAlert.type).toStrictEqual(AlertTypes.ERROR);
            expect(defaultAlert.nodeId).toStrictEqual(extensionConfig.nodeId);
            expect(defaultAlert.nodeInfo).toStrictEqual(extensionConfig.nodeInfo);
        });

        it('creates defined alert', () => {
            const knimeService = new KnimeService(extensionConfig);
            const alertParams = {
                type: AlertTypes.ERROR,
                code: 404,
                message: 'Service not found',
                subtitle: 'JSONDataService does not exist on node MISSING'
            };
            expect(knimeService.createAlert(alertParams)).toStrictEqual({
                ...alertParams,
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo
            });
        });

        it('sends errors', () => {
            const pushNotificationMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, jest.fn(), pushNotificationMock);
            const alert = knimeService.createAlert(mockError);
            knimeService.sendError(alert);
            expect(pushNotificationMock).toHaveBeenCalledWith({
                alert,
                callerId: '123.knime workflow.root:10.view',
                type: 'alert'
            });
        });

        it('sends warnings', () => {
            const pushNotificationMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, jest.fn(), pushNotificationMock);
            const alert = knimeService.createAlert(mockError);
            knimeService.sendWarning(alert);
            expect(pushNotificationMock).toHaveBeenCalledWith({
                alert,
                callerId: '123.knime workflow.root:10.view',
                type: 'alert'
            });
        });

        it('Returns backend errors and pushes them via notification', async () => {
            const callableMock = jest.fn()
                .mockReturnValue(Promise.resolve(new Promise(res => res({ error: mockError }))));
            const pushNotificationMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callableMock, pushNotificationMock);
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            const testResult = await knimeService.callService([NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA, '']);
            expect(testResult).toStrictEqual({ error: mockError });
            expect(sendErrorSpy).toHaveBeenCalledWith(mockError);
        });
    });

    describe('data getter callback registration', () => {
        it('Registers callback for retrieving data', () => {
            const knimeService = new KnimeService();
            const jsonDataService = new JsonDataService(knimeService);

            jsonDataService.registerDataGetter(() => {});
            expect(knimeService).toHaveProperty('dataGetter');
        });

        it('Returns default data without registered callback', async () => {
            const knimeService = new KnimeService(extensionConfig);

            const response = await knimeService.getData();
            expect(response).toStrictEqual(null);
        });

        it('Gets data with registered callback', async () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const testData = { nodeName: 'something' };
            const getDataMock = jest.fn(() => testData);

            jsonDataService.registerDataGetter(getDataMock);
            const response = await knimeService.getData();
            expect(response).toStrictEqual(JSON.stringify(testData));
            expect(getDataMock).toHaveBeenCalledTimes(1);
        });
    });
});
