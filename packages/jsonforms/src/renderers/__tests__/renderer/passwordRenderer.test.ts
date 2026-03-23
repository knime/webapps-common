import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("passwordRenderer", () => {
  const schema = {
    type: "string",
  };

  it("picks PasswordRenderer", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/password",
      options: {
        format: "password",
      },
    };

    expect(determineRenderer(uischema, schema)).toBe("PasswordRenderer");
  });

  it("does not pick PasswordRenderer with different format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/password",
      options: {
        format: "text",
      },
    };

    expect(determineRenderer(uischema, schema)).not.toBe("PasswordRenderer");
  });

  it("does not pick PasswordRenderer without format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/password",
    };

    expect(determineRenderer(uischema, schema)).not.toBe("PasswordRenderer");
  });
});
