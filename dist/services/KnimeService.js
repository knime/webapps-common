'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

// @TODO: NXTEXT-80 add JSDoc comments
class KnimeService {
    constructor(extensionConfig = null) {
        this.extensionConfig = extensionConfig;
        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }
    // @TODO: add request types w/ DataService type/interface when request types defined
    // for now it should be a string
    callService(method, serviceMethod, request = '') {
        var _a, _b, _c;
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }
        const jsonRpcRequest = createJsonRpcRequest.createJsonRpcRequest(method, [
            (_a = this.extensionConfig) === null || _a === void 0 ? void 0 : _a.projectId,
            (_b = this.extensionConfig) === null || _b === void 0 ? void 0 : _b.workflowId,
            (_c = this.extensionConfig) === null || _c === void 0 ? void 0 : _c.nodeId,
            serviceMethod,
            request
        ]);
        const requestResult = JSON.parse(window.jsonrpc(jsonRpcRequest));
        const { result, error = {} } = requestResult;
        if (result) {
            return Promise.resolve(JSON.parse(result));
        }
        return Promise.reject(new Error(`Error code: ${error.code || 'UNKNOWN'}. Message: ${error.message || 'not provided'}`));
    }
    registerGetDataToApply(callback) {
        this.registeredGetDataToApply = callback;
    }
    getDataToApply() {
        return Promise.resolve(typeof this.registeredGetDataToApply === 'function'
            ? this.registeredGetDataToApply()
            : null);
    }
}

exports.KnimeService = KnimeService;
