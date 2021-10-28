/**
 * Denotes whether the parent configuration references a node dialog or node view. As both are ui-extensions,
 * how they are rendered in a layout is determined by this type.
 *
 * @enum
 */
var ExtensionTypes;
(function (ExtensionTypes) {
    ExtensionTypes["DIALOG"] = "dialog";
    ExtensionTypes["VIEW"] = "view";
})(ExtensionTypes || (ExtensionTypes = {}));

export { ExtensionTypes };
