declare const _default: import("vue").DefineComponent<{
    /**
     * Status code to be shown in the svg.
     * "?" default for runtime errors.
     */
    statusCode: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Headline to display above the error message.
     */
    headline: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Status code specific message.
     */
    message: {
        type: StringConstructor;
        default: string;
    };
}, any, any, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Status code to be shown in the svg.
     * "?" default for runtime errors.
     */
    statusCode: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Headline to display above the error message.
     */
    headline: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Status code specific message.
     */
    message: {
        type: StringConstructor;
        default: string;
    };
}>>, {
    statusCode: string;
    headline: string;
    message: string;
}, {}>;
export default _default;
