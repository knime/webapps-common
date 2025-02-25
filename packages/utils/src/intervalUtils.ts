export type Period = {
  negative: boolean;
  years: number;
  months: number;
  weeks: number;
  days: number;
};

export type Duration = {
  negative: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
};

type AllowedIntervalTypes = "DATE" | "TIME";
type AllowedIntervalTypesOrEither = AllowedIntervalTypes | "DATE_OR_TIME";

type IntervalStringValidationResult =
  | {
      valid: true;
      type: AllowedIntervalTypes;
      negative: boolean;
    }
  | { valid: false };

export type PeriodOrDuration =
  | {
      interval: Period;
      type: "DATE";
    }
  | {
      interval: Duration;
      type: "TIME";
    };

const extractPeriodFromRegexMatch = (
  negative: boolean,
  match: RegExpExecArray,
): Period => {
  return {
    negative,
    years: parseInt(match[1] ?? "0", 10),
    months: parseInt(match[2] ?? "0", 10),
    weeks: parseInt(match[3] ?? "0", 10),
    days: parseInt(match[4] ?? "0", 10),
  };
};

const extractDurationFromRegexMatch = (
  negative: boolean,
  match: RegExpExecArray,
): Duration => {
  // eslint-disable-next-line no-magic-numbers
  const milliseconds = parseInt(match[4]?.padEnd(3, "0") ?? "0", 10);

  return {
    negative,
    hours: parseInt(match[1] ?? "0", 10),
    minutes: parseInt(match[2] ?? "0", 10),
    seconds: parseInt(match[3] ?? "0", 10),
    milliseconds,
  };
};

export const isZero = (interval: PeriodOrDuration): boolean => {
  if (interval.type === "DATE") {
    return (
      interval.interval.years === 0 &&
      interval.interval.months === 0 &&
      interval.interval.weeks === 0 &&
      interval.interval.days === 0
    );
  } else {
    return (
      interval.interval.hours === 0 &&
      interval.interval.minutes === 0 &&
      interval.interval.seconds === 0 &&
      interval.interval.milliseconds === 0
    );
  }
};

/**
 * Take an interval object and convert it to an ISO duration or period string. All parts of the
 * relevant part of the Interval object are included in the output, even if they are zero.
 *
 * Technically the ISO standard allows to mix period and duration parts, but we don't support that
 * here because it's incredibly hard to deal with all the edge cases. Maybe in a future ticket.
 *
 * The output here is allowed to be negative, in which case the minus sign is prepended to the
 * output.
 *
 * @param toFormat The PeriodOrDuration object to format
 */
export const formatIntervalToISOIntervalString = (
  toFormat: PeriodOrDuration,
): string => {
  let output = "P";

  if (toFormat.type === "DATE") {
    output += `${toFormat.interval.years}Y${toFormat.interval.months}M${toFormat.interval.weeks}W${toFormat.interval.days}D`;
  } else {
    output += `T${toFormat.interval.hours}H${toFormat.interval.minutes}M${toFormat.interval.seconds}.${toFormat.interval.milliseconds
      .toString()
      // eslint-disable-next-line no-magic-numbers
      .padStart(3, "0")}S`;
  }

  if (toFormat.interval.negative) {
    output = `-${output}`;
  }
  return output;
};

/**
 * Take an interval object and convert it to a human readable string. Only non-zero parts are
 * included in the output (unless all parts are 0).
 *
 * The output here is allowed to be negative, in which case the minus sign is prepended to the
 * output and we wrap the whole thing in brackets e.g. -(1 year 2 days).
 *
 * @param toFormat The PeriodOrDuration object to format
 */
export const formatIntervalToHumanReadableIntervalString = (
  toFormat: PeriodOrDuration,
): string => {
  const formatPart = (value: number, unit: string): string => {
    if (value === 0) {
      return "";
    } else if (value === 1) {
      return `${value} ${unit} `;
    } else {
      return `${value} ${unit}s `;
    }
  };

  let output = "";

  if (toFormat.type === "DATE") {
    if (isZero(toFormat)) {
      return "0 days";
    }

    output += formatPart(toFormat.interval.years, "year");
    output += formatPart(toFormat.interval.months, "month");
    output += formatPart(toFormat.interval.weeks, "week");
    output += formatPart(toFormat.interval.days, "day");
  } else {
    if (isZero(toFormat)) {
      return "0 seconds";
    }

    output += formatPart(toFormat.interval.hours, "hour");
    output += formatPart(toFormat.interval.minutes, "minute");

    const milliSecondsZero = toFormat.interval.milliseconds === 0;
    if (toFormat.interval.seconds !== 0 || !milliSecondsZero) {
      if (milliSecondsZero) {
        output += formatPart(toFormat.interval.seconds, "second");
      } else {
        output += `${toFormat.interval.seconds}.${toFormat.interval.milliseconds.toString().padStart(3, "0")} seconds `; // eslint-disable-line no-magic-numbers
      }
    }
  }

  if (toFormat.interval.negative) {
    output = `-(${output.trim()})`;
  }

  return output.trim();
};

const yearsPart = "(\\d+)\\s*y(?:ears?)?";
const monthsPart = "(\\d+)\\s*m(?:o(?:nths?)?)?";
const weeksPart = "(\\d+)\\s*w(?:eeks?)?";
const daysPart = "(\\d+)\\s*d(?:ays?)?";
const hoursPart = "(\\d+)\\s*h(?:ours?)?";
const minutesPart = "(\\d+)\\s*m(?:in(?:s|utes?)?)?";
const secondsPart = "(\\d+)(?:[,.](\\d{1,3}))?\\s*s(?:ec(?:s|onds?)?)?";

/**
 * Matches a human readable period string, e.g. "1y 2mo 3weeks 4day" (each part is optional)
 */
const humanReadablePeriodRegex = new RegExp(
  `^(?:${yearsPart})?\\s*(?:${monthsPart})?\\s*(?:${weeksPart})?\\s*(?:${daysPart})?\\s*$`,
  "i",
);

/**
 * Matches a human readable duration string, e.g. "1h 2m 3.456s" (each part is optional)
 */
const humanReadableDurationRegex = new RegExp(
  `^(?:${hoursPart})?\\s*(?:${minutesPart})?\\s*(?:${secondsPart})?$`,
  "i",
);

/**
 * Matches a negative human readable period string, e.g. "-(1y 2mo 3weeks 4day)" (each part is optional)
 */
const negativeHumanReadablePeriodRegex = new RegExp(
  `^\\s*-\\s*\\(\\s*${humanReadablePeriodRegex.source.replace(/[$^]/g, "")}\\s*\\)\\s*$`,
  "i",
);

/**
 * Matches a negative human readable period string with one field like "-1y" or "-1w"
 */
const negativeHumanReadablePeriodRegexWithSingleField = new RegExp(
  `^\\s*-\\s*(?:\\s*${yearsPart}|${monthsPart}|${weeksPart}|${daysPart})\\s*$`,
  "i",
);

/**
 * Matches a negative human readable duration string, e.g. "-(1h 2m 3.456s)" (each part is optional)
 */
const negativeHumanReadableDurationRegex = new RegExp(
  `^\\s*-\\s*\\(\\s*${humanReadableDurationRegex.source.replace(/[$^]/g, "")}\\s*\\)\\s*$`,
  "i",
);

/**
 * Matches a negative human readable duration string with one field like "-1h" or "-1.5s"
 */
const negativeHumanReadableDurationRegexWithSingleField = new RegExp(
  `^\\s*-\\s*(?:\\s*${hoursPart}|${minutesPart}|${secondsPart})\\s*$`,
  "i",
);

/**
 * Try to parse a human readable interval string into an Interval object. Any parts not specified
 * are assumed to be zero. Note that the string must be either a period or a duration, not a mix of
 * both. So for example, "1y 2mo 3weeks 4day" is fine, as is "1h 2m 3.456s". However, "1y 2mo 1sec"
 * is not, since it's a mix of both.
 *
 * Negative intervals are allowed, although if multiple fields are provided the string must include
 * brackets, so "-(1y 2mo)" is also valid, as is "-5 seconds".
 *
 * The string is required to have at least some content, any string that is blank will throw an error.
 *
 * @param intervalString The human readable time string
 */
export const parseHumanReadableIntervalString = (
  intervalString: string,
): PeriodOrDuration => {
  intervalString = intervalString?.trim();

  if (!intervalString) {
    throw new Error("Empty interval string");
  }

  const matchPositivePeriod = humanReadablePeriodRegex.exec(intervalString);
  const matchNegativePeriod =
    negativeHumanReadablePeriodRegex.exec(intervalString) ??
    negativeHumanReadablePeriodRegexWithSingleField.exec(intervalString);
  const matchPositiveDuration = humanReadableDurationRegex.exec(intervalString);
  const matchNegativeDuration =
    negativeHumanReadableDurationRegex.exec(intervalString) ??
    negativeHumanReadableDurationRegexWithSingleField.exec(intervalString);

  const matchPeriod = matchPositivePeriod ?? matchNegativePeriod;
  const matchDuration = matchPositiveDuration ?? matchNegativeDuration;
  const negative = (matchNegativePeriod ?? matchNegativeDuration) !== null;

  // I think this will happen only for the string "1M" or similar
  if (matchDuration && matchPeriod) {
    throw new Error("Ambiguous time format");
  }

  if (matchPeriod) {
    return {
      type: "DATE",
      interval: extractPeriodFromRegexMatch(negative, matchPeriod),
    };
  } else if (matchDuration) {
    return {
      type: "TIME",
      interval: extractDurationFromRegexMatch(negative, matchDuration),
    };
  } else {
    throw new Error(`Invalid human readable time: ${intervalString}`);
  }
};

/**
 * Check if the given string can be understood as a human readable duration or period string. The
 * type parameter specifies whether the string should be a date, time, or either.
 *
 * @param time the string to check
 * @param expectedType the type of the string - either "DATE", "TIME", or "ANY"
 */
export const isValidHumanReadableIntervalString = (
  time: string,
  expectedType: AllowedIntervalTypesOrEither,
): IntervalStringValidationResult => {
  try {
    const validationResult = parseHumanReadableIntervalString(time);
    const actualType = validationResult.type;
    const negative = validationResult.interval.negative;

    if (actualType === expectedType || expectedType === "DATE_OR_TIME") {
      return {
        valid: true,
        type: actualType,
        negative,
      };
    } else {
      return { valid: false };
    }
  } catch (_e) {
    return { valid: false };
  }
};

/**
 * Convert an ISO duration OR period string to an Interval object. So for example,
 * "P1Y2M3W4D" is fine, as is "PT1H2M3.456S". However, "P1Y2M3W4D1H2M3.456S" is not, since
 * it's a mix of both. We're more forgiving than the ISO standard, so we allow for missing parts.
 * Also, the string is allowed to be negative, so "-P1Y2M3W4D" is also valid.
 *
 * The string is required to have at least some content, so the strings "", "P", and "PT" are
 * considered invalid (also if they start with a -).
 *
 * @param isoString The ISO duration or period string.
 */
export const parseISOIntervalString = (isoString: string): PeriodOrDuration => {
  isoString = isoString?.trim();

  if (["", "P", "PT", "-", "-P", "-PT"].includes(isoString)) {
    throw new Error("Empty ISO duration");
  }

  const periodRegex = /^-?P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?$/;
  const durationRegex =
    /^-?PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)(?:[,.](\d{1,3}))?S)?$/;

  const matchPeriod = periodRegex.exec(isoString);
  const matchDuration = durationRegex.exec(isoString);

  if (matchPeriod) {
    return {
      type: "DATE",
      interval: extractPeriodFromRegexMatch(
        isoString.startsWith("-"),
        matchPeriod,
      ),
    };
  } else if (matchDuration) {
    return {
      type: "TIME",
      interval: extractDurationFromRegexMatch(
        isoString.startsWith("-"),
        matchDuration,
      ),
    };
  } else {
    throw new Error(`Invalid ISO duration: ${isoString}`);
  }
};

/**
 * Check if the given string is a valid duration or period ISO string. The type parameter
 * specifies whether the string should be a date, time, or either.
 *
 * @param isoString the string to check
 * @param type the type of the string - either "DATE", "TIME", or "ANY"
 */
export const isValidISOIntervalString = (
  isoString: string,
  type: AllowedIntervalTypesOrEither,
): IntervalStringValidationResult => {
  try {
    const validationResult = parseISOIntervalString(isoString);
    const actualType = validationResult.type;
    const negative = validationResult.interval.negative;

    if (actualType === type || type === "DATE_OR_TIME") {
      return {
        valid: true,
        type: actualType,
        negative,
      };
    } else {
      return { valid: false };
    }
  } catch (_e) {
    return { valid: false };
  }
};

/**
 * Try to convert an interval string to an Interval object. The string can be either an ISO
 * duration/period string or a human readable string. If the string is not valid, an error is
 * thrown.
 *
 * @param time the time string, either ISO or human readable
 */
export const parseGenericIntervalString = (time: string): PeriodOrDuration => {
  const validISO = isValidISOIntervalString(time, "DATE_OR_TIME");
  const validHumanReadable = isValidHumanReadableIntervalString(
    time,
    "DATE_OR_TIME",
  );
  if (validISO.valid) {
    return parseISOIntervalString(time);
  } else if (validHumanReadable.valid) {
    return parseHumanReadableIntervalString(time);
  } else {
    throw new Error(`Invalid interval string: ${time}`);
  }
};

/**
 * Check if the given string is a valid interval string, either human readable or ISO. The type parameter
 * specifies whether the string should be a period, duration, or either.
 *
 * @param time the time string to check
 * @param type the type of the string - either "DATE", "TIME", or "ANY"
 */
export const isValidIntervalString = (
  time: string,
  type: AllowedIntervalTypesOrEither,
): IntervalStringValidationResult => {
  const validISO = isValidISOIntervalString(time, type);
  const validHumanReadable = isValidHumanReadableIntervalString(time, type);
  if (validISO.valid) {
    return validISO;
  } else if (validHumanReadable.valid) {
    return validHumanReadable;
  } else {
    return { valid: false };
  }
};
