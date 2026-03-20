/* eslint-disable camelcase */
import { describe, expect, it } from "vitest";

import { toSnakeCaseDeep } from "../toSnakeCaseDeep";

describe("toSnakeCaseDeep", () => {
  it("maps data correctly", () => {
    const dummyDate = new Date("2026-01-01").toISOString();

    const result = toSnakeCaseDeep({
      fooBar: "fooBar",
      dataApp: true,
      longNameForTimestamp: dummyDate,
      myProp: [1, 2, 3],
      myProp2: [
        { fooBar: "foobar", nestedFoo: "nestedFoo" },
        "mixed",
        1,
        [1, 2, 3],
      ],
    });

    const expected = {
      foo_bar: "fooBar",
      data_app: true,
      long_name_for_timestamp: dummyDate,
      my_prop: [1, 2, 3],
      my_prop_2: [
        { foo_bar: "foobar", nested_foo: "nestedFoo" },
        "mixed",
        1,
        [1, 2, 3],
      ],
    };

    expect(result).toEqual(expected);
  });
});
