'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var JSONRpcServices = require('../types/JSONRpcServices.js');
var DataServiceTypes = require('../types/DataServiceTypes.js');
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
        var _a;
        this.knimeService = knimeService;
        this.initialData = null;
        const initialData = ((_a = this.knimeService.extensionConfig) === null || _a === void 0 ? void 0 : _a.initialData) || null;
        if (initialData) {
            this.initialData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
        }
    }
    /**
     * Calls knimeService callService with defined service type CALL_NODE_DATA_SERVICE
     * @param {DataServiceTypes} serviceType one of available method names for CALL_NODE_DATA_SERVICE
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    callDataService(serviceType, request = '') {
        return this.knimeService.callService(JSONRpcServices.JSONRpcServices.CALL_NODE_DATA_SERVICE, serviceType, request);
    }
    /**
     * @returns {Promise} node initial data provided by knime service, or received with window.jsonrpc
     */
    getInitialData() {
        if (this.initialData) {
            return Promise.resolve(this.initialData);
        }
        return this.callDataService(DataServiceTypes.DataServiceTypes.INITIAL_DATA, '');
    }
    /**
     * @param {string} method name of method that should be called
     * @param {any} params that should be passed to called method
     * @returns {Promise} resolve value depends on called method
     */
    getDataByMethodName(method, ...params) {
        // @TODO: NXT-737 handle errors
        return this.callDataService(DataServiceTypes.DataServiceTypes.DATA, createJsonRpcRequest.createJsonRpcRequest(method, params));
    }
    // TODO this is just a temporary short-cut - see NXT-761
    getData(...params) {
        return this.getDataByMethodName('getData', ...params);
    }
    registerGetDataToApply(callback) {
        this.knimeService.registerGetDataToApply(() => JSON.stringify(callback()));
    }
    // TODO: NXTEXT-77 implement apply data
    applyData( /* data */) {
        return this.callDataService(DataServiceTypes.DataServiceTypes.APPLY_DATA, '');
    }
}

exports.JSONDataService = JSONDataService;
