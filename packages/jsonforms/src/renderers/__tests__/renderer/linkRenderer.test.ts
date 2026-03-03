import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";

describe("LinkControl", () => {
  const schema = {
    description: "",
  };

  it("picks LinkControl", () => {
    const uischema = {
      type: "Control",
      scope: "#/properties/link",
      options: {
        format: "linkButton",
        to: "https://jsonforms.io",
      },
    };

    expect(determineRenderer(uischema, schema)).toBe("LinkRenderer");
  });
});
