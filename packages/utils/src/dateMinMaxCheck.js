import { isAfter, isBefore } from "date-fns-tz";
import updateTime from "./updateTime";
import updateDate from "./updateDate";

/**
 * Check if date is before min.
 * @param {Date} date
 * @param {Date | null} min
 * @param {Boolean} checkDate - check date part (year, day, month).
 * @param {Boolean} checkTime - check time part (hour, minutes etc.).
 * @returns {Boolean} whether limit is kept or not.
 */
export const isBeforeMinDate = (date, min, checkDate, checkTime) => {
  if (min) {
    if (checkTime && checkDate) {
      return isBefore(date, min);
    }
    if (checkTime) {
      // only time is visible so ignore date: use same datre as base
      const base = new Date(0);
      return isBefore(updateTime(base, date), updateTime(base, min));
    }
    if (checkDate) {
      // only date is visible so ignore time: use same time as base
      const base = new Date(0);
      return isBefore(updateDate(base, date), updateDate(base, min));
    }
  }
  return false;
};

/**
 * Check
 * @param {Date} date - date to check.
 * @param {Date | null} max - maximum date.
 * @param {Boolean} checkDate - check date part (year, day, month).
 * @param {Boolean} checkTime - check time part (hour, minutes etc.).
 * @returns {Boolean} whether limit is kept or not.
 */
export const isAfterMaxDate = (date, max, checkDate, checkTime) => {
  if (max) {
    if (checkTime && checkDate) {
      return isAfter(date, max);
    }
    if (checkTime) {
      // only time is visible so ignore date: use same datre as base
      const base = new Date(0);
      return isAfter(updateTime(base, date), updateTime(base, max));
    }
    if (checkDate) {
      // use same time base
      const base = new Date(0);
      return isAfter(updateDate(base, date), updateDate(base, max));
    }
  }
  return false;
};
