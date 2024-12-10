import { describe, expect, it } from "vitest";

import { determineRenderer } from "../rendererTestUtils";

describe("ColumnFilter", () => {
  const schema = {
    type: "object",
    properties: {
      columnFilter: {
        type: "object",
        properties: {
          selected: {
            anyOf: [
              {
                const: "1",
                title: "One",
              },
              {
                const: "2",
                title: "Two",
              },
              {
                const: "3",
                title: "Three",
              },
            ],
          },
        },
      },
    },
  };

  it("columnFilter with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/columnFilter",
      options: {
        format: "columnFilter",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("ColumnFilter");
  });
});
