import { type PropType } from "vue";
import { type Id, type PossibleValue } from "../possibleValues";
import "../variables.css";
interface ComponentData {
    searchValue: string;
    inputOrOptionsFocussed: boolean;
    focusElement: any;
    refocusElement: any;
    allPossibleItems: Array<PossibleValue>;
}
declare const _default: import("vue").DefineComponent<{
    /**
     * List of possible values. Each item must have an `id` and a `text` property. Some optional properties
     * can be used that are specified in Multiselect.vue.
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
        validator(values: unknown): boolean;
    };
    /**
     * List of initial selected ids.
     */
    modelValue: {
        type: PropType<Id[]>;
        default: () => never[];
    };
    /**
     * Limit the number of visible options in the dropdown.
     */
    sizeVisibleOptions: {
        type: NumberConstructor;
        default: number;
        validator(value: number): boolean;
    };
    /**
     * Close the dropdown when an entry was selected.
     */
    closeDropdownOnSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    isValid: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Allow adding and selecting new tags, not just possible values
     */
    allowNewValues: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, ComponentData, {
    trimmedSearchValue(): string;
    trimmedLowerCasedSearchValue(): string;
    isSearchEmpty(): boolean;
    searchResults(): {
        id: Id;
        text: string;
        invalid?: boolean | undefined;
        special?: true | undefined;
    }[];
    hasSelection(): boolean;
    inputWidth(): {
        width?: undefined;
    } | {
        width: string;
    };
    selectedValues(): PossibleValue[];
    maxSizeVisibleOptions(): number;
}, {
    emitNewSelection(newSelectedIds: Id[]): void;
    focusInput(): void;
    onDown(): void;
    onEnter(): void;
    onBackspace(): void;
    onFocusOutside(): void;
    onInput(): void;
    onInputFocus(): void;
    updateSelectedIds(selectedIds: Array<Id>): void;
    removeTag(idToRemove: Id): void;
    removeAllTags(): void;
    closeOptionsAndStop(event: KeyboardEvent): void;
    closeOptions(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (_payload: Array<Id>) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * List of possible values. Each item must have an `id` and a `text` property. Some optional properties
     * can be used that are specified in Multiselect.vue.
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
        validator(values: unknown): boolean;
    };
    /**
     * List of initial selected ids.
     */
    modelValue: {
        type: PropType<Id[]>;
        default: () => never[];
    };
    /**
     * Limit the number of visible options in the dropdown.
     */
    sizeVisibleOptions: {
        type: NumberConstructor;
        default: number;
        validator(value: number): boolean;
    };
    /**
     * Close the dropdown when an entry was selected.
     */
    closeDropdownOnSelection: {
        type: BooleanConstructor;
        default: boolean;
    };
    isValid: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Allow adding and selecting new tags, not just possible values
     */
    allowNewValues: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((_payload: Id[]) => any) | undefined;
}, {
    compact: boolean;
    modelValue: Id[];
    possibleValues: PossibleValue[];
    isValid: boolean;
    sizeVisibleOptions: number;
    closeDropdownOnSelection: boolean;
    allowNewValues: boolean;
}, {}>;
export default _default;
