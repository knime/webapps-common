import { describe, expect, it } from "vitest";

import { localTimeUtils } from "../localTimeUtils";

describe("localTimeUtils", () => {
  describe("toString", () => {
    it("formats time correctly with leading zeros", () => {
      const time = new Date();
      time.setHours(3);
      time.setMinutes(5);
      time.setSeconds(9);
      time.setMilliseconds(42);

      const result = localTimeUtils.toString(time);
      expect(result).toBe("03:05:09.042");
    });

    it("handles zero values correctly", () => {
      const time = new Date();
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
      time.setMilliseconds(0);
      const result = localTimeUtils.toString(time);
      expect(result).toBe("00:00:00.000");
    });
  });

  describe("fromString", () => {
    it("parses full time string correctly", () => {
      const timeStr = "12:34:56.789";
      const result = localTimeUtils.fromString(timeStr);
      expect(result.getHours()).toBe(12);
      expect(result.getMinutes()).toBe(34);
      expect(result.getSeconds()).toBe(56);
      expect(result.getMilliseconds()).toBe(789);
    });

    it("parses time string without seconds and milliseconds", () => {
      const timeStr = "14:22";
      const result = localTimeUtils.fromString(timeStr);
      expect(result.getHours()).toBe(14);
      expect(result.getMinutes()).toBe(22);
      expect(result.getSeconds()).toBe(0);
      expect(result.getMilliseconds()).toBe(0);
    });

    it("parses time with subsecond precision, rounding to milliseconds", () => {
      const timeStr = "10:10:10.123456789";
      const result = localTimeUtils.fromString(timeStr);
      expect(result.getHours()).toBe(10);
      expect(result.getMinutes()).toBe(10);
      expect(result.getSeconds()).toBe(10);
      expect(result.getMilliseconds()).toBe(123);
    });

    it("throws error for invalid time format", () => {
      expect(() => localTimeUtils.fromString("invalid")).toThrow(/.*invalid.*/);
    });
  });
});
