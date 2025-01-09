import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("TextControl", () => {
  const schema = {
    type: "object",
    properties: {
      text: {
        type: "string",
      },
    },
  };

  it("textControl config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/text",
    };

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("textControl with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/text",
      options: {
        format: "string",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TextControl");
  });

  it("textControl without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/text",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TextControl");
  });
});
