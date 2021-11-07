import { JSONDataService } from 'src/services';
import { KnimeService } from 'src/services/KnimeService';
import { NodeServiceMethods, DataServiceTypes } from 'src/types';
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

            expect(() =>
                knimeService.callService(
                    NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                    DataServiceTypes.INITIAL_DATA,
                    '',
                ),
            ).rejects.toMatchObject({
                message: `Cannot read properties of null (reading 'projectId')`,
            });
        });
    });

    describe('callService', () => {
        it('Throws error if extension config not provided', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(() =>
                knimeService.callService(
                    NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                    DataServiceTypes.INITIAL_DATA,
                    '',
                ),
            ).rejects.toMatchObject({
                message: `Method executeServiceCall should only be used by derived class`,
            });
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

        it('Calls onJsonrpcNotification if callbacks added', () => {
            const knime = new KnimeService();

            const callback = jest.fn(() => {});

            knime.addNotificationCallback('SelectionEvent', callback);

            const notification = {
                jsonrpc: '2.0',
                method: 'SelectionEvent',
                params: [
                    {
                        projectId: '...',
                        workflowId: '...',
                        nodeId: '...',
                        keys: ['Row01', 'Row02'],
                        mode: 'ADD',
                    },
                ],
            };

            window.jsonrpcNotification(notification);

            expect(callback).toBeCalled();
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
            const jsonDataService = new JSONDataService(knimeService);

            jsonDataService.registerDataGetter(() => {});
            expect(knimeService).toHaveProperty('dataGetter');
        });

        it('Returns default data without registered callback', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(knimeService.getData()).resolves.toEqual(null);
        });

        it('Gets data with registered callback', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);
            const testData = { nodeName: 'something' };
            const getDataMock = jest.fn(() => testData);

            jsonDataService.registerDataGetter(getDataMock);
            expect(knimeService.getData()).resolves.toEqual(JSON.stringify(testData));
            expect(getDataMock).toHaveBeenCalledTimes(1);
        });
    });
});
