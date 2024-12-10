import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("SortListControl", () => {
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
        format: "sortList",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("SortListControl");
  });
});
