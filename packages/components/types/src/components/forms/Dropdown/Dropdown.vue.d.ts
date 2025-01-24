/// <reference types="node" />
import { type PropType } from "vue";
import "../variables.css";
type Id = string | number;
interface PossibleValue {
    id: Id;
    text: string;
    title?: string;
    group?: string;
    slotData?: {
        [K in keyof any]: string | number | boolean;
    };
}
declare const _default: import("vue").DefineComponent<{
    id: {
        type: StringConstructor;
        default(): string;
    };
    modelValue: {
        type: PropType<Id>;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    placeholder: {
        type: StringConstructor;
        default: null;
    };
    ariaLabel: {
        type: StringConstructor;
        required: true;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * The direction of the dropdown menu. When set to 'up', the menu will appear above the input field.
     * Defaults to 'down'.
     */
    direction: {
        default: string;
        type: PropType<"down" | "up">;
    };
    /**
     * List of possible values. Each item must have an `id` and a `text` property. To use slots an additional
     * slotData object must be passed which contains the data to be displayed.
     *
     * IMPORTANT: All values have to have a slotData object otherwise the slot will not be displayed and the
     * usual text is rendered instead.
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }, {
     *   id: 'JPG',
     *   text: 'Jpeg',
     *   slotData: {
     *     fullName: 'Joint Photographic Experts Group',
     *     year: '1992'
     *     description: 'Commonly used method of lossy compression for digital images'
     *   }
     * }]
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    caseSensitiveSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, {
    searchValue: import("vue").Ref<string>;
    useFilterValues: import("vue").Ref<boolean>;
    currentPossibleValues: import("vue").Ref<PossibleValue[]>;
}, {
    typingTimeout: NodeJS.Timeout | null;
    isExpanded: boolean;
    searchQuery: string;
    candidate: Id;
    emptyState: string;
    optionRefs: Map<any, any>;
    slotContainerHeight: number;
}, {
    groupedValues(): {
        label?: string | undefined;
        items: PossibleValue[];
    }[];
    orderedGroupedValues(): {
        label?: string | undefined;
        items: PossibleValue[];
    }[];
    flatOrderedValues(): PossibleValue[];
    selectedIndex(): number;
    showPlaceholder(): boolean;
    displayTextMap(): Record<Id, string>;
    displayText(): string;
    isMissing(): boolean | "" | 0;
    hasRightIcon(): number | undefined;
    hasOptionTemplate(): boolean;
    selectedOption(): PossibleValue | undefined;
    hasNoFilteredPossibleValues(): boolean;
    nonEmptySearchValue(): boolean;
    possibleValuesIsProvided(): boolean;
    isDisabled(): boolean;
    closeIconTooltip(): "Clear";
}, {
    updateCandidate(candidate: Id): void;
    isCurrentValue(candidate: Id): boolean;
    getButtonRef(): HTMLElement;
    getOptionsRefs(): HTMLElement[];
    getSearchInput(): HTMLInputElement;
    getListBoxNodeRef(): HTMLElement;
    emitAndClose(id: Id): void;
    scrollTo(id: Id): void;
    onArrowDown(): void;
    onArrowUp(): void;
    onEnter(): void;
    onEndKey(): void;
    onHomeKey(): void;
    toggleExpanded(): void;
    expand(): Promise<void>;
    collapse(): void;
    handleKeyDownButton(e: KeyboardEvent): void;
    handleKeyDownOnExpanded(e: KeyboardEvent): void;
    hasSelection(): boolean;
    getCurrentSelectedId(): Id;
    generateId(node: string, itemId?: Id | null): string;
    closeDropdown(): void;
    handleSearch(item: string): void;
    handleResetInput(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default(): string;
    };
    modelValue: {
        type: PropType<Id>;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    placeholder: {
        type: StringConstructor;
        default: null;
    };
    ariaLabel: {
        type: StringConstructor;
        required: true;
    };
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * The direction of the dropdown menu. When set to 'up', the menu will appear above the input field.
     * Defaults to 'down'.
     */
    direction: {
        default: string;
        type: PropType<"down" | "up">;
    };
    /**
     * List of possible values. Each item must have an `id` and a `text` property. To use slots an additional
     * slotData object must be passed which contains the data to be displayed.
     *
     * IMPORTANT: All values have to have a slotData object otherwise the slot will not be displayed and the
     * usual text is rendered instead.
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }, {
     *   id: 'JPG',
     *   text: 'Jpeg',
     *   slotData: {
     *     fullName: 'Joint Photographic Experts Group',
     *     year: '1992'
     *     description: 'Commonly used method of lossy compression for digital images'
     *   }
     * }]
     */
    possibleValues: {
        type: PropType<PossibleValue[]>;
        default: () => never[];
    };
    caseSensitiveSearch: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
    compact: boolean;
    disabled: boolean;
    direction: "down" | "up";
    modelValue: Id;
    id: string;
    placeholder: string;
    possibleValues: PossibleValue[];
    isValid: boolean;
    caseSensitiveSearch: boolean;
}, {}>;
export default _default;
