import { describe, expect, it, test } from "vitest";

import {
  hasAdvancedOptions,
  isModelSettingAndHasNodeView,
  mergeDeep,
  optionsMapper,
} from "..";

describe("Utils", () => {
  it("optionsMapper maps Knime row data presentation to echarts index value", () => {
    expect(
      [
        { const: "rowName", title: "Row Name" },
        { const: "columName", title: "Colum Name" },
      ].map(optionsMapper),
    ).toEqual([
      { id: "rowName", text: "Row Name" },
      { id: "columName", text: "Colum Name" },
    ]);
  });

  it("mergeDeep", () => {
    // resolves without conflicts if possible
    expect(mergeDeep({ a: 1 }, { b: 1 })).toStrictEqual({ a: 1, b: 1 });
    expect(mergeDeep({ a: { b: 1 } }, { a: { c: 1 } })).toStrictEqual({
      a: { b: 1, c: 1 },
    });
    // prefers the second object over the first one on conflicts
    expect(mergeDeep({ a: 1 }, { a: 2 })).toStrictEqual({ a: 2 });
    expect(mergeDeep({ a: { b: 1 } }, { a: 1 })).toStrictEqual({ a: 1 });
    expect(mergeDeep({ a: 1 }, { a: { c: 1 } })).toStrictEqual({ a: { c: 1 } });
    // arrays
    expect(mergeDeep({ a: [1] }, { a: [2] })).toStrictEqual({ a: [2] });
    // not an object
    expect(mergeDeep({ a: 1 }, 1)).toStrictEqual({ a: 1 });
    expect(mergeDeep(1, { a: 1 })).toStrictEqual({ a: 1 });
  });

  // eslint-disable-next-line vitest/consistent-test-it
  test("isModelSettingsAndHasNodeView", () => {
    const control = {
      uischema: {
        scope: "#/properties/model/blub",
      },
    };
    expect(isModelSettingAndHasNodeView(control, true)).toBeTruthy();

    expect(isModelSettingAndHasNodeView(control, false)).toBeFalsy();

    control.uischema.scope = "#/properties/view/blub";
    expect(isModelSettingAndHasNodeView(control, true)).toBeFalsy();
  });

  it("returns true on ui_schema with advanced settings", () => {
    const uiSchema = {
      elements: [
        {
          type: "Section",
          label: "Some Section",
          description: "test",
          elements: [
            {
              type: "Control",
              scope: "#/properties/model/properties/categoryColumn",
              options: {
                format: "columnSelection",
                showRowKeys: false,
                showNoneColumn: false,
                isAdvanced: true,
              },
            },
          ],
        },
      ],
    };
    expect(hasAdvancedOptions(uiSchema)).toBeTruthy();
  });

  it("returns false on ui_schema without advanced settings", () => {
    const uiSchema = {
      elements: [
        {
          type: "Section",
          label: "Some Section",
          description: "test",
          elements: [
            {
              type: "Control",
              scope: "#/properties/model/properties/categoryColumn",
              options: {
                format: "columnSelection",
                showRowKeys: false,
                showNoneColumn: false,
              },
            },
          ],
        },
      ],
    };
    expect(hasAdvancedOptions(uiSchema)).not.toBeTruthy();
  });

  it("does not throw errors with an empty uischema", () => {
    // eslint-disable-next-line no-undefined
    expect(hasAdvancedOptions(undefined)).not.toBeTruthy();
  });
});
