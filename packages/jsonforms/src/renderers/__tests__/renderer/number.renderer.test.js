import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("NumberControl", () => {
  const uiSchema = {
    type: "Control",
    scope: "#/properties/number",
  };

  it("determines integer renderer", () => {
    const integerSchema = {
      type: "object",
      properties: {
        number: {
          type: "integer",
        },
      },
    };
    expect(determineRenderer(uiSchema, integerSchema)).toBe("IntegerControl");
  });

  it("determines double renderer", () => {
    const schema = {
      type: "object",
      properties: {
        number: {
          type: "number",
        },
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe("NumberControl");
  });
});
