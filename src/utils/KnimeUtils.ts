import { generateRequestId, createJsonRpcRequest } from '.';
import * as KnimeConstants from '../constants';

export const KnimeUtils = {
    generateRequestId,
    createJsonRpcRequest,
    ...KnimeConstants
};
