/**
 * Converts the specified date String to human readable text containing the day, month, and year.
 * Example: '2018-07-31T09:44:31+00:00' => 'Jul 31, 2018'
 *
 * @param {String} dateString String representation of the Date to format
 * @returns {String} human readable date String
 */
export const formatDateString = (dateString) => {
    let date = new Date(dateString);
    if (isNaN(date)) {
        throw Error('Invalid Date format');
    }
    // This only works for the default locale of en-US, as support of other locals in node js might not be available
    // See for example this issue https://github.com/nodejs/node/issues/8500
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};
