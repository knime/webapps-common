import { SelectionModes } from './SelectionModes';

export type Notification = {
    params?: {
        projectId: string;
        workflowId: string;
        nodeId: string;
        mode: SelectionModes | string;
        keys?: string[];
    }[];
    type?: 'ERROR' | 'WARNING' | string;
    nodeInfo?: {
        nodeName: string;
        nodeAnnotation: string;
    };
    message?: string;
    [key: string]: any;
};
