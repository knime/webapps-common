declare const _default: import("vue").DefineComponent<{
    /**
     * the text to be shown
     */
    text: {
        type: StringConstructor;
        default: null;
    };
    /**
     * whether the provided `text` should be rendered as HTML or plain text
     */
    renderAsHtml: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * the text to be shown
     */
    text: {
        type: StringConstructor;
        default: null;
    };
    /**
     * whether the provided `text` should be rendered as HTML or plain text
     */
    renderAsHtml: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    text: string;
    renderAsHtml: boolean;
}, {}>;
export default _default;
