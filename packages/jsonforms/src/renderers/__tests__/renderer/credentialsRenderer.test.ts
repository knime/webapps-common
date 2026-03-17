import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("CredentialsControl", () => {
  const schema = {
    type: "object",
    properties: {
      credentials: {
        type: "object",
        properties: {
          username: {
            type: "string",
          },
          password: {
            type: "string",
          },
        },
      },
    },
  };

  it("picks CredentialsControl", () => {
    const uiSchema = {
      type: "Control",
      scope: "#/properties/credentials",
      options: {
        format: "credentials",
      },
    };

    expect(determineRenderer(uiSchema, schema)).toBe("CredentialsRenderer");
  });
});
