import { formatDateString } from '~/util/format';

describe('formatDateString', () => {
    let validFixtures = [{
        input: 0,
        expected: 'Jan 1, 1970'
    }, {
        input: '2018-07-31T09:44:31+00:00',
        expected: 'Jul 31, 2018'
    }, {
        input: 'December 17, 1995 03:24:00',
        expected: 'Dec 17, 1995'
    }];

    let invalidFixtures = [{
        input: ''
    }, {
        input: 'thisIsNotAValidDate'
    }];

    it('formats date strings', () => {
        validFixtures.forEach(({ input, expected }) => {
            expect(formatDateString(input)).toEqual(expected);
        });
    });

    it('throws error on invalid format', () => {
        invalidFixtures.forEach(({ input }) => {
            expect(() => formatDateString(input)).toThrowError();
        });
    });
});
