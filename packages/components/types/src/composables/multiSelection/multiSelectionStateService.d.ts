export type SelectionRange = {
    from: number;
    to: number;
};
export type MultiSelectionState = {
    anchorHistory: Array<number>;
    anchorExceptions: Array<number>;
    selectionRanges: Array<SelectionRange>;
};
/**
 * Initialize the state of the multi selection service
 */
export declare const getInitialState: () => MultiSelectionState;
/**
 * Determines whether there is any active selection in the provided state
 */
export declare const isMultipleSelectionActive: (state: MultiSelectionState, initialElement: number) => boolean;
/**
 * Determines whether the provided item is selected considering the given selection state
 * by trying to find it inside the selection ranges, bounded by the from and to properties
 */
export declare const isItemSelected: (state: MultiSelectionState, item: number) => boolean;
/**
 * Executes the Ctrl+Click logic. Will set (or unset) the clicked item into the selection state
 * updating it accordingly.
 *
 * e.g: New items will be added, existing items will be removed
 */
export declare const ctrlClick: (state: MultiSelectionState, clickedItem: number) => MultiSelectionState;
/**
 * Executes the Shift+Click logic. Will set (or unset) the clicked item into the selection state
 * updating it accordingly and also updating any possible selection ranges.
 */
export declare const shiftClick: (state: MultiSelectionState, clickedItem: number) => MultiSelectionState;
/**
 * Executes the "Click" logic. Will reset any selection state, since click alone would unselect
 */
export declare const click: (clickedItem: number) => MultiSelectionState;
/**
 * Normalizes a multiselection state into an array of selection ranges that:
 * - **Excludes anchor exceptions**.
 *    - Example:
 *      Given a state with ranges: [(1-5), (7-10)], and anchorExceptions: [2, 8]
 *      The output for this example should be these ranges: [(1-1), (3-5), (7-7), (9-10)]. Since they do not
 *      include items 2 and 8.
 *
 * - **Has no overlapping ranges**.
 *    - Example:
 *      Given two ranges: (4-7) and (1-6), the latter would be "overlapping" (the left side) of the first one.
 *      The correct output range for this example should be just the range (1-7)
 *
 * - **Has no subranges**.
 *    - Example:
 *      Given two ranges: (1-6) and (2-4), the latter would be "included" in the first one.
 *      The correct output range for this example should be just the range (1-6)
 */
export declare const normalizeRanges: (state: MultiSelectionState) => Array<SelectionRange>;
/**
 * Returns the selection size for the given state
 */
export declare const selectionSize: (state: MultiSelectionState) => number;
/**
 * Returns an array of all the indexes that are selected in the given state
 * @returns selected indexes
 */
export declare const getSelectedIndexes: (state: MultiSelectionState) => Array<number>;
