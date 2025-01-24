declare const _default: import("vue").DefineComponent<{
    id: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    initialInverseSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    showCaseSensitiveSearchButton: {
        default: boolean;
        type: BooleanConstructor;
    };
    showInverseSearchButton: {
        default: boolean;
        type: BooleanConstructor;
    };
    autofocus: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    tooltips: {
        type: ObjectConstructor;
        default: () => {};
    };
    focusOnMount: {
        type: BooleanConstructor;
        default: boolean;
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
}, any, {
    caseSensitiveSearch: boolean;
    inverseSearch: boolean;
}, {
    showClearButton(): boolean;
    showSpacer(): any;
    tooltipsWithDefaults(): any;
}, {
    clearSearch(): void;
    toggleCaseSensitiveSearch(): void;
    toggleInverseSearch(): void;
    focus(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("clear" | "focus" | "update:modelValue" | "toggle-case-sensitive-search" | "toggle-inverse-search")[], "clear" | "focus" | "update:modelValue" | "toggle-case-sensitive-search" | "toggle-inverse-search", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    placeholder: {
        type: StringConstructor;
        default: string;
    };
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    initialInverseSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    showCaseSensitiveSearchButton: {
        default: boolean;
        type: BooleanConstructor;
    };
    showInverseSearchButton: {
        default: boolean;
        type: BooleanConstructor;
    };
    autofocus: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    tooltips: {
        type: ObjectConstructor;
        default: () => {};
    };
    focusOnMount: {
        type: BooleanConstructor;
        default: boolean;
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
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onClear?: ((...args: any[]) => any) | undefined;
    "onToggle-case-sensitive-search"?: ((...args: any[]) => any) | undefined;
    "onToggle-inverse-search"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
    compact: boolean;
    disabled: boolean;
    modelValue: string;
    id: string;
    placeholder: string;
    autofocus: boolean;
    focusOnMount: boolean;
    ariaActivedescendant: string;
    ariaOwns: string;
    initialCaseSensitiveSearch: boolean;
    initialInverseSearch: boolean;
    showCaseSensitiveSearchButton: boolean;
    showInverseSearchButton: boolean;
    tooltips: Record<string, any>;
}, {}>;
export default _default;
