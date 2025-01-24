import type { PropType, Ref } from "vue";
import { type Id, type PossibleValue } from "../possibleValues";
declare const _default: import("vue").DefineComponent<{
    /**
     *  selected value (which is a list of ids of entries)
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => void;
        validator(values: PossibleValue): boolean;
    };
    modelValue: {
        type: PropType<Id[] | null>;
        default: () => void;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    withSearchLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
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
    /**
     * Labels
     */
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
    /**
     * controls the alignment
     */
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: string): boolean;
    };
    /**
     * Is only used when emptyStateComponent is null
     */
    emptyStateLabel: {
        type: StringConstructor;
        default: string;
    };
    filterChosenValuesOnPossibleValuesChange: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    initialSearchTerm: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    showEmptyState: {
        default: boolean;
        type: BooleanConstructor;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Is only used when emptyStateComponent is null
     */
    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
        default: null;
        type: ObjectConstructor;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    selectedValues: Ref<Id[] | null>;
    searchTerm: Ref<string>;
    visibleValues: import("vue").ComputedRef<PossibleValue[]>;
    concatenatedItems: import("vue").ComputedRef<PossibleValue[]>;
    caseSensitiveSearch: Ref<boolean>;
    numLabelInfos: import("vue").ComputedRef<string>;
    matchingInvalidValueIds: import("vue").ComputedRef<PossibleValue[]>;
    allItems: Ref<PossibleValue[]>;
}, unknown, {
    withIsEmptyState(): boolean;
    listSize(): number;
    cssStyleSize(): {
        height: string;
    } | {
        height?: undefined;
    };
    returnContainerRef(): HTMLDivElement;
    allignmentCheck(): {
        height: string;
    } | {
        height?: undefined;
    };
}, {
    onSearchInput(value: string): void;
    onChange(newVal: Id[]): void;
    hasSelection(): boolean;
    handleMouseIn(): void;
    handleMouseLeave(): void;
    validate(): {
        isValid: boolean;
        errorMessage: string | null;
    };
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     *  selected value (which is a list of ids of entries)
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => void;
        validator(values: PossibleValue): boolean;
    };
    modelValue: {
        type: PropType<Id[] | null>;
        default: () => void;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    withSearchLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
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
    /**
     * Labels
     */
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
    /**
     * controls the alignment
     */
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: string): boolean;
    };
    /**
     * Is only used when emptyStateComponent is null
     */
    emptyStateLabel: {
        type: StringConstructor;
        default: string;
    };
    filterChosenValuesOnPossibleValuesChange: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    initialSearchTerm: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    showEmptyState: {
        default: boolean;
        type: BooleanConstructor;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Is only used when emptyStateComponent is null
     */
    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
        default: null;
        type: ObjectConstructor;
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
    modelValue: Id[] | null;
    id: string;
    possibleValues: PossibleValue[];
    alignment: string;
    isValid: boolean;
    initialCaseSensitiveSearch: boolean;
    emptyStateLabel: string;
    emptyStateComponent: Record<string, any>;
    showEmptyState: boolean;
    initialSearchTerm: string;
    showSearch: boolean;
    withSearchLabel: boolean;
    searchLabel: string;
    searchPlaceholder: string;
    filterChosenValuesOnPossibleValuesChange: boolean;
}, {}>;
export default _default;
