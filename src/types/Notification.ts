import { EventTypes } from '.';

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
