/* eslint-disable no-magic-numbers */
import { describe, expect, it } from "vitest";
import { ref } from "vue";

import { useMultiSelection } from "../useMultiSelection";

describe("useMultiSelection", () => {
  it("should focus and select items on keyboard navigation", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-100);

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
      useMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-100);

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
      useMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-100);

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

  it("resets selection on -1 index (folder back)", () => {
    const singleSelectionOnly = ref(false);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-100);

    handleKeyboardNavigation(
      new KeyboardEvent("keydown", { key: "ArrowDown" }),
    );

    expect(selectedIndexes.value).toStrictEqual([0]);
    expect(focusedIndex.value).toBe(0);

    handleKeyboardNavigation(new KeyboardEvent("keydown", { key: "ArrowUp" }));

    expect(selectedIndexes.value).toStrictEqual([]);
    expect(focusedIndex.value).toBe(-1);
  });

  it("honors single select mode", () => {
    const singleSelectionOnly = ref(true);
    const numberOfItems = ref(10);
    const startIndex = ref(-1);

    const { handleKeyboardNavigation, focusedIndex, selectedIndexes } =
      useMultiSelection({
        singleSelectionOnly,
        numberOfItems,
        startIndex,
      });

    expect(focusedIndex.value).toBe(-100);

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
