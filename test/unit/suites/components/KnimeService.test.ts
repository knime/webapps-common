import { KnimeService } from 'src';
import { JSONRpcMethods } from 'src/types/JSONRpcMethods';
import { ServiceTypes } from 'src/types/serviceTypes';
import { extInfo } from 'test/mocks/extInfo';

window.jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.method === JSONRpcMethods.CALL_NODE_VIEW_DATA_SERVICE) {
        return JSON.stringify({ result: JSON.stringify({}) });
    }
};

describe('KnimeService', () => {
    it('Creates KnimeService', () => {
        const knime = new KnimeService(extInfo);

        expect(knime).toHaveProperty('extInfo');

        expect(knime.extInfo).toEqual(extInfo);
    });

    it('Calls data service', () => {
        const knime = new KnimeService();

        knime.callService(
            JSONRpcMethods.CALL_NODE_VIEW_DATA_SERVICE,
            ServiceTypes.INITIAL_DATA,
            '',
        );
    });
});
