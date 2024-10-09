import { type ComputedRef, type Ref, computed, ref } from "vue";

import { navigatorUtils } from "@knime/utils";

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

export const useMultiSelection = (
  options: UseMultiSelectionOptions,
): UseMultiSelectionReturn => {
  const multiSelectionState = ref<multiSelectionService.MultiSelectionState>(
    multiSelectionService.getInitialState(),
  );

  const isSelected = (index: number) =>
    multiSelectionService.isItemSelected(multiSelectionState.value, index);

  const selectedIndexes = computed(() =>
    multiSelectionService.getSelectedIndexes(multiSelectionState.value),
  );

  const isMultipleSelectionActive = (index: number) =>
    multiSelectionService.isMultipleSelectionActive(
      multiSelectionState.value,
      index,
    );

  const resetSelection = () => {
    multiSelectionState.value = multiSelectionService.getInitialState();
  };

  const clickItem = (index: number) => {
    multiSelectionState.value = multiSelectionService.click(index);
  };

  const ctrlClickItem = (index: number) => {
    multiSelectionState.value = multiSelectionService.ctrlClick(
      multiSelectionState.value,
      index,
    );
  };

  const shiftClickItem = (index: number) => {
    multiSelectionState.value = multiSelectionService.shiftClick(
      multiSelectionState.value,
      index,
    );
  };

  const handleSelectionClick = (
    index: number,
    event: MouseEvent | null = null,
  ) => {
    if (!event || options.singleSelectionOnly.value) {
      clickItem(index);
      return;
    }

    const metaOrCtrlKey = navigatorUtils.getMetaOrCtrlKey();

    if (event.shiftKey) {
      shiftClickItem(index);
      return;
    }

    if (event[metaOrCtrlKey]) {
      ctrlClickItem(index);
      return;
    }

    clickItem(index);
  };

  return {
    multiSelectionState,
    isSelected,
    selectedIndexes,
    isMultipleSelectionActive,
    resetSelection,
    handleSelectionClick,
    ctrlClickItem,
  };
};
