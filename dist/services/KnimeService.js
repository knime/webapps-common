'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index = require('../constants/index.js');

// TODO: NXTEXT-80 add JSDoc comments
class KnimeService {
    constructor(extInfo = null) {
        this.extInfo = extInfo;
        this.requestId = 0;
        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }
    // for now we only need any kind of id, not even unique, later will need unique ones
    generateRequestId() {
        this.requestId += 1;
        return this.requestId;
    }
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(service, method, request = '') {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }
        const jsonRpcRequest = {
            jsonrpc: index.JSON_RPC_VERSION,
            method: service,
            params: [
                // TODO: NXTEXT-77 enable and check compatibility with backend implementation
                '',
                '',
                '',
                method,
                request
            ],
            id: this.generateRequestId()
        };
        const requestResult = JSON.parse(window.jsonrpc(JSON.stringify(jsonRpcRequest)));
        const { result, error = {} } = requestResult;
        if (result) {
            return Promise.resolve(JSON.parse(result));
        }
        return Promise.reject(new Error(`Error code: ${error.code || 'UNKNOWN'}. Message: ${error.message || 'not provided'}`));
    }
}

exports.KnimeService = KnimeService;
