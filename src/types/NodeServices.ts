/**
 * Collection of RPC method signatures registered as node services with the framework. Each signature
 * targets specific workflow-level node service functionality for UI Extensions.
 */
export enum NodeServices {
    // Data service method signature.
    CALL_NODE_DATA_SERVICE = 'NodeService.callNodeDataService',
    // Selection service method signature.
    CALL_NODE_SELECTION_SERVICE = 'NodeService.updateDataPointSelection',
}

/**
 * Any RPC-compliant method signature which directly targets a node service of the application. Each signature
 * is in the format `<service>.<method name>` where the `<service>` (i.e. NodeService) is provided by the framework
 * and implements the `<method name>` (i.e. `callNodeDataService`) to call.
 */
export type NodeService = NodeServices | any;
