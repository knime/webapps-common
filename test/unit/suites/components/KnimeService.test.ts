import { KnimeService, JSONDataService } from 'src';
import { RPCNodeServices, DataServices } from 'src/types';
import { extensionConfig } from 'test/mocks/extensionConfig';

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.method === RPCNodeServices.CALL_NODE_DATA_SERVICE) {
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
        it('Throws error if jsonrpc unsupported', () => {
            const knimeService = new KnimeService();
            expect(() => knimeService.callService(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.INITIAL_DATA,
                ''
            )).toThrowError(`Current environment doesn't support window.jsonrpc()`);
        });

        it('Throws error if extension config not provided', () => {
            window.jsonrpc = jsonrpc;
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new KnimeService();

            expect(() => knimeService.callService(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.INITIAL_DATA,
                ''
            )).toThrowError(`Cannot read property 'projectId' of null`);
            expect(rpcSpy).not.toHaveBeenCalled();
            delete window.jsonrpc;
        });

        it('Calls data service', () => {
            window.jsonrpc = jsonrpc;
            let rpcSpy = jest.spyOn(window, 'jsonrpc');
            
            const knimeService = new KnimeService(extensionConfig);

            knimeService.callService(RPCNodeServices.CALL_NODE_DATA_SERVICE, DataServices.INITIAL_DATA, '');
            expect(rpcSpy).toHaveBeenCalledWith('{"jsonrpc":"2.0","method":"NodeService.callNodeDataService",' +
                '"params":["knime workflow","root:10","123","view","initial_data",""],"id":1}');
            delete window.jsonrpc;
        });

        it('Throws error if called with unsupported rpc service', () => {
            window.jsonrpc = jsonrpc;
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new KnimeService(extensionConfig);

            expect(() => knimeService.callService(
                'Unsupported.Service' as RPCNodeServices,
                DataServices.INITIAL_DATA,
                ''
            )).toThrowError('Unsupported params');
            expect(rpcSpy).toHaveBeenCalledWith('{"jsonrpc":"2.0","method":"Unsupported.Service","params":' +
                '["knime workflow","root:10","123","view","initial_data",""],"id":2}');
            delete window.jsonrpc;
        });
    });

    describe('dataToApply', () => {
        it('Registers callback for retrieving data', () => {
            const knimeService = new KnimeService();
            const jsonDataService = new JSONDataService(knimeService);

            jsonDataService.registerGetDataToApply(() => {});
            expect(knimeService).toHaveProperty('registeredGetDataToApply');
            delete window.jsonrpc;
        });

        it('Gets data with registered callback', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);

            const testData = { nodeName: 'something' };
            let getDataMock = jest.fn(() => testData);

            jsonDataService.registerGetDataToApply(getDataMock);

            expect(knimeService.getDataToApply()).resolves.toEqual(JSON.stringify(testData));
            expect(getDataMock).toHaveBeenCalledTimes(1);
            delete window.jsonrpc;
        });
    });
});
