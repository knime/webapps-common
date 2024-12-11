import { describe, expect, it } from "vitest";

import { dialogInitialData } from "../../../../test-setup/mocks/dialogData";
import { dropdownTester } from "../../dropdownRenderer";

import { inputFormats } from "./../../../constants/inputFormats";

describe("dropdownTester", () => {
  it("applies on oneOf control with dropdown format", () => {
    expect(
      dropdownTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/dropdown",
          options: {
            format: inputFormats.dropDown,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(true);
  });

  it("does not apply without dropdown format", () => {
    expect(
      dropdownTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/dropdown",
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });

  it("does not apply if not a control", () => {
    expect(
      dropdownTester(
        {
          type: "Section",
          options: {
            format: inputFormats.dropDown,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });
});
