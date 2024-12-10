import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("TextControl", () => {
  it("detects VennDiagram type", () => {
    const uiSchema = {
      type: "VennDiagram",
    };

    expect(determineRenderer(uiSchema, {})).toBe("VennDiagramLayout");
  });
});
