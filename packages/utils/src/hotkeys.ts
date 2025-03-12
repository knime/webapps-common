import { navigatorUtils } from "@knime/utils";

/**
 * Checks if any modifier key (Ctrl, Meta, Alt, or Shift) is pressed.
 * @param {KeyboardEvent} event - The keyboard event to check.
 * @returns {boolean} True if a modifier key is pressed, otherwise false.
 */
export const isModifierKeyPressed = (event: KeyboardEvent): boolean => {
  return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
};

/**
 * Checks if a specific key (or keys) were pressed without any modifier keys.
 * @param {KeyboardEvent} event - The keyboard event to check.
 * @param {string | string[]} keys - The key or keys to check for.
 * @returns {boolean} True if the specified key(s) were pressed without modifiers, otherwise false.
 */
export const isKeyWithoutModifiers = (
  event: KeyboardEvent,
  keys: string | string[],
): boolean => {
  const keyList = Array.isArray(keys) ? keys : [keys];
  return keyList.includes(event.key) && !isModifierKeyPressed(event);
};

/**
 *
 * @returns name of the primary modifier key for the current platform
 */
export const getMetaOrCtrlKey = (): "ctrlKey" | "metaKey" => {
  return navigatorUtils.isMac() ? "metaKey" : "ctrlKey";
};
