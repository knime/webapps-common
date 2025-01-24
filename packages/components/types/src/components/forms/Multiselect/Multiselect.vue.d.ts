declare const _default: import("vue").DefineComponent<{
    /**
     * List of possible values. Each item must have an `id` and a `text` property. Optionally it can have:
     * - `selectedText` property that is used for displaying the list of selected items.
     *   If it is omitted, `text` is used instead.
     * - `disabled` property for disabling the corresponding checkbox so that the user can not change the value.
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     *   selectedText: '.xls'
     * }]
     */
    possibleValues: {
        type: ArrayConstructor;
        default: () => never[];
        validator(values: unknown): boolean;
    };
    /**
     * selected value (which is a list of ids of entries)
     */
    modelValue: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * placeholder to be displayed when nothing is selected
     */
    placeholder: {
        type: StringConstructor;
        default: null;
    };
    isValid: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Seperator which seperates selected items in the summary.
     */
    separator: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Max number of items that will be displayed in the summary.
     */
    summaryMaxItemCount: {
        type: NumberConstructor;
        default: number;
    };
    /**
     * Name that will be used if summaryMaxItemCount is exceeded.
     */
    summaryName: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Use a custom list box (slot: 'listBox') that replaces the standard Multiselect element containing the button
     * to toggle the dropdown and the summary
     */
    useCustomListBox: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Limit the number of visible options (more options are reachable by scrolling)
     */
    sizeVisibleOptions: {
        type: NumberConstructor;
        default: number;
        validator(value: unknown): boolean;
    };
    /**
     * Focus element of the parent for which the options don't get closed when it is focussed.
     */
    parentFocusElement: {
        type: ObjectConstructor;
        default: () => {};
    };
    /**
     * The element of the parent to refocus when the options get closed and using a custom listbox.
     */
    parentRefocusElementOnClose: {
        type: ObjectConstructor;
        default: () => {};
    };
    /**
     * Close the dropdown when a value was selected.
     */
    closeDropdownOnSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    activeElement: import("@vueuse/core").ComputedRefWithControl<HTMLElement | null | undefined>;
}, {
    collapsed: boolean;
    focusOptions: never[];
}, {
    focusElements(): Record<string, any>[];
    summary(): string;
    showOptions(): boolean;
    useSpecificOptionsHeight(): boolean;
    optionsHeight(): {
        "max-height": string;
    } | {
        "max-height"?: undefined;
    };
    refocusElementOnClose(): unknown;
}, {
    emitNewSelection(newSelectedIds: any): void;
    /**
     * Returns the next HTML Element from the list of items. If the current focused Element is at the top or bottom
     * of the list, this method will return the opposite end.
     *
     * @param {Number} changeInd - the positive or negative index shift for the next Element (usually 1 || -1).
     * @returns {Element} - the next option Element in the list of options.
     */
    getNextElement(changeInd: number): Element;
    onUpdateModelValue(value: any, toggled: any): void;
    toggle(): void;
    isChecked(itemId: any): boolean;
    /**
     * Handle closing the options.
     *
     * @param {Boolean} [refocusToggle = true] - if the toggle button / parentRefocusElement should be re-focused
     * after closing.
     * @return {undefined}
     */
    closeOptions(refocusToggle?: boolean | undefined): undefined;
    /**
     * Handle closing the options if necessary and stopping the event if so.
     *
     * @param {KeyboardEvent} event - the keyboard "Escape" event triggering the close.
     * @return {undefined}
     */
    closeOptionsAndStop(event: KeyboardEvent): undefined;
    onUp(): void;
    onDown(): void;
    onFocusOut(): void;
    onMousedown(event: any): void;
    updateFocusOptions(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "focusOutside")[], "update:modelValue" | "focusOutside", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * List of possible values. Each item must have an `id` and a `text` property. Optionally it can have:
     * - `selectedText` property that is used for displaying the list of selected items.
     *   If it is omitted, `text` is used instead.
     * - `disabled` property for disabling the corresponding checkbox so that the user can not change the value.
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     *   selectedText: '.xls'
     * }]
     */
    possibleValues: {
        type: ArrayConstructor;
        default: () => never[];
        validator(values: unknown): boolean;
    };
    /**
     * selected value (which is a list of ids of entries)
     */
    modelValue: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * placeholder to be displayed when nothing is selected
     */
    placeholder: {
        type: StringConstructor;
        default: null;
    };
    isValid: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Seperator which seperates selected items in the summary.
     */
    separator: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Max number of items that will be displayed in the summary.
     */
    summaryMaxItemCount: {
        type: NumberConstructor;
        default: number;
    };
    /**
     * Name that will be used if summaryMaxItemCount is exceeded.
     */
    summaryName: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Use a custom list box (slot: 'listBox') that replaces the standard Multiselect element containing the button
     * to toggle the dropdown and the summary
     */
    useCustomListBox: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Limit the number of visible options (more options are reachable by scrolling)
     */
    sizeVisibleOptions: {
        type: NumberConstructor;
        default: number;
        validator(value: unknown): boolean;
    };
    /**
     * Focus element of the parent for which the options don't get closed when it is focussed.
     */
    parentFocusElement: {
        type: ObjectConstructor;
        default: () => {};
    };
    /**
     * The element of the parent to refocus when the options get closed and using a custom listbox.
     */
    parentRefocusElementOnClose: {
        type: ObjectConstructor;
        default: () => {};
    };
    /**
     * Close the dropdown when a value was selected.
     */
    closeDropdownOnSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onFocusOutside?: ((...args: any[]) => any) | undefined;
}, {
    compact: boolean;
    separator: string;
    modelValue: unknown[];
    placeholder: string;
    possibleValues: unknown[];
    isValid: boolean;
    summaryMaxItemCount: number;
    summaryName: string;
    useCustomListBox: boolean;
    sizeVisibleOptions: number;
    parentFocusElement: Record<string, any>;
    parentRefocusElementOnClose: Record<string, any>;
    closeDropdownOnSelection: boolean;
}, {}>;
export default _default;
