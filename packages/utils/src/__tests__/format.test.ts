import { type Mock, describe, expect, it, vi } from "vitest";

import {
  formatDateString,
  formatDateTimeString,
  formatFileSize,
  formatLocalDateTimeString,
  formatTimeString,
} from "../format";
import getLocalTimeZone from "../localTimezone";

vi.mock("../localTimezone");

describe("formatDate", () => {
  const validFixtures = [
    {
      input: 0,
      expectedDate: "Jan 1, 1970",
      expectedTime: "1:00 AM",
      expectedDateTime: "Jan 1, 1970 1:00 AM",
    },
    {
      input: "2018-07-31T09:44:31+00:00",
      expectedDate: "Jul 31, 2018",
      expectedTime: "11:44 AM",
      expectedDateTime: "Jul 31, 2018 11:44 AM",
    },
    {
      input: "December 17, 1995 03:24:00",
      expectedDate: "Dec 17, 1995",
      expectedTime: "3:24 AM",
      expectedDateTime: "Dec 17, 1995 3:24 AM",
    },
  ];

  const invalidFixtures = [
    {
      input: "",
    },
    {
      input: "thisIsNotAValidDate",
    },
  ];

  it("formats date strings", () => {
    validFixtures.forEach(({ input, expectedDate }) => {
      expect(formatDateString(input)).toEqual(expectedDate);
    });
  });

  it("formats time strings", () => {
    validFixtures.forEach(({ input, expectedTime }) => {
      expect(formatTimeString(input)).toEqual(expectedTime);
    });
  });

  it("formats date/time strings", () => {
    validFixtures.forEach(({ input, expectedDateTime }) => {
      expect(formatDateTimeString(input)).toEqual(expectedDateTime);
    });
  });

  it("format date throws error on invalid format", () => {
    invalidFixtures.forEach(({ input }) => {
      expect(() => formatDateString(input)).toThrowError();
    });
  });

  it("format time throws error on invalid format", () => {
    invalidFixtures.forEach(({ input }) => {
      expect(() => formatTimeString(input)).toThrowError();
    });
  });

  it("format date/time throws error on invalid format", () => {
    invalidFixtures.forEach(({ input }) => {
      expect(() => formatDateTimeString(input)).toThrowError();
    });
  });

  describe("parseToLocalTime", () => {
    const timeInUTC = {
      input: "2023-06-30T11:15:00.000Z",
      expectedDateTime: "Jun 30, 2023 1:15 PM",
    };
    const timeWithOffset = {
      input: "2023-11-30T11:15:00+00:00",
      expectedDateTime: "Nov 30, 2023 12:15 PM",
    };
    const timeInCST = {
      input: "2023-09-22T08:38:36.291Z",
      expectedDateTime: "Sep 22, 2023 3:38 AM",
    };

    it("parseToLocalTime throws error on invalid format", () => {
      expect(() => formatLocalDateTimeString("", true)).toThrowError();
    });

    it("formats time in UTC strings", () => {
      expect(formatLocalDateTimeString(timeInUTC.input, true)).toEqual(
        timeInUTC.expectedDateTime,
      );
    });

    it("formats time with offset strings", () => {
      expect(formatLocalDateTimeString(timeWithOffset.input, true)).toEqual(
        timeWithOffset.expectedDateTime,
      );
    });

    it("formats time to a different time zone", () => {
      (getLocalTimeZone as Mock).mockReturnValue("CST");
      expect(formatLocalDateTimeString(timeInCST.input, true)).toEqual(
        timeInCST.expectedDateTime,
      );
      (getLocalTimeZone as Mock).mockRestore();
    });
  });
});

describe("formatFileSize", () => {
  it("formats bytes using IEC units", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1024)).toBe("1 KiB");
    expect(formatFileSize(5 * 1024 * 1024 * 1024)).toBe("5 GiB");
  });

  it("respects rounding precision", () => {
    expect(formatFileSize(1536)).toBe("1.5 KiB");
    expect(formatFileSize(1536, 2)).toBe("1.50 KiB");
    expect(formatFileSize(1536, 0)).toBe("2 KiB");
  });

  it("guards against invalid inputs", () => {
    expect(formatFileSize(-1)).toBe("0 B");
    expect(formatFileSize(Number.NaN)).toBe("0 B");
    expect(formatFileSize(1536, -1)).toBe("2 KiB");
  });
});
