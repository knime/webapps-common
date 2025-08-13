import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("MultiSelectDropdownRenderer", () => {
  const schema = {
    type: "object",
    properties: {
      multiSelectDropdownSettings: {
        type: "array",
      },
    },
  };

  it("determines MultiSelectDropdown renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/multiSelectDropdownSettings",
      options: {
        format: "multiSelectDropdown",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe(
      "MultiSelectDropdownControl",
    );
  });
});
