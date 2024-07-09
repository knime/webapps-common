import {
  type UseMultiSelectionReturn,
  type UseMultiSelectionOptions,
} from "./useMultiSelection";
import * as multiSelectionService from "./multiSelectionStateService";
import { computed, ref, type Ref } from "vue";
import { navigatorUtils } from "@knime/utils";

const PAGE_SIZE = 15;
const INVALID_INDEX = -Infinity;

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
export const useFocusableMultiSelection = (
  options: UseFocusableMultiSelectionOptions,
): UseFocusableMultiSelectionReturn => {
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
    // limit values with start and count-1
    const lastIndex = options.numberOfItems.value - 1;
    focusedIndex.value = Math.min(
      Math.max(focusIndex, options.startIndex.value),
      lastIndex,
    );
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
    if (options.disabled) {
      return;
    }

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

    const metaOrCtrlKey = navigatorUtils.getMetaOrCtrlKey();

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

    const metaOrCtrl = navigatorUtils.getMetaOrCtrlKey();
    const isHandledKey = [
      "Enter",
      " " /* Space */,
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "End",
      "Home",
    ].includes(event.key);

    if (isHandledKey) {
      event.preventDefault();
      if (event[metaOrCtrl] || event.shiftKey) {
        event.stopPropagation();
      }
    }

    const index = Math.max(focusedIndex.value, options.startIndex.value);
    const lastIndex = options.numberOfItems.value - 1;

    switch (event.key) {
      case "ArrowUp":
        handleSelectionClick(index - 1, event, false);
        break;
      case "PageUp":
        handleSelectionClick(Math.max(index - PAGE_SIZE, 0), event, false);
        break;
      case "PageDown":
        handleSelectionClick(
          Math.min(index + PAGE_SIZE, lastIndex),
          event,
          false,
        );
        break;
      case "End":
        handleSelectionClick(lastIndex, event, false);
        break;
      case "Home":
        handleSelectionClick(0, event, false);
        break;
      case "ArrowDown":
        handleSelectionClick(index + 1, event, false);
        break;
      case "Enter":
        if (event[metaOrCtrl] && !options.singleSelectionOnly.value) {
          ctrlClickItem(index);
        }
        break;
      case " " /* Space */:
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
    ctrlClickItem,
    handleKeyboardNavigation,
    focusedIndex,
  };
};
