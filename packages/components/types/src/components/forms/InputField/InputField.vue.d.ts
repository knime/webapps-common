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
     * Sets the error styling, validity needs to be controlled by the parent component to be flexible
     */
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    type: {
        default: string;
        type: StringConstructor;
    };
    pattern: {
        default: null;
        type: StringConstructor;
    };
    placeholder: {
        default: null;
        type: StringConstructor;
    };
    autocomplete: {
        default: null;
        type: StringConstructor;
    };
    autofocus: {
        default: boolean;
        type: BooleanConstructor;
    };
    focusOnMount: {
        default: boolean;
        type: BooleanConstructor;
    };
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    ariaActivedescendant: {
        type: StringConstructor;
        default: null;
    };
    ariaOwns: {
        type: StringConstructor;
        default: null;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {
    hasLeftIcon(): any;
    hasRightIcon(): any;
    inputClassList(): any;
}, {
    getValue(): any;
    onInput(): void;
    focus(): void;
    validate(): {
        isValid: boolean;
        errorMessage: string | null;
    };
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("focus" | "keydown" | "keypress" | "keyup" | "update:modelValue")[], "focus" | "keydown" | "keypress" | "keyup" | "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
     * Sets the error styling, validity needs to be controlled by the parent component to be flexible
     */
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    type: {
        default: string;
        type: StringConstructor;
    };
    pattern: {
        default: null;
        type: StringConstructor;
    };
    placeholder: {
        default: null;
        type: StringConstructor;
    };
    autocomplete: {
        default: null;
        type: StringConstructor;
    };
    autofocus: {
        default: boolean;
        type: BooleanConstructor;
    };
    focusOnMount: {
        default: boolean;
        type: BooleanConstructor;
    };
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    ariaActivedescendant: {
        type: StringConstructor;
        default: null;
    };
    ariaOwns: {
        type: StringConstructor;
        default: null;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onFocus?: ((...args: any[]) => any) | undefined;
    onKeydown?: ((...args: any[]) => any) | undefined;
    onKeypress?: ((...args: any[]) => any) | undefined;
    onKeyup?: ((...args: any[]) => any) | undefined;
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    type: string;
    pattern: string;
    name: string;
    compact: boolean;
    disabled: boolean;
    modelValue: string | number;
    id: string;
    autocomplete: string;
    placeholder: string;
    isValid: boolean;
    autofocus: boolean;
    focusOnMount: boolean;
    inputClasses: string;
    ariaActivedescendant: string;
    ariaOwns: string;
}, {}>;
export default _default;
