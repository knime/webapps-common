import { describe, expect, it } from "vitest";
import { valueSwitchTester } from "../../valueSwitchRenderer";
import { dialogInitialData } from "@@/test-setup/mocks/dialogData";

describe("valueSwitchTester", () => {
  it("applies on a oneOf control with valueSwitch format", () => {
    expect(
      valueSwitchTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/yAxisScale",
          options: {
            format: "valueSwitch",
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(true);
  });

  it("does not apply without valueSwitch format", () => {
    expect(
      valueSwitchTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/yAxisScale",
          options: {
            format: "columnSelection",
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });

  it("does not apply if not a control", () => {
    expect(
      valueSwitchTester(
        {
          type: "Section",
          scope: "#/properties/view/properties/yAxisScale",
          options: {
            format: "valueSwitch",
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });
});
