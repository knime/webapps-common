import {
  type MockInstance,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { isMac, isWindows } from "../navigator";

const SAMPLE_OUTPUT_USER_AGENT_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/109.0";

const SAMPLE_OUTPUT_USER_AGENT_WINDOWS =
  "Mozilla/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725 Netscape6/6.1";

describe("navigator", () => {
  describe("mac os", () => {
    let userAgentGetter: MockInstance;

    beforeEach(() => {
      userAgentGetter = vi
        .spyOn(window.navigator, "userAgent", "get")
        .mockReturnValue(SAMPLE_OUTPUT_USER_AGENT_MAC);
    });

    it("returns true when calling isMac", () => {
      expect(isMac()).toBeTruthy();
      expect(userAgentGetter).toHaveBeenCalled();
    });

    it("returns false when calling isWindows", () => {
      expect(isWindows()).toBeFalsy();
      expect(userAgentGetter).toHaveBeenCalled();
    });
  });

  describe("windows/linux", () => {
    let userAgentGetter: MockInstance;

    beforeEach(() => {
      userAgentGetter = vi
        .spyOn(window.navigator, "userAgent", "get")
        .mockReturnValue(SAMPLE_OUTPUT_USER_AGENT_WINDOWS);
    });

    it("returns false when calling isMac", () => {
      expect(isMac()).toBeFalsy();
      expect(userAgentGetter).toHaveBeenCalled();
    });

    it("returns true when calling isWindows", () => {
      expect(isWindows()).toBe(true);
      expect(userAgentGetter).toHaveBeenCalled();
    });
  });
});
