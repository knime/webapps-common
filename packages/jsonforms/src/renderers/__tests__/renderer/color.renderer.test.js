import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("ColorControl", () => {
  it("determines ColorControl renderer for format: color", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/color",
      options: {
        format: "color",
      },
    };

    const schema = {
      type: "object",
      properties: {
        value: {
          type: "integer",
          format: "int32",
        },
      },
      default: "#FF9632",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("ColorControl");
  });
});
