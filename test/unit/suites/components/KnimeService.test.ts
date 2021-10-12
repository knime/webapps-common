import { KnimeService } from 'src';
import { JSONRpcServices, ViewDataServiceMethods } from 'src/types';
import { extInfo } from 'test/mocks/extInfo';

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.method === JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE) {
        return JSON.stringify({ result: JSON.stringify({}) });
    }

    const error: any = new Error('Unsupported params');

    throw error;
};

describe('KnimeService', () => {
    it('Creates KnimeService', () => {
        const knime = new KnimeService(extInfo);

        expect(knime).toHaveProperty('extInfo');

        expect(knime.extInfo).toEqual(extInfo);
    });

    it('Throws error if no extInfo provided and jsonrpc unsupported', () => {
        const knime = new KnimeService();
        try {
            knime.callService(
                JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE,
                ViewDataServiceMethods.INITIAL_DATA,
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
            JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE,
            ViewDataServiceMethods.INITIAL_DATA,
            ''
        );
    });

    it('Throws error if called with unsupported rpc service', () => {
        window.jsonrpc = jsonrpc;

        const knime = new KnimeService();

        try {
            knime.callService(
                'Unsupported.Service' as JSONRpcServices,
                ViewDataServiceMethods.INITIAL_DATA,
                ''
            );
        } catch (e) {
            expect(e).toEqual(new Error('Unsupported params'));
        }
    });
});
