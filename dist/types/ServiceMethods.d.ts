/**
 * Collection of known Service method signatures registered as RPC services with the framework. Each signature
 * targets specific functionality of node-level UI Extension Services. These method signatures correspond to
 * top-level RPC methods registered within the framework.
 */
declare enum ServiceMethodTypes {
    CALL_NODE_DATA_SERVICE = "NodeService.callNodeDataService"
}
/**
 * Any method signature which directly targets a UI Extension Service implemented by the current workflow.
 */
type ServiceMethod = ServiceMethodTypes;
export { ServiceMethodTypes, ServiceMethod };
