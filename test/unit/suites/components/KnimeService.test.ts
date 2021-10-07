import { KnimeService } from 'src';
import { JSONRpcServices, ViewDataServiceMethods } from 'src/types';
import { extInfo } from 'test/mocks/extInfo';

window.jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.service === JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE) {
        return JSON.stringify({ result: JSON.stringify({}) });
    }

    return null;
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
            JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE,
            ViewDataServiceMethods.INITIAL_DATA,
            ''
        );
    });
});
