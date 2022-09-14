/**
 * Converts the specified date String to human readable text containing the day, month, and year.
 * Example: '2018-07-31T09:44:31+00:00' => 'Jul 31 2018'
 *
 * @param {String} dateString String representation of the Date to format
 * @returns {String} human readable date String
 */
export const formatDateString = (dateString) => {
    let date = new Date(dateString);
    if (isNaN(date)) {
        throw Error('Invalid Date format');
    }
    // Build String manually in 'en-GB' format. Directly using
    // date.toLocaleDateString('en-GB', options) with
    // options = { day: 'numeric', month: 'short', year: 'numeric' }
    // could lead to a different format when the 'en-GB' locale is missing,
    // i.e. it will fall back to 'en-US' without complaining. By default
    // node.js only contains the US locale. Also see:
    // https://github.com/nodejs/node/issues/8500
    let dayOfMonth = date.getDate();
    let month = date.toLocaleDateString('en-US', { month: 'short' });
    let year = date.getFullYear();

    return [month, dayOfMonth, year].join(' ');
};
