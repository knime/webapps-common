import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("IntegerInput", () => {
  const schema = {
    type: "object",
    properties: {
      integer: {
        type: "integer",
      },
    },
  };

  it("integerInput config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/integer",
    };

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("integerInput with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/integer",
      options: {
        format: "integer",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("IntegerInput");
  });

  it("integerInput without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/integer",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("IntegerInput");
  });
});
