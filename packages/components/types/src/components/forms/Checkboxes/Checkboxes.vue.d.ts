declare const _default: import("vue").DefineComponent<{
    /**
     * List of possible values. Each item must have an `id` and a `text` property.
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
        validator(values: unknown): boolean;
    };
    /**
     * Controls the alignment
     */
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: unknown): boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * selected value (which is a list of ids of entries)
     */
    modelValue: {
        type: ArrayConstructor;
        default: () => never[];
    };
}, any, any, {}, {
    validate(): {
        isValid: boolean;
        errorMessage: string | null;
    };
    onUpdateModelValue(value: any, toggled: any): void;
    /**
     * Is at least one checkbox checked?
     * @returns {boolean}
     */
    hasSelection(): boolean;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * List of possible values. Each item must have an `id` and a `text` property.
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
        validator(values: unknown): boolean;
    };
    /**
     * Controls the alignment
     */
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: unknown): boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * selected value (which is a list of ids of entries)
     */
    modelValue: {
        type: ArrayConstructor;
        default: () => never[];
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    modelValue: unknown[];
    possibleValues: unknown[];
    alignment: string;
    isValid: boolean;
}, {}>;
export default _default;
