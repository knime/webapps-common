import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("RadioControl", () => {
  const schema = {
    type: "object",
    properties: {
      radio: {
        oneOf: [
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

  it("radioControl with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/radio",
      options: {
        format: "radio",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("RadioControl");
  });
});
