/**
 * Service types for DataServices.
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
type Service<T> = T;
/**
 * A DataService implemented by a specific UI Extension node.
 */
type DataService = Service<DataServiceTypes>;
export { DataServiceTypes, Service, DataService };
