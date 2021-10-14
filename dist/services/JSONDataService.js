'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var JSONRpcServices = require('../types/JSONRpcServices.js');
var ViewDataServiceMethods = require('../types/ViewDataServiceMethods.js');
var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

// @TODO: NXTEXT-80 add JSDoc comments
class JSONDataService {
    constructor(knimeService) {
        var _a;
        this.knimeService = knimeService;
        this.initData = null;
        const initData = ((_a = this.knimeService.extInfo) === null || _a === void 0 ? void 0 : _a.initData) || null;
        if (initData) {
            this.initData = typeof initData === 'string' ? JSON.parse(initData) : initData;
        }
    }
    callDataService(serviceType, request = '') {
        return this.knimeService.callService(JSONRpcServices.JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE, serviceType, request);
    }
    getInitialData() {
        if (this.initData) {
            return Promise.resolve(this.initData);
        }
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.INITIAL_DATA, '');
    }
    getDataByMethodName(method, ...params) {
        // @TODO: NXT-737 handle errors
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.DATA, createJsonRpcRequest.createJsonRpcRequest(method, params));
    }
    getData(...params) {
        return this.getDataByMethodName('getData', ...params);
    }
    registerGetDataToApply(callback) {
        this.knimeService.registerGetDataToApply(() => JSON.stringify(callback()));
    }
}

exports.JSONDataService = JSONDataService;
