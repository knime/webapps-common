import { isMac } from "./navigator";

type Keys =
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7"
  | "F8"
  | "F9"
  | "F10"
  | "F11"
  | "F12"
  | "PageUp"
  | "PageDown"
  | "ArrowUp"
  | "ArrowRight"
  | "ArrowDown"
  | "ArrowLeft"
  | "Delete"
  | "Enter"
  | "Backspace"
  | "Home"
  | "End";

type Modifiers = "Ctrl" | "Alt" | "Shift";

// creates loose autocomplete by using a union of the passed-in type
// and the entire `string` set *except* the passed-in type
type LooseAutoComplete<T extends string> = T | Omit<string, T>;

export type KnownHotkey = Keys | Modifiers;

export type Hotkey = LooseAutoComplete<Keys | Modifiers>;
/**
 * Returns a string array where all special chars are replaced
 */
export const mapKeyFormat = (hotkeys: Array<Hotkey>) => {
  type KeyFormatMap = Partial<Record<KnownHotkey, string>>;
  const globalKeyMap: KeyFormatMap = {
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    Enter: "↵",
  };

  const MacOSkeyMap: KeyFormatMap = {
    Shift: "⇧",
    Delete: "⌫",
    Ctrl: "⌘",
    Alt: "⌥",
    Enter: "↩",
  };

  const mapSymbols =
    (formatMap: KeyFormatMap) =>
    (key: KnownHotkey): KnownHotkey | Omit<string, KnownHotkey> =>
      formatMap[key] ?? key;

  const identity = (value: any) => value;

  return (
    hotkeys
      // map only for mac the symbols that should be displayed differently
      .map((key) =>
        isMac() ? mapSymbols(MacOSkeyMap)(key as KnownHotkey) : identity(key),
      )
      // map all keys that should be displayed differently
      .map(mapSymbols(globalKeyMap))
  );
};

const defaultGetSeparator = () => {
  return " ";
};

/**
 * Returns a string representation of a hotkey. Replaces some special key names with symbols
 */
export const formatHotkeys = (
  hotkeys: Array<Hotkey>,
  getSeparator = defaultGetSeparator,
) => {
  return mapKeyFormat(hotkeys).join(getSeparator());
};
