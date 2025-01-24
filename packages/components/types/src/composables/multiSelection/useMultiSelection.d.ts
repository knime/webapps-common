import { type ComputedRef, type Ref } from "vue";
import * as multiSelectionService from "./multiSelectionStateService";
export type UseMultiSelectionOptions = {
    singleSelectionOnly: Ref<boolean>;
};
export type UseMultiSelectionReturn = {
    multiSelectionState: Ref<multiSelectionService.MultiSelectionState>;
    isSelected: (index: number) => boolean;
    selectedIndexes: ComputedRef<Array<number>>;
    isMultipleSelectionActive: (index: number) => boolean;
    resetSelection: () => void;
    handleSelectionClick: (index: number, event?: MouseEvent | null) => void;
    ctrlClickItem: (index: number) => void;
};
export declare const useMultiSelection: (options: UseMultiSelectionOptions) => UseMultiSelectionReturn;
