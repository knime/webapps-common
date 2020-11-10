/* eslint-disable no-magic-numbers */
import updateTime from '../../util/updateTime';

describe('updateTime.js', () => {
    it('updates only date part (year, month, day) of a date object', () => {
        const d = new Date('2020-10-20T15:12:08');
        const r = updateTime(d, new Date('2019-09-02T12:20:10'));

        expect(r.getFullYear()).toBe(2020);
        expect(r.getMonth()).toBe(9); // month starts with 0
        expect(r.getDate()).toBe(20);
        expect(r.getHours()).toBe(12);
        expect(r.getMinutes()).toBe(20);
        expect(r.getSeconds()).toBe(10);
    });

    it('skips falsy dates', () => {
        const d = new Date();
        expect(updateTime(d, null)).toStrictEqual(d);
    });
});
