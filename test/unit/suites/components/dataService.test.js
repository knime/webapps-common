import { KnimeService } from '../../../../src/services/KnimeService';
import { JsonDataService } from '../../../../src/services/JsonDataService';
import { extInfo } from '../../../mocks/extInfo';

describe('DataService', () => {
    it('Creates data service', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JsonDataService(knime);

        expect(jsonDataService).toHaveProperty('getInitialData');
    });

    it('Fetches initData', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JsonDataService(knime);

        return expect(jsonDataService.getInitialData()).resolves.toEqual(extInfo.initData);
    });
});
