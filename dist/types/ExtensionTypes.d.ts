/**
 * Denotes whether the parent configuration references a node dialog or node view. As both are ui-extensions,
 * how they are rendered in a layout is determined by this type.
 *
 * @enum
 */
declare enum ExtensionTypes {
    DIALOG = "dialog",
    VIEW = "view"
}
type ExtensionTypeStrings = keyof typeof ExtensionTypes;
export { ExtensionTypes, ExtensionTypeStrings };
