import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("MultiSelectListBoxRenderer", () => {
  const schema = {
    type: "object",
    properties: {
      multiSelectListBoxRendererSettings: {
        type: "array",
      },
    },
  };

  it("determines MultiSelectListBox renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/multiSelectListBoxRendererSettings",
      options: {
        format: "multiSelectListBox",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe(
      "MultiselectListBoxControl",
    );
  });
});
