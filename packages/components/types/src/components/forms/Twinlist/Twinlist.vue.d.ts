import { type PropType, type Ref } from "vue";
import { type Id, type PossibleValue } from "../possibleValues";
interface TransformOnMovePayload {
    /**
     * The to be updated list of ids
     */
    previous: Id[];
    movingParts: {
        /**
         * The moved items that are not the "unknown values"
         */
        knownValues: Array<Id>;
        /**
         * Whether the unknown values are part of the moved items
         */
        movingUnknownValues: boolean;
    };
}
/** The included values or null if not yet known. Values which are not an id in the possible values will be shown as missing. */
type SimpleTwinlistModelValue<T extends Id> = null | T[];
/**
 * using this form of model value allows showing unknown values. With that the logic for missing values also changes:
 * Missing values on the same side as unknown values are not displayed and removed as soon as the user moves items.
 * Also missing values now can always exist on the opposite side of the unknown values which is why we also need to
 *  keep track of the excluded values as data.
 */
interface TwinlistModelValueWithUnknownValues<T extends Id> {
    /**
     * null if not yet known
     */
    includedValues: T[] | null;
    /**
     * null if not yet known
     */
    excludedValues: T[] | null;
    includeUnknownValues: boolean;
}
type TwinlistModelValue<T extends Id = Id> = SimpleTwinlistModelValue<T> | TwinlistModelValueWithUnknownValues<T>;
declare const useTwinlistModelValue: (modelValue: Ref<TwinlistModelValue>) => {
    includedValues: import("vue").ComputedRef<Id[] | null>;
    excludedValues: import("vue").ComputedRef<Id[] | null>;
    showUnknownExcludedValues: import("vue").ComputedRef<boolean>;
    showUnknownIncludedValues: import("vue").ComputedRef<boolean>;
    getEmitValue: (newIncludedValues: Id[] | null, toNewExcluded?: (oldVal: Id[] | null) => Id[] | null, toNewIncludeUnknownValues?: (oldVal: boolean) => boolean) => TwinlistModelValue;
};
export { type TwinlistModelValue, useTwinlistModelValue };
declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: PropType<TwinlistModelValue<Id>>;
        default: null;
    };
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    initialSearchTerm: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Hiding and disabling
     */
    showSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    showEmptyState: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Labels
     */
    leftLabel: {
        type: StringConstructor;
        required: true;
        default: string;
    };
    rightLabel: {
        type: StringConstructor;
        required: true;
        default: string;
    };
    withSearchLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    searchLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    searchPlaceholder: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    unknownValuesText: {
        type: StringConstructor;
        required: false;
        default: string;
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
     * Controls the size of the list.
     * Number of visible items (for others user need to scroll)
     * - 0 means all
     * - values 1 - 4  are ignored; 5 is minimum
     */
    size: {
        type: NumberConstructor;
        default: number;
        validator(value: number): boolean;
    };
    showResizeHandle: {
        type: BooleanConstructor;
        default: boolean;
    };
    isValid: {
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
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    /**
     * If this setting is true, on a change of possible values, the currently
     * chosen values which are missing with respect to the new possible values
     * are removed.
     */
    filterChosenValuesOnPossibleValuesChange: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    includedValues: import("vue").ComputedRef<Id[] | null>;
    excludedValues: import("vue").ComputedRef<Id[] | null>;
    showUnknownExcludedValues: import("vue").ComputedRef<boolean>;
    showUnknownIncludedValues: import("vue").ComputedRef<boolean>;
    getEmitValue: (newIncludedValues: Id[] | null, toNewExcluded?: (oldVal: Id[] | null) => Id[] | null, toNewIncludeUnknownValues?: (oldVal: boolean) => boolean) => TwinlistModelValue<Id>;
    searchTerm: Ref<string>;
    filteredExcludedItems: Ref<PossibleValue[]>;
    filteredIncludedItems: Ref<PossibleValue[]>;
    knownExcludedValues: import("vue").ComputedRef<Id[]>;
    knownIncludedValues: import("vue").ComputedRef<Id[] | null>;
    possibleValueIds: import("vue").ComputedRef<Id[]>;
    possibleValueIdsSet: import("vue").ComputedRef<Set<Id>>;
    excludedLabels: import("vue").ComputedRef<string | null>;
    includedLabels: import("vue").ComputedRef<string | null>;
    caseSensitiveSearch: Ref<boolean>;
    allIncludedItems: import("vue").ComputedRef<PossibleValue[]>;
    possibleValueMap: import("vue").ComputedRef<Record<Id, {
        item: PossibleValue;
        index: number;
    }>>;
}, {
    invalidPossibleValueIds: Set<unknown>;
    rightSelected: Id[];
    leftSelected: Id[];
    unknownValuesId: symbol;
    constants: Readonly<{
        MIN_LIST_SIZE: 5;
        BUTTON_HEIGHT: 24;
        BUTTON_WIDTH: 30;
        RESIZE_HANDLE_WIDTH: "calc((100% - 30px) * 1 / 6)";
        MAX_HEIGHT_BUTTONS_CENTER_ALIGNMENT: number;
    }>;
}, {
    listSize(): number;
    moveAllRightButtonDisabled(): boolean;
    moveRightButtonDisabled(): boolean;
    moveAllLeftButtonDisabled(): boolean;
    moveLeftButtonDisabled(): boolean;
}, {
    getIndex(id: Id): number;
    compareByOriginalSorting(a: Id, b: Id): number;
    clearSelections(): void;
    moveItems(items: Id[], { toNewIncludedValues, toNewExcludedValues, }: {
        toNewIncludedValues: (params: TransformOnMovePayload) => Id[];
        toNewExcludedValues: (params: TransformOnMovePayload) => Id[];
    }): void;
    moveRight(itemsParam?: Id[] | null): void;
    moveLeft(itemsParam?: Id[] | null): void;
    /**
     * Filters out the moved items and also invalid items if unknown values are being moved.
     */
    filterMovedItems({ previous, movingParts: { movingUnknownValues, knownValues }, }: TransformOnMovePayload): Id[];
    /**
     * Adds the given items sorting by the order in the possible values afterwards and removing invalid items
     * if unknown values are being moved
     */
    addMovedItems({ previous, movingParts: { movingUnknownValues, knownValues }, }: TransformOnMovePayload): Id[];
    onMoveRightButtonClick(): void;
    onMoveAllRightButtonClick(): void;
    onMoveAllRightButtonKey(e: KeyboardEvent): void;
    onMoveRightButtonKey(e: KeyboardEvent): void;
    onMoveLeftButtonClick(): void;
    onMoveAllLeftButtonClick(): void;
    onMoveLeftButtonKey(e: KeyboardEvent): void;
    onMoveAllLeftButtonKey(e: KeyboardEvent): void;
    stopPropagation(e: KeyboardEvent): void;
    onLeftListBoxDoubleClick(item: Id): void;
    onLeftListBoxShiftDoubleClick(items: Id[]): void;
    onRightListBoxDoubleClick(item: Id): void;
    onRightListBoxShiftDoubleClick(items: Id[]): void;
    onLeftInput(value: Id[]): void;
    onRightInput(value: Id[]): void;
    onSearchInput(value: string): void;
    hasSelection(): boolean;
    validate(): {
        isValid: boolean;
        errorMessage: string | null;
    };
    getListBoxes(): import("vue").CreateComponentPublicInstance<Readonly<import("vue").ExtractPropTypes<{
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
        emptyStateLabel: {
            default: string;
            type: StringConstructor;
        };
        emptyStateComponent: {
            default: null;
            type: ObjectConstructor;
        };
        multiselectByClick: {
            type: BooleanConstructor;
            default: boolean;
        };
        withBottomValue: {
            type: BooleanConstructor;
            default: boolean;
        };
        bottomValue: {
            type: PropType<import("../possibleValues").BottomValue>;
            default: () => {
                id: string;
                text: string;
            };
            validator(value: import("../possibleValues").BottomValue): boolean;
        };
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
        optionLineHeight: number;
        containerProps: {
            ref: Ref<HTMLElement | null>;
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
        list: Ref<import("@vueuse/core").UseVirtualListItem<PossibleValue>[]>;
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
        possibleValuesWithBottom(): (PossibleValue | import("../possibleValues").BottomValue)[];
        bottomIndex(): number;
        showEmptyState(): boolean;
    }, {
        createDebouncedHandleCtrlClick(): void;
        debouncedHandleCtrlClick(value: Id, index: number): void;
        isCurrentValue(candidate: Id): boolean | undefined;
        handleCtrlClick(value: Id, index: number): void;
        handleShiftClick(value: Id, clickedIndex: number): void;
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
    }, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "doubleClickOnItem" | "doubleClickShift" | "keyArrowLeft" | "keyArrowRight")[], import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Readonly<import("vue").ExtractPropTypes<{
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
        emptyStateLabel: {
            default: string;
            type: StringConstructor;
        };
        emptyStateComponent: {
            default: null;
            type: ObjectConstructor;
        };
        multiselectByClick: {
            type: BooleanConstructor;
            default: boolean;
        };
        withBottomValue: {
            type: BooleanConstructor;
            default: boolean;
        };
        bottomValue: {
            type: PropType<import("../possibleValues").BottomValue>;
            default: () => {
                id: string;
                text: string;
            };
            validator(value: import("../possibleValues").BottomValue): boolean;
        };
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
        bottomValue: import("../possibleValues").BottomValue;
        minSize: number;
    }, true, {}, {}, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
        emptyStateLabel: {
            default: string;
            type: StringConstructor;
        };
        emptyStateComponent: {
            default: null;
            type: ObjectConstructor;
        };
        multiselectByClick: {
            type: BooleanConstructor;
            default: boolean;
        };
        withBottomValue: {
            type: BooleanConstructor;
            default: boolean;
        };
        bottomValue: {
            type: PropType<import("../possibleValues").BottomValue>;
            default: () => {
                id: string;
                text: string;
            };
            validator(value: import("../possibleValues").BottomValue): boolean;
        };
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
        optionLineHeight: number;
        containerProps: {
            ref: Ref<HTMLElement | null>;
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
        list: Ref<import("@vueuse/core").UseVirtualListItem<PossibleValue>[]>;
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
        possibleValuesWithBottom(): (PossibleValue | import("../possibleValues").BottomValue)[];
        bottomIndex(): number;
        showEmptyState(): boolean;
    }, {
        createDebouncedHandleCtrlClick(): void;
        debouncedHandleCtrlClick(value: Id, index: number): void;
        isCurrentValue(candidate: Id): boolean | undefined;
        handleCtrlClick(value: Id, index: number): void;
        handleShiftClick(value: Id, clickedIndex: number): void;
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
        bottomValue: import("../possibleValues").BottomValue;
        minSize: number;
    }>[];
    onResizeMove(deltaY: number): void;
    onResizeEnd(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: PropType<TwinlistModelValue<Id>>;
        default: null;
    };
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    initialSearchTerm: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    /**
     * Hiding and disabling
     */
    showSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    showEmptyState: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Labels
     */
    leftLabel: {
        type: StringConstructor;
        required: true;
        default: string;
    };
    rightLabel: {
        type: StringConstructor;
        required: true;
        default: string;
    };
    withSearchLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    searchLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    searchPlaceholder: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    unknownValuesText: {
        type: StringConstructor;
        required: false;
        default: string;
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
     * Controls the size of the list.
     * Number of visible items (for others user need to scroll)
     * - 0 means all
     * - values 1 - 4  are ignored; 5 is minimum
     */
    size: {
        type: NumberConstructor;
        default: number;
        validator(value: number): boolean;
    };
    showResizeHandle: {
        type: BooleanConstructor;
        default: boolean;
    };
    isValid: {
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
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    /**
     * If this setting is true, on a change of possible values, the currently
     * chosen values which are missing with respect to the new possible values
     * are removed.
     */
    filterChosenValuesOnPossibleValuesChange: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    size: number;
    compact: boolean;
    disabled: boolean;
    modelValue: TwinlistModelValue<Id>;
    possibleValues: PossibleValue[];
    isValid: boolean;
    initialCaseSensitiveSearch: boolean;
    emptyStateLabel: string;
    emptyStateComponent: Record<string, any>;
    showEmptyState: boolean;
    initialSearchTerm: string;
    showSearch: boolean;
    leftLabel: string;
    rightLabel: string;
    withSearchLabel: boolean;
    searchLabel: string;
    searchPlaceholder: string;
    unknownValuesText: string;
    showResizeHandle: boolean;
    filterChosenValuesOnPossibleValuesChange: boolean;
}, {}>;
export default _default;
