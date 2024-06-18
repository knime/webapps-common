import { describe, expect, it, vi, beforeEach } from "vitest";
import { formatHotkeys } from "../formatHotkeys";
import type { Hotkey } from "../formatHotkeys";
import { afterEach } from "node:test";
import * as navigator from "../navigator";

describe("formatHotkey", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("mac os", () => {
    beforeEach(() => {
      vi.spyOn(navigator, "isMac").mockImplementation(() => true);
    });

    it("returns symbols for arrow keys and enter", () => {
      const hotkeys: Array<Hotkey> = [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
      ];
      expect(formatHotkeys(hotkeys)).toBe("↑ ↓ ← → ↩");
    });

    it("returns special symbols for specific keys on mac", () => {
      const hotkeys: Array<Hotkey> = [
        // mac specific
        "Shift",
        "Delete",
        "CtrlOrCmd",
        "Ctrl",
        "Alt",
        "Enter",

        // general
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " ",
      ];
      expect(formatHotkeys(hotkeys)).toBe("⇧ ⌫ ⌘ ⌃ ⌥ ↩ ↑ ↓ ← → Space");
    });
  });

  describe("windows/linux", () => {
    beforeEach(() => {
      vi.spyOn(navigator, "isMac").mockImplementation(() => false);
    });

    it("returns symbols for arrow keys and enter", () => {
      const hotkeys: Array<Hotkey> = [
        "Shift",
        "Delete",
        "CtrlOrCmd",
        "Ctrl",
        "Alt",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        " ",
      ];
      expect(formatHotkeys(hotkeys)).toBe(
        "Shift Delete Ctrl Ctrl Alt ↑ ↓ ← → ↵ Space",
      );
    });
  });
});
