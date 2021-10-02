'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class KnimeService {
    constructor(extInfo) {
        this.extInfo = extInfo;
    }
}
/*

// move to static method
const callDataService = async (serviceType, request) => {
    if (this.jsonrpcSupported) {
        let jsonRpcRequest = {
            jsonrpc: '2.0',
            method: 'NodeService.callNodeViewDataService',
            params: [this.extInfo.projectId, this.extInfo.workflowId, this.extInfo.nodeId, serviceType, request],
            id: this.requestId++;
        };
        return Promise.resolve(window.jsonrpc(JSON.stringify(jsonRpcRequest)));
    }
}

export class KnimeService {
    constructor(extInfo) {
        this.extInfo = extInfo;
        this.requestId = 0;

        // TODO check for window.jsonrpc here
        if (window.jsonrpc) {
            this.jsonrpcSupported = true;
        } else {
            throw new Error(`current environment doesn't support window.jsonrpc()`);
        }

    }

    getInitialData() { // private
        // TODO if (this.knimeService.extInfo.hasInitData) {
        if (this.extInfo.initData) {
            return Promise.resolve(this.initData);
        } else {
            return callDataService('initial_data');
        }
     }

    getData(request) { // private
       return callDataService('data', request);
    }

    applyData(request) { // private
        return callDataService('apply_data', request);
    }

}
 */

exports.KnimeService = KnimeService;
