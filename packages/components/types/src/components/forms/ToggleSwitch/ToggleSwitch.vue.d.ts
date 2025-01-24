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
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Controls the size of the label
     * supported values:
     * - regular
     * - large
     */
    labelSize: {
        type: StringConstructor;
        default: string;
    };
}, any, any, {}, {
    onChange($event: any): void;
    isChecked(): any;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Controls the size of the label
     * supported values:
     * - regular
     * - large
     */
    labelSize: {
        type: StringConstructor;
        default: string;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
    modelValue: boolean;
    id: string;
    labelSize: string;
}, {}>;
export default _default;
