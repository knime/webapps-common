import { describe, expect, it } from "vitest";

import { sideAndAlignToPlacement } from "../sideAndAlignToPlacement";

describe("sideAndAlignToPlacement", () => {
  it("side bottom align start", () => {
    const placement = sideAndAlignToPlacement("bottom", "start");
    expect(placement).toBe("bottom-start");
  });

  it("side top, align center", () => {
    const placement = sideAndAlignToPlacement("top", "center");
    expect(placement).toBe("top");
  });

  it("side left, align end", () => {
    const placement = sideAndAlignToPlacement("left", "end");
    expect(placement).toBe("left-end");
  });

  it("side right, align start", () => {
    const placement = sideAndAlignToPlacement("right", "start");
    expect(placement).toBe("right-start");
  });

  it("side bottom, no align", () => {
    const placement = sideAndAlignToPlacement("bottom");
    expect(placement).toBe("bottom");
  });

  it("fallback", () => {
    const placement = sideAndAlignToPlacement();
    expect(placement).toBe("bottom");
  });
});
