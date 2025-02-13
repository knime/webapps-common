import { afterEach, describe, expect, it, vi } from "vitest";

import { isModifierKeyPressed, isOnlyEnterPressed } from "../keyboardUtils";

afterEach(() => {
  vi.resetAllMocks();
});

describe("keyboardUtils", () => {
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

  describe("isOnlyEnterPressed", () => {
    it("should return true when only the Enter key is pressed", () => {
      const event = new KeyboardEvent("keydown", { key: "Enter" });
      expect(isOnlyEnterPressed(event)).toBe(true);
    });

    it("should return false when Enter is pressed with Ctrl", () => {
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        ctrlKey: true,
      });
      expect(isOnlyEnterPressed(event)).toBe(false);
    });

    it("should return false when Enter is pressed with Meta", () => {
      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        metaKey: true,
      });
      expect(isOnlyEnterPressed(event)).toBe(false);
    });

    it("should return false when Enter is pressed with any modifier key (Alt, Shift, Ctrl, or Meta)", () => {
      const modifiers = [
        { altKey: true },
        { shiftKey: true },
        { ctrlKey: true },
        { metaKey: true },
      ];

      modifiers.forEach((modifier) => {
        const event = new KeyboardEvent("keydown", {
          key: "Enter",
          ...modifier,
        });
        expect(isOnlyEnterPressed(event)).toBe(false);
      });
    });

    it("should return false when a non-Enter key is pressed", () => {
      const event = new KeyboardEvent("keydown", { key: "A" });
      expect(isOnlyEnterPressed(event)).toBe(false);
    });
  });
});
