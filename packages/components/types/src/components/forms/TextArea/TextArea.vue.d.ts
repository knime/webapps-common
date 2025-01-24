declare const _default: import("vue").DefineComponent<{
    modelValue: {
        default: string;
        type: (StringConstructor | NumberConstructor)[];
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    cols: {
        default: number;
        type: NumberConstructor;
    };
    rows: {
        default: number;
        type: NumberConstructor;
    };
    placeholder: {
        default: null;
        type: StringConstructor;
    };
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    title: {
        default: null;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
}, any, any, {}, {
    getValue(): any;
    onInput(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        default: string;
        type: (StringConstructor | NumberConstructor)[];
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    cols: {
        default: number;
        type: NumberConstructor;
    };
    rows: {
        default: number;
        type: NumberConstructor;
    };
    placeholder: {
        default: null;
        type: StringConstructor;
    };
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    title: {
        default: null;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    title: string;
    name: string;
    disabled: boolean;
    modelValue: string | number;
    id: string;
    placeholder: string;
    isValid: boolean;
    inputClasses: string;
    cols: number;
    rows: number;
}, {}>;
export default _default;
