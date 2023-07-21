import { describe, expect, it } from "vitest";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { fallbackRenderers, defaultRenderers } from "..";
import { determineRenderer } from "../rendererTestUtils";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

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
        showRowKeys: false,
        showNoneColumn: false,
        format: "comboBox",
      },
    };
    expect(determineRenderer(uiSchema, schema, renderers)).toBe(
      "ComboBoxInput",
    );
  });
});
