import { KnimeService } from 'src';
import { extInfo } from 'test/mocks/extInfo';

describe('KnimeService', () => {
    it('Creates KnimeService', () => {
        const knime = new KnimeService(extInfo);

        expect(knime).toHaveProperty('extInfo');

        expect(knime.extInfo).toEqual(extInfo);
    });
});
