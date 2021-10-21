'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var NodeServices = require('../types/NodeServices.js');
var DataServices = require('../types/DataServices.js');
require('../types/ExtensionTypes.js');
var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

/**
 * Class represents JSONDataService used to fetch data with window.jsonrpc provided by backend in json format
 */
class JSONDataService {
    /**
     * @param {KnimeService} knimeService knimeService instance, used to provide initialData && callService functionality
     */
    constructor(knimeService) {
        this.knimeService = knimeService;
    }
    /**
     * Calls knimeService callService with defined service type CALL_NODE_DATA_SERVICE
     * @param {DataServiceTypes} serviceType one of available method names for CALL_NODE_DATA_SERVICE
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    callDataService(serviceType, request = '') {
        return this.knimeService.callService(NodeServices.RPCNodeServices.CALL_NODE_DATA_SERVICE, serviceType, request);
    }
    /**
     * @returns {Promise} node initial data provided by knime service, or received with window.jsonrpc
     */
    getInitialData() {
        var _a;
        if ((_a = this.knimeService.extensionConfig) === null || _a === void 0 ? void 0 : _a.initialData) {
            return Promise.resolve(this.knimeService.extensionConfig.initialData);
        }
        return this.callDataService(DataServices.DataServices.INITIAL_DATA);
    }
    /**
     * @param {string} method name of method that should be called
     * @param {any} params that should be passed to called method
     * @returns {Promise} resolve value depends on called method
     */
    getData(method, ...params) {
        return this.callDataService(DataServices.DataServices.DATA, createJsonRpcRequest.createJsonRpcRequest(method, params));
    }
    async applyData() {
        const data = await this.knimeService.getData();
        return this.callDataService(DataServices.DataServices.APPLY_DATA, JSON.stringify(data));
    }
    // should be promise
    registerDataGetter(callback) {
        this.knimeService.registerDataGetter(() => JSON.stringify(callback()));
    }
}

exports.JSONDataService = JSONDataService;
