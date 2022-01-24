export type Notification = {
    params?: {
        projectId: string;
        workflowId: string;
        nodeId: string;
        mode: string;
        keys?: string[];
    }[];
    [key: string]: any;
};
