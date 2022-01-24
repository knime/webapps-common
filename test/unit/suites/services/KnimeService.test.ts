import { JsonDataService } from 'src/services';
import { KnimeService } from 'src/services/KnimeService';
import { NodeServiceMethods, DataServiceTypes, EventTypes } from 'src/types';
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
        it('Throws error if extension config not provided', () => {
            const knimeService = new KnimeService();

            expect(() => knimeService.callService(
                [NodeServiceMethods.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            )).rejects.toThrowError('Cannot call service without extension config');
        });

        it('Throws error if callable service not provided', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(() => knimeService.callService(
                [NodeServiceMethods.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            )).rejects.toThrowError('Callable service is not available');
        });

        it('Returns the results of successful service calls', async () => {
            const result = 'test';
            const callableMock = jest.fn().mockReturnValue(Promise.resolve(new Promise(res => res({ result }))));
            const knimeService = new KnimeService(extensionConfig, callableMock);
            const testResult = await knimeService.callService(
                [NodeServiceMethods.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            );
            expect(testResult).toBe(result);
        });

        it('Rethrows backend errors with codes and messages if available', () => {
            const error = {
                code: '007',
                message: 'Shaken, not stirred.'
            };
            const callableMock = jest.fn().mockReturnValue(Promise.resolve(new Promise(res => res({ error }))));
            const knimeService = new KnimeService(extensionConfig, callableMock);
            expect(() => knimeService.callService(
                [NodeServiceMethods.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '']
            )).rejects.toThrowError('Error code: 007. Message: Shaken, not stirred.');
        });
    });

    describe('pushNotification', () => {
        it('Throws error if extension config not provided', () => {
            const knimeService = new KnimeService();

            expect(() => knimeService.pushNotification({ agent: '007', method: EventTypes.DataEvent }))
                .rejects.toThrowError('Cannot push notification without extension config');
        });

        it('Throws error if push notification not provided', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(() => knimeService.pushNotification({ agent: '007', method: EventTypes.DataEvent }))
                .rejects.toThrowError('Push notification is not available');
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

    describe('data getter callback registration', () => {
        it('Registers callback for retrieving data', () => {
            const knimeService = new KnimeService();
            const jsonDataService = new JsonDataService(knimeService);

            jsonDataService.registerDataGetter(() => {});
            expect(knimeService).toHaveProperty('dataGetter');
        });

        it('Returns default data without registered callback', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(knimeService.getData()).resolves.toEqual(null);
        });

        it('Gets data with registered callback', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const testData = { nodeName: 'something' };
            const getDataMock = jest.fn(() => testData);

            jsonDataService.registerDataGetter(getDataMock);
            expect(knimeService.getData()).resolves.toEqual(JSON.stringify(testData));
            expect(getDataMock).toHaveBeenCalledTimes(1);
        });
    });
});
