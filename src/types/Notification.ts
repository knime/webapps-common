export type Notification = {
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
