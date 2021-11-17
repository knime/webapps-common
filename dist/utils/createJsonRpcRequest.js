'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('../constants/index.js');
var generateRequestId = require('./generateRequestId.js');

const createJsonRpcRequest = (method, params = []) => JSON.stringify({
    jsonrpc: index.JSON_RPC_VERSION,
    method,
    params,
    id: generateRequestId.generateRequestId()
});

exports.createJsonRpcRequest = createJsonRpcRequest;
