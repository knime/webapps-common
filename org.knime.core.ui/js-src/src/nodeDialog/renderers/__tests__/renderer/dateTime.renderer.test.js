import { describe, expect, it } from "vitest";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { fallbackRenderers, defaultRenderers } from "..";
import { determineRenderer } from "../rendererTestUtils";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

describe("DateTimeInput", () => {
  const schema = {
    type: "object",
    properties: {
      dateTime: {
        type: "string",
        format: "date-time",
      },
    },
  };

  it("dateTimeInput config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/dateTime",
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBeUndefined();
  });

  it("textInput with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
      options: {
        format: "date-time",
      },
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBe(
      "DateTimeInput",
    );
  });

  it("textInput without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBe(
      "DateTimeInput",
    );
  });
});
