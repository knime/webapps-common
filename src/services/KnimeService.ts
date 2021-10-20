import { ExtensionConfig, JSONRpcServices, DataServiceTypes } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';

/** Class represents KnimeService  */
export class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;

    private jsonRpcSupported: boolean;

    /**
     * @param {Object} extensionConfig required param that used to provide basic configuration for
     * KnimeService. While using Typescript can be called with generic type so it will type initialData
     * filed of ExtensionConfig
     */
    constructor(extensionConfig: ExtensionConfig = null) {
        this.extensionConfig = extensionConfig;

        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }

    /**
     * Generic method to call jsonrpc
     * @param {string} method jsonrpc service name
     * @param {string} serviceType exact method of jsonrpc service
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    callService(method: JSONRpcServices, serviceType: DataServiceTypes, request: string) {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }

        const jsonRpcRequest = createJsonRpcRequest(method, [
            this.extensionConfig.projectId,
            this.extensionConfig.workflowId,
            this.extensionConfig.nodeId,
            this.extensionConfig.extensionType,
            serviceType,
            request || ''
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
}
