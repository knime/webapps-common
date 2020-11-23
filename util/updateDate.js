import { isValid, getYear, getMonth, getDate, set } from 'date-fns';
/**
 * Updates the date part (year, day and month) of a date object (base)
 * time, offset (timezone) and so on will be left untouched.
 *
 * @param {Date} base - Date which will be used (copied) to set day, month and year.
 * @param {Date} date - Extract day, month and year from this date object.
 * @returns {Date} Copy of base with day, month and year of date.
 */
export default (base, date) => {
    // ignore falsy dates
    if (date) {
        // allow invalid base and set time to 0
        base = isValid(base) ? base : new Date(Date.UTC(0, 0));
        return set(base, {
            year: getYear(date),
            month: getMonth(date),
            date: getDate(date)
        });
    }
    return base;
};
