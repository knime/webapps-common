import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("Section", () => {
  const schema = {};

  it("empty SectionLayout", () => {
    const uiSchema = {
      type: "Section",
      scope: "#/properties/test",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("SectionLayout");
  });
});
