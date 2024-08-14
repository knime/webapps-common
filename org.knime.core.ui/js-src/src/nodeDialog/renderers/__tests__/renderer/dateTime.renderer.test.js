import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("DateTimeControl", () => {
  const schema = {
    type: "object",
    properties: {
      dateTime: {
        type: "string",
        format: "date-time",
      },
    },
  };

  it("dateTimeControl config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/dateTime",
    };

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("textControl with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
      options: {
        format: "date-time",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DateTimeControl");
  });

  it("textControl without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DateTimeControl");
  });
});
