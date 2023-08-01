/**
 * Enum for extension resource types.
 * @readonly
 * @enum {string}
 */
export enum ResourceTypes {
  /** Indicates the resource should be loaded as a complete HTML page. */
  HTML = "HTML",
  /** Indicates the resource is a Vue component and should be treated as a library. */
  VUE_COMPONENT_LIB = "VUE_COMPONENT_LIB",
}
