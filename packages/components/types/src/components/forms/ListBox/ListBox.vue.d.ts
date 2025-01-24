declare const _default: import("vue").DefineComponent<{
    id: {
        type: StringConstructor;
        default(): string;
    };
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Controls the size of the list. Number of visible items (for others user need to scroll)
     * 0 means all
     */
    size: {
        type: NumberConstructor;
        default: number;
        validator(value: unknown): boolean;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    ariaLabel: {
        type: StringConstructor;
        required: true;
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
        validator(values: unknown): boolean;
    };
}, any, {
    selectedIndex: number;
    invalidPossibleValueIds: never[];
    optionLineHeight: number;
}, {
    ulSizeStyle(): {
        height: string;
        minHeight?: undefined;
    } | {
        minHeight: string;
        height?: undefined;
    };
    selectableValues(): any[];
}, {
    updateSelectedIndexAndInvalidValue(value: any): void;
    isCurrentValue(candidate: any): boolean;
    setSelected(value: any, index: any): void;
    scrollToCurrent(): void;
    onArrowDown(): void;
    onArrowUp(): void;
    onEndKey(): void;
    onHomeKey(): void;
    handleKeyDown(e: any): void;
    hasSelection(): boolean;
    validate(): {
        isValid: boolean;
        errorMessage: null;
    };
    getCurrentItem(): any;
    generateInvalidItem(id: any): {
        id: any;
        text: string;
        invalid: boolean;
    };
    generateOptionId(item: any): string;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default(): string;
    };
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Controls the size of the list. Number of visible items (for others user need to scroll)
     * 0 means all
     */
    size: {
        type: NumberConstructor;
        default: number;
        validator(value: unknown): boolean;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    ariaLabel: {
        type: StringConstructor;
        required: true;
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
        validator(values: unknown): boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    size: number;
    modelValue: string;
    id: string;
    possibleValues: unknown[];
    isValid: boolean;
}, {}>;
export default _default;
