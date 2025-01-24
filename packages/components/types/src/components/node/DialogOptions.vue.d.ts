declare const _default: import("vue").DefineComponent<{
    /**
     * Array of options
     *
     * Option: {
     *   sectionName: String,
     *   sectionDescription: String,
     *   fields: [{
     *     name: String,
     *     description: String,
     *     optional: Boolean
     *   }]
     * }
     */
    options: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * Whether to sanitize the content rendered in the Description components (render as HTML or not)
     */
    sanitizeContent: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {
    renderableOptions(): any;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Array of options
     *
     * Option: {
     *   sectionName: String,
     *   sectionDescription: String,
     *   fields: [{
     *     name: String,
     *     description: String,
     *     optional: Boolean
     *   }]
     * }
     */
    options: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * Whether to sanitize the content rendered in the Description components (render as HTML or not)
     */
    sanitizeContent: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    options: unknown[];
    sanitizeContent: boolean;
}, {}>;
export default _default;
