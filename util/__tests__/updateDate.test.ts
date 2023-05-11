/* eslint-disable no-magic-numbers */
import { describe, it, expect } from "vitest";

import updateDate from "../updateDate";

describe("updateDate.js", () => {
  it("updates only date part (year, month, day) of a date object", () => {
    const d = new Date("2020-10-20T15:12:08Z");
    const r = updateDate(d, new Date("2019-09-02T12:20:10Z"));

    expect(r.getUTCFullYear()).toBe(2019);
    expect(r.getUTCMonth()).toBe(8); // month starts with 0
    expect(r.getUTCDate()).toBe(2);
    expect(r.getUTCHours()).toBe(15);
    expect(r.getUTCMinutes()).toBe(12);
    expect(r.getUTCSeconds()).toBe(8);
  });

  it("returns valid date object even if base is invalid", () => {
    const d = new Date("");
    const r = updateDate(d, new Date("2019-09-02T12:20:10Z"));

    expect(r.getFullYear()).toBe(2019);
    expect(r.getMonth()).toBe(8); // month starts with 0
    expect(r.getDate()).toBe(2);
    expect(r.getHours()).toBe(1);
    expect(r.getMinutes()).toBe(0);
    expect(r.getSeconds()).toBe(0);
  });

  it("skips falsy dates", () => {
    const d = new Date();
    expect(updateDate(d, null)).toStrictEqual(d);
  });
});
