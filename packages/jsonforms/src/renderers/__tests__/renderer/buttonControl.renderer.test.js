import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("ButtonControl", () => {
  const schema = {
    type: "object",
    properties: {
      buttonControl: {}, // type does not matter for button input
    },
  };

  it("buttonControl without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonControl",
    };

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("buttonControl with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonControl",
      options: {
        format: "button",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("ButtonControl");
  });

  it("buttonControl with string type", () => {
    const schema = {
      type: "object",
      properties: {
        buttonControl: {}, // type does not matter for button input
      },
    };
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonControl",
      options: {
        format: "button",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe("ButtonControl");
  });

  it("string type without button format", () => {
    const schema = {
      type: "object",
      properties: {
        buttonControl: {
          type: "string",
        },
      },
    };
    const uiSchema = {
      type: "Control",
      scope: "#/properties/buttonControl",
    };
    expect(determineRenderer(uiSchema, schema)).toBe("TextControl");
  });
});
