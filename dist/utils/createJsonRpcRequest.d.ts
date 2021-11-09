import { ServiceMethod } from "../index-af6571f7";
declare const createJsonRpcRequest: (method: ServiceMethod | string, params?: any[]) => {
    jsonrpc: string;
    method: any;
    params: any[];
    id: number;
};
export { createJsonRpcRequest };
