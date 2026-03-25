import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("radioWithDescriptionRenderer", () => {
  const schema = {
    oneOf: [
      {
        const: "option1",
        title: "Option 1",
        description: "Description 1",
        price: "$10",
      },
      {
        const: "option2",
        title: "Option 2",
        description: "Description 2",
        price: "$20",
      },
    ],
  };

  it("picks RadioButtonsWithDescriptionControl", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/subscription",
      options: {
        format: "radioButtonsWithDescription",
      },
    };

    expect(determineRenderer(uischema, schema)).toBe(
      "RadioButtonsWithDescriptionControl",
    );
  });

  it("does not pick RadioButtonsWithDescriptionControl with different format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/subscription",
      options: {
        format: "radio",
      },
    };

    expect(determineRenderer(uischema, schema)).not.toBe(
      "RadioButtonsWithDescriptionControl",
    );
  });
});
