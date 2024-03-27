import { describe, expect, it } from "vitest";
import { determineRenderer } from "../rendererTestUtils";

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

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("textInput with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/text",
      options: {
        format: "string",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TextInput");
  });

  it("textInput without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/text",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TextInput");
  });
});
