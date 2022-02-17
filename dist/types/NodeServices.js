/**
 * Collection of RPC method signatures registered as node services with the framework. Each signature
 * targets specific workflow-level node service functionality for UI Extensions.
 */
var NodeServices;
(function (NodeServices) {
    // Data service method signature.
    NodeServices["CALL_NODE_DATA_SERVICE"] = "NodeService.callNodeDataService";
    // Selection service method signature.
    NodeServices["CALL_NODE_SELECTION_SERVICE"] = "NodeService.updateDataPointSelection";
})(NodeServices || (NodeServices = {}));

export { NodeServices };
