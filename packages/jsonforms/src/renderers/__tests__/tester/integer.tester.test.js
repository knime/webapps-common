import { describe, expect, it } from "vitest";

import { dialogInitialData } from "../../../../test-setup/mocks/dialogData";
import { inputFormats } from "../../../constants/inputFormats";
import { integerTester } from "../../integerRenderer";

describe("integerTester", () => {
  it("applies on number control with integer format", () => {
    expect(
      integerTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: inputFormats.integer,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(true);
  });

  it("does not apply without integer format", () => {
    expect(
      integerTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });

  it("does not apply if not a control", () => {
    expect(
      integerTester(
        {
          type: "Section",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: inputFormats.integer,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });
});
