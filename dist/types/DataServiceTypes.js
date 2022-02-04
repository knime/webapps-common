/**
 * Data service service-types available by default to UI Extension nodes.
 *
 * @enum {string}
 */
var DataServiceTypes;
(function (DataServiceTypes) {
    // Returns the initial data as provided by the node implementation. Requires no parameters.
    DataServiceTypes["INITIAL_DATA"] = "initial_data";
    // Expects request to provide correct method parameters to retrieve data from the referenced data service method.
    DataServiceTypes["DATA"] = "data";
    // Expects request body to contain the update data to apply/persist/update depending on node implementation.
    DataServiceTypes["APPLY_DATA"] = "apply_data";
})(DataServiceTypes || (DataServiceTypes = {}));

export { DataServiceTypes };
