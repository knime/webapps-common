import { describe, expect, it } from "vitest";
import { determineRenderer } from "../rendererTestUtils";

describe("TextInput", () => {
  it("detects VennDiagram type", () => {
    const uiSchema = {
      type: "VennDiagram",
    };

    expect(determineRenderer(uiSchema, {})).toBe("VennDiagramLayout");
  });
});
