/**
 * Data service service-types available by default to UI Extension nodes.
 *
 * @enum {string}
 */
declare enum DataServiceTypes {
    INITIAL_DATA = "initial_data",
    DATA = "data",
    APPLY_DATA = "apply_data"
}
type DataServiceType = DataServiceTypes;
export { DataServiceTypes, DataServiceType };
