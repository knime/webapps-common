/**
 * Collection of node service method signatures registered as RPC services with the framework. Each signature
 * targets specific workflow-level RPC node service functionality for UI Extensions.
 */
declare enum NodeServiceMethods {
    CALL_NODE_DATA_SERVICE = "NodeService.callNodeDataService",
    CALL_NODE_SELECTION_SERVICE = "NodeService.updateDataPointSelection"
}
/**
 * Any method signature which directly targets an RPC Service by the application. Each signature is in the format
 * `<service>.<method name>` where the `<service>` (i.e. NodeService) is provided by the framework  and implements
 * the `<method name>` (i.e. `callNodeDataService`) to call.
 */
type ServiceMethod = NodeServiceMethods | any;
export { NodeServiceMethods, ServiceMethod };
