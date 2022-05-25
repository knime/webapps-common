import { ExtensionTypes } from "./types/ExtensionTypes";
import { NodeInfo } from "./NodeInfo-cf6372d2";
import { ResourceTypes } from "./types/ResourceTypes";
import { SelectionModes } from "./types/SelectionModes";
import { DataServiceTypes } from "./types/DataServiceTypes";
type FlowVariableSetting = {
    controllingFlowVariableAvailable: boolean;
    controllingFlowVariableName: string | null;
    exposedFlowVariableName: string | null;
    leaf?: boolean;
    [key: string]: FlowVariableSetting | boolean | string | null | undefined;
};
type FlowVariableSettings = {
    modelVariables: {
        [key: string]: FlowVariableSetting;
    };
    viewVariables: {
        [key: string]: FlowVariableSetting;
    };
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
 * @property {T} [initialSelection] - optional initial selection to provide directly to the UI Extension.
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
    initialSelection?: T;
    flowVariableSettings?: FlowVariableSettings;
};
type Notification = {
    params?: {
        projectId: string;
        workflowId: string;
        nodeId: string;
        mode: SelectionModes | string;
        selection?: string[];
    }[];
    type?: "ERROR" | "WARNING" | string;
    nodeInfo?: {
        nodeName: string;
        nodeAnnotation: string;
    };
    message?: string;
    [key: string]: any;
};
/**
 * Any node service request supported by that specific node service.
 */
type ServiceRequest = DataServiceTypes | SelectionModes;
type CallServiceResponse = {
    error: {
        code: string;
        message: string;
    };
    result?: any;
};
export { ExtensionConfig, Notification, ServiceRequest, CallServiceResponse, FlowVariableSetting, FlowVariableSettings };
export * from "./types/NodeServices";
export * from "./NodeInfo-cf6372d2";
export * from "./types/index";
export * from "./types/DataServiceTypes";
export * from "./types/SelectionModes";
export * from "./types/ExtensionTypes";
export * from "./types/EventTypes";
export * from "./types/ResourceTypes";
export * from "./CallableService-8f4e5800";
