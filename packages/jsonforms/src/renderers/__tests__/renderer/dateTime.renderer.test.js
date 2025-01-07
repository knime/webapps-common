import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("DateTimeControl", () => {
  const schema = {
    type: "object",
    properties: {
      dateTime: {
        type: "string",
        // This is important for `isDateTimeControl` from the jsonforms core/src/testers
        format: "date-time",
      },
    },
  };

  it("determines DateTimeControl from schema", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DateTimeControl");
  });

  it("determines DateTimeControl from uischema", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
      options: {
        format: "dateTime",
      },
    };

    const schema = {
      type: "object",
      properties: {
        dateTime: {
          type: "string",
        },
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DateTimeControl");
  });

  it("detemines DateControl from uischema", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
      options: {
        format: "localDate",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DateControl");
  });

  it("determines TimeControl from uischema", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dateTime",
      options: {
        format: "localTime",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TimeControl");
  });
});
