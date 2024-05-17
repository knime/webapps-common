import { describe, expect, it } from "vitest";
import { getIndicesFromDataPaths } from "../useGlobalWatchers";

describe("getIndicesFromDataPaths", () => {
  const splitPathAndGetIndicesFromDataPaths = (
    dataPaths: string[][],
    path: string,
  ) => getIndicesFromDataPaths(dataPaths, path.split("."))?.indices ?? null;

  it("matches indices from data paths", () => {
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem"]], "lorem"),
    ).toStrictEqual([]);
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem"], ["ipsum"]], "lorem"),
    ).toStrictEqual([]);
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem.ipsum"]], "lorem"),
    ).toStrictEqual([]);
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem"]], "lorem.ipsum"),
    ).toStrictEqual([]);
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem", "ipsum"]], "lorem.123"),
    ).toStrictEqual([123]);
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem", "ipsum"]],
        "lorem.123.ipsum",
      ),
    ).toStrictEqual([123]);
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem.ipsum", "dolor"]],
        "lorem.ipsum.123.dolor",
      ),
    ).toStrictEqual([123]);
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem", "ipsum.dolor"]],
        "lorem.123.ipsum",
      ),
    ).toStrictEqual([123]);
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem", "ipsum", "dolor"]],
        "lorem.123.ipsum.45",
      ),
    ).toStrictEqual([123, 45]);
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem", "ipsum", "dolor"]],
        "lorem.123.ipsum.45.dolor",
      ),
    ).toStrictEqual([123, 45]);
  });

  it("returns null if not matched", () => {
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem"]], "ipsum"),
    ).toBeNull();
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem"]], "ipsum.lorem"),
    ).toBeNull();
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem", "ipsum"]], "lorem.123."),
    ).toBeNull();
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem", "ipsum"]],
        "lorem.123.dolor.456.ipsum",
      ),
    ).toBeNull();
    expect(
      splitPathAndGetIndicesFromDataPaths([["loremipsum"]], "lorem"),
    ).toBeNull();
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem", "ipsum", "dolor"]],
        "lorem.123",
      ),
    ).toBeNull();
  });

  /**
   * E.g. when an array element is added, a value trigger inside of the array should not trigger.
   */
  it("return null if matched but the number of indices in the output would be smaller than required", () => {
    expect(
      splitPathAndGetIndicesFromDataPaths([["lorem", "ipsum"]], "lorem"),
    ).toBeNull();

    expect(
      splitPathAndGetIndicesFromDataPaths(
        [["lorem", "ipsum", "dolor"]],
        "lorem.123.ipsum",
      ),
    ).toBeNull();
  });

  it("decides for the longer indices array in case multiple data paths match", () => {
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [
          ["lorem", "ipsum", "dolor"],
          ["lorem", "ipsum"],
        ],
        "lorem.123.ipsum.45.dolor",
      ),
    ).toStrictEqual([123, 45]);
    expect(
      splitPathAndGetIndicesFromDataPaths(
        [
          ["lorem", "ipsum"],
          ["lorem", "ipsum", "dolor"],
        ],
        "lorem.123.ipsum.45.dolor",
      ),
    ).toStrictEqual([123, 45]);
  });
});
