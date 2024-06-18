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
  | "End"
  | " "; // Space;

type Modifiers = "CtrlOrCmd" | "Ctrl" | "Alt" | "Shift";

// creates loose autocomplete by using a union of the passed-in type
// and the entire `string` set *except* the passed-in type
type LooseAutoComplete<T extends string> = T | Omit<string, T>;

export type NumberRange = `${number}-${number}`;
export type KnownHotkey = Keys | Modifiers | NumberRange;

export type Hotkey = LooseAutoComplete<Keys | Modifiers>;

const globalKeyMap = {
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Enter: "↵",
  " ": "Space", // we use event.key and there space is an actual space not the code "Space"
  CtrlOrCmd: "Ctrl",
} as const;

const MacOSkeyMap = {
  Shift: "⇧",
  Delete: "⌫",
  CtrlOrCmd: "⌘",
  Ctrl: "⌃",
  Alt: "⌥",
  Enter: "↩",
} as const;

type KeyFormatMap = typeof MacOSkeyMap | typeof globalKeyMap;

/**
 * Returns a string representation of a single hotkey. Replaces some special key names with symbols
 */
export const formatHotkey = (hotkey: Hotkey): string => {
  /**
   * Returns the symbol corresponding to the `key` based on the given
   * `formatMap`. Otherwise, if not found, returns the same `key` value given
   */
  const mapSymbols = (formatMap: KeyFormatMap) => (key: Hotkey) =>
    formatMap[key as keyof KeyFormatMap] ?? key;

  /**
   * Pipe function implementation. Receives a list of functions to execute in order
   * and will pipe the parameter passed at the end to each function returning the final output
   */
  const pipe = <T extends () => any>(
    ...fns: Array<(...args: any[]) => ReturnType<T>>
  ) => fns.reduce((f, g) => (arg) => g(f(arg)));

  const macKeyFormatter = pipe(
    mapSymbols(MacOSkeyMap),
    mapSymbols(globalKeyMap),
  );

  const generalKeyFormatter = mapSymbols(globalKeyMap);

  return isMac() ? macKeyFormatter(hotkey) : generalKeyFormatter(hotkey);
};

export const getDefaultSeparator = () => " ";

/**
 * Returns a string representation of a list of hotkeys. Replaces some special key names with symbols
 */
export const formatHotkeys = (
  hotkeys: Array<Hotkey>,
  getSeparator = getDefaultSeparator,
) => hotkeys.map(formatHotkey).join(getSeparator());
