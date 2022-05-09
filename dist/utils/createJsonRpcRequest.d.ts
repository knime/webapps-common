import { NodeService } from "../index-92dc325b";
type JsonRpcRequest = {
    jsonrpc: string;
    method: any;
    params: string | string[];
    id: number;
};
declare const createJsonRpcRequest: (method: NodeService | string, params?: any[]) => JsonRpcRequest;
export { createJsonRpcRequest };
