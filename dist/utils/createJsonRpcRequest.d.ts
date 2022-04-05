import { NodeService } from "../index-b3e43760";
type JsonRpcRequest = {
    jsonrpc: string;
    method: any;
    params: string | string[];
    id: number;
};
declare const createJsonRpcRequest: (method: NodeService | string, params?: any[]) => JsonRpcRequest;
export { createJsonRpcRequest };
