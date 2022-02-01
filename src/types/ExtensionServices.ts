/**
 * Selection services available by default to UI Extension nodes.
 *
 * @enum {string}
 */
export enum SelectionServices {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    REPLACE = 'REPLACE',
}

/**
 * Data services available by default to UI Extension nodes.
 *
 * @enum {string}
 */
export enum DataServices {
    // Returns the initial data as provided by the node implementation. Requires no parameters.
    INITIAL_DATA = 'initial_data',
    // Expects request to provide correct method parameters to retrieve data from the referenced data service method.
    DATA = 'data',
    // Expects request body to contain the update data to apply/persist/update depending on node implementation.
    APPLY_DATA = 'apply_data',
}

/**
 * Any Service implemented by a specific UI Extension node.
 */
export type ExtensionService = DataServices | SelectionServices | any;
export type DataService = DataServices;
export type TSelectionService = SelectionServices;
