import { describe, expect, it } from "vitest";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { fallbackRenderers, defaultRenderers } from "..";
import { determineRenderer } from "../rendererTestUtils";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

describe("Section", () => {
  const schema = {};

  it("empty SectionLayout", () => {
    const uiSchema = {
      type: "Section",
      scope: "#/properties/test",
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBe(
      "SectionLayout",
    );
  });
});
