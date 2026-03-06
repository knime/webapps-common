import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("executorMemoryResourceRenderer", () => {
  const schema = {
    type: "integer",
    minimum: 0,
    maximum: 100,
  };

  it("renders ExecutorMemoryControl", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/executorMemory",
      options: {
        format: "executorMemoryResources",
      },
    };
    expect(determineRenderer(uischema, schema)).toBe("ExecutorMemoryControl");
  });

  it("does not render for non-integer type", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/executorMemory",
      options: {
        format: "executorMemoryResources",
      },
    };
    const stringSchema = { type: "string" };
    expect(determineRenderer(uischema, stringSchema)).not.toBe(
      "ExecutorMemoryControl",
    );
  });

  it("does not render for different format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/executorMemory",
      options: {
        format: "quantity",
      },
    };
    expect(determineRenderer(uischema, schema)).not.toBe(
      "ExecutorMemoryControl",
    );
  });
});
