import { JSON_RPC_VERSION } from 'src/constants';
import { ExtInfo, JSONRpcServices, ViewDataServiceMethods } from 'src/types';

// TODO: NXTEXT-80 add JSDoc comments
export class KnimeService<T = any> {
    extInfo: ExtInfo<T>;

    private jsonRpcSupported: boolean;

    private requestId: number;

    constructor(extInfo: ExtInfo = null) {
        this.extInfo = extInfo;

        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }

    // for now we only need any kind of id, not even unique, later will need unique ones
    private generateRequestId() {
        this.requestId += 1;

        return this.requestId;
    }

    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(service: JSONRpcServices, method: ViewDataServiceMethods, request = '') {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }

        const jsonRpcRequest = {
            jsonrpc: JSON_RPC_VERSION,
            service,
            params: [
                // TODO: NXTEXT-77 enable and check compatibility with backend implementation
                '', // this.extInfo.projectId,
                '', // this.extInfo.workflowId,
                '', // this.extInfo.nodeId,
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

        return Promise.reject(
            new Error(
                `Error code: ${error.code || 'UNKNOWN'}. Message: ${
                    error.message || 'not provided'
                }`
            )
        );
    }
}
