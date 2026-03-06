import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("fileUploadRenderer", () => {
  it("picks the fileUploadRenderer", () => {
    const schema = {
      type: "object",
      properties: {
        fileUpload: {
          type: "array",
          title: "File Upload",
        },
      },
    };
    const uiSchema = {
      type: "Control",
      scope: "#/properties/fileUpload",
      options: {
        format: "fileUpload",
      },
    };
    expect(determineRenderer(uiSchema, schema)).toBe("FileUploadRenderer");
  });
});
