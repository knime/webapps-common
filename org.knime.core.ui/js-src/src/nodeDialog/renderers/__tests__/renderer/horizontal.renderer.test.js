import { describe, expect, it } from "vitest";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { fallbackRenderers, defaultRenderers } from "..";
import { determineRenderer } from "../rendererTestUtils";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

describe("HorizontalLayout", () => {
  const schema = {};

  it("empty HorizontalLayout", () => {
    const uiSchema = {
      type: "HorizontalLayout",
      scope: "#/properties/test",
    };

    expect(determineRenderer(uiSchema, schema, renderers)).toBe(
      "HorizontalLayout",
    );
  });
});
