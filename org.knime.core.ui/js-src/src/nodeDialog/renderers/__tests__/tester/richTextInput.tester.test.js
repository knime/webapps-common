import { describe, expect, it } from "vitest";
import { dialogInitialData } from "@@/test-setup/mocks/dialogData";
import { inputFormats } from "@/nodeDialog/constants/inputFormats";
import { richTextInputTester } from "../../richTextInputRenderer";

describe("richTextInputTester", () => {
  it("applies for string control with richTextInput format", () => {
    expect(
      richTextInputTester(
        {
          type: "Control",
          scope: "#/properties/view/properties/title",
          options: {
            format: inputFormats.richTextInput,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBeTruthy();
  });

  it("does not apply if richTextInput format is not set", () => {
    expect(
      richTextInputTester({
        type: "Control",
        scope: "#/properties/view/properties/title",
      }),
      dialogInitialData.schema,
    ).toBeFalsy();
  });

  it("does not apply if not a Control", () => {
    expect(
      richTextInputTester(
        {
          type: "Section",
          scope: "#/properties/view/properties/title",
          options: {
            format: inputFormats.richTextInput,
          },
        },
        dialogInitialData.schema,
      ),
    ).toBeFalsy();
  });
});
