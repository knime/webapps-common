import { describe, it, beforeAll, expect, vi } from "vitest";
import { filters } from "../filters";

describe("filters", () => {
  beforeAll(() => {
    document.execCommand = vi.fn();
  });

  it("search matches correctly", () => {
    const filter = filters.search;
    let searchTerm = "A";

    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // case sensitive
    isCaseSensitive = true;
    normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // inverted
    isCaseSensitive = false;
    isInverted = true;
    normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();
    expect(
      filter.test("--B--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();

    // empty search term
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("", isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();
  });

  it("regex search matches correctly", () => {
    const filter = filters.regex;
    let searchTerm = ".*A.*";

    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // case sensitive
    isCaseSensitive = true;
    isInverted = false;
    normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // inverted
    isCaseSensitive = false;
    isInverted = true;
    normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();
    expect(
      filter.test("--B--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();

    // partial match --> do not match
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("A", isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // empty search term
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("", isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();
  });

  it("matches the wildcard general cases", () => {
    const filter = filters.wildcard;

    // partial match --> do not match
    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize("A", isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // empty search term
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize("", isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // case sensitive
    isCaseSensitive = true;
    isInverted = false;
    normalized = filter.normalize("--A--", isCaseSensitive, isInverted);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // inverted
    isCaseSensitive = false;
    isInverted = true;
    normalized = filter.normalize("--a--", isCaseSensitive, isInverted);
    expect(
      filter.test("--A--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();
    expect(
      filter.test("--B--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();
  });

  it('matches wildcard "*" search correctly', () => {
    const filter = filters.wildcard;
    let searchTerm = "*A*";

    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();
  });

  it('matches wildcard "?" search correctly', () => {
    const filter = filters.wildcard;
    let searchTerm = "??A??";

    let isCaseSensitive = false;
    let isInverted = false;
    let normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("--a--", normalized, isCaseSensitive, isInverted)
    ).toBeTruthy();
    expect(
      filter.test("--b--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();

    // checks that '?' only accepts one random character
    isCaseSensitive = false;
    isInverted = false;
    normalized = filter.normalize(searchTerm, isCaseSensitive, isInverted);
    expect(
      filter.test("---a--", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();
    expect(
      filter.test("--a---", normalized, isCaseSensitive, isInverted)
    ).toBeFalsy();
  });

  it("type search matches correctly", () => {
    const filter = filters.type;
    let selectedTypes = ["Type A", "Type B"];

    let normalized = filter.normalize(selectedTypes);
    expect(filter.test("Type A", normalized)).toBeTruthy();
    expect(filter.test("Type C", normalized)).toBeFalsy();
  });
});
