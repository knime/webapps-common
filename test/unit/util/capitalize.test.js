import { capitalize } from '~/webapps-common/util/capitalize';

describe('capitalize', () => {
    it('capitalizes first letter of string', () => {
        const testString = 'fooBar';
        expect(capitalize(testString)).toBe('FooBar');
    });

    it('leaves capitalized strings as they are', () => {
        const testString2 = 'ZooFlew';
        expect(capitalize(testString2)).toBe(testString2);
    });
});
