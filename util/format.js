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
    throw Error("Invalid Date format");
  }
  // This only works for the default locale of en-US, as support of other locals in node js might not be available
  // See for example this issue https://github.com/nodejs/node/issues/8500
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
/**
 * Converts the specified time String to human readable text containing the hour (12-hour) and minute.
 * Example: '2018-07-31T09:44:31+00:00' => '9:44 AM'
 *
 * @param {String} timeString String representation of the Date (including time) to format
 * @returns {String} human readable time String
 */
export const formatTimeString = (timeString) => {
  let time = new Date(timeString);
  if (isNaN(time)) {
    throw Error("Invalid Date format");
  }
  // This only works for the default locale of en-US, as support of other locals in node js might not be available
  // See for example this issue https://github.com/nodejs/node/issues/8500
  return time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};
/**
 * Converts the specified time String to human readable text containing the date (day, month, year) and time (hour,
 * minute; 12-hour).
 * Example: '2018-07-31T09:44:31+00:00' => 'Jul 31, 2018 9:44 AM'
 *
 * @param {String} dateTimeString String representation of the Date (including time and date) to format
 * @returns {String} human readable date/time String
 */
export const formatDateTimeString = (dateTimeString) => {
  // eslint-disable-line arrow-body-style
  return `${formatDateString(dateTimeString)} ${formatTimeString(
    dateTimeString
  )}`;
};
