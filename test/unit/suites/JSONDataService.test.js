import { KnimeService } from '@/services/KnimeService';
import { JSONDataService } from '@/services/JSONDataService';
import { extInfo } from '../../mocks/extInfo';

describe('JSONDataService', () => {
    it('Creates data service', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService).toHaveProperty('getInitialData');
    });

    it('Fetches initData', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        return expect(jsonDataService.getInitialData()).resolves.toEqual(extInfo.initData);
    });
});
