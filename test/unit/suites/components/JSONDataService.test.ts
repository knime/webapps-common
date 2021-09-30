import { KnimeService } from 'src/services/KnimeService';
import { JSONDataService } from 'src/services/JSONDataService';
import { extInfo } from 'test/mocks/extInfo';

describe('JSONDataService', () => {
    it('Creates data service', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService).toHaveProperty('getInitialData');
    });

    it('Fetches initData', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getInitialData()).resolves.toEqual(extInfo.initData);
    });
});
