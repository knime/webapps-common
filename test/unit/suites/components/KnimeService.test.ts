import { KnimeService, JSONDataService } from 'src';
import { NodeServiceTypes, DataServiceTypes } from 'src/types';
import { extensionConfig } from 'test/mocks/extensionConfig';

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.method === NodeServiceTypes.CALL_NODE_DATA_SERVICE) {
        return JSON.stringify({ result: JSON.stringify({}) });
    }

    const error: any = new Error('Unsupported params');

    throw error;
};

describe('KnimeService', () => {
    describe('initialization', () => {
        it('Creates KnimeService', () => {
            const knimeService = new KnimeService(extensionConfig);

            expect(knimeService).toHaveProperty('extensionConfig');

            expect(knimeService.extensionConfig).toEqual(extensionConfig);
        });
    });

    describe('callService', () => {
        beforeEach(() => {
            window.jsonrpc = jsonrpc;
        });

        afterEach(() => {
            delete window.jsonrpc;
        });

        it('Throws error if jsonrpc unsupported', () => {
            delete window.jsonrpc;
            const knimeService = new KnimeService();
            expect(() => knimeService.callService(
                NodeServiceTypes.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA,
                ''
            )).toThrowError(`Current environment doesn't support window.jsonrpc()`);
        });

        it('Throws error if extension config not provided', () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new KnimeService();

            expect(() => knimeService.callService(
                NodeServiceTypes.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA,
                ''
            )).toThrowError(`Cannot read properties of null (reading 'projectId')`);
            expect(rpcSpy).not.toHaveBeenCalled();
        });

        it('Calls data service', () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new KnimeService(extensionConfig);

            knimeService.callService(
                NodeServiceTypes.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA,
                ''
            );
            expect(rpcSpy).toHaveBeenCalledWith('{"jsonrpc":"2.0","method":"NodeService.callNodeDataService",' +
                '"params":["knime workflow","root:10","123","view","initial_data",""],"id":1}');
        });

        it('Throws error if called with unsupported rpc service', () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new KnimeService(extensionConfig);

            expect(() => knimeService.callService(
                'UnsupportedService.unknownMethod' as NodeServiceTypes,
                DataServiceTypes.INITIAL_DATA,
                ''
            )).toThrowError('Unsupported params');
            expect(rpcSpy).toHaveBeenCalledWith('{"jsonrpc":"2.0","method":"UnsupportedService.unknownMethod",' +
                '"params":["knime workflow","root:10","123","view","initial_data",""],"id":2}');
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
            let getDataMock = jest.fn(() => testData);

            jsonDataService.registerDataGetter(getDataMock);

            expect(knimeService.getData()).resolves.toEqual(JSON.stringify(testData));
            expect(getDataMock).toHaveBeenCalledTimes(1);
        });
    });
});

describe('KnimeService notifications', () => {
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
                    mode: 'ADD'
                }
            ]
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
