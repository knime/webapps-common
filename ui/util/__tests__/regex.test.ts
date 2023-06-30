import { describe, expect, it } from "vitest";
import { buildUrlRegex } from "../regex";

describe("regex utils", () => {
  it("should create a regex that validates URLs without an http(s) prefix", () => {
    const regex = buildUrlRegex();

    expect(regex.test("http://www.google.com")).toBe(true);
    expect(regex.test("https://www.google.com")).toBe(true);
    expect(regex.test("www.google.com")).toBe(true);

    expect(regex.test("htt://www.google.com")).toBe(false);
    expect(regex.test("https:www.google.com")).toBe(false);
    expect(regex.test("www.example")).toBe(false);
  });

  it("should create a regex that validates URLs with an http(s) prefix", () => {
    const regex = buildUrlRegex(true);

    expect(regex.test("http://www.google.com")).toBe(true);
    expect(regex.test("https://www.google.com")).toBe(true);
    expect(regex.test("www.google.com")).toBe(false);

    expect(regex.test("htt://www.google.com")).toBe(false);
    expect(regex.test("https:www.google.com")).toBe(false);
    expect(regex.test("www.example")).toBe(false);
  });
});
