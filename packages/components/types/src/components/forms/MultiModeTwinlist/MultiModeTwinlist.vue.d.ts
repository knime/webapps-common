import { type PropType } from "vue";
import { type TwinlistModelValue } from "../Twinlist/Twinlist.vue";
import { type Id, type PossibleValue as TwinlistPossibleValue } from "../possibleValues";
type PossibleType = {
    id: string;
    text: string;
};
type PossibleValue = TwinlistPossibleValue & {
    type?: PossibleType;
};
declare const allModes: {
    manual: string;
    wildcard: string;
    regex: string;
    type: string;
};
declare const _default: import("vue").DefineComponent<{
    /**
     * initial values
     */
    mode: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    manualSelection: {
        type: PropType<TwinlistModelValue>;
        default: () => never[];
    };
    pattern: {
        type: StringConstructor;
        default: string;
    };
    caseSensitivePattern: {
        default: boolean;
        type: BooleanConstructor;
    };
    inversePattern: {
        default: boolean;
        type: BooleanConstructor;
    };
    withTypes: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectedTypes: {
        type: PropType<string[]>;
        default: () => never[];
    };
    /**
     * Hiding and disabling
     */
    showMode: {
        default: boolean;
        type: BooleanConstructor;
    };
    showSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Labels
     */
    withModeLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    modeLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    withPatternLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    patternLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    withTypesLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    typesLabel: {
        type: StringConstructor;
        required: false;
        default: string;
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
     * For type selection, additionally, an element has to have a property `type` wich itself has properties
     * `id` and `text`, e.g.
     * [{
     *   id: 'pdf',
     *   text: 'PDF',
     *   type: {
     *     id: 'StringValue',
     *     text: 'String'
     *  }]
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    /**
     * List of possible types which should be selectable but are not necessarily present in the possible values.
     */
    additionalPossibleTypes: {
        type: PropType<PossibleType[]>;
        default: () => never[];
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    manuallySelected: import("vue").ComputedRef<Id[] | null>;
}, {
    invalidPossibleValueIds: Set<unknown>;
}, {
    possibleValueIds(): Id[];
    possibleTypes(): PossibleType[];
    matchingValueIds(): Id[];
    twinlistModelValue(): TwinlistModelValue;
    selectedValues(): Id[] | null;
    selectionDisabled(): boolean;
    normalizedSearchTerm(): any;
    possibleModes(): {
        id: string;
        text: string;
    }[];
}, {
    onManualInput(value: TwinlistModelValue): void;
    onPatternInput(value: string): void;
    onTypeInput(value: string[]): void;
    onModeChange(value: keyof typeof allModes): void;
    onToggleCaseSensitivePattern(value: boolean): void;
    onToggleInversePattern(value: boolean): void;
    validate(): any;
    hasSelection(): boolean;
    itemMatches(item: PossibleValue): boolean;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:manualSelection" | "update:pattern" | "update:selectedTypes" | "update:mode" | "update:caseSensitivePattern" | "update:inversePattern" | "update:selected")[], "update:manualSelection" | "update:pattern" | "update:selectedTypes" | "update:mode" | "update:caseSensitivePattern" | "update:inversePattern" | "update:selected", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * initial values
     */
    mode: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    manualSelection: {
        type: PropType<TwinlistModelValue>;
        default: () => never[];
    };
    pattern: {
        type: StringConstructor;
        default: string;
    };
    caseSensitivePattern: {
        default: boolean;
        type: BooleanConstructor;
    };
    inversePattern: {
        default: boolean;
        type: BooleanConstructor;
    };
    withTypes: {
        type: BooleanConstructor;
        default: boolean;
    };
    selectedTypes: {
        type: PropType<string[]>;
        default: () => never[];
    };
    /**
     * Hiding and disabling
     */
    showMode: {
        default: boolean;
        type: BooleanConstructor;
    };
    showSearch: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Labels
     */
    withModeLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    modeLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    withPatternLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    patternLabel: {
        type: StringConstructor;
        required: false;
        default: string;
    };
    withTypesLabel: {
        default: boolean;
        type: BooleanConstructor;
    };
    typesLabel: {
        type: StringConstructor;
        required: false;
        default: string;
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
     * For type selection, additionally, an element has to have a property `type` wich itself has properties
     * `id` and `text`, e.g.
     * [{
     *   id: 'pdf',
     *   text: 'PDF',
     *   type: {
     *     id: 'StringValue',
     *     text: 'String'
     *  }]
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    /**
     * List of possible types which should be selectable but are not necessarily present in the possible values.
     */
    additionalPossibleTypes: {
        type: PropType<PossibleType[]>;
        default: () => never[];
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:manualSelection"?: ((...args: any[]) => any) | undefined;
    "onUpdate:pattern"?: ((...args: any[]) => any) | undefined;
    "onUpdate:selectedTypes"?: ((...args: any[]) => any) | undefined;
    "onUpdate:mode"?: ((...args: any[]) => any) | undefined;
    "onUpdate:caseSensitivePattern"?: ((...args: any[]) => any) | undefined;
    "onUpdate:inversePattern"?: ((...args: any[]) => any) | undefined;
    "onUpdate:selected"?: ((...args: any[]) => any) | undefined;
}, {
    pattern: string;
    compact: boolean;
    disabled: boolean;
    possibleValues: PossibleValue[];
    mode: string;
    showSearch: boolean;
    manualSelection: TwinlistModelValue;
    caseSensitivePattern: boolean;
    inversePattern: boolean;
    withTypes: boolean;
    selectedTypes: string[];
    showMode: boolean;
    withModeLabel: boolean;
    modeLabel: string;
    withPatternLabel: boolean;
    patternLabel: string;
    withTypesLabel: boolean;
    typesLabel: string;
    additionalPossibleTypes: PossibleType[];
}, {}>;
export default _default;
