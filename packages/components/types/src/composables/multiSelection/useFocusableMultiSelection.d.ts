import { type Ref } from "vue";
import { type UseMultiSelectionOptions, type UseMultiSelectionReturn } from "./useMultiSelection";
type UseFocusableMultiSelectionOptions = UseMultiSelectionOptions & {
    numberOfItems: Ref<number>;
    startIndex: Ref<number>;
    disabled?: boolean;
};
export type UseFocusableMultiSelectionReturn = {
    resetSelection: (focusIndex?: number) => void;
    handleKeyboardNavigation: (event: KeyboardEvent | null) => void;
    focusedIndex: Ref<number>;
} & Omit<UseMultiSelectionReturn, "resetSelection">;
/**
 * Thin wrapper around multi selection service with added keyboard navigation and focus (index based) support.
 */
export declare const useFocusableMultiSelection: (options: UseFocusableMultiSelectionOptions) => UseFocusableMultiSelectionReturn;
export {};
