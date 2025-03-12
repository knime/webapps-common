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
