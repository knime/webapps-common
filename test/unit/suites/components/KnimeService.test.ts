import { KnimeService, JSONDataService } from 'src';
import { JSONRpcServices, DataServiceTypes } from 'src/types';
import { extensionConfig } from 'test/mocks/extensionConfig';

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.method === JSONRpcServices.CALL_NODE_DATA_SERVICE) {
        return JSON.stringify({ result: JSON.stringify({}) });
    }

    const error: any = new Error('Unsupported params');

    throw error;
};

describe('KnimeService initialization', () => {
    it('Creates KnimeService', () => {
        const knime = new KnimeService(extensionConfig);

        expect(knime).toHaveProperty('extensionConfig');

        expect(knime.extensionConfig).toEqual(extensionConfig);
    });
});

describe('KnimeService callService', () => {
    it('Throws error if jsonrpc unsupported', () => {
        const knime = new KnimeService();
        expect(() => knime.callService(
            JSONRpcServices.CALL_NODE_DATA_SERVICE,
            DataServiceTypes.INITIAL_DATA,
            ''
        )).toThrowError(`Current environment doesn't support window.jsonrpc()`);
    });

    it('Throws error if extension config not provided', () => {
        window.jsonrpc = jsonrpc;
        let rpcSpy = jest.spyOn(window, 'jsonrpc');

        const knime = new KnimeService();

        expect(knime.callService(
            JSONRpcServices.CALL_NODE_DATA_SERVICE,
            DataServiceTypes.INITIAL_DATA,
            ''
        )).toThrowError(`Cannot read properties of null (reading 'projectId')`);
        expect(rpcSpy).not.toHaveBeenCalled();
    });

    it('Calls data service', () => {
        window.jsonrpc = jsonrpc;
        let rpcSpy = jest.spyOn(window, 'jsonrpc');
        
        const knime = new KnimeService(extensionConfig);

        knime.callService(JSONRpcServices.CALL_NODE_DATA_SERVICE, DataServiceTypes.INITIAL_DATA, '');
        expect(rpcSpy).toHaveBeenCalledWith('{"jsonrpc":"2.0","method":"NodeService.callNodeViewDataService",' +
            '"params":["knime workflow","root:10","123","initial_data",""],"id":1}');
    });

    it('Throws error if called with unsupported rpc service', () => {
        window.jsonrpc = jsonrpc;
        let rpcSpy = jest.spyOn(window, 'jsonrpc');

        const knime = new KnimeService(extensionConfig);

        expect(() => knime.callService(
            'Unsupported.Service' as JSONRpcServices,
            DataServiceTypes.INITIAL_DATA,
            ''
        )).toThrowError('Unsupported params');
        expect(rpcSpy).toHaveBeenCalledWith('{"jsonrpc":"2.0","method":"Unsupported.Service","params":' +
            '["knime workflow","root:10","123","initial_data",""],"id":2}');
    });
});

describe('KnimeService dataToApply', () => {
    it('Registers callback for retrieving data', () => {
        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        jsonDataService.registerGetDataToApply(() => {});
        expect(knime).toHaveProperty('registeredGetDataToApply');
    });

    it('Gets data with registered callback', () => {
        const knime = new KnimeService(extensionConfig);
        const jsonDataService = new JSONDataService(knime);

        const testData = { nodeName: 'something' };
        let getDataMock = jest.fn(() => testData);

        jsonDataService.registerGetDataToApply(getDataMock);

        expect(knime.getDataToApply()).resolves.toEqual(JSON.stringify(testData));
        expect(getDataMock).toHaveBeenCalledTimes(1);
    });
});
