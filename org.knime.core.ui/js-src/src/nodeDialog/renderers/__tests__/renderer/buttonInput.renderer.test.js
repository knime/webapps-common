import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("ButtonInput", () => {
  const schema = {
    type: "object",
    properties: {
      buttonInput: {}, // type does not matter for button input
    },
  };

  it("buttonInput without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonInput",
    };

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("buttonInput with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonInput",
      options: {
        format: "button",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("ButtonInput");
  });

  it("buttonInput with string type", () => {
    const schema = {
      type: "object",
      properties: {
        buttonInput: {}, // type does not matter for button input
      },
    };
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonInput",
      options: {
        format: "button",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe("ButtonInput");
  });

  it("string type without button format", () => {
    const schema = {
      type: "object",
      properties: {
        buttonInput: {
          type: "string",
        },
      },
    };
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonInput",
    };
    expect(determineRenderer(uiSchema, schema)).toBe("TextInput");
  });
});
