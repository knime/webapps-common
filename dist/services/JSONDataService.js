'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var JSONRpcServices = require('../types/JSONRpcServices.js');
var ViewDataServiceMethods = require('../types/ViewDataServiceMethods.js');
require('../types/SelectionServiceMethods.js');
var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

// TODO: NXTEXT-80 add JSDoc comments
class JSONDataService {
    constructor(knimeService) {
        var _a;
        this.knimeService = knimeService;
        this.initialData = null;
        const initialData = ((_a = this.knimeService.extensionConfig) === null || _a === void 0 ? void 0 : _a.initialData) || null;
        if (initialData) {
            this.initialData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
        }
    }
    callDataService(serviceType, request = '') {
        return this.knimeService.callService(JSONRpcServices.JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE, serviceType, request);
    }
    getInitialData() {
        if (this.initialData) {
            return Promise.resolve(this.initialData);
        }
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.INITIAL_DATA, '');
    }
    getDataByMethodName(method, ...params) {
        // TODO: NXT-737 handle errors
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.DATA, createJsonRpcRequest.createJsonRpcRequest(method, params));
    }
    // TODO this is just a temporary short-cut - see NXT-761
    getData(...params) {
        return this.getDataByMethodName('getData', ...params);
    }
    // TODO: NXTEXT-77 implement apply data
    applyData( /* data */) {
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.APPLY_DATA, '');
    }
}

exports.JSONDataService = JSONDataService;
