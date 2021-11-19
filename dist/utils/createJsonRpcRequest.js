import { JSON_RPC_VERSION } from '../constants/index.js';
import { generateRequestId } from './generateRequestId.js';

const createJsonRpcRequest = (method, params = []) => ({
    jsonrpc: JSON_RPC_VERSION,
    method,
    params,
    id: generateRequestId(),
});

export { createJsonRpcRequest };
