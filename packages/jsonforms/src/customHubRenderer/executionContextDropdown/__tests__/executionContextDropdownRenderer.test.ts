import { describe, expect, it } from "vitest";
import { determineRenderer } from "packages/jsonforms/testUtils";

describe("ExecutionContextDropdown", () => {
  const schema = {
    type: "object",
    properties: {
      executionContextDropdown: {
        oneOf: [
          {
            const: "ec1",
            title: "Execution Context 1",
          },
          {
            const: "ec2",
            title: "Execution Context 2",
          },
        ],
      },
    },
  };

  it("renders ExecutionContextDropdown", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/executionContextDropdown",
      options: {
        format: "executionContextDropdown",
      },
    };

    expect(determineRenderer(schema, uiSchema)).toBe(
      "ExecutionContextDropdownRenderer",
    );
  });
});
