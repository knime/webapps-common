import { expect, describe, it } from "vitest";
import * as multiSelectionService from "../multiSelectionStateService";

describe("multiSelectionStateService", () => {
  it("should update state correctly", () => {
    // select item: 1
    const state1 = multiSelectionService.click(1);
    // select item: 4
    const state2 = multiSelectionService.ctrlClick(state1, 4);
    // select items: 4-8
    const state3 = multiSelectionService.shiftClick(state2, 8);
    // unselect item: 4
    const state4 = multiSelectionService.ctrlClick(state3, 4);
    // unselect item: 7
    const state5 = multiSelectionService.ctrlClick(state4, 7);
    // select all from last anchor (7 from previous call), to item 1
    const state6 = multiSelectionService.shiftClick(state5, 1);

    // state 1 -> only `1` selected
    expect(multiSelectionService.normalizeRanges(state1)).toEqual([
      { from: 1, to: 1 },
    ]);

    // state 2 -> `1` selected. `4` selected
    expect(multiSelectionService.normalizeRanges(state2)).toEqual([
      { from: 1, to: 1 },
      { from: 4, to: 4 },
    ]);

    // state 3 -> `1` selected. `4-8` selected
    expect(multiSelectionService.normalizeRanges(state3)).toEqual([
      { from: 1, to: 1 },
      { from: 4, to: 8 },
    ]);

    // state 4 -> `1` selected. `5-8` selected
    expect(multiSelectionService.normalizeRanges(state4)).toEqual([
      { from: 1, to: 1 },
      { from: 5, to: 8 },
    ]);

    // state 5 -> `1` selected. `5-6` selected. `8` selected
    expect(multiSelectionService.normalizeRanges(state5)).toEqual([
      { from: 1, to: 1 },
      { from: 5, to: 6 },
      { from: 8, to: 8 },
    ]);

    // state 6 -> `1-8`.
    expect(multiSelectionService.normalizeRanges(state6)).toEqual([
      { from: 1, to: 8 },
    ]);
  });

  it("should remove overlapping ranges", () => {
    const output = multiSelectionService.normalizeRanges({
      selectionRanges: [
        { from: 13, to: 18 },
        { from: 1, to: 6 },
        { from: 5, to: 11 },
        { from: 3, to: 9 },
      ],
      anchorExceptions: [],
      anchorHistory: [],
    });

    expect(output).toEqual([
      { from: 1, to: 11 },
      { from: 13, to: 18 },
    ]);
  });

  it("should remove sub ranges", () => {
    const output = multiSelectionService.normalizeRanges({
      selectionRanges: [
        { from: 2, to: 18 },
        { from: 3, to: 6 },
        { from: 5, to: 11 },
        { from: 3, to: 9 },
      ],
      anchorExceptions: [],
      anchorHistory: [],
    });

    expect(output).toEqual([{ from: 2, to: 18 }]);
  });

  describe("click", () => {
    it("should select the item", () => {
      const state = multiSelectionService.click(1);

      expect(multiSelectionService.normalizeRanges(state)).toEqual([
        { from: 1, to: 1 },
      ]);
    });
  });

  describe("ctrlClick", () => {
    it("should add item to selection if it is not selected", () => {
      const state1 = multiSelectionService.click(1);
      const state2 = multiSelectionService.ctrlClick(state1, 4);

      expect(multiSelectionService.normalizeRanges(state2)).toEqual([
        { from: 1, to: 1 },
        { from: 4, to: 4 },
      ]);
    });

    it("should remove item from selection if selected", () => {
      const state1 = multiSelectionService.click(1);
      const state2 = multiSelectionService.ctrlClick(state1, 4);
      const state3 = multiSelectionService.ctrlClick(state2, 4);

      expect(state3.anchorExceptions).toContain(4);
      expect(multiSelectionService.normalizeRanges(state3)).toEqual([
        { from: 1, to: 1 },
      ]);
    });

    it("should select->unselect->select correctly", () => {
      const initialState = multiSelectionService.getInitialState();
      // select
      const state1 = multiSelectionService.ctrlClick(initialState, 4);
      // unselect
      const state2 = multiSelectionService.ctrlClick(state1, 4);
      // select
      const state3 = multiSelectionService.ctrlClick(state2, 4);

      expect(multiSelectionService.normalizeRanges(state3)).toEqual([
        { from: 4, to: 4 },
      ]);
    });

    it("should update the anchor history and anchor exceptions correctly", () => {
      const initialState = multiSelectionService.getInitialState();
      const state1 = multiSelectionService.ctrlClick(initialState, 4);

      expect(state1.anchorHistory).toEqual([4]);

      const state2 = multiSelectionService.ctrlClick(state1, 8);
      expect(state2.anchorHistory).toEqual([4, 8]);

      const state3 = multiSelectionService.ctrlClick(state2, 8);
      expect(state3.anchorHistory).toEqual([4, 8, 8]);
      expect(state3.anchorExceptions).toEqual([8]);
    });
  });

  describe("shiftClick", () => {
    it("should select ranges", () => {
      // select from 5-9
      const initialState = multiSelectionService.click(5);
      const state1 = multiSelectionService.shiftClick(initialState, 9);

      expect(multiSelectionService.normalizeRanges(state1)).toEqual([
        { from: 5, to: 9 },
      ]);

      // invert selection by clicking on item 1
      const state2 = multiSelectionService.shiftClick(state1, 1);
      expect(multiSelectionService.normalizeRanges(state2)).toEqual([
        { from: 1, to: 5 },
      ]);
    });

    it("should select correctly when selection is empty", () => {
      const initialState = multiSelectionService.getInitialState();
      const state1 = multiSelectionService.shiftClick(initialState, 2);
      const state2 = multiSelectionService.shiftClick(state1, 6);

      expect(multiSelectionService.normalizeRanges(state2)).toEqual([
        { from: 2, to: 6 },
      ]);
    });

    it("should increase existing ranges", () => {
      const initialState = multiSelectionService.click(1);
      const state1 = multiSelectionService.shiftClick(initialState, 5);
      const state2 = multiSelectionService.shiftClick(state1, 10);

      expect(multiSelectionService.normalizeRanges(state2)).toEqual([
        { from: 1, to: 10 },
      ]);
    });

    it("should decrease existing ranges", () => {
      const initialState = multiSelectionService.click(1);
      const state1 = multiSelectionService.shiftClick(initialState, 10);
      const state2 = multiSelectionService.shiftClick(state1, 5);

      expect(multiSelectionService.normalizeRanges(state2)).toEqual([
        { from: 1, to: 5 },
      ]);
    });
  });

  it("should return the right selection size", () => {
    const state1 = multiSelectionService.click(1);
    const state2 = multiSelectionService.ctrlClick(state1, 4);
    const state3 = multiSelectionService.shiftClick(state2, 8);

    const selectionSize = multiSelectionService.selectionSize(state3);
    expect(selectionSize).toBe(6);
  });

  it("should return the selected indexes", () => {
    const state1 = multiSelectionService.click(1);
    const state2 = multiSelectionService.ctrlClick(state1, 4);
    const state3 = multiSelectionService.shiftClick(state2, 8);
    const state4 = multiSelectionService.ctrlClick(state3, 7);

    const selectedIndexes = multiSelectionService.getSelectedIndexes(state4);
    expect(selectedIndexes).toEqual([1, 4, 5, 6, 8]);
  });
});
