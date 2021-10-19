'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var JSONRpcServices = require('../types/JSONRpcServices.js');
require('../types/ViewDataServiceMethods.js');
var SelectionServiceMethods = require('../types/SelectionServiceMethods.js');

class SelectionService {
    constructor(knimeService) {
        this.knimeService = knimeService;
    }
    callSelectionService(serviceType, request) {
        return this.knimeService.callService(JSONRpcServices.JSONRpcServices.CALL_NODE_SELECT_DATA_POINTS, serviceType, request);
    }
    add(keys) {
        return this.callSelectionService(SelectionServiceMethods.SelectionServiceMethods.ADD, keys);
    }
    remove(keys) {
        return this.callSelectionService(SelectionServiceMethods.SelectionServiceMethods.REMOVE, keys);
    }
    replace(keys) {
        return this.callSelectionService(SelectionServiceMethods.SelectionServiceMethods.REPLACE, keys);
    }
    /**
     * @param {function} callback - will be called by backend when data selection happens
     * @param {Object} jsonRpcResponse - jsonrpc object signature callback will be called with
     * @param {string} jsonRpcResponse.jsonrpc - version of jsonrpc
     * @param {string} jsonRpcResponse.method - selection event name that triggered on backend
     * @param {Object} jsonRpcResponse.params - parameters method called with
     * @returns {any}
     */
    // eslint-disable-next-line class-methods-use-this
    registerOnSelectionChangeCallback(callback) {
        window.jsonrpcNotification = callback;
    }
}

exports.SelectionService = SelectionService;
