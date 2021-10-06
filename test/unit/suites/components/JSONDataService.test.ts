import { KnimeService } from 'src/services/KnimeService';
import { JSONDataService } from 'src/services/JSONDataService';
import { extInfo, rpcInitialData } from 'test/mocks';

describe('JSONDataService', () => {
    it('Creates data service', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService).toHaveProperty('getInitialData');
    });

    it(`Throws error if environment doesn't support rpc and no extInfo provided`, () => {
        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        try {
            jsonDataService.getInitialData();
        } catch (e) {
            expect(e).toEqual(new Error(`Current environment doesn't support window.jsonrpc()`));
        }
    });

    it(`Fetches initial_data if it's passed to constructor`, () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getInitialData()).resolves.toEqual(extInfo.initData);
    });

    it('Fetches initial_data via rpc', () => {
        window.jsonrpc = () => rpcInitialData;

        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getInitialData()).resolves.toEqual({
            settings: extInfo.initData.settings
        });
    });
});
