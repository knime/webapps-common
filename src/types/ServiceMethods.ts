/**
 * Collection of node service method signatures registered as RPC services with the framework. Each signature
 * targets specific workflow-level RPC node service functionality for UI Extensions.
 */
export enum NodeServiceTypes {
    // Data service method signature.
    CALL_NODE_DATA_SERVICE = 'NodeService.callNodeDataService',
    // TODO: NXT-722 provide updated RPC method name.
    // Selection service method signature.
    // CALL_UPDATE_DATA_POINT_SELECTION = 'NodeService.selectDataPoints'
}

/**
 * Any method signature which directly targets an RPC Service by the application. Each signature is in the format
 * `<service>.<method name>` where the `<service>` (i.e. NodeService) is provided by the framework  and implements
 * the `<method name>` (i.e. `callNodeDataService`) to call.
 */
export type ServiceMethod = NodeServiceTypes | any;
