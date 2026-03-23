import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("usernameRenderer", () => {
  const schema = {
    type: "string",
  };

  it("picks UsernameRenderer", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/username",
      options: {
        format: "username",
      },
    };

    expect(determineRenderer(uischema, schema)).toBe("UsernameRenderer");
  });

  it("does not pick UsernameRenderer with different format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/username",
      options: {
        format: "text",
      },
    };

    expect(determineRenderer(uischema, schema)).not.toBe("UsernameRenderer");
  });

  it("does not pick UsernameRenderer without format", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/username",
    };

    expect(determineRenderer(uischema, schema)).not.toBe("UsernameRenderer");
  });
});
