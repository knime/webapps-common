import { ExtInfo, JSONRpcServices, ViewDataServiceMethods } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';

// @TODO: NXTEXT-80 add JSDoc comments
export class KnimeService<T = any> {
    extInfo: ExtInfo<T>;

    private jsonRpcSupported: boolean;

    private registeredGetDataToApply: () => any;

    constructor(extInfo: ExtInfo = null) {
        this.extInfo = extInfo;

        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }

    // @TODO: add request types w/ DataService type/interface when request types defined
    // for now it should be a string
    callService(method: JSONRpcServices, serviceMethod: ViewDataServiceMethods, request = '') {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }

        const jsonRpcRequest = createJsonRpcRequest(method, [
            '', // this.extInfo.projectId,
            '', // this.extInfo.workflowId,
            '', // this.extInfo.nodeId,
            serviceMethod,
            request
        ]);

        const requestResult = JSON.parse(window.jsonrpc(jsonRpcRequest));

        const { result, error = {} } = requestResult;

        if (result) {
            return Promise.resolve(JSON.parse(result));
        }

        return Promise.reject(
            new Error(
                `Error code: ${error.code || 'UNKNOWN'}. Message: ${
                    error.message || 'not provided'
                }`
            )
        );
    }

    registerGetDataToApply(callback: () => any) {
        this.registeredGetDataToApply = callback;
    }

    getDataToApply() {
        return Promise.resolve(
            typeof this.registeredGetDataToApply === 'function'
                ? this.registeredGetDataToApply()
                : null
        );
    }
}
