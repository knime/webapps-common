import { generateRequestId } from './generateRequestId.js';
import { createJsonRpcRequest } from './createJsonRpcRequest.js';
import * as index from '../constants/index.js';

const KnimeUtils = Object.assign({ generateRequestId,
    createJsonRpcRequest }, index);

export { KnimeUtils };
