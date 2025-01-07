import { describe, expect, it } from "vitest";

import { dialogInitialData } from "../../../../test-setup/mocks/dialogData";
import { inputFormats } from "../../../constants/inputFormats";
import { richTextTester } from "../../richTextRenderer";

describe("richTextTester", () => {
  it("applies for string control with richTextInput format", () => {
    expect(
      richTextTester(
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
      richTextTester({
        type: "Control",
        scope: "#/properties/view/properties/title",
      }),
      dialogInitialData.schema,
    ).toBeFalsy();
  });

  it("does not apply if not a Control", () => {
    expect(
      richTextTester(
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
