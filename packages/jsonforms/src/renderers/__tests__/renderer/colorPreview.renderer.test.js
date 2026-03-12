import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("ColorPreviewControl", () => {
  it("determines ColorPreviewControl renderer for format: colorPreview", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/colorPreviewSetting",
      options: {
        format: "colorPreview",
      },
    };

    const schema = {
      type: "object",
      properties: {
        colorPreviewSetting: {},
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("ColorPreviewControl");
  });
});
