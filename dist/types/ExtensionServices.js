/**
 * Selection services available by default to UI Extension nodes.
 *
 * @enum {string}
 */
var SelectionServices;
(function (SelectionServices) {
    SelectionServices["ADD"] = "ADD";
    SelectionServices["REMOVE"] = "REMOVE";
    SelectionServices["REPLACE"] = "REPLACE";
})(SelectionServices || (SelectionServices = {}));
/**
 * Data services available by default to UI Extension nodes.
 *
 * @enum {string}
 */
var DataServices;
(function (DataServices) {
    // Returns the initial data as provided by the node implementation. Requires no parameters.
    DataServices["INITIAL_DATA"] = "initial_data";
    // Expects request to provide correct method parameters to retrieve data from the referenced data service method.
    DataServices["DATA"] = "data";
    // Expects request body to contain the update data to apply/persist/update depending on node implementation.
    DataServices["APPLY_DATA"] = "apply_data";
})(DataServices || (DataServices = {}));

export { DataServices, SelectionServices };
