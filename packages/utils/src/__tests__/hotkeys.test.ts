import { afterEach, describe, expect, it, vi } from "vitest";

import { navigatorUtils } from "@knime/utils";

import {
  getMetaOrCtrlKey,
  isKeyWithoutModifiers,
  isModifierKeyPressed,
} from "../hotkeys";

afterEach(() => {
  vi.resetAllMocks();
});

vi.mock("@knime/utils", () => ({
  navigatorUtils: {
    isMac: vi.fn(),
    getMetaOrCtrlKey: vi.fn(),
  },
}));

describe("hotkeys", () => {
  describe("isModifierKeyPressed", () => {
    it("should return false when no modifier keys are pressed", () => {
      const event = new KeyboardEvent("keydown", { key: "A" });
      expect(isModifierKeyPressed(event)).toBe(false);
    });

    it("should return true when the Ctrl key is pressed", () => {
      const event = new KeyboardEvent("keydown", { key: "A", ctrlKey: true });
      expect(isModifierKeyPressed(event)).toBe(true);
    });

    it("should return true when the Meta key is pressed", () => {
      const event = new KeyboardEvent("keydown", { key: "A", metaKey: true });
      expect(isModifierKeyPressed(event)).toBe(true);
    });

    it("should return true when multiple modifier keys (Ctrl + Shift) are pressed", () => {
      const event = new KeyboardEvent("keydown", {
        key: "A",
        ctrlKey: true,
        shiftKey: true,
      });
      expect(isModifierKeyPressed(event)).toBe(true);
    });
  });

  describe("isKeyWithoutModifiers", () => {
    it("should return true when only the specified key (Enter) is pressed without modifiers", () => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      expect(isKeyWithoutModifiers(event, "Enter")).toBe(true);
    });

    it("should return true when only a key from a list of allowed keys is pressed", () => {
      const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
      expect(isKeyWithoutModifiers(event, ["ArrowUp", "ArrowDown"])).toBe(true);
    });

    it("should return false when the specified key is pressed with a modifier", () => {
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        ctrlKey: true,
      });
      expect(isKeyWithoutModifiers(event, "Enter")).toBe(false);
    });

    it("should return false when any key from the list is pressed with a modifier", () => {
      const event = new KeyboardEvent("keydown", {
        key: "ArrowDown",
        shiftKey: true,
      });
      expect(isKeyWithoutModifiers(event, ["ArrowUp", "ArrowDown"])).toBe(
        false,
      );
    });

    it("should return false when a non-specified key is pressed", () => {
      const event = new KeyboardEvent("keydown", { key: "A" });
      expect(isKeyWithoutModifiers(event, "Enter")).toBe(false);
    });
  });

  describe("getMetaOrCtrlKey", () => {
    it("should return 'metaKey' on macOS", () => {
      vi.mocked(navigatorUtils.isMac).mockReturnValue(true);
      vi.mocked(navigatorUtils.getMetaOrCtrlKey).mockReturnValue("metaKey");

      expect(getMetaOrCtrlKey()).toBe("metaKey");
    });

    it("should return 'ctrlKey' on non-macOS platforms", () => {
      vi.mocked(navigatorUtils.isMac).mockReturnValue(false);
      vi.mocked(navigatorUtils.getMetaOrCtrlKey).mockReturnValue("ctrlKey");

      expect(getMetaOrCtrlKey()).toBe("ctrlKey");
    });
  });
});
