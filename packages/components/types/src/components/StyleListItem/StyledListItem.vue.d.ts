declare const _default: import("vue").DefineComponent<{
    text: {
        type: StringConstructor;
        default: string;
    };
    selected: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    invalid: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Styles the item distinct to the other ones by adding a margin, adjusting the font-style and -height and
     * rounding the corners
     */
    special: {
        type: BooleanConstructor;
        default: boolean;
    };
    lineHeight: {
        type: NumberConstructor;
        default: null;
    };
}, any, any, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("click" | "mousedown" | "mousemove" | "dblclick-exact" | "dblclick-shift")[], "click" | "mousedown" | "mousemove" | "dblclick-exact" | "dblclick-shift", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    text: {
        type: StringConstructor;
        default: string;
    };
    selected: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    invalid: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Styles the item distinct to the other ones by adding a margin, adjusting the font-style and -height and
     * rounding the corners
     */
    special: {
        type: BooleanConstructor;
        default: boolean;
    };
    lineHeight: {
        type: NumberConstructor;
        default: null;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
    onMousedown?: ((...args: any[]) => any) | undefined;
    onMousemove?: ((...args: any[]) => any) | undefined;
    "onDblclick-exact"?: ((...args: any[]) => any) | undefined;
    "onDblclick-shift"?: ((...args: any[]) => any) | undefined;
}, {
    text: string;
    invalid: boolean;
    disabled: boolean;
    lineHeight: number;
    selected: boolean;
    special: boolean;
}, {}>;
export default _default;
