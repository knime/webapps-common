import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("VerticalLayout", () => {
  const schema = {};

  it("falls back to vertical layout on empty type", () => {
    const uiSchema = {
      scope: "#/properties/test",
    };

    // @ts-expect-error
    expect(determineRenderer(uiSchema, schema)).toBe("VerticalLayout");
  });

  it("detects vertical layout by type", () => {
    const uiSchema = {
      type: "VerticalLayout",
      scope: "#/properties/test",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("VerticalLayout");
  });
});
