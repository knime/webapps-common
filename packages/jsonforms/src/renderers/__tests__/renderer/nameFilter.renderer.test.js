import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("TypedStringFilter", () => {
  const schema = {
    type: "object",
    properties: {
      typedStringFilter: {
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

  it("nameFilter with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/nameFilter",
      options: {
        format: "nameFilter",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("NameFilter");
  });
});
