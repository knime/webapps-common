'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Collection of node service method signatures registered as RPC services with the framework. Each signature
 * targets specific workflow-level RPC node service functionality for UI Extensions.
 */
exports.NodeServiceTypes = void 0;
(function (NodeServiceTypes) {
    // Data service method signature.
    NodeServiceTypes["CALL_NODE_DATA_SERVICE"] = "NodeService.callNodeDataService";
    // TODO: NXT-722 provide updated RPC method name.
    // Selection service method signature.
    // CALL_UPDATE_DATA_POINT_SELECTION = 'NodeService.selectDataPoints'
})(exports.NodeServiceTypes || (exports.NodeServiceTypes = {}));
