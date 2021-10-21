'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Collection of known Service method signatures registered as RPC services with the framework. Each signature
 * targets specific functionality of node-level UI Extension Services. These method signatures correspond to
 * top-level RPC methods registered within the framework.
 */
exports.ServiceMethodTypes = void 0;
(function (ServiceMethodTypes) {
    // Node-specific data services.
    ServiceMethodTypes["CALL_NODE_DATA_SERVICE"] = "NodeService.callNodeDataService";
    // TODO: NXT-722 provide updated RPC method name.
    // Component/Workflow level service for updating selected points.
    // CALL_UPDATE_DATA_POINT_SELECTION = 'NodeService.selectDataPoints'
})(exports.ServiceMethodTypes || (exports.ServiceMethodTypes = {}));
