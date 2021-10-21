import { JSON_RPC_VERSION } from 'src/constants';
import { RPCNodeServices } from 'src/types';
import { generateRequestId } from './generateRequestId';

export const createJsonRpcRequest = (
    method: RPCNodeServices | string,
    params = []
) => JSON.stringify({
    jsonrpc: JSON_RPC_VERSION,
    method,
    params,
    id: generateRequestId()
});
