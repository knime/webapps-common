import { formatVersionNumber, groupDigits, formatDateString } from '~/util/format';

/* eslint-disable no-magic-numbers */
describe('formatVersionNumber', () => {

    let fixtures = [{
        input: '(unknown)',
        expected: '(unknown)'
    }, {
        input: '',
        expected: ''
    }, {
        input: '1.2.3',
        expected: '1.2.3'
    }, {
        input: '3.2.1.v4.5.6',
        expected: '3.2.1'
    }];

    it('formats version numbers', () => {
        fixtures.forEach(({ input, expected }) => {
            expect(formatVersionNumber(input)).toEqual(expected);
        });
    });
});

describe('groupDigits', () => {
    let fixtures = [{
        input: '',
        expected: ''
    }, {
        input: 0,
        expected: '0'
    }, {
        input: 5,
        expected: '5'
    }, {
        input: 442,
        expected: '442'
    }, {
        input: 1004,
        expected: '1\u{2009}004'
    }, {
        input: 999999,
        expected: '999\u{2009}999'
    }, {
        input: 1111111111,
        expected: '1\u{2009}111\u{2009}111\u{2009}111'
    }];

    it('groups digits', () => {
        fixtures.forEach(({ input, expected }) => {
            expect(groupDigits(input)).toEqual(expected);
        });
    });

    it('pads with zeroes', () => {
        expect(groupDigits(4, true)).toEqual('004');
        expect(groupDigits(10, true)).toEqual('010');
    });
});

describe('formatDateString', () => {
    let validFixtures = [{
        input: 0,
        expected: '1 Jan 1970'
    }, {
        input: '2018-07-31T09:44:31+00:00',
        expected: '31 Jul 2018'
    }, {
        input: 'December 17, 1995 03:24:00',
        expected: '17 Dec 1995'
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
