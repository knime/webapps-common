import { describe, expect, it } from "vitest";

import { determineRenderer } from "../../../../testUtils";
import { SimpleArrayLayout } from "../../../layoutComponents";
import { simpleArrayLayoutRenderer } from "../../simpleArrayLayoutRenderer";

describe("simpleArrayLayoutRenderer", () => {
  it("has the correct name", () => {
    expect(simpleArrayLayoutRenderer.name).toBe("SimpleArrayLayout");
  });

  it("has the correct renderer component", () => {
    expect(simpleArrayLayoutRenderer.renderer).toBe(SimpleArrayLayout);
  });

  it("matches uischemas with type SimpleArrayLayout", () => {
    const result = determineRenderer({ type: "SimpleArrayLayout" }, {});
    expect(result).toBe("SimpleArrayLayout");
  });

  it("does not match other uischema types", () => {
    const result = determineRenderer({ type: "VerticalLayout" }, {});
    expect(result).not.toBe("SimpleArrayLayout");
  });
});
