import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { useFocusableMultiSelection } from "../useFocusableMultiSelection";

describe("useFocusableMultiSelection", () => {
  it("should focus and select items on keyboard navigation", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-Infinity);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );

    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(selectedIndexes.value).toStrictEqual([1]);
    expect(focusedIndex.value).toBe(1);
  });

  it("multi selects items on key navigation with shift", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-Infinity);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );

    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );

    expect(selectedIndexes.value).toStrictEqual([1, 2, 3, 4, 5]);
    expect(focusedIndex.value).toBe(5);
  });

  it("multi selects items on key navigation with ctrl and enter/space", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-Infinity);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );

    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowUp", ctrlKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowUp", ctrlKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowUp", ctrlKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: " " /* Space */, ctrlKey: true }),
    );

    expect(selectedIndexes.value).toStrictEqual([0, 2, 3]);
    expect(focusedIndex.value).toBe(0);
  });

  it("resets selection on -1 index (folder back), accessed by going up when first element is selected", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-Infinity);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );

    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(selectedIndexes.value).toStrictEqual([]);
    expect(focusedIndex.value).toBe(-1);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    // page up should not navigate to the back button
    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "PageUp" }));
    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    // also the home button should not navigate to the back button
    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "Home" }));
    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);
  });

  it("if first element is not selected, home and page up should not reset selection", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);
    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    expect(selectedIndexes.value).toStrictEqual([1]);
    expect(focusedIndex.value).toBe(1);

    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "PageUp" }));
    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    expect(selectedIndexes.value).toStrictEqual([1]);
    expect(focusedIndex.value).toBe(1);

    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "Home" }));
    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);
  });

  it("skips disabled items on keyboard navigation with arrows", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);
    const disabledIndexes = ref([1, 3, 5]);
    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
        skippedIndices: disabledIndexes,
      });
    expect(focusedIndex.value).toBe(-Infinity);
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    expect(selectedIndexes.value).toStrictEqual([2]);
    expect(focusedIndex.value).toBe(2);

    // also test that it behaves when holding the shift key
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );
    expect(selectedIndexes.value).toStrictEqual([2, 4]);
    expect(focusedIndex.value).toBe(4);
  });

  it("skips disabled items on keyboard navigation with page up/down", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);
    const disabledIndexes = ref([0, 3, 5]);
    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
        skippedIndices: disabledIndexes,
      });
    expect(focusedIndex.value).toBe(-Infinity);
    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "PageDown" }));
    expect(selectedIndexes.value).toStrictEqual([9]);
    expect(focusedIndex.value).toBe(9);

    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "PageUp" }));
    expect(selectedIndexes.value).toStrictEqual([1]);
    expect(focusedIndex.value).toBe(1);
  });

  it("end skips to last non-disabled item", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);
    const disabledIndexes = ref([0, 3, 9]);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
        skippedIndices: disabledIndexes,
      });
    expect(focusedIndex.value).toBe(-Infinity);

    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "End" }));
    expect(selectedIndexes.value).toStrictEqual([8]);
    expect(focusedIndex.value).toBe(8);
  });

  it("honors single select mode", () => {
    const singleSelectionOnly = ref(true);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useFocusableMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-Infinity);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", shiftKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown", ctrlKey: true }),
    );
    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "Enter", ctrlKey: true }),
    );

    expect(selectedIndexes.value).toStrictEqual([2]);
    expect(focusedIndex.value).toBe(2);
  });
});
