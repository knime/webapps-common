/**
 * Enum for extension resource types.
 * @readonly
 * @enum {string}
 */
export type ResourceTypes =
  /** Indicates the resource should be loaded as a complete HTML page. */
  | "HTML"
  /** Indicates the resource is a shadow root based ui extension app and should
   * be treated as a ES6 module that exports a mount function as default. */
  | "SHADOW_APP";
