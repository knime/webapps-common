import { describe, expect, it } from "vitest";
import getWrappedAroundIndex from "../getWrappedAroundIndex";

describe("getWrappedAroundIndex", () => {
  it("returns positive modulo for positive values", () => {
    expect(getWrappedAroundIndex(5, 3)).toBe(2);
  });

  it("returns positive modulo for negaive first value", () => {
    expect(getWrappedAroundIndex(-5, 3)).toBe(1);
  });

  it("returns correct answer for edge cases", () => {
    expect(getWrappedAroundIndex(5, 1)).toBe(0);
    expect(getWrappedAroundIndex(5, 0)).toBeNaN();
  });
});
