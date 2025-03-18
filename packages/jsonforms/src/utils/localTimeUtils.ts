import { format, parse, parseISO } from "date-fns";

/**
 * Try to parse the string as a full ISO date, but if that doesn't work then
 * just assume it's a time and parse that instead.
 *
 * @param value string representation of a time like 01:23:45.678, or an ISO
 * date time.
 * @returns a Date object representing the time. JavaScript being JavaScript,
 * this will be in the local time zone, with the date part set to 1970-01-01,
 * unless the input was an ISO date time string.
 */
export const fromString = (value: string): Date => {
  const isoDate = parseISO(value);
  if (isNaN(isoDate.getTime())) {
    // As far as I can tell from the date-fns docs, this really is the only way
    // to parse a time string with an unknown number of subsecond digits. Our
    // backend doesn't provide all of these formats right now - I think it can
    // only have up to 3 subsecond digits, but it's possible that something might
    // change in the future.
    const otherFormats = [
      "HH:mm",
      "HH:mm:ss",
      "HH:mm:ss.S",
      "HH:mm:ss.SS",
      "HH:mm:ss.SSS",
      "HH:mm:ss.SSSS",
      "HH:mm:ss.SSSSS",
      "HH:mm:ss.SSSSSS",
      "HH:mm:ss.SSSSSSS",
      "HH:mm:ss.SSSSSSSS",
      "HH:mm:ss.SSSSSSSSS",
    ];

    for (const format of otherFormats) {
      const parsed = parse(value, format, new Date(1970, 0, 1));
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    throw new Error(`Unparsable time format: ${value}`);
  } else {
    return isoDate;
  }
};

export const toString = (value: Date): string => format(value, "HH:mm:ss.SSS");

export const localTimeUtils = {
  toString,
  fromString,
};

export const toUTCTime = (dateString: string) => new Date(`${dateString}Z`);
export const fromUTCTime = (date: Date) => date.toISOString().slice(0, -1);
