import { KnimeService, JSONDataService } from '../../../../src';
import { extInfo } from '../../../mocks/extInfo';

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
