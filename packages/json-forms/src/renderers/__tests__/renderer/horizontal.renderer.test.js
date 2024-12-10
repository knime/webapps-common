import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("HorizontalLayout", () => {
  const schema = {};

  it("empty HorizontalLayout", () => {
    const uiSchema = {
      type: "HorizontalLayout",
      scope: "#/properties/test",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("HorizontalLayout");
  });
});
