import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("ColumnSelect", () => {
  const schema = {
    type: "object",
    properties: {
      twinlistSetting: {
        type: "object",
        properties: {
          selected: {
            type: "array",
          },
        },
      },
      simpleTwinlistSetting: {
        type: "array",
      },
    },
  };

  it("determines ColumnSelect renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/twinlistSetting",
      options: {
        showRowKeys: false,
        showNoneColumn: false,
        format: "columnSelection",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe("ColumnSelect");
  });

  it("determines TwinList renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/twinlistSetting",
      options: {
        format: "twinList",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TwinlistControl");
  });

  it("determines SimpleTwinList renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/simpleTwinlistSetting",
      options: {
        format: "twinList",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("SimpleTwinlistControl");
  });
});
