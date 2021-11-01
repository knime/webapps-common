'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Selection service types for the `NodeService.selectDataPoints` method.
 *
 * @enum {string}
 */
exports.SelectionServiceTypes = void 0;
(function (SelectionServiceTypes) {
    SelectionServiceTypes["ADD"] = "ADD";
    SelectionServiceTypes["REMOVE"] = "REMOVE";
    SelectionServiceTypes["REPLACE"] = "REPLACE";
})(exports.SelectionServiceTypes || (exports.SelectionServiceTypes = {}));
/**
 * Service types for DataServices implemented by a specific UI Extension node.
 *
 * @enum {string}
 *
 * TODO: NXT-761 convert to interfaces which are then members of the <Type>DataService implementations.
 */
exports.DataServiceTypes = void 0;
(function (DataServiceTypes) {
    // Returns the initial data as provided by the node implementation. Requires no parameters.
    DataServiceTypes["INITIAL_DATA"] = "initial_data";
    // Expects request to be valid RPC format to retrieve data from the referenced data service method.
    DataServiceTypes["DATA"] = "data";
    // Expects request body to contain the update data to apply/persist/update depending on node implementation.
    DataServiceTypes["APPLY_DATA"] = "apply_data";
})(exports.DataServiceTypes || (exports.DataServiceTypes = {}));
