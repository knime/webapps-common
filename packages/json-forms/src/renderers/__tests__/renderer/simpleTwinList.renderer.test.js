import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("SimpleTwinlistControl", () => {
  const schema = {
    type: "object",
    properties: {
      twinlist: {
        type: "array",
      },
    },
  };

  it("determines the correct renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/twinlist",
      options: {
        format: "twinList",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("SimpleTwinlistControl");
  });
});
