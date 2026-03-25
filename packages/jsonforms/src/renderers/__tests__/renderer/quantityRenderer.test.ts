import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("quantityRenderer", () => {
  const schema = {
    type: "integer",
    minimum: 0,
    maximum: 100,
  };

  it("renders quantity control", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/quantity",
      options: {
        format: "quantity",
        step: 1,
      },
    };
    expect(determineRenderer(uischema, schema)).toBe("QuantityControl");
  });
});
