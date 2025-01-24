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
     * Enable / disable collapser for details.
     * If true, details will be down inside of the collapser content area and accessed by clicking on the
     * expand icon.
     * If false, details will be shown in the main message body below the message itself.
     * This property has no effect if the message does not have details.
     * Defaults to `true`.
     */
    showCollapser: {
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
    details: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
}, any, {
    active: boolean;
}, {
    detailsText(): any;
    detailsLink(): any;
    showDetailsCollapser(): any;
}, {
    onDismiss(): void;
    copyMessage(event: any): Promise<void>;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("dismiss" | "copied")[], "dismiss" | "copied", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
     * Enable / disable collapser for details.
     * If true, details will be down inside of the collapser content area and accessed by clicking on the
     * expand icon.
     * If false, details will be shown in the main message body below the message itself.
     * This property has no effect if the message does not have details.
     * Defaults to `true`.
     */
    showCollapser: {
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
    details: {
        type: (ObjectConstructor | StringConstructor)[];
        default: string;
    };
}>> & {
    onDismiss?: ((...args: any[]) => any) | undefined;
    onCopied?: ((...args: any[]) => any) | undefined;
}, {
    type: string;
    button: string;
    details: string | Record<string, any>;
    showCloseButton: boolean;
    count: number;
    showCollapser: boolean;
}, {}>;
export default _default;
