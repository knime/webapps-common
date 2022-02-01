import { NodeService } from "../index-b5c74bb8";
type JsonRpcRequest = {
    jsonrpc: string;
    method: any;
    params: string | string[];
    id: number;
};
declare const createJsonRpcRequest: (method: NodeService | string, params?: any[]) => JsonRpcRequest;
export { createJsonRpcRequest };
