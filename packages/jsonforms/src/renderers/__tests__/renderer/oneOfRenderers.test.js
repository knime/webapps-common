import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("controls with an oneOf schema", () => {
  const schema = {
    type: "object",
    properties: {
      oneOfControl: {
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

  it("creates a value switch if requested", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/oneOfControl",
      options: {
        format: "valueSwitch",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("ValueSwitchControl");
  });

  it("creates radio buttons if requested", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/oneOfControl",
      options: {
        format: "radio",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("RadioControl");
  });

  it("falls back to dropdown without format", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/oneOfControl",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("OneOfDropdown");
  });
});
