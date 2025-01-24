import { type PropType } from "vue";
import type { BottomValue, Id, PossibleValue } from "../possibleValues";
declare const _default: import("vue").DefineComponent<{
    id: {
        type: StringConstructor;
        default(): string;
    };
    modelValue: {
        type: PropType<Id[] | null>;
        default: () => never[];
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    withIsEmptyState: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Is only used when emptyStateComponent is null
     */
    emptyStateLabel: {
        default: string;
        type: StringConstructor;
    };
    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
        default: null;
        type: ObjectConstructor;
    };
    /**
     * If enabled the single click will allow the user to select multiple items, otherwise this only works with
     * CTRL + Click (similar to <select> html widgets)
     */
    multiselectByClick: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Bottom values
     */
    withBottomValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    bottomValue: {
        type: PropType<BottomValue>;
        default: () => {
            id: string;
            text: string;
        };
        validator(value: BottomValue): boolean;
    };
    /**
     * Controls the size of the list. Number of visible items (for others user need to scroll)
     * 0 means all
     */
    size: {
        type: NumberConstructor;
        default: number;
        validator(value: number): boolean;
    };
    minSize: {
        type: NumberConstructor;
        default: number;
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
        type: PropType<PossibleValue[]>;
        default: () => never[];
        validator(values: unknown): boolean;
    };
}, {
    optionLineHeight: number;
    containerProps: {
        ref: import("vue").Ref<HTMLElement | null>;
        onScroll: () => void;
        style: import("vue").StyleValue;
    };
    wrapperProps: import("vue").ComputedRef<{
        style: {
            width: string;
            height: string;
            marginTop: string;
        } | {
            width: string;
            height: string;
            marginLeft: string;
            display: string;
        };
    }>;
    list: import("vue").Ref<import("@vueuse/core").UseVirtualListItem<PossibleValue>[]>;
}, {
    selectedValues: Id[] | null;
    currentKeyNavIndex: number;
    shiftStartIndex: number;
    draggingStartIndex: number;
    draggingInverseMode: boolean;
    resizeHeight: number;
}, {
    cssStyleSize(): {
        height: string;
    } | {
        height?: undefined;
    };
    minResizeHeight(): number;
    possibleValuesWithBottom(): (PossibleValue | BottomValue)[];
    bottomIndex(): number;
    showEmptyState(): boolean;
}, {
    createDebouncedHandleCtrlClick(): void;
    debouncedHandleCtrlClick(value: Id, index: number): void;
    isCurrentValue(candidate: Id): boolean | undefined;
    handleCtrlClick(value: Id, index: number): void;
    handleShiftClick(value: Id, clickedIndex: number): void;
    /**
     * Returns all value ids (String) for two indices no matter which one is the start/end index
     * @param {Number} firstIndex - index a
     * @param {Number} secondIndex - index b
     * @returns {String[]}
     */
    getPossibleValuesInSection(firstIndex: number, secondIndex: number): Id[];
    onStartDrag(e: MouseEvent, isBottom?: boolean): void;
    onDrag(e: MouseEvent): void;
    onBottomStartDrag(e: MouseEvent): void;
    onBottomDrag(e: MouseEvent): void;
    onStopDrag(): void;
    handleClick($event: MouseEvent, value: Id, index: number): void;
    handleDblClick(id: Id, index: number): void;
    handleBottomClick($event: MouseEvent): void;
    handleBottomDblClick(): void;
    handleShiftDblClick(): void;
    addToSelection(value: Id): boolean;
    removeFromSelection(value: Id): boolean;
    toggleSelection(value: Id): void;
    setSelectedNoShiftReset(values: Id[]): void;
    setSelected(values: Id[]): void;
    setSelectedToIndex(index: number): void;
    scrollToCurrent(): void;
    scrollIntoView(index: number, mode?: string): void;
    scrollUpIntoView(index: number): void;
    scrollDownIntoView(index: number): void;
    setCurrentKeyNavIndex(index: number): void;
    isOutOfRange(index: number): boolean;
    onArrowDown(): void;
    onArrowUp(): void;
    onArrowDownShift(): void;
    onArrowUpShift(): void;
    onEndKey(): void;
    onHomeKey(): void;
    onArrowLeft(): void;
    onArrowRight(): void;
    onCtrlA(): void;
    hasSelection(): boolean;
    getCurrentKeyNavItem(): PossibleValue;
    generateOptionId(item: PossibleValue): string;
    focus(): void;
    clearSelection(): void;
    computeBoxHeight(size: number): number;
    initResizeHeight(): void;
    onResizeMove(deltaY: number): void;
    onResizeEnd(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "doubleClickOnItem" | "doubleClickShift" | "keyArrowLeft" | "keyArrowRight")[], "update:modelValue" | "doubleClickOnItem" | "doubleClickShift" | "keyArrowLeft" | "keyArrowRight", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default(): string;
    };
    modelValue: {
        type: PropType<Id[] | null>;
        default: () => never[];
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    withIsEmptyState: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Is only used when emptyStateComponent is null
     */
    emptyStateLabel: {
        default: string;
        type: StringConstructor;
    };
    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
        default: null;
        type: ObjectConstructor;
    };
    /**
     * If enabled the single click will allow the user to select multiple items, otherwise this only works with
     * CTRL + Click (similar to <select> html widgets)
     */
    multiselectByClick: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Bottom values
     */
    withBottomValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    bottomValue: {
        type: PropType<BottomValue>;
        default: () => {
            id: string;
            text: string;
        };
        validator(value: BottomValue): boolean;
    };
    /**
     * Controls the size of the list. Number of visible items (for others user need to scroll)
     * 0 means all
     */
    size: {
        type: NumberConstructor;
        default: number;
        validator(value: number): boolean;
    };
    minSize: {
        type: NumberConstructor;
        default: number;
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
        type: PropType<PossibleValue[]>;
        default: () => never[];
        validator(values: unknown): boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onDoubleClickOnItem?: ((...args: any[]) => any) | undefined;
    onDoubleClickShift?: ((...args: any[]) => any) | undefined;
    onKeyArrowLeft?: ((...args: any[]) => any) | undefined;
    onKeyArrowRight?: ((...args: any[]) => any) | undefined;
}, {
    size: number;
    disabled: boolean;
    modelValue: Id[] | null;
    id: string;
    possibleValues: PossibleValue[];
    isValid: boolean;
    withIsEmptyState: boolean;
    emptyStateLabel: string;
    emptyStateComponent: Record<string, any>;
    multiselectByClick: boolean;
    withBottomValue: boolean;
    bottomValue: BottomValue;
    minSize: number;
}, {}>;
export default _default;
