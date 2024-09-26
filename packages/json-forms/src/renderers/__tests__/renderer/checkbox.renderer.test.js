import { describe, expect, it } from "vitest";
import { determineRenderer } from "../rendererTestUtils";

describe("CheckboxControl", () => {
  const schema = {
    type: "object",
    properties: {
      checkbox: {
        type: "boolean",
      },
    },
  };

  it("checkboxControl config error", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/checkbox",
      options: {
        format: "integer",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("CheckboxControl");
  });

  it("checkboxControl with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/checkbox",
      options: {
        format: "checkbox",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("CheckboxControl");
  });

  it("checkboxControl without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/checkbox",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("CheckboxControl");
  });
});
