import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("executorCoresResourceRenderer", () => {
  const schema = {
    type: "integer",
    minimum: 0,
    maximum: 100,
  };

  it("renders ExecutorCoresControl", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/executorCores",
      options: {
        format: "executorCoresResources",
      },
    };
    expect(determineRenderer(uischema, schema)).toBe("ExecutorCoresControl");
  });

  it("does not render for non-integer type", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/executorCores",
      options: {
        format: "executorCoresResources",
      },
    };
    const stringSchema = { type: "string" };
    expect(determineRenderer(uischema, stringSchema)).not.toBe(
      "ExecutorCoresControl",
    );
  });

  it("does not render for different format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/executorCores",
      options: {
        format: "quantity",
      },
    };
    expect(determineRenderer(uischema, schema)).not.toBe(
      "ExecutorCoresControl",
    );
  });
});
