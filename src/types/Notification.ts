import { EventTypes } from './EventTypes';

export type Notification = {
    method: EventTypes;
    jsonrpc?: string;
    params?: {
        projectId: string;
        workflowId: string;
        nodeId: string;
        mode: string;
        keys?: string[];
    }[];
    [key: string]: any;
};
