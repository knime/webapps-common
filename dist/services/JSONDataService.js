'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var JSONRpcServices = require('../types/JSONRpcServices.js');
var ViewDataServiceMethods = require('../types/ViewDataServiceMethods.js');

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
        // @TODO: if (this.extInfo.hasInitData) {
        // @TODO: how we should prioritize data sources?
        if (this.initData) {
            return Promise.resolve(this.initData);
        }
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.INITIAL_DATA, '');
    }
    getData() {
        // @TODO: what kind of error handling we suppose here?
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.DATA, '');
    }
    // @TODO: should receive some kind of data, stringifyed JSON?
    applyData( /* data */) {
        return this.callDataService(ViewDataServiceMethods.ViewDataServiceMethods.APPLY_DATA, '');
    }
}

exports.JSONDataService = JSONDataService;
