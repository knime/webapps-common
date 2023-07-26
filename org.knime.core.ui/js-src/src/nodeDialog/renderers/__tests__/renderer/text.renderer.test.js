import { describe, expect, it } from "vitest";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { fallbackRenderers, defaultRenderers } from "..";
import { determineRenderer } from "../rendererTestUtils";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

describe("TextInput", () => {
  const schema = {
    type: "object",
    properties: {
      text: {
        type: "string",
      },
    },
  };

  it("textInput config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/text",
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBeUndefined();
  });

  it("textInput with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/text",
      options: {
        format: "string",
      },
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBe("TextInput");
  });

  it("textInput without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/text",
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBe("TextInput");
  });
});
