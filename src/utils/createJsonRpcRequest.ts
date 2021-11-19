import { JSON_RPC_VERSION } from 'src/constants';
import { ServiceMethod } from 'src/types';
import { generateRequestId } from './generateRequestId';

export const createJsonRpcRequest = (method: ServiceMethod | string, params = []) => ({
    jsonrpc: JSON_RPC_VERSION,
    method,
    params,
    id: generateRequestId(),
});
