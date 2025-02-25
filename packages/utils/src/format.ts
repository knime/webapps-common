import getLocalTimeZone from "./localTimezone";
/**
 * Converts the specified date String to human readable text containing the day, month, and year.
 * Example: '2018-07-31T09:44:31+00:00' => 'Jul 31, 2018'
 *
 * @param dateString String representation of the Date to format
 * @param useTimeZone to set the timeZone where the user is located, and display local date and time
 * @returns human readable date String
 */
export const formatDateString = (
  dateString: string | number,
  useTimeZone = false,
) => {
  const date = new Date(dateString);

  // @ts-expect-error Argument of type 'Date' is not assignable to parameter of type 'number'
  if (isNaN(date)) {
    throw Error("Invalid Date format");
  }

  const baseDateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  // This only works for the default locale of en-US, as support of other locals in node js might not be available
  // See for example this issue https://github.com/nodejs/node/issues/8500
  const dateOptions: Intl.DateTimeFormatOptions = useTimeZone
    ? { ...baseDateOptions, timeZone: getLocalTimeZone() }
    : baseDateOptions;

  return date.toLocaleDateString("en-US", dateOptions);
};

/**
 * Converts the specified time String to human readable text containing the hour (12-hour) and minute.
 * Example: '2018-07-31T09:44:31+00:00' => '9:44 AM'
 *
 * @param timeString String representation of the Date (including time) to format
 * @param useTimeZone to set the timeZone where the user is located, and display local date and time
 * @returns human readable time String
 */
export const formatTimeString = (
  timeString: string | number,
  useTimeZone = false,
) => {
  const time = new Date(timeString);

  // @ts-expect-error Argument of type 'Date' is not assignable to parameter of type 'number'
  if (isNaN(time)) {
    throw Error("Invalid Date format");
  }

  // This only works for the default locale of en-US, as support of other locals in node js might not be available
  // See for example this issue https://github.com/nodejs/node/issues/8500
  const baseTimeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
  };

  const timeOptions: Intl.DateTimeFormatOptions = useTimeZone
    ? { ...baseTimeOptions, timeZone: getLocalTimeZone() }
    : baseTimeOptions;

  return time.toLocaleTimeString("en-US", timeOptions);
};

/**
 * Converts the specified time String to human readable text containing the date (day, month, year) and time (hour,
 * minute; 12-hour).
 * Example: '2018-07-31T09:44:31+00:00' => 'Jul 31, 2018 9:44 AM'
 *
 * @param dateTimeString String representation of the Date (including time and date) to format
 * @param useTimeZone to set the timeZone where the user is located, and display local date and time
 * @returns human readable date/time String
 */
export const formatDateTimeString = (
  dateTimeString: string | number,
  useTimeZone = false,
) => {
  return `${formatDateString(dateTimeString, useTimeZone)} ${formatTimeString(
    dateTimeString,
    useTimeZone,
  )}`;
};

/**
 * Converts the specified date and time to the user time zone with option to display (day, month, year) only or with time (hour,
 * minute; 12-hour).
 *
 * @param showTime String representation of the Date to convert and format
 * @param String | number} date String representation of the Date to convert and format
 * @returns human readable date/time String converted to user time zone
 */
export const formatLocalDateTimeString = (date: string, showTime: boolean) =>
  showTime ? formatDateTimeString(date, true) : formatDateString(date, true);
