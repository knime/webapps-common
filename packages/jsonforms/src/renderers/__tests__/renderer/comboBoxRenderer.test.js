import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("ColumnSelect", () => {
  const schema = {
    type: "object",
    properties: {
      comboBoxSettings: {
        type: "array",
      },
    },
  };

  it("determines ComboBox renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/comboBoxSettings",
      options: {
        format: "comboBox",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe("ComboBoxControl");
  });
});
