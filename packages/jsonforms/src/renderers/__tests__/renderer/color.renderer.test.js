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
      type: "string",
      default: "#FF9632",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("ColorControl");
  });
});
