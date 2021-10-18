'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

// TODO: NXTEXT-80 add JSDoc comments
class KnimeService {
    constructor(extensionConfig = null) {
        this.extensionConfig = extensionConfig;
        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(method, serviceType, request = '') {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }
        const jsonRpcRequest = createJsonRpcRequest.createJsonRpcRequest(method, [
            this.extensionConfig.projectId,
            this.extensionConfig.workflowId,
            this.extensionConfig.nodeId,
            this.extensionConfig.extensionType,
            serviceType,
            request
        ]);
        const requestResult = JSON.parse(window.jsonrpc(jsonRpcRequest));
        const { result, error = {} } = requestResult;
        if (result) {
            return Promise.resolve(JSON.parse(result));
        }
        return Promise.reject(new Error(`Error code: ${error.code || 'UNKNOWN'}. Message: ${error.message || 'not provided'}`));
    }
}

exports.KnimeService = KnimeService;
