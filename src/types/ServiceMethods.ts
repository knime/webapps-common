/**
 * Collection of known Service method signatures registered as RPC services with the framework. Each signature
 * targets specific functionality of node-level UI Extension Services. These method signatures correspond to
 * top-level RPC methods registered within the framework.
 */
export enum ServiceMethodTypes {
    // Node-specific data services.
    CALL_NODE_DATA_SERVICE = 'NodeService.callNodeDataService',
    // TODO: NXT-722 provide updated RPC method name.
    // Component/Workflow level service for updating selected points.
    // CALL_UPDATE_DATA_POINT_SELECTION = 'NodeService.selectDataPoints'
}

/**
 * Any method signature which directly targets a UI Extension Service implemented by the current workflow.
 */
export type ServiceMethod = ServiceMethodTypes;
