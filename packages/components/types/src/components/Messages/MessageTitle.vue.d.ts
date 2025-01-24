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
    /**
     * Enable / disable rendering of close button.
     * Defaults to `true`.
     */
    showCloseButton: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Optional button text.
     * If set, renders a button instead of the 'x' that is used for closing the Message.
     * If left blank, the 'x' is rendered.
     * This property has no effect if `showCloseButton` is `false`.
     */
    button: {
        type: StringConstructor;
        default: null;
    };
    count: {
        type: NumberConstructor;
        default: number;
    };
}, any, any, {}, {
    onDismiss(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "dismiss"[], "dismiss", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * One of 'info', 'error', 'success', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling
     */
    type: {
        type: StringConstructor;
        default: string;
        validator(type?: unknown): boolean;
    };
    /**
     * Enable / disable rendering of close button.
     * Defaults to `true`.
     */
    showCloseButton: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Optional button text.
     * If set, renders a button instead of the 'x' that is used for closing the Message.
     * If left blank, the 'x' is rendered.
     * This property has no effect if `showCloseButton` is `false`.
     */
    button: {
        type: StringConstructor;
        default: null;
    };
    count: {
        type: NumberConstructor;
        default: number;
    };
}>> & {
    onDismiss?: ((...args: any[]) => any) | undefined;
}, {
    type: string;
    button: string;
    showCloseButton: boolean;
    count: number;
}, {}>;
export default _default;
