import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("teamResourceRenderer", () => {
  const schema = {
    type: "integer",
    minimum: 0,
    maximum: 100,
  };

  it("renders TeamResourceControl", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/teamResource",
      options: {
        format: "teamResources",
      },
    };
    expect(determineRenderer(uischema, schema)).toBe("TeamResourceControl");
  });

  it("does not render for non-integer type", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/teamResource",
      options: {
        format: "teamResources",
      },
    };
    const stringSchema = { type: "string" };
    expect(determineRenderer(uischema, stringSchema)).not.toBe(
      "TeamResourceControl",
    );
  });

  it("does not render for different format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/teamResource",
      options: {
        format: "quantity",
      },
    };
    expect(determineRenderer(uischema, schema)).not.toBe("TeamResourceControl");
  });
});
