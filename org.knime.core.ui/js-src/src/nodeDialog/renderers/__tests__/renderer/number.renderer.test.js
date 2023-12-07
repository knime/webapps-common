import { describe, expect, it } from "vitest";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { fallbackRenderers, defaultRenderers } from "..";
import { determineRenderer } from "../rendererTestUtils";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

describe("NumberInput", () => {
  const uiSchema = {
    type: "Control",
    scope: "#/properties/number",
  };

  it("determines integer renderer", () => {
    const integerSchema = {
      type: "object",
      properties: {
        number: {
          type: "integer",
        },
      },
    };
    expect(determineRenderer(uiSchema, integerSchema, renderers)).toBe(
      "IntegerInput",
    );
  });

  it("determines double renderer", () => {
    const schema = {
      type: "object",
      properties: {
        number: {
          type: "number",
        },
      },
    };
    expect(determineRenderer(uiSchema, schema, renderers)).toBe("NumberInput");
  });
});
