import { describe, expect, it } from "vitest";
import { determineRenderer } from "../rendererTestUtils";

describe("Dropdown", () => {
  const schema = {
    type: "object",
    properties: {
      dropdown: {
        oneOf: [
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
  };

  it("renders DropdownInput", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/dropdown",
      options: {
        format: "dropDown",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("DropdownInput");
  });
});
