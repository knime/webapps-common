import { describe, expect, it } from "vitest";

import { dialogInitialData } from "../../../../test-setup/mocks/dialogData";
import { checkboxTester } from "../../checkboxRenderer";

import { inputFormats } from "./../../../constants/inputFormats";

describe("checkboxTester", () => {
  it("applies for boolean control with checkbox format", () => {
    expect(
      checkboxTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/showTooltip",
          options: {
            format: inputFormats.checkbox,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(true);
  });

  it("does not apply if checkbox format is not set", () => {
    expect(
      checkboxTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/showTooltip",
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });

  it("does not apply if not a Control", () => {
    expect(
      checkboxTester(
        {
          type: "Section",
          scope: "#/properties/view/properties/showTooltip",
          options: {
            format: inputFormats.checkbox,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });
});
