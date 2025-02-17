import consola from "consola";

/**
 *
 * @returns true when the platform of the user is Mac
 */
export const isMac = (): boolean =>
  navigator?.userAgent?.toLowerCase()?.includes("mac");

/**
 * @deprecated Since version 1.3.6.  Use `keyboardUtils.ts` instead.
 *
 * @returns name of the primary modifier key for the current platform.
 */
export const getMetaOrCtrlKey = () => {
  if (import.meta.env.DEV) {
    consola.warn(
      "getMetaOrCtrlKey is deprecated on navigatorUtils. Please use keyboardUtils instead.",
    );
  }
  return isMac() ? "metaKey" : "ctrlKey";
};
