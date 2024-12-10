import { describe, expect, it } from "vitest";

import { dialogInitialData } from "@@/test-setup/mocks/dialogData";
import { nameFilterTester } from "../../nameFilterRenderer";

import { inputFormats } from "./../../../constants/inputFormats";

describe("NameFilterTester", () => {
  it("applies on anyOf control with nameFilter format", () => {
    expect(
      nameFilterTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/frequencyColumns",
          options: {
            format: inputFormats.nameFilter,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(true);
  });

  it("does not apply if not a control", () => {
    expect(
      nameFilterTester(
        {
          type: "Section",
          options: {
            format: inputFormats.nameFilter,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBe(false);
  });
});
