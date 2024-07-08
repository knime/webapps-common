import { isAfter, isBefore } from "date-fns";
import updateTime from "./updateTime";
import updateDate from "./updateDate";

/**
 * Check if date is before min.
 * @param date
 * @param min
 * @param checkDate - check date part (year, day, month).
 * @param checkTime - check time part (hour, minutes etc.).
 * @returns whether limit is kept or not.
 */
export const isBeforeMinDate = (
  date: Date,
  min: Date | null,
  checkDate: boolean,
  checkTime: boolean,
) => {
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
 * @param date - date to check.
 * @param max - maximum date.
 * @param checkDate - check date part (year, day, month).
 * @param checkTime - check time part (hour, minutes etc.).
 * @returns whether limit is kept or not.
 */
export const isAfterMaxDate = (
  date: Date,
  max: Date | null,
  checkDate: boolean,
  checkTime: boolean,
) => {
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
