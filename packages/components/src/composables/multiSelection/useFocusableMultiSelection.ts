import { type Ref, computed, ref } from "vue";

import { getMetaOrCtrlKey } from "@knime/utils";

import * as multiSelectionService from "./multiSelectionStateService";
import {
  type UseMultiSelectionOptions,
  type UseMultiSelectionReturn,
} from "./useMultiSelection";

const PAGE_SIZE = 15;
const INVALID_INDEX = -Infinity;

type UseFocusableMultiSelectionOptions = UseMultiSelectionOptions & {
  numberOfItems: Ref<number>;
  startIndex: Ref<number>;
  disabled?: boolean;
  skippedIndices?: Ref<number[]>;
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

  const skippedIndices = computed(() => options.skippedIndices?.value ?? []);

  const isSelected = (index: number) =>
    !skippedIndices.value.includes(index) &&
    multiSelectionService.isItemSelected(multiSelectionState.value, index);

  const selectedIndexes = computed(() =>
    multiSelectionService
      .getSelectedIndexes(multiSelectionState.value)
      .filter((index) => !skippedIndices.value.includes(index)),
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

  const unskippedIndices = computed(() => {
    const allIndices = Array.from(
      { length: options.numberOfItems.value },
      (_, i) => i,
    );
    if (skippedIndices.value.length) {
      return allIndices.filter((i) => !skippedIndices.value.includes(i));
    }
    return allIndices;
  });

  const nextNonSkippedIndex = (
    startIndex: number,
    increment: number,
  ): number => {
    if (unskippedIndices.value.length === 0 || increment === 0) {
      return startIndex;
    }
    const targetIndex = startIndex + increment;
    if (increment < 0) {
      return (
        unskippedIndices.value.findLast((val) => val <= targetIndex) ??
        unskippedIndices.value[0]
      );
    } else {
      return (
        unskippedIndices.value.find((val) => val >= targetIndex) ??
        unskippedIndices.value.at(-1)!
      );
    }
  };

  /**
   * In case we cannot navigate further in the direction of the increment, we return -1.
   */
  const nextNonSkippedIndexOrMinusOne = (
    startIndex: number,
    increment: number,
  ) => {
    if (startIndex === -1 && increment < 0) {
      return -1;
    }
    const nextIndex = nextNonSkippedIndex(startIndex, increment);
    if (increment < 0 && nextIndex === startIndex) {
      return -1;
    } else {
      return nextIndex;
    }
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

    switch (event.key) {
      case "ArrowUp":
        handleSelectionClick(
          nextNonSkippedIndexOrMinusOne(index, -1),
          event,
          false,
        );
        break;
      case "PageUp":
        handleSelectionClick(
          nextNonSkippedIndex(index, -PAGE_SIZE),
          event,
          false,
        );
        break;
      case "PageDown":
        handleSelectionClick(
          nextNonSkippedIndex(index, PAGE_SIZE),
          event,
          false,
        );
        break;
      case "End":
        handleSelectionClick(
          nextNonSkippedIndex(index, Infinity),
          event,
          false,
        );
        break;
      case "Home":
        handleSelectionClick(
          nextNonSkippedIndex(index, -Infinity),
          event,
          false,
        );
        break;
      case "ArrowDown":
        handleSelectionClick(nextNonSkippedIndex(index, 1), event, false);
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
