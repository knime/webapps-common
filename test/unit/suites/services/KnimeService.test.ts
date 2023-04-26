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
        it('Handles error if extension config not provided', async () => {
            const knimeService = new KnimeService(null, null, jest.fn());
            const sendErrorMock = jest.spyOn(knimeService, 'sendError');
            const response = await knimeService.callService(
                [NodeServices.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            );
            // Expect no rejected promise or thrown errors; else failure
            expect(response).toStrictEqual({});
            expect(sendErrorMock).toHaveBeenCalledWith({
                code: undefined,
                message: 'Cannot call service without extension config',
                nodeId: 'MISSING',
                nodeInfo: {},
                subtitle: 'Missing extension config',
                type: 'error'
            });
        });

        it('Handles error if callable service not provided', async () => {
            const knimeService = new KnimeService(extensionConfig, null, jest.fn());
            const sendErrorMock = jest.spyOn(knimeService, 'sendError');
            const response = await knimeService.callService(
                [NodeServices.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            );
            // Expect no rejected promise or thrown errors; else failure
            expect(response).toStrictEqual({});
            expect(sendErrorMock).toHaveBeenCalledWith({
                code: undefined,
                message: 'Callable service is not available',
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: 'Service not found',
                type: 'error'
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
            expect(testResult).toStrictEqual({ result });
        });
    });

    describe('pushEvent', () => {
        it('Handles error if extension config not provided', async () => {
            const knimeService = new KnimeService(null, null, jest.fn());
            const sendErrorMock = jest.spyOn(knimeService, 'sendError');
            const response = await knimeService.pushEvent({ agent: '007', eventType: EventTypes.DataEvent });
            expect(response).toStrictEqual({});
            expect(sendErrorMock).toHaveBeenCalledWith({
                code: undefined,
                message: 'Cannot push event without extension config',
                nodeId: 'MISSING',
                nodeInfo: {},
                subtitle: 'Missing extension config',
                type: 'error'
            });
        });

        it('Handles error if push event not provided', async () => {
            const knimeService = new KnimeService(extensionConfig);
            const sendErrorMock = jest.spyOn(knimeService, 'sendError');

            const response = await knimeService.pushEvent({ agent: '007', eventType: EventTypes.DataEvent });
            expect(response).toStrictEqual({});
            expect(sendErrorMock).toHaveBeenCalledWith({
                code: undefined,
                message: 'Push event is not available',
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: 'Push event failed',
                type: 'error'
            });
        });

        it('Pushes event successfully', () => {
            const callableMock = jest.fn();
            const pushEventMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callableMock, pushEventMock);
            const testEvent = { agent: '007', eventType: EventTypes.DataEvent };
            knimeService.pushEvent(testEvent);
            expect(pushEventMock).toHaveBeenCalledWith({
                callerId: '123.knime workflow.root:10.view',
                ...testEvent
            });
        });
    });

    describe('event handling', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('Adds event callback with addEventCallback', () => {
            const knime = new KnimeService();

            const callback = () => {};

            knime.addEventCallback(EventTypes.SelectionEvent, callback);

            expect(knime.eventCallbacksMap.get(EventTypes.SelectionEvent)[0]).toEqual(callback);
        });

        it('Removes event callback with removeEventCallback', () => {
            const knime = new KnimeService();

            const callback = () => {};

            knime.addEventCallback(EventTypes.SelectionEvent, callback);
            knime.removeEventCallback(EventTypes.SelectionEvent, callback);

            expect(knime.eventCallbacksMap.get(EventTypes.SelectionEvent).length === 0);
        });

        it('Resets event callbacks by type with resetEventCallbacksByType', () => {
            const knime = new KnimeService();

            knime.addEventCallback(EventTypes.SelectionEvent, () => {});
            expect(knime.eventCallbacksMap.get(EventTypes.SelectionEvent).length === 1);
            knime.resetEventCallbacksByType(EventTypes.SelectionEvent);

            expect(knime.eventCallbacksMap.get(EventTypes.SelectionEvent).length === 0);
        });

        it('Resets all event callbacks with resetEventCallbacks', () => {
            const knime = new KnimeService();

            knime.addEventCallback(EventTypes.SelectionEvent, () => {});
            expect(knime.eventCallbacksMap.size === 1);
            knime.resetEventCallbacks();

            expect(knime.eventCallbacksMap.size === 0);
        });

        it('Calls event callback when an event with correct type was received', () => {
            const knime = new KnimeService();
            const callback = jest.fn();

            knime.addEventCallback(EventTypes.SelectionEvent, callback);
            knime.onServiceEvent({
                eventType: EventTypes.SelectionEvent
            } as any);

            expect(callback).toHaveBeenCalledWith({
                eventType: EventTypes.SelectionEvent
            });
        });

        it(`Doesn't call event callback when an event with different type was received`, () => {
            const knime = new KnimeService();
            const callback = jest.fn();

            knime.addEventCallback(EventTypes.SelectionEvent, callback);
            knime.onServiceEvent({
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
            const pushEventMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, jest.fn(), pushEventMock);
            const alert = knimeService.createAlert(mockError);
            knimeService.sendError(alert);
            expect(pushEventMock).toHaveBeenCalledWith({
                alert,
                callerId: '123.knime workflow.root:10.view',
                type: 'alert'
            });
        });

        it('sends warnings', () => {
            const pushEventMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, jest.fn(), pushEventMock);
            const alert = knimeService.createAlert(mockError);
            knimeService.sendWarning(alert);
            expect(pushEventMock).toHaveBeenCalledWith({
                alert,
                callerId: '123.knime workflow.root:10.view',
                type: 'alert'
            });
        });

        it('Pushes backend errors via event', async () => {
            const callableMock = jest.fn()
                .mockReturnValue(Promise.resolve(new Promise(res => res({ error: mockError }))));
            const pushEventMock = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callableMock, pushEventMock);
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            const testResult = await knimeService.callService([NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA, '']);
            expect(testResult).toStrictEqual({ result: undefined });
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
