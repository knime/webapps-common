import { JsonDataService } from 'src/services';
import { KnimeService } from 'src/services/KnimeService';
import { NodeServiceMethods, DataServiceTypes } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';
import { extensionConfig } from 'test/mocks/extensionConfig';

describe('KnimeService', () => {
    describe('initialization', () => {
        it('Creates KnimeService', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(knimeService).toHaveProperty('extensionConfig');

            expect(knimeService.extensionConfig).toEqual(extensionConfig);
        });
    });

    describe('callService', () => {
        it('Throws error if extension config not provided', () => {
            const knimeService = new KnimeService();

            expect(() => knimeService.callService(createJsonRpcRequest(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                [DataServiceTypes.INITIAL_DATA, '']
            ))).rejects.toThrowError('Cannot call service without extension config');
        });

        it('Throws error if callable service not provided', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(() => knimeService.callService(createJsonRpcRequest(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                [DataServiceTypes.INITIAL_DATA, '']
            ))).rejects.toThrowError('Callable service is not available');
        });

        it('Returns the results of successful service calls', async () => {
            const result = 'test';
            const callableMock = jest.fn().mockReturnValue(Promise.resolve(new Promise(res => res({ result }))));
            const knimeService = new KnimeService(extensionConfig, callableMock);
            const testResult = await knimeService.callService(createJsonRpcRequest(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                [DataServiceTypes.INITIAL_DATA, '']
            ));
            expect(testResult).toBe(result);
        });

        it('Rethrows backend errors with codes and messages if available', () => {
            const error = {
                code: '007',
                message: 'Shaken, not stirred.'
            };
            const callableMock = jest.fn().mockReturnValue(Promise.resolve(new Promise(res => res({ error }))));
            const knimeService = new KnimeService(extensionConfig, callableMock);
            expect(() => knimeService.callService(createJsonRpcRequest(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                [DataServiceTypes.INITIAL_DATA, '']
            ))).rejects.toThrowError('Error code: 007. Message: Shaken, not stirred.');
        });
    });

    describe('notifications', () => {
        beforeEach(() => {
            window.jsonrpcNotification = null;
        });

        it('Adds notification callback with addNotificationCallback', () => {
            const knime = new KnimeService();

            const callback = () => {};

            knime.addNotificationCallback('SelectionEvent', callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')[0]).toEqual(callback);
        });

        it('Removes notification callback with removeNotificationCallback', () => {
            const knime = new KnimeService();

            const callback = () => {};

            knime.addNotificationCallback('SelectionEvent', callback);
            knime.removeNotificationCallback('SelectionEvent', callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent').length === 0);
        });

        it('Resets notification callbacks by type with resetNotificationCallbacksByType', () => {
            const knime = new KnimeService();

            knime.addNotificationCallback('SelectionEvent', () => {});
            knime.addNotificationCallback('CustomEvent', () => {});
            knime.resetNotificationCallbacksByType('SelectionEvent');

            expect(knime.notificationCallbacksMap.get('SelectionEvent').length === 0);
            expect(knime.notificationCallbacksMap.get('CustomEvent').length === 1);
        });

        it('Resets all notification callbacks with resetNotificationCallbacks', () => {
            const knime = new KnimeService();

            knime.addNotificationCallback('SelectionEvent', () => {});
            knime.addNotificationCallback('CustomEvent', () => {});
            knime.resetNotificationCallbacksByType('SelectionEvent');

            expect(knime.notificationCallbacksMap.get('SelectionEvent').length === 0);
            expect(knime.notificationCallbacksMap.get('CustomEvent').length === 0);
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
