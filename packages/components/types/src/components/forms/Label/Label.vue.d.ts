declare const _default: import("vue").DefineComponent<{
    generateId: {
        type: BooleanConstructor;
        default: boolean;
    };
    idPrefix: {
        type: StringConstructor;
        default: string;
    };
    text: {
        default: string;
        type: StringConstructor;
    };
    /**
     * smaller font size and margin
     */
    large: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Whether to show the label or only its content.
     */
    active: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {
    labelFor(): string | null;
    labelId(): string | null;
    isLarge(): any;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "labelForId"[], "labelForId", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    generateId: {
        type: BooleanConstructor;
        default: boolean;
    };
    idPrefix: {
        type: StringConstructor;
        default: string;
    };
    text: {
        default: string;
        type: StringConstructor;
    };
    /**
     * smaller font size and margin
     */
    large: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Whether to show the label or only its content.
     */
    active: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onLabelForId?: ((...args: any[]) => any) | undefined;
}, {
    text: string;
    active: boolean;
    large: boolean;
    generateId: boolean;
    idPrefix: string;
}, {}>;
export default _default;
