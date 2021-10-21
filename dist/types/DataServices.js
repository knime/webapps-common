'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Service type for node-level data services. Other, custom services may be implemented, but those known by the
 * framework are listed here.
 *
 * @enum {string}
 *
 * TODO: NXT-761 convert to interfaces which are then members of the <Type>DataService implementations.
 */
exports.DataServices = void 0;
(function (DataServices) {
    // Returns the initial data as provided by the node implementation. Requires no parameters.
    DataServices["INITIAL_DATA"] = "initial_data";
    // Expects request to be valid RPC format to retrieve data from the referenced data service method.
    DataServices["DATA"] = "data";
    // Expects request body to contain the update data to apply/persist/update depending on node implementation.
    DataServices["APPLY_DATA"] = "apply_data";
})(exports.DataServices || (exports.DataServices = {}));
