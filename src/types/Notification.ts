import { EventTypes } from '.';

export type Notification = {
    jsonrpc: string;
    method: EventTypes;
    params: {
        projectId: string;
        workflowId: string;
        nodeId: string;
        mode: string;
    }[];
    [key: string]: any;
};
