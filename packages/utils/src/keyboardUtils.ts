/**
 * Checks if any modifier key (Ctrl, Meta, Alt, or Shift) is pressed.
 * @param {KeyboardEvent} event - The keyboard event to check.
 * @returns {boolean} True if a modifier key is pressed, otherwise false.
 */

export const isModifierKeyPressed = (event: KeyboardEvent): boolean => {
  return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
};

/**
 * Determines if the "Enter" key was pressed without any modifier keys.
 * @param {KeyboardEvent} event - The keyboard event to check.
 * @returns {boolean} True if only the "Enter" key was pressed, otherwise false.
 */

export const isOnlyEnterPressed = (event: KeyboardEvent): boolean => {
  return event.key === "Enter" && !isModifierKeyPressed(event);
};
