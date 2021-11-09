import { ExtensionTypes } from "./types/ExtensionTypes";
import { ResourceTypes } from "./types/ResourceTypes";
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
 * @property {string} id - unique identifier based on the factory class of the node.
 * @property {ResourceTypes} type - the resource type associated with the extension.
 * @property {string} [path] - the optional relative path of the resource (for remote resources).
 * @property {string} [url] - the optional absolute url of the resource (for local resources).
 */
type ResourceInfo = {
    id: string;
    type: ResourceTypes;
    path?: string;
    url?: string;
};
/**
 * The base configuration of any UI Extension which contains all of the relevant information about the UI Extension
 * node it references. This information allows the framework to coordinate communication between the frontend
 * application and the target node in the workflow.
 *
 * Optionally, it may also contain the initial data to provide directly to the client-side UI Extension implementation.
 *
 * @property {string} nodeId - the id of the node in the workflow.
 * @property {string} projectId - the project id of the workflow.
 * @property {string} workflowId - the workflow id.
 * @property {ResourceInfo} resourceInfo - information regarding the client-side resources for this extension.
 * @property {NodeInfo} nodeInfo - additional information regarding the node itself.
 * @property {ExtensionTypes} extensionType - the type of the extension (effects the api behavior).
 * @property {T} [initialData] - optional initial data to provide directly to the UI Extension.
 * @template T
 */
type ExtensionConfig<T = any> = {
    nodeId: string;
    projectId: string;
    workflowId: string;
    resourceInfo: ResourceInfo;
    nodeInfo: NodeInfo;
    extensionType: ExtensionTypes;
    initialData?: T;
};
type Notification = {
    jsonrpc: string;
    method: string;
    params: {
        projectId: string;
        workflowId: string;
        nodeId: string;
        mode: string;
    }[];
    [key: string]: any;
};
type JsonRpcResponse = {
    error: {
        code: string;
        message: string;
    };
    result: string;
};
type JsonRpcRequest = {
    jsonrpc: string;
    method: any;
    params: string | string[];
    id: number;
};
export { ExtensionConfig, Notification, JsonRpcResponse, JsonRpcRequest };
export * from "./types/ServiceMethods";
export * from "./types/ServiceTypes";
export * from "./types/ExtensionTypes";
export * from "./types/ResourceTypes";
