import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("SingleSelectListBoxRenderer", () => {
  const schema = {
    type: "object",
    properties: {
      singleSelectListBoxRendererSettings: {
        type: "string",
      },
    },
  };

  it("determines SingleSelectListBox renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/singleSelectListBoxRendererSettings",
      options: {
        format: "singleSelectListBox",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe(
      "SingleSelectListBoxControl",
    );
  });
});
