import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("IntegerControl", () => {
  const schema = {
    type: "object",
    properties: {
      integer: {
        type: "integer",
      },
    },
  };

  it("integerControl config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/integer",
    };

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("integerControl with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/integer",
      options: {
        format: "integer",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("IntegerControl");
  });

  it("integerControl without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/integer",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("IntegerControl");
  });
});
