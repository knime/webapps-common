/**
 * @property {string} [nodeAnnotation] - the optional annotation associated with the node.
 * @property {string} nodeState - the current state of the node.
 * @property {string} [nodeErrorMessage] - the optional error message associated with a node in the failed state.
 * @property {string} [nodeWarnMessage] - the optional warning message associated with a node in the failed state.
 * @property {string} nodeName - the human-readable node name as it's registered with the node description.
 */
type NodeInfo = {
    nodeAnnotation?: string;
    nodeState: string;
    nodeErrorMessage?: string;
    nodeWarnMessage?: string;
    nodeName: string;
};
/**
 * Enum for extension resource types.
 * @readonly
 * @enum {string}
 */
declare const enum ResourceType {
    /** Indicates the resource should be loaded as a complete HTML page. */
    HTML = "HTML",
    /** Indicates the resource is a Vue component and should be treated as a library. */
    VUE_COMPONENT_LIB = "VUE_COMPONENT_LIB"
}
type ResourceTypeString = keyof typeof ResourceType;
/**
 * @property {string} id - unique identifier based on the factory class of the node.
 * @property {ResourceType} type - the resource type associated with the extension.
 * @property {string} [path] - the optional relative path of the resource (for remote resources).
 * @property {string} [url] - the optional absolute url of the resource (for local resources).
 */
type ResourceInfo = {
    id: string;
    type: ResourceTypeString;
    path?: string;
    url?: string;
};
// TODO: NXTEXT-80 add JSDoc comments
type ExtensionConfig<T = any> = {
    nodeId: string;
    projectId: string;
    workflowId: string;
    resourceInfo: ResourceInfo;
    nodeInfo: NodeInfo;
    initialData?: T;
};
export { ExtensionConfig };
export * from "./types/JSONRpcServices";
export * from "./types/ViewDataServiceMethods";
