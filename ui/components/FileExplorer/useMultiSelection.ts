import { computed, ref, type ComputedRef, type Ref } from "vue";
import * as multiSelectionService from "./multiSelectionStateService";
import { getMetaOrCtrlKey } from "../../../util/navigator";

const INVALID_INDEX = -100;

type UseMultiSelectionOptions = {
  singleSelectionOnly: Ref<boolean>;
  numberOfItems: Ref<number>;
  startIndex: Ref<number>;
};

export type UseMultiSelectionReturn = {
  multiSelectionState: Ref<multiSelectionService.MultiSelectionState>;
  isSelected: (index: number) => boolean;
  selectedIndexes: ComputedRef<Array<number>>;
  isMultipleSelectionActive: (index: number) => boolean;
  resetSelection: () => void;
  handleSelectionClick: (index: number, event?: MouseEvent | null) => void;
  handleKeyboardNavigation: (event: KeyboardEvent | null) => void;
  ctrlClickItem: (index: number) => void;
  focusedIndex: Ref<number>;
};

export const useMultiSelection = (
  options: UseMultiSelectionOptions,
): UseMultiSelectionReturn => {
  const multiSelectionState = ref<multiSelectionService.MultiSelectionState>(
    multiSelectionService.getInitialState(),
  );

  const focusedIndex = ref<number>(INVALID_INDEX);

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

  const resetSelection = (focusIndex = 0) => {
    focusedIndex.value = focusIndex;
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
    event: MouseEvent | KeyboardEvent | null = null,
    handleCtrl = true,
  ) => {
    // check bounds (for keyboard nav)
    if (
      index < options.startIndex.value ||
      index >= options.numberOfItems.value
    ) {
      return;
    }

    // focus last clicked item (start key nav from there)
    focusedIndex.value = index;

    // special handling
    if (index === -1) {
      resetSelection(-1);
      return;
    }

    // single select
    if (!event || options.singleSelectionOnly.value) {
      clickItem(index);
      return;
    }

    const metaOrCtrlKey = getMetaOrCtrlKey();

    if (event.shiftKey) {
      shiftClickItem(index);
      return;
    }

    if (event[metaOrCtrlKey]) {
      if (handleCtrl) {
        ctrlClickItem(index);
      }
      return;
    }

    clickItem(index);
  };

  const handleKeyboardNavigation = (event: KeyboardEvent | null) => {
    if (!event) {
      return;
    }

    const metaOrCtrl = getMetaOrCtrlKey();
    const isHandledKey = [
      "Enter",
      " " /* Space */,
      "ArrowUp",
      "ArrowDown",
    ].includes(event.key);

    if (isHandledKey) {
      event.preventDefault();
      if (event[metaOrCtrl] || event.shiftKey) {
        event.stopPropagation();
      }
    }

    const index = Math.max(focusedIndex.value, options.startIndex.value);

    switch (event.key) {
      case "ArrowUp":
        handleSelectionClick(index - 1, event, false);
        break;
      case "ArrowDown":
        handleSelectionClick(index + 1, event, false);
        break;
      case "Enter":
        if (event[metaOrCtrl] && !options.singleSelectionOnly.value) {
          ctrlClickItem(index);
        }
        break;
      case "Space":
        if (!options.singleSelectionOnly.value) {
          ctrlClickItem(index);
        }
        break;
    }
  };

  return {
    multiSelectionState,
    isSelected,
    selectedIndexes,
    isMultipleSelectionActive,
    resetSelection,
    handleSelectionClick,
    handleKeyboardNavigation,
    focusedIndex,
    ctrlClickItem,
  };
};
