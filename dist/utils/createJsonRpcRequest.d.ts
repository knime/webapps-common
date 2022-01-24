import { ServiceMethod } from "../index-692f6f4e";
type JsonRpcRequest = {
    jsonrpc: string;
    method: any;
    params: string | string[];
    id: number;
};
declare const createJsonRpcRequest: (method: ServiceMethod | string, params?: any[]) => JsonRpcRequest;
export { createJsonRpcRequest };
