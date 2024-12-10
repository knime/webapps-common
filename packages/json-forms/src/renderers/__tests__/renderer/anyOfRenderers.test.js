import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("controls with an anyOf schema", () => {
  const schema = {
    type: "object",
    properties: {
      anyOfControl: {
        anyOf: [
          {
            const: "1",
            title: "One",
          },
          {
            const: "2",
            title: "Two",
          },
        ],
      },
    },
  };

  it("falls back to twinlist without format", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/anyOfControl",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("AnyOfTwinlist");
  });
});
