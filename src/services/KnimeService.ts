import { JSON_RPC_VERSION } from 'src/constants';
import { ExtInfo } from 'src/types/ExtInfo';
import { JSONRpcMethods } from 'src/types/JSONRpcMethods';
import { ServiceTypes } from 'src/types/serviceTypes';

export class KnimeService<T = any> {
    extInfo: ExtInfo<T>;

    private jsonRpcSupported: boolean;

    private requestId: number;

    constructor(extInfo) {
        this.extInfo = extInfo;

        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }

    // for now we only need any kind of id, not even unique, later will need unique ones
    private generateRequestId() {
        this.requestId += 1;

        return this.requestId;
    }

    callService(method: JSONRpcMethods, serviceType: ServiceTypes, request = '') {
        if (!this.jsonRpcSupported) {
            throw new Error(`current environment doesn't support window.jsonrpc()`);
        }

        const jsonRpcRequest = {
            jsonrpc: JSON_RPC_VERSION,
            method,
            params: [
                // @TODO: awaits backend implementation
                '', // this.extInfo.projectId,
                '', // this.extInfo.workflowId,
                '', // this.extInfo.nodeId,
                serviceType,
                request,
            ],
            id: this.generateRequestId(),
        };

        return Promise.resolve(window.jsonrpc(JSON.stringify(jsonRpcRequest)));
    }
}
