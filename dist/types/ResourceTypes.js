'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Enum for extension resource types.
 * @readonly
 * @enum {string}
 */
exports.ResourceTypes = void 0;
(function (ResourceTypes) {
    /** Indicates the resource should be loaded as a complete HTML page. */
    ResourceTypes["HTML"] = "HTML";
    /** Indicates the resource is a Vue component and should be treated as a library. */
    ResourceTypes["VUE_COMPONENT_LIB"] = "VUE_COMPONENT_LIB";
})(exports.ResourceTypes || (exports.ResourceTypes = {}));
