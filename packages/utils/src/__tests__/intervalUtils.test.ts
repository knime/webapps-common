import { describe, expect, it } from "vitest";

import * as intervalUtils from "../intervalUtils";

describe("intervalUtils", () => {
  const isoDateParseTestCases = [
    { str: "P1Y2M3W4D", expected: [1, 2, 3, 4, false] }, // all fields
    { str: "P1Y2M3W", expected: [1, 2, 3, 0, false] }, // missing days
    { str: "P1Y2M4D", expected: [1, 2, 0, 4, false] }, // missing weeks
    { str: "P1Y3W4D", expected: [1, 0, 3, 4, false] }, // missing months
    { str: "P2M3W4D", expected: [0, 2, 3, 4, false] }, // missing years
    { str: "P1Y", expected: [1, 0, 0, 0, false] }, // only years
    { str: "P1M", expected: [0, 1, 0, 0, false] }, // only months
    { str: "P1W", expected: [0, 0, 1, 0, false] }, // only weeks
    { str: "P1D", expected: [0, 0, 0, 1, false] }, // only days
    { str: "-P1Y2M3W4D", expected: [1, 2, 3, 4, true] }, // negative
  ];

  const isoTimeParseTestCases = [
    { str: "PT1H2M3.4S", expected: [1, 2, 3, 400, false] }, // all fields
    { str: "PT1H2M3S", expected: [1, 2, 3, 0, false] }, // missing milliseconds
    { str: "PT1H2M", expected: [1, 2, 0, 0, false] }, // missing seconds and milliseconds
    { str: "PT1H", expected: [1, 0, 0, 0, false] }, // only hours
    { str: "PT1M", expected: [0, 1, 0, 0, false] }, // only minutes
    { str: "PT1S", expected: [0, 0, 1, 0, false] }, // only seconds
    { str: "PT1.05S", expected: [0, 0, 1, 50, false] }, // seconds with milliseconds
    { str: "-PT1H2M3.4S", expected: [1, 2, 3, 400, true] }, // negative
    { str: "PT1H2M3,4S", expected: [1, 2, 3, 400, false] }, // comma instead of period
  ];

  const isoInvalidParseTestCases = [
    "P1Y2M3D4H5M6S", // mixed date and time parts
    "P", // no data
    "PT", // no data
    "P-1Y", // negative fields
    "P2M1Y", // out of order fields
  ];

  const humanReadableDateParseTestCases = [
    { str: "1 year 2 months 3 weeks 4 days", expected: [1, 2, 3, 4, false] }, // all fields
    { str: "1 year 2 months 3 weeks", expected: [1, 2, 3, 0, false] }, // missing days
    { str: "1 year 2 months 4 days", expected: [1, 2, 0, 4, false] }, // missing weeks
    { str: "1 year 3 weeks 4 days", expected: [1, 0, 3, 4, false] }, // missing months
    { str: "2 months 3 weeks 4 days", expected: [0, 2, 3, 4, false] }, // missing years
    { str: "1 year", expected: [1, 0, 0, 0, false] }, // only years
    { str: "1 month", expected: [0, 1, 0, 0, false] }, // only months
    { str: "1 week", expected: [0, 0, 1, 0, false] }, // only weeks
    { str: "1 day", expected: [0, 0, 0, 1, false] }, // only days
    { str: "-(1 year 2 months 3 weeks 4 days)", expected: [1, 2, 3, 4, true] }, // negative
    { str: "-3 years", expected: [3, 0, 0, 0, true] }, // negative single field
    // all the same tests but in short form
    { str: "1y 2m 3w 4d", expected: [1, 2, 3, 4, false] }, // all fields
    { str: "1y 2m 3w", expected: [1, 2, 3, 0, false] }, // missing days
    { str: "1y 2m 4d", expected: [1, 2, 0, 4, false] }, // missing weeks
    { str: "1y 3w 4d", expected: [1, 0, 3, 4, false] }, // missing months
    { str: "2m 3w 4d", expected: [0, 2, 3, 4, false] }, // missing years
    { str: "1y", expected: [1, 0, 0, 0, false] }, // only years
    { str: "1w", expected: [0, 0, 1, 0, false] }, // only weeks
    { str: "1d", expected: [0, 0, 0, 1, false] }, // only days
    { str: "1mo", expected: [0, 1, 0, 0, false] }, // other short forms
    { str: "1 y 2 m 3w4d", expected: [1, 2, 3, 4, false] }, // spacing shouldn't matter
    { str: "1Y 2M 3W 4D", expected: [1, 2, 3, 4, false] }, // case shouldn't matter
    { str: "-(1Y 2M)", expected: [1, 2, 0, 0, true] }, // negative
    { str: "-3Y", expected: [3, 0, 0, 0, true] }, // negative single field
  ];

  const humanReadableTimeParseTestCases = [
    { str: "1 hour 2 minutes 3.4 seconds", expected: [1, 2, 3, 400, false] }, // all fields
    { str: "2 minutes 8.2 seconds", expected: [0, 2, 8, 200, false] }, // missing hours
    { str: "2 hours 3.7 seconds", expected: [2, 0, 3, 700, false] }, // missing minutes
    { str: "1 hour 2 minutes", expected: [1, 2, 0, 0, false] }, // missing seconds
    { str: "2 hours 3 minutes 4 seconds", expected: [2, 3, 4, 0, false] }, // missing milliseconds
    { str: "1 hour", expected: [1, 0, 0, 0, false] }, // only hours
    { str: "1 minute", expected: [0, 1, 0, 0, false] }, // only minutes
    { str: "1 second", expected: [0, 0, 1, 0, false] }, // only seconds
    { str: "1.05 seconds", expected: [0, 0, 1, 50, false] }, // seconds with milliseconds
    { str: "1,06 seconds", expected: [0, 0, 1, 60, false] }, // seconds with comma instead of period
    { str: "-(1 hour)", expected: [1, 0, 0, 0, true] }, // negative
    { str: "-1 hour", expected: [1, 0, 0, 0, true] }, // negative single field
    // all the same tests but in short form
    { str: "1h 2m 3.4s", expected: [1, 2, 3, 400, false] }, // all fields
    { str: "2m 8.2s", expected: [0, 2, 8, 200, false] }, // missing hours
    { str: "2h 3.7s", expected: [2, 0, 3, 700, false] }, // missing minutes
    { str: "1h 2m", expected: [1, 2, 0, 0, false] }, // missing seconds
    { str: "2h 3m 4s", expected: [2, 3, 4, 0, false] }, // missing milliseconds
    { str: "1h", expected: [1, 0, 0, 0, false] }, // only hours
    { str: "1s", expected: [0, 0, 1, 0, false] }, // only seconds
    { str: "1.05s", expected: [0, 0, 1, 50, false] }, // seconds with milliseconds
    { str: "1,06s", expected: [0, 0, 1, 60, false] }, // seconds with comma instead of period
    { str: "3.4 secs", expected: [0, 0, 3, 400, false] }, // other short forms
    { str: "1h2m 3.4 s", expected: [1, 2, 3, 400, false] }, // spacing shouldn't matter
    { str: "1H 2M 3.4S", expected: [1, 2, 3, 400, false] }, // case shouldn't matter
    { str: "-(1H)", expected: [1, 0, 0, 0, true] }, // negative
    { str: "-1H", expected: [1, 0, 0, 0, true] }, // negative single field
  ];

  const humanReadableInvalidParseTestCases = [
    "1 year 2 months 3 days 4 hours 5 minutes 6 seconds", // mixed date and time parts
    "1m", // ambiguous - is it a month or a minute?
    "1",
    "1 month 2 years", // out of order fields
  ];

  const isoDateFormatTestCases = [
    { expected: "P1Y2M3W4D", date: [1, 2, 3, 4, false] }, // all fields
    { expected: "P1Y2M3W0D", date: [1, 2, 3, 0, false] }, // missing days
    { expected: "P1Y2M0W4D", date: [1, 2, 0, 4, false] }, // missing weeks
    { expected: "P1Y0M3W4D", date: [1, 0, 3, 4, false] }, // missing months
    { expected: "P0Y2M3W4D", date: [0, 2, 3, 4, false] }, // missing years
    { expected: "P1Y0M0W0D", date: [1, 0, 0, 0, false] }, // only years
    { expected: "P0Y1M0W0D", date: [0, 1, 0, 0, false] }, // only months
    { expected: "P0Y0M1W0D", date: [0, 0, 1, 0, false] }, // only weeks
    { expected: "P0Y0M0W1D", date: [0, 0, 0, 1, false] }, // only days
    { expected: "-P1Y2M3W4D", date: [1, 2, 3, 4, true] }, // negative
  ];

  const isoTimeFormatTestCases = [
    { expected: "PT1H2M3.400S", time: [1, 2, 3, 400, false] }, // all fields
    { expected: "PT1H2M3.000S", time: [1, 2, 3, 0, false] }, // missing milliseconds
    { expected: "PT1H2M0.000S", time: [1, 2, 0, 0, false] }, // missing seconds and milliseconds
    { expected: "PT1H0M0.000S", time: [1, 0, 0, 0, false] }, // only hours
    { expected: "PT0H1M0.000S", time: [0, 1, 0, 0, false] }, // only minutes
    { expected: "PT0H0M1.000S", time: [0, 0, 1, 0, false] }, // only seconds
    { expected: "PT0H0M1.050S", time: [0, 0, 1, 50, false] }, // seconds with milliseconds
    { expected: "-PT1H2M3.400S", time: [1, 2, 3, 400, true] }, // negative
  ];

  const humanReadableTimeFormatTestCases = [
    { expected: "1 hour 2 minutes 3.400 seconds", time: [1, 2, 3, 400, false] }, // all fields
    { expected: "2 minutes 8.200 seconds", time: [0, 2, 8, 200, false] }, // missing hours
    { expected: "2 hours 3.700 seconds", time: [2, 0, 3, 700, false] }, // missing minutes
    { expected: "1 hour 2 minutes", time: [1, 2, 0, 0, false] }, // missing seconds
    { expected: "2 hours 3 minutes 4 seconds", time: [2, 3, 4, 0, false] }, // missing milliseconds
    { expected: "1 hour", time: [1, 0, 0, 0, false] }, // only hours
    { expected: "1 minute", time: [0, 1, 0, 0, false] }, // only minutes
    { expected: "1 second", time: [0, 0, 1, 0, false] }, // only seconds
    { expected: "1.050 seconds", time: [0, 0, 1, 50, false] }, // seconds with milliseconds
    { expected: "0.100 seconds", time: [0, 0, 0, 100, false] }, // less than a second
    {
      expected: "-(1 hour 2 minutes 3.400 seconds)",
      time: [1, 2, 3, 400, true],
    }, // negative
    { expected: "0 seconds", time: [0, 0, 0, 0, false] }, // zero
  ];

  const humanReadableDateFormatTestCases = [
    { expected: "1 year 2 months 3 weeks 4 days", date: [1, 2, 3, 4, false] }, // all fields
    { expected: "1 year 2 months 3 weeks", date: [1, 2, 3, 0, false] }, // missing days
    { expected: "1 year 2 months 4 days", date: [1, 2, 0, 4, false] }, // missing weeks
    { expected: "1 year 3 weeks 4 days", date: [1, 0, 3, 4, false] }, // missing months
    { expected: "2 months 3 weeks 4 days", date: [0, 2, 3, 4, false] }, // missing years
    { expected: "1 year", date: [1, 0, 0, 0, false] }, // only years
    { expected: "1 month", date: [0, 1, 0, 0, false] }, // only months
    { expected: "1 week", date: [0, 0, 1, 0, false] }, // only weeks
    { expected: "1 day", date: [0, 0, 0, 1, false] }, // only days
    { expected: "-(1 year 2 months 3 weeks 4 days)", date: [1, 2, 3, 4, true] }, // negative
    { expected: "0 days", date: [0, 0, 0, 0, false] }, //
  ];

  it.for(isoDateParseTestCases)(
    "correctly parses the ISO date duration string '$str'",
    ({ str, expected }) => {
      const parseResult = intervalUtils.parseISOIntervalString(str);
      expect(parseResult.type).toBe("DATE");
      expect(parseResult.interval).toStrictEqual({
        negative: expected[4] as boolean,
        years: expected[0] as number,
        months: expected[1] as number,
        weeks: expected[2] as number,
        days: expected[3] as number,
      } satisfies intervalUtils.Period);
    },
  );

  it.for(isoTimeParseTestCases)(
    "correctly parses the ISO time duration string '$str'",
    ({ str, expected }) => {
      const parseResult = intervalUtils.parseISOIntervalString(str);
      expect(parseResult.type).toBe("TIME");
      expect(parseResult.interval).toStrictEqual({
        negative: expected[4] as boolean,
        hours: expected[0] as number,
        minutes: expected[1] as number,
        seconds: expected[2] as number,
        milliseconds: expected[3] as number,
      } satisfies intervalUtils.Duration);
    },
  );

  it.fails.for(isoInvalidParseTestCases)(
    "fails to parse the invalid ISO string '%s'",
    (iso) => {
      intervalUtils.parseISOIntervalString(iso);
    },
  );

  it.for(humanReadableDateParseTestCases)(
    "correctly parses the human-readable date string '$str'",
    ({ str, expected }) => {
      const parseResult = intervalUtils.parseHumanReadableIntervalString(str);
      expect(parseResult.type).toBe("DATE");
      expect(parseResult.interval).toStrictEqual({
        negative: expected[4] as boolean,
        years: expected[0] as number,
        months: expected[1] as number,
        weeks: expected[2] as number,
        days: expected[3] as number,
      } satisfies intervalUtils.Period);
    },
  );

  it.for(humanReadableTimeParseTestCases)(
    "correctly parses the human-readable time string '$str'",
    ({ str, expected }) => {
      const parseResult = intervalUtils.parseHumanReadableIntervalString(str);
      expect(parseResult.type).toBe("TIME");
      expect(parseResult.interval).toStrictEqual({
        negative: expected[4] as boolean,
        hours: expected[0] as number,
        minutes: expected[1] as number,
        seconds: expected[2] as number,
        milliseconds: expected[3] as number,
      } satisfies intervalUtils.Duration);
    },
  );

  it.fails.for(humanReadableInvalidParseTestCases)(
    "fails to parse the invalid human-readable string '%s'",
    (str) => {
      intervalUtils.parseHumanReadableIntervalString(str);
    },
  );

  it.for([...isoDateParseTestCases, ...humanReadableDateParseTestCases])(
    "can parse a date interval without knowing the type",
    ({ str, expected }) => {
      const parseResult = intervalUtils.parseGenericIntervalString(str);
      expect(parseResult.type).toBe("DATE");
      expect(parseResult.interval).toStrictEqual({
        negative: expected[4] as boolean,
        years: expected[0] as number,
        months: expected[1] as number,
        weeks: expected[2] as number,
        days: expected[3] as number,
      } satisfies intervalUtils.Period);
    },
  );

  it.for([...isoTimeParseTestCases, ...humanReadableTimeParseTestCases])(
    "can parse a time interval without knowing the type",
    ({ str, expected }) => {
      const parseResult = intervalUtils.parseGenericIntervalString(str);
      expect(parseResult.type).toBe("TIME");
      expect(parseResult.interval).toStrictEqual({
        negative: expected[4] as boolean,
        hours: expected[0] as number,
        minutes: expected[1] as number,
        seconds: expected[2] as number,
        milliseconds: expected[3] as number,
      } satisfies intervalUtils.Duration);
    },
  );

  it.for(isoDateParseTestCases)(
    "can validate the valid ISO date interval '$str'",
    ({ str }) => {
      const validationResult = intervalUtils.isValidISOIntervalString(
        str,
        "DATE_OR_TIME",
      );
      expect(validationResult.valid).toBe(true);
      if (validationResult.valid) {
        expect(validationResult.type).toBe("DATE");
      }

      const validationResult2 = intervalUtils.isValidISOIntervalString(
        str,
        "DATE",
      );
      expect(validationResult2.valid).toBeTruthy();

      const validationResult3 = intervalUtils.isValidISOIntervalString(
        str,
        "TIME",
      );
      expect(validationResult3.valid).toBeFalsy();
    },
  );

  it.for(humanReadableDateParseTestCases)(
    "can validate the valid human readable date interval '$str'",
    ({ str }) => {
      const validationResult = intervalUtils.isValidHumanReadableIntervalString(
        str,
        "DATE_OR_TIME",
      );
      expect(validationResult.valid).toBeTruthy();
      if (validationResult.valid) {
        expect(validationResult.type).toBe("DATE");
      }

      const validationResult2 =
        intervalUtils.isValidHumanReadableIntervalString(str, "DATE");
      expect(validationResult2.valid).toBeTruthy();

      const validationResult3 =
        intervalUtils.isValidHumanReadableIntervalString(str, "TIME");
      expect(validationResult3.valid).toBeFalsy();
    },
  );

  it.for(isoTimeParseTestCases)(
    "can validate the valid ISO time interval '$str'",
    ({ str }) => {
      const validationResult = intervalUtils.isValidISOIntervalString(
        str,
        "DATE_OR_TIME",
      );
      expect(validationResult.valid).toBe(true);
      if (validationResult.valid) {
        expect(validationResult.type).toBe("TIME");
      }

      const validationResult2 = intervalUtils.isValidISOIntervalString(
        str,
        "TIME",
      );
      expect(validationResult2.valid).toBeTruthy();

      const validationResult3 = intervalUtils.isValidISOIntervalString(
        str,
        "DATE",
      );
      expect(validationResult3.valid).toBeFalsy();
    },
  );

  it.for(humanReadableTimeParseTestCases)(
    "can validate the valid human readable time interval '$str'",
    ({ str }) => {
      const validationResult = intervalUtils.isValidHumanReadableIntervalString(
        str,
        "DATE_OR_TIME",
      );
      expect(validationResult.valid).toBeTruthy();
      if (validationResult.valid) {
        expect(validationResult.type).toBe("TIME");
      }

      const validationResult2 =
        intervalUtils.isValidHumanReadableIntervalString(str, "TIME");
      expect(validationResult2.valid).toBeTruthy();

      const validationResult3 =
        intervalUtils.isValidHumanReadableIntervalString(str, "DATE");
      expect(validationResult3.valid).toBeFalsy();
    },
  );

  it.for([...isoDateParseTestCases, ...humanReadableDateParseTestCases])(
    "can validate a valid generic date interval string",
    ({ str }) => {
      const validationResult = intervalUtils.isValidIntervalString(
        str,
        "DATE_OR_TIME",
      );
      expect(validationResult.valid).toBeTruthy();

      if (validationResult.valid) {
        expect(validationResult.type).toBe("DATE");
      }

      const validationResult2 = intervalUtils.isValidIntervalString(
        str,
        "DATE",
      );
      expect(validationResult2.valid).toBeTruthy();

      const validationResult3 = intervalUtils.isValidIntervalString(
        str,
        "TIME",
      );
      expect(validationResult3.valid).toBeFalsy();
    },
  );

  it.for([...isoTimeParseTestCases, ...humanReadableTimeParseTestCases])(
    "cant validate a valid generic time interval string",
    ({ str }) => {
      const validationResult = intervalUtils.isValidIntervalString(
        str,
        "DATE_OR_TIME",
      );
      expect(validationResult.valid).toBeTruthy();

      if (validationResult.valid) {
        expect(validationResult.type).toBe("TIME");
      }

      const validationResult2 = intervalUtils.isValidIntervalString(
        str,
        "TIME",
      );
      expect(validationResult2.valid).toBeTruthy();

      const validationResult3 = intervalUtils.isValidIntervalString(
        str,
        "DATE",
      );
      expect(validationResult3.valid).toBeFalsy();
    },
  );

  it.for([...isoInvalidParseTestCases, ...humanReadableInvalidParseTestCases])(
    "can validate an invalid interval string",
    (str) => {
      const validationResult = intervalUtils.isValidIntervalString(
        str,
        "DATE_OR_TIME",
      );
      expect(validationResult.valid).toBeFalsy();

      const validationResult2 = intervalUtils.isValidIntervalString(
        str,
        "DATE",
      );
      expect(validationResult2.valid).toBeFalsy();

      const validationResult3 = intervalUtils.isValidIntervalString(
        str,
        "TIME",
      );
      expect(validationResult3.valid).toBeFalsy();
    },
  );

  it.for(isoDateFormatTestCases)(
    "correctly formats the date interval $date to iso",
    ({ date, expected }) => {
      const formattedInterval = intervalUtils.formatIntervalToISOIntervalString(
        {
          type: "DATE",
          interval: {
            negative: date[4] as boolean,
            years: date[0] as number,
            months: date[1] as number,
            weeks: date[2] as number,
            days: date[3] as number,
          },
        },
      );
      expect(formattedInterval).toBe(expected);
    },
  );

  it.for(isoTimeFormatTestCases)(
    "correctly formats the time interval $time to iso",
    ({ time, expected }) => {
      const formattedInterval = intervalUtils.formatIntervalToISOIntervalString(
        {
          type: "TIME",
          interval: {
            negative: time[4] as boolean,
            hours: time[0] as number,
            minutes: time[1] as number,
            seconds: time[2] as number,
            milliseconds: time[3] as number,
          },
        },
      );
      expect(formattedInterval).toBe(expected);
    },
  );

  it.for(humanReadableDateFormatTestCases)(
    "correctly formats the date interval $date to human readable",
    ({ date, expected }) => {
      const formattedInterval =
        intervalUtils.formatIntervalToHumanReadableIntervalString({
          type: "DATE",
          interval: {
            negative: date[4] as boolean,
            years: date[0] as number,
            months: date[1] as number,
            weeks: date[2] as number,
            days: date[3] as number,
          },
        });
      expect(formattedInterval).toBe(expected);
    },
  );

  it.for(humanReadableTimeFormatTestCases)(
    "correctly formats the time interval $time to human readable",
    ({ time, expected }) => {
      const formattedInterval =
        intervalUtils.formatIntervalToHumanReadableIntervalString({
          type: "TIME",
          interval: {
            negative: time[4] as boolean,
            hours: time[0] as number,
            minutes: time[1] as number,
            seconds: time[2] as number,
            milliseconds: time[3] as number,
          },
        });
      expect(formattedInterval).toBe(expected);
    },
  );

  it("correctly checks whether an interval is zero", () => {
    expect(
      intervalUtils.isZero({
        type: "DATE",
        interval: { negative: true, years: 0, months: 0, weeks: 0, days: 0 },
      }),
    ).toBeTruthy();

    expect(
      intervalUtils.isZero({
        type: "TIME",
        interval: {
          negative: false,
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        },
      }),
    ).toBeTruthy();

    expect(
      intervalUtils.isZero({
        type: "DATE",
        interval: { negative: false, years: 0, months: 0, weeks: 0, days: 1 },
      }),
    ).toBeFalsy();

    expect(
      intervalUtils.isZero({
        type: "TIME",
        interval: {
          negative: true,
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 1,
        },
      }),
    ).toBeFalsy();
  });
});
