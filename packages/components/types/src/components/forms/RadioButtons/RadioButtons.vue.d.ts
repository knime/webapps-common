declare const _default: import("vue").DefineComponent<{
    id: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * List of possible values. Each item must have an `id` and a `text` property
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }]
     */
    possibleValues: {
        type: ArrayConstructor;
        default: () => never[];
    };
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: unknown): boolean;
    };
}, any, any, {}, {
    hasSelection(): any;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * List of possible values. Each item must have an `id` and a `text` property
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }]
     */
    possibleValues: {
        type: ArrayConstructor;
        default: () => never[];
    };
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: unknown): boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    modelValue: string;
    id: string;
    possibleValues: unknown[];
    alignment: string;
}, {}>;
export default _default;
