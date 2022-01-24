/**
 * Selection service types for the `NodeService.selectDataPoints` method.
 *
 * @enum {string}
 */
export enum SelectionServiceTypes {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    REPLACE = 'REPLACE',
}

/**
 * Service types for DataServices implemented by a specific UI Extension node.
 *
 * @enum {string}
 *
 * TODO: NXT-761 convert to interfaces which are then members of the <Type>DataService implementations.
 */
export enum DataServiceTypes {
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
export type Service = DataServiceTypes | SelectionServiceTypes | any;
