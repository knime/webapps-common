import { JSON_RPC_VERSION } from 'src/constants';
import { JSONRpcServices } from 'src/types';
import { generateRequestId } from './generateRequestId';

export const createJsonRpcRequest = (
    method: JSONRpcServices | string,
    params = [],
) =>
    JSON.stringify({
        jsonrpc: JSON_RPC_VERSION,
        method,
        params,
        id: generateRequestId(),
    });
