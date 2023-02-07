import { describe, it, expect } from 'vitest';

import { formatDateString, formatDateTimeString, formatTimeString } from '../format';

describe('formatDateString', () => {
    const validFixtures = [{
        input: 0,
        expectedDate: 'Jan 1, 1970',
        expectedTime: '1:00\u202fAM',
        expectedDateTime: 'Jan 1, 1970 1:00\u202fAM'
    }, {
        input: '2018-07-31T09:44:31+00:00',
        expectedDate: 'Jul 31, 2018',
        expectedTime: '11:44\u202fAM',
        expectedDateTime: 'Jul 31, 2018 11:44\u202fAM'
    }, {
        input: 'December 17, 1995 03:24:00',
        expectedDate: 'Dec 17, 1995',
        expectedTime: '3:24\u202fAM',
        expectedDateTime: 'Dec 17, 1995 3:24\u202fAM'
    }];

    const invalidFixtures = [{
        input: ''
    }, {
        input: 'thisIsNotAValidDate'
    }];

    it('formats date strings', () => {
        validFixtures.forEach(({ input, expectedDate }) => {
            expect(formatDateString(input)).toEqual(expectedDate);
        });
    });

    it('formats time strings', () => {
        validFixtures.forEach(({ input, expectedTime }) => {
            expect(formatTimeString(input)).toEqual(expectedTime);
        });
    });

    it('formats date/time strings', () => {
        validFixtures.forEach(({ input, expectedDateTime }) => {
            expect(formatDateTimeString(input)).toEqual(expectedDateTime);
        });
    });

    it('format date throws error on invalid format', () => {
        invalidFixtures.forEach(({ input }) => {
            expect(() => formatDateString(input)).toThrowError();
        });
    });

    it('format time throws error on invalid format', () => {
        invalidFixtures.forEach(({ input }) => {
            expect(() => formatTimeString(input)).toThrowError();
        });
    });

    it('format date/time throws error on invalid format', () => {
        invalidFixtures.forEach(({ input }) => {
            expect(() => formatDateTimeString(input)).toThrowError();
        });
    });
});
