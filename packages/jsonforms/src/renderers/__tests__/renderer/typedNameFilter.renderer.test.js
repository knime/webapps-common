import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("TypedNameFilter", () => {
  const schema = {
    type: "object",
    properties: {
      typedNameFilter: {
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

  it("typedNameFilter with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/typedNameFilter",
      options: {
        format: "typedNameFilter",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TypedNameFilter");
  });
});
