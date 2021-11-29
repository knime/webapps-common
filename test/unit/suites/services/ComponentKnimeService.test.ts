import { ComponentKnimeService } from 'src/services';
import { NodeServiceMethods, DataServiceTypes, JsonRpcRequest } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';
import { extensionConfig } from 'test/mocks/extensionConfig';

const jsonrpc = (requestJSON: JsonRpcRequest) => {
    const request = requestJSON;

    if (request.method === NodeServiceMethods.CALL_NODE_DATA_SERVICE) {
        return JSON.stringify({ result: JSON.stringify({}) });
    }

    const error: any = new Error('Unsupported params');

    throw error;
};

describe('ComponentKnimeService', () => {
    describe('initialization', () => {
        it('Creates ComponentKnimeService', () => {
            const knimeService = new ComponentKnimeService(extensionConfig);

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

        it('Throws error if extension config not provided', () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new ComponentKnimeService();

            expect(() => knimeService.callService(createJsonRpcRequest(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                [DataServiceTypes.INITIAL_DATA, '']
            ))).rejects.toThrowError('Cannot call service without extension config');
            expect(rpcSpy).not.toHaveBeenCalled();
        });

        it('Calls data service', async () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new ComponentKnimeService(extensionConfig);

            await knimeService.callService(createJsonRpcRequest(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                ['knime workflow', 'root:10', '123', 'view', DataServiceTypes.INITIAL_DATA, '']
            ));
            expect(rpcSpy).toHaveBeenCalledWith({
                jsonrpc: '2.0',
                method: 'NodeService.callNodeDataService',
                params: ['knime workflow', 'root:10', '123', 'view', 'initial_data', ''],
                id: expect.any(Number)
            });
        });

        it('Throws error if called with unsupported rpc service', () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new ComponentKnimeService(extensionConfig);

            expect(() => knimeService.callService(createJsonRpcRequest(
                    'UnsupportedService.unknownMethod' as NodeServiceMethods,
                    ['knime workflow', 'root:10', '123', 'view', DataServiceTypes.INITIAL_DATA, '']
            ))).rejects.toMatchObject({ message: 'Unsupported params' });
            expect(rpcSpy).toHaveBeenCalledWith({
                jsonrpc: '2.0',
                method: 'UnsupportedService.unknownMethod',
                params: ['knime workflow', 'root:10', '123', 'view', 'initial_data', ''],
                id: expect.any(Number)
            });
        });
    });
});
