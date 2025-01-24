import type { PropType, Ref } from "vue";
import { type BottomValue, type Id, type PossibleValue } from "../possibleValues";
declare const _default: import("vue").DefineComponent<{
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    bottomValue: {
        type: PropType<BottomValue>;
        default: () => {
            id: string;
            text: string;
        };
        validator(value: BottomValue): boolean;
    };
    withBottomValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    ariaLabel: {
        type: StringConstructor;
        required: true;
        default: string;
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
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: string): boolean;
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: PropType<Id[] | null>;
        default: () => void;
    };
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    withSearchLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
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
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    initialSearchTerm: {
        type: StringConstructor;
        default: string;
    };
    showEmptyState: {
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
    filterChosenValuesOnPossibleValuesChange: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    unknownValuesText: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    concatenatedItems: import("vue").ComputedRef<PossibleValue[]>;
    visibleValues: import("vue").ComputedRef<PossibleValue[]>;
    selectedValues: Ref<Id[] | null>;
    searchTerm: Ref<string>;
    matchingValidIds: import("vue").ComputedRef<PossibleValue[]>;
    caseSensitiveSearch: Ref<boolean>;
    invalidValueIds: import("vue").ComputedRef<Id[]>;
    matchingInvalidValueIds: import("vue").ComputedRef<PossibleValue[]>;
    numLabelInfos: import("vue").ComputedRef<string>;
    numMatchedSearchedItems: import("vue").ComputedRef<PossibleValue[]>;
    possibleValueMap: import("vue").ComputedRef<Record<Id, {
        item: PossibleValue;
        index: number;
    }>>;
}, unknown, {
    listSize(): number;
}, {
    hasSelection(): boolean;
    onChange(newVal: Id[]): void;
    onSearchInput(value: string): void;
    validate(): {
        isValid: boolean;
        errorMessage: string | null;
    };
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    initialCaseSensitiveSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    bottomValue: {
        type: PropType<BottomValue>;
        default: () => {
            id: string;
            text: string;
        };
        validator(value: BottomValue): boolean;
    };
    withBottomValue: {
        type: BooleanConstructor;
        default: boolean;
    };
    ariaLabel: {
        type: StringConstructor;
        required: true;
        default: string;
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
    alignment: {
        type: StringConstructor;
        default: string;
        validator(value: string): boolean;
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: PropType<Id[] | null>;
        default: () => void;
    };
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    withSearchLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    showSearch: {
        type: BooleanConstructor;
        default: boolean;
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
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    initialSearchTerm: {
        type: StringConstructor;
        default: string;
    };
    showEmptyState: {
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
    filterChosenValuesOnPossibleValuesChange: {
        type: BooleanConstructor;
        default: boolean;
        required: false;
    };
    unknownValuesText: {
        type: StringConstructor;
        required: false;
        default: string;
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
    ariaLabel: string;
    initialCaseSensitiveSearch: boolean;
    emptyStateLabel: string;
    emptyStateComponent: Record<string, any>;
    withBottomValue: boolean;
    bottomValue: BottomValue;
    showEmptyState: boolean;
    initialSearchTerm: string;
    showSearch: boolean;
    withSearchLabel: boolean;
    searchLabel: string;
    searchPlaceholder: string;
    unknownValuesText: string;
    filterChosenValuesOnPossibleValuesChange: boolean;
}, {}>;
export default _default;
