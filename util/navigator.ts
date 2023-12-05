/**
 *
 * @returns {Boolean} true when the platform of the user is Mac
 */
export const isMac = () => navigator?.userAgent?.toLowerCase()?.includes("mac");

/**
 *
 * @returns {String} name of the primary modifier key for the current platform
 */
export const getMetaOrCtrlKey = () => (isMac() ? "metaKey" : "ctrlKey");
