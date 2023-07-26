import { describe, expect, it } from "vitest";
import { numberTester } from "../../numberRenderer";
import { inputFormats } from "@/nodeDialog/constants/inputFormats";
import { dialogInitialData } from "@@/test-setup/mocks/dialogInitialData";

describe("numberTester", () => {
  it("applies on number control with number format", () => {
    expect(
      numberTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/fraction",
          options: {
            format: inputFormats.number,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(true);
  });

  it("does not apply without number format", () => {
    expect(
      numberTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/fraction",
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });

  it("does not apply if not a control", () => {
    expect(
      numberTester(
        {
          type: "Section",
          scope: "#/properties/view/properties/fraction",
          options: {
            format: inputFormats.number,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });
});
