import { describe, expect, it } from "vitest";

import { dialogInitialData } from "@@/test-setup/mocks/dialogData";
import { comboBoxTester } from "../../comboBoxRenderer";

import { inputFormats } from "./../../../constants/inputFormats";

describe("comboBoxTester", () => {
  it("applies on control with comboBox format and array schema", () => {
    expect(
      comboBoxTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/comboBox",
          options: {
            format: inputFormats.comboBox,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(true);
  });

  it("does not apply without comboBox format", () => {
    expect(
      comboBoxTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/comboBox",
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });

  it("does not apply if not a control", () => {
    expect(
      comboBoxTester(
        {
          type: "Section",
          options: {
            format: inputFormats.comboBox,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });

  it("does not apply if not an array", () => {
    expect(
      comboBoxTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/simpleTwinlist",
          options: {
            format: inputFormats.comboBox,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });
});
