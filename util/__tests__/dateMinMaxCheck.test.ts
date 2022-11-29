import { describe, it, expect } from 'vitest';

import { isAfterMaxDate, isBeforeMinDate } from '../dateMinMaxCheck';

describe('dateMinMaxCheck.js', () => {
    describe('isAfterMaxDate', () => {
        it('returns true if date is after max date', () => {
            const date = new Date('2020-10-20T15:12:08');
            const max = new Date('2020-10-19T15:12:08');
            expect(isAfterMaxDate(date, max, true, true)).toBe(true);
        });

        it('returns false if date is not after max date', () => {
            const date = new Date('2020-10-20T15:12:08');
            const max = new Date('2020-10-20T15:13:00');
            expect(isAfterMaxDate(date, max, true, true)).toBe(false);
        });

        it('returns false if max is not set', () => {
            const date = new Date('2020-10-20T15:12:08');
            const max = null;
            expect(isAfterMaxDate(date, max, true, true)).toBe(false);
        });

        it('ignores date if checkDate is false', () => {
            const date = new Date('2020-10-20T15:12:08');
            const max = new Date('2020-10-10T15:13:00');
            expect(isAfterMaxDate(date, max, false, true)).toBe(false);

            const date2 = new Date('2020-10-20T15:12:08');
            const max2 = new Date('2020-10-10T10:10:00');
            expect(isAfterMaxDate(date2, max2, false, true)).toBe(true);
        });

        it('ignores time if checkTime is false', () => {
            const date = new Date('2020-10-20T15:12:08');
            const max = new Date('2020-10-20T10:00:00');
            expect(isAfterMaxDate(date, max, true, false)).toBe(false);

            const date2 = new Date('2020-10-21T15:12:08');
            const max2 = new Date('2020-10-20T17:00:00');
            expect(isAfterMaxDate(date2, max2, true, false)).toBe(true);
        });
    });

    describe('isBeforeMinDate', () => {
        it('returns true if date is before min date', () => {
            const min = new Date('2020-10-20T15:12:08');
            const date = new Date('2020-10-19T15:12:08');
            expect(isBeforeMinDate(date, min, true, true)).toBe(true);
        });

        it('returns false if date is not before min date', () => {
            const min = new Date('2020-10-20T15:12:08');
            const date = new Date('2020-10-20T15:13:00');
            expect(isBeforeMinDate(date, min, true, true)).toBe(false);
        });

        it('returns false if min is not set', () => {
            const min = null;
            const date = new Date('2020-10-20T15:12:08');
            expect(isBeforeMinDate(date, min, true, true)).toBe(false);
        });

        it('ignores date if checkDate is false', () => {
            const min = new Date('2020-10-20T15:12:08');
            const date = new Date('2020-10-10T15:13:00');
            expect(isBeforeMinDate(date, min, false, true)).toBe(false);

            const min2 = new Date('2020-10-20T15:12:08');
            const date2 = new Date('2020-10-10T10:10:00');
            expect(isBeforeMinDate(date2, min2, false, true)).toBe(true);
        });

        it('ignores time if checkTime is false', () => {
            const min = new Date('2020-10-20T15:12:08');
            const date = new Date('2020-10-20T10:00:00');
            expect(isBeforeMinDate(date, min, true, false)).toBe(false);

            const min2 = new Date('2020-10-21T15:12:08');
            const date2 = new Date('2020-10-20T17:00:00');
            expect(isBeforeMinDate(date2, min2, true, false)).toBe(true);
        });
    });
});
