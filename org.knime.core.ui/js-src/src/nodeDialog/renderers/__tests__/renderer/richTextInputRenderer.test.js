import { describe, expect, it } from "vitest";
import { determineRenderer } from "../rendererTestUtils";
import { inputFormats } from "@/nodeDialog/constants";

describe("RichTextInput", () => {
  const schema = {
    type: "object",
    properties: {
      richTextContent: {
        type: "string",
      },
    },
  };

  it("richTextInput config error", () => {
    const uiSchema = {
      type: "Controll",
      scope: "#/properties/richTextContent",
      options: {
        format: inputFormats.richTextInput,
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBeUndefined();
  });

  it("richTextInput with options", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/richTextContent",
      options: {
        format: "richTextInput",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("RichTextInput");
  });

  it("richTextInput without options uses fallback text renderer", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/richTextContent",
    };

    expect(determineRenderer(uiSchema, schema)).toBe("TextInput");
  });
});
