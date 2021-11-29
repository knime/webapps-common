/**
 * Collection of node service method signatures registered as RPC services with the framework. Each signature
 * targets specific workflow-level RPC node service functionality for UI Extensions.
 */
var NodeServiceMethods;
(function (NodeServiceMethods) {
    // Data service method signature.
    NodeServiceMethods["CALL_NODE_DATA_SERVICE"] = "NodeService.callNodeDataService";
    // Selection service method signature.
    NodeServiceMethods["CALL_NODE_SELECTION_SERVICE"] = "NodeService.updateDataPointSelection";
})(NodeServiceMethods || (NodeServiceMethods = {}));

export { NodeServiceMethods };
