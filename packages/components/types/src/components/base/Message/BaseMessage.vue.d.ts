declare const _default: import("vue").DefineComponent<{
    /**
     * One of 'info', 'error', 'success', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling
     */
    type: {
        type: StringConstructor;
        default: string;
        validator(type?: unknown): boolean;
    };
}, any, any, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * One of 'info', 'error', 'success', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling
     */
    type: {
        type: StringConstructor;
        default: string;
        validator(type?: unknown): boolean;
    };
}>>, {
    type: string;
}, {}>;
export default _default;
