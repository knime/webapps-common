import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("DateTimeInput", () => {
  const schema = {
    type: "object",
    properties: {
      dateTime: {
        type: "string",
        format: "date-time",
      },
    },
  };

  it("dateTimeInput config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/dateTime",
    };

    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("textInput with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
      options: {
        format: "date-time",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DateTimeInput");
  });

  it("textInput without options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DateTimeInput");
  });
});
