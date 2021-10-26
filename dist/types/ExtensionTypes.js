'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Denotes whether the parent configuration references a node dialog or node view. As both are ui-extensions,
 * how they are rendered in a layout is determined by this type.
 *
 * @enum
 */
exports.ExtensionTypes = void 0;
(function (ExtensionTypes) {
    ExtensionTypes["DIALOG"] = "dialog";
    ExtensionTypes["VIEW"] = "view";
})(exports.ExtensionTypes || (exports.ExtensionTypes = {}));
