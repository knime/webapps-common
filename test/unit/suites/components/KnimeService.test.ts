import { KnimeService } from 'src';
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

describe('KnimeService', () => {
    it('Creates KnimeService', () => {
        const knime = new KnimeService(extensionConfig);

        expect(knime).toHaveProperty('extensionConfig');

        expect(knime.extensionConfig).toEqual(extensionConfig);
    });

    it('Throws error if no extensionConfig provided and jsonrpc unsupported', () => {
        const knime = new KnimeService();
        try {
            knime.callService(
                JSONRpcServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA,
                ''
            );
        } catch (e) {
            expect(e).toEqual(new Error(`Current environment doesn't support window.jsonrpc()`));
        }
    });

    it('Calls data service', () => {
        window.jsonrpc = jsonrpc;

        const knime = new KnimeService();

        knime.callService(
            JSONRpcServices.CALL_NODE_DATA_SERVICE,
            DataServiceTypes.INITIAL_DATA,
            ''
        );
    });

    it('Throws error if called with unsupported rpc service', () => {
        window.jsonrpc = jsonrpc;

        const knime = new KnimeService();

        try {
            knime.callService(
                'Unsupported.Service' as JSONRpcServices,
                DataServiceTypes.INITIAL_DATA,
                ''
            );
        } catch (e) {
            expect(e).toEqual(new Error('Unsupported params'));
        }
    });
});
