import getLocalTimeZone from './localTimezone';

/**
 * Converts the specified date String to human readable text containing the day, month, and year.
 * Example: '2018-07-31T09:44:31+00:00' => 'Jul 31, 2018'
 *
 * @useTimeZone {Bolean} to set the timeZone where the user is located, and display local date and time
 * @param {String} dateString String representation of the Date to format
 * @returns {String} human readable date String
 */
export const formatDateString = (dateString, useTimeZone = false) => {
    let date = new Date(dateString);
    if (isNaN(date)) {
        throw Error('Invalid Date format');
    }
    // This only works for the default locale of en-US, as support of other locals in node js might not be available
    // See for example this issue https://github.com/nodejs/node/issues/8500
    let dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    if (useTimeZone) {
        dateOptions.timeZone = getLocalTimeZone();
    }

    return date.toLocaleDateString('en-US', dateOptions);
};
/**
 * Converts the specified time String to human readable text containing the hour (12-hour) and minute.
 * Example: '2018-07-31T09:44:31+00:00' => '9:44 AM'
 *
 * @useTimeZone {Bolean} to set the timeZone where the user is located, and display local date and time
 * @param {String} timeString String representation of the Date (including time) to format
 * @returns {String} human readable time String
 */
export const formatTimeString = (timeString, useTimeZone = false) => {
    let time = new Date(timeString);
    if (isNaN(time)) {
        throw Error('Invalid Date format');
    }

    let timeOptions = { hour: 'numeric', minute: '2-digit' };
    if (useTimeZone) {
        timeOptions.timeZone = getLocalTimeZone();
    }

    // This only works for the default locale of en-US, as support of other locals in node js might not be available
    // See for example this issue https://github.com/nodejs/node/issues/8500
    return time.toLocaleTimeString('en-US', timeOptions);
};
/**
 * Converts the specified time String to human readable text containing the date (day, month, year) and time (hour,
 * minute; 12-hour).
 * Example: '2018-07-31T09:44:31+00:00' => 'Jul 31, 2018 9:44 AM'
 *
 * @useTimeZone {Bolean} to set the timeZone where the user is located, and display local date and time
 * @param {String} dateTimeString String representation of the Date (including time and date) to format
 * @returns {String} human readable date/time String
 */
export const formatDateTimeString = (dateTimeString, useTimeZone = false) => { // eslint-disable-line arrow-body-style
    return `${formatDateString(dateTimeString, useTimeZone)} ${formatTimeString(dateTimeString, useTimeZone)}`;
};

/**
 * Converts the specified date and time to the user time zone with option to display (day, month, year) only or with time (hour,
 * minute; 12-hour).
 *
 * @showTime {String} to choose to display or not the hour and minute
 */

export const formatLocalDateTimeString = (date, showTime) => {
    if (date.includes('Z')) {
    // to bring the date coming from the table in an standardized UTC date format
        let indexOfZ = date.indexOf('Z');
        date = date.substring(0, indexOfZ + 1);
    }

    let dateTime = new Date(date);
    
    if (isNaN(dateTime)) {
        throw Error('Invalid Date format');
    }
    return showTime
        ? formatDateTimeString(dateTime, true)
        : formatDateString(dateTime, true);
};
