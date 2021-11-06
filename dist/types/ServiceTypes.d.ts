/**
 * Selection service types for the `NodeService.selectDataPoints` method.
 *
 * @enum {string}
 */
declare enum SelectionServiceTypes {
    ADD = "ADD",
    REMOVE = "REMOVE",
    REPLACE = "REPLACE"
}
/**
 * Service types for DataServices implemented by a specific UI Extension node.
 *
 * @enum {string}
 *
 * TODO: NXT-761 convert to interfaces which are then members of the <Type>DataService implementations.
 */
declare enum DataServiceTypes {
    INITIAL_DATA = "initial_data",
    DATA = "data",
    APPLY_DATA = "apply_data"
}
/**
 * Any Service implemented by a specific UI Extension node.
 */
type Service = DataServiceTypes | SelectionServiceTypes | any;
export { SelectionServiceTypes, DataServiceTypes, Service };
