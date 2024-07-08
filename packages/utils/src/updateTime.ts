/**
 * Updates the time part (hour, minute, second and millisecond) of a date object (base)
 * date, offset (timezone) and so on will be left untouched.
 *
 * @param base - Date which will be used (copied) to set day, month and year.
 * @param date - Extract hour, minute, second and millisecond from this date object.
 * @returns Copy of base with hour, minute, second and millisecond changed.
 */
export default (base: Date, date: Date | null) => {
  const d = new Date(base);
  // ignore falsy dates
  if (date) {
    d.setHours(date.getHours());
    d.setMinutes(date.getMinutes());
    d.setSeconds(date.getSeconds());
    d.setMilliseconds(date.getMilliseconds());
  }
  return d;
};
