import { ComponentKnimeService } from 'src/services';
import { JSONDataService } from 'src';
import { NodeServiceMethods, DataServiceTypes } from 'src/types';
import { extensionConfig } from 'test/mocks/extensionConfig';

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

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

            expect(() =>
                knimeService.callService(
                    NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                    DataServiceTypes.INITIAL_DATA,
                    '',
                ),
            ).rejects.toMatchObject({
                message: `Cannot read properties of null (reading 'projectId')`,
            });
            expect(rpcSpy).not.toHaveBeenCalled();
        });

        it('Calls data service', () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new ComponentKnimeService(extensionConfig);

            knimeService.callService(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA,
                '',
            );
            expect(rpcSpy).toHaveBeenCalledWith(
                '{"jsonrpc":"2.0","method":"NodeService.callNodeDataService",' +
                    '"params":["knime workflow","root:10","123","view","initial_data",""],"id":1}',
            );
        });

        it('Throws error if called with unsupported rpc service', () => {
            let rpcSpy = jest.spyOn(window, 'jsonrpc');

            const knimeService = new ComponentKnimeService(extensionConfig);

            expect(() =>
                knimeService.callService(
                    'UnsupportedService.unknownMethod' as NodeServiceMethods,
                    DataServiceTypes.INITIAL_DATA,
                    '',
                ),
            ).rejects.toMatchObject({ message: 'Unsupported params' });
            expect(rpcSpy).toHaveBeenCalledWith(
                '{"jsonrpc":"2.0","method":"UnsupportedService.unknownMethod",' +
                    '"params":["knime workflow","root:10","123","view","initial_data",""],"id":2}',
            );
        });
    });
});
