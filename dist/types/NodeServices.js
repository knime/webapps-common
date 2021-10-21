'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Services registered for UI Extensions when running locally in the KNIME Analytics Platform. Members reference
 * top-level RPC signatures exposed by the framework/API.
 *
 * @enum
 */
exports.RPCNodeServices = void 0;
(function (RPCNodeServices) {
    // Node-specific data services.
    RPCNodeServices["CALL_NODE_DATA_SERVICE"] = "NodeService.callNodeDataService";
    // TODO: NXT-722 provide updated RPC method name.
    // Component/Workflow level service for updating selected points.
    // CALL_UPDATE_DATA_POINT_SELECTION = 'NodeService.selectDataPoints'
})(exports.RPCNodeServices || (exports.RPCNodeServices = {}));
