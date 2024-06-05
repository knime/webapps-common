/* eslint-disable no-magic-numbers */
import { describe, it, expect } from "vitest";

import numIntegerDigits from "../numIntegerDigits";

describe("numIntegerDigits.js", () => {
  it("counts integer places of number", () => {
    expect(numIntegerDigits(457812)).toBe(6);
    expect(numIntegerDigits(-47812)).toBe(5);
    expect(numIntegerDigits(-47812.343)).toBe(5);
    expect(numIntegerDigits(47812.343)).toBe(5);
    expect(numIntegerDigits(0)).toBe(1);
    expect(numIntegerDigits(Infinity)).toBe(Infinity);
    expect(numIntegerDigits(Number.MAX_SAFE_INTEGER)).toBe(16);
    expect(numIntegerDigits(Number.MIN_SAFE_INTEGER)).toBe(16);
  });
});
