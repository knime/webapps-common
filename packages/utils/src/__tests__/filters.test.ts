import { describe, expect, it } from "vitest";

import { filters } from "../filters";

describe("filters", () => {
  it("search matches correctly", () => {
    const filter = filters.search;
    const searchTerm = "A";

    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // case sensitive
    isCaseSensitive = true;
    normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // inverted
    isCaseSensitive = false;
    isInverted = true;
    normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();
    expect(
      filter.test("--B--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();

    // empty search term
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("", isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
  });

  it("regex search matches correctly", () => {
    const filter = filters.regex;
    const searchTerm = ".*A.*";

    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // case sensitive
    isCaseSensitive = true;
    isInverted = false;
    normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // inverted
    isCaseSensitive = false;
    isInverted = true;
    normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();
    expect(
      filter.test("--B--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();

    // partial match --> do not match
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("A", isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // empty search term
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("", isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // or concantenated expressions
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("test1|test2", isCaseSensitive);
    expect(
      filter.test("test1", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
    expect(
      filter.test("test2", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
    expect(
      filter.test(
        "something ending with test2",
        normalized,
        isCaseSensitive,
        isInverted,
      ),
    ).toBeFalsy();
    expect(
      filter.test(
        "test1 starting with the correct word",
        normalized,
        isCaseSensitive,
        isInverted,
      ),
    ).toBeFalsy();
  });

  it("matches the wildcard general cases", () => {
    const filter = filters.wildcard;

    // partial match --> do not match
    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize("A", isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // empty search term
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("", isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // case sensitive
    isCaseSensitive = true;
    isInverted = false;
    normalized = filter.normalize("--A--", isCaseSensitive);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // inverted
    isCaseSensitive = false;
    isInverted = true;
    normalized = filter.normalize("--a--", isCaseSensitive);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();
    expect(
      filter.test("--B--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
  });

  it('matches wildcard "*" search correctly', () => {
    const filter = filters.wildcard;
    const searchTerm = "*A*";

    const isCaseSensitive = false;
    const isInverted = false;
    const normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();
  });

  it('matches wildcard "?" search correctly', () => {
    const filter = filters.wildcard;
    const searchTerm = "??A??";

    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted),
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();

    // checks that '?' only accepts one random character
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize(searchTerm, isCaseSensitive);
    expect(
      filter.test("---a--", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();
    expect(
      filter.test("--a---", normalized, isCaseSensitive, isInverted),
    ).toBeFalsy();
  });

  it("type search matches correctly", () => {
    const filter = filters.type;
    const selectedTypes = ["Type A", "Type B"];

    const normalized = filter.normalize(selectedTypes, false);
    expect(filter.test("Type A", normalized, false, false)).toBeTruthy();
    expect(filter.test("Type C", normalized, false, false)).toBeFalsy();
  });
});
