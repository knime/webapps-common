/**
 * Collection of RPC method signatures registered as node services with the framework. Each signature
 * targets specific workflow-level node service functionality for UI Extensions.
 */
declare enum NodeServiceMethods {
    CALL_NODE_DATA_SERVICE = "NodeService.callNodeDataService",
    CALL_NODE_SELECTION_SERVICE = "NodeService.updateDataPointSelection"
}
/**
 * Any RPC-compliant method signature which directly targets a node service of the application. Each signature
 * is in the format `<service>.<method name>` where the `<service>` (i.e. NodeService) is provided by the framework
 * and implements the `<method name>` (i.e. `callNodeDataService`) to call.
 */
type ServiceMethod = NodeServiceMethods | any;
export { NodeServiceMethods, ServiceMethod };
