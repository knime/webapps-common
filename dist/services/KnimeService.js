'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

// @TODO: NXTEXT-80 add JSDoc comments
class KnimeService {
    constructor(extInfo = null) {
        this.extInfo = extInfo;
        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }
    // @TODO: add request types w/ DataService type/interface when request types defined
    // for now it should be a string
    callService(method, serviceMethod, request = '') {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }
        const jsonRpcRequest = createJsonRpcRequest.createJsonRpcRequest(method, [
            '',
            '',
            '',
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
        return Promise.resolve(this.registeredGetDataToApply ? this.registeredGetDataToApply() : null);
    }
}

exports.KnimeService = KnimeService;
