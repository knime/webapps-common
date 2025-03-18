/**
 *
 * @returns true if the platform of the user is Mac
 */
export const isMac = (): boolean =>
  navigator?.userAgent?.toLowerCase()?.includes("mac");

/**
 *
 * @returns true if the platform of the user is Windows
 */
export const isWindows = (): boolean =>
  navigator?.userAgent?.toLowerCase()?.includes("windows");

/**
 * @deprecated Since version 1.3.6.  Use `hotkeys.ts` instead.
 *
 * @returns name of the primary modifier key for the current platform.
 */
export const getMetaOrCtrlKey = () => {
  if (import.meta.env.DEV) {
    consola.warn(
      "getMetaOrCtrlKey is deprecated on navigatorUtils. Please use hotkeys.ts instead.",
    );
  }
  return isMac() ? "metaKey" : "ctrlKey";
};
