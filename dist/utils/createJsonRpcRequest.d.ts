import { NodeService } from "../index-f7c46dc0";
type JsonRpcRequest = {
    jsonrpc: string;
    method: any;
    params: string | string[];
    id: number;
};
declare const createJsonRpcRequest: (method: NodeService | string, params?: any[]) => JsonRpcRequest;
export { createJsonRpcRequest };
