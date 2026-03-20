import { describe, expect, it } from "vitest";

import { eventID } from "../eventIds";

describe("eventIds", () => {
  it("validates", () => {
    expect(eventID("bar::foo").isValid()).toBe(true);
    expect(eventID("qwerty").isValid()).toBe(false);
  });

  it("parses", () => {
    expect(eventID("bar::foo").parse()).toEqual({
      category: "bar",
      action: "foo",
    });
    expect(() => eventID("qwerty").parse()).toThrow();
  });
});
