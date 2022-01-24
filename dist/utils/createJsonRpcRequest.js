import { generateRequestId } from './generateRequestId.js';

const JSON_RPC_VERSION = '2.0';
const createJsonRpcRequest = (method, params = []) => ({
    jsonrpc: JSON_RPC_VERSION,
    method,
    params,
    id: generateRequestId()
});

export { createJsonRpcRequest };
