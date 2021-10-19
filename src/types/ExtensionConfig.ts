import { NodeInfo } from './NodeInfo';
import { ResourceInfo } from './ResourceInfo';

// TODO: NXTEXT-80 add JSDoc comments
export type ExtensionConfig<T = any> = {
    nodeId: string;
    projectId: string;
    workflowId: string;
    resourceInfo: ResourceInfo;
    nodeInfo: NodeInfo;
    initialData?: T;
};
