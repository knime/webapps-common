'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

/** Class represents KnimeService  */
class KnimeService {
    /**
     * @param {Object} extensionConfig required param that used to provide basic configuration for
     * KnimeService. While using Typescript can be called with generic type so it will type initialData
     * filed of ExtensionConfig
     */
    constructor(extensionConfig = null) {
        this.extensionConfig = extensionConfig;
        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }
    /**
     * Generic method to call jsonrpc
     * @param {string} method jsonrpc service name
     * @param {string} serviceType exact method of jsonrpc service
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    callService(method, serviceType, request) {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }
        const jsonRpcRequest = createJsonRpcRequest.createJsonRpcRequest(method, [
            this.extensionConfig.projectId,
            this.extensionConfig.workflowId,
            this.extensionConfig.nodeId,
            this.extensionConfig.extensionType,
            serviceType,
            request || ''
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
