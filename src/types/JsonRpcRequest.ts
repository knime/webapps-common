export type JsonRpcRequest = {
    jsonrpc: string;
    method: any;
    params: string | string[];
    id: number;
};
