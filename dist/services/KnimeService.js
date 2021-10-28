import { createJsonRpcRequest } from '../utils/createJsonRpcRequest.js';

/**
 * The main API entry point for UI Extensions, this class consumes the initial information about a UI Extension
 * (via the {@type ExtensionConfig}) and handles all of the communication between the environment (e.g. KNIME
 * Analytics Platform) and the registered services.
 *
 * To utilize this functionality, services should be registered with an instance of this class, after which their
 * functionality can be utilized by the UI Extension implementation.
 *
 * @template T - the {@type ExtensionConfig} generic type.
 */
class KnimeService {
    /**
     * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
     */
    constructor(extensionConfig = null) {
        this.pendingJsonRpcRequests = new Map();
        this.extensionConfig = extensionConfig;
        this.jsonRpcSupported = Boolean(window.jsonrpc && typeof window.jsonrpc === 'function');
        const runningInIFrame = Boolean(window.parent && window.parent !== window);
        if (runningInIFrame) {
            window.addEventListener('message', this.onMessageFromParent.bind(this));
            window.parent.postMessage({
                type: 'knimeUIExtension:ready'
            }, '*'); // TODO security
        }
    }
    onMessageFromParent(event) {
        var _a;
        // TODO security check
        const { data } = event;
        if (!((_a = data.type) === null || _a === void 0 ? void 0 : _a.startsWith('knimeUIExtension'))) {
            return;
        }
        if (data.type === 'knimeUIExtension:init') {
            this.extensionConfig = event.data.extensionConfig;
        }
        if (data.type === 'knimeUIExtension:jsonrpcResponse') {
            const { response } = data;
            const responseJSON = JSON.parse(response);
            const { id } = responseJSON;
            const request = this.pendingJsonRpcRequests.get(id);
            if (!request) {
                throw new Error(`Received jsonrpcResponse for non-existing pending request with id ${id}`);
            }
            const { result, error = {} } = JSON.parse(responseJSON.result);
            if (result) {
                request.resolve(result);
            }
            else {
                request.reject(new Error(`Error code: ${error.code || 'UNKNOWN'}. Message: ${error.message || 'not provided'}`));
            }
            this.pendingJsonRpcRequests.delete(id);
        }
    }
    /**
     * Generic method to call services provided by the UI Extension node implementation.
     *
     * @param {ServiceMethod} method - the framework method to target with this service call.
     * @param {Service} service - the service which should be called.
     * @param {string} request - the serialized request payload.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    callService(method, service, request) {
        const jsonRpcRequest = createJsonRpcRequest(method, [
            this.extensionConfig.projectId,
            this.extensionConfig.workflowId,
            this.extensionConfig.nodeId,
            this.extensionConfig.extensionType,
            service,
            request || ''
        ]);
        if (this.jsonRpcSupported) {
            const requestResult = JSON.parse(window.jsonrpc(jsonRpcRequest));
            const { result, error = {} } = requestResult;
            if (result) {
                return Promise.resolve(JSON.parse(result));
            }
            return Promise.reject(new Error(`Error code: ${error.code || 'UNKNOWN'}. Message: ${error.message || 'not provided'}`));
        }
        else {
            const id = JSON.parse(jsonRpcRequest).id; // TODO find better way
            const promise = new Promise((resolve, reject) => {
                this.pendingJsonRpcRequests.set(id, { resolve, reject });
            });
            window.parent.postMessage({
                type: 'knimeUIExtension:jsonrpcRequest',
                request: jsonRpcRequest
            }, '*'); // TODO security
            // TODO handle timeouts: reject promise when there was no response after e.g. 10 seconds
            return promise;
        }
    }
    /**
     * Register a callback method which returns relevant data to provide when "applying" client-side state
     * changes to the framework (i.e. when settings change and should be persisted).
     *
     * @param {Function} callback - method which returns any data needed by the framework to persist the client-
     *      side state.
     * @returns {undefined}
     */
    registerDataGetter(callback) {
        this.dataGetter = callback;
    }
    /**
     * A framework method to get any data which is needed for state persistence. Not intended to be called directly
     * by a UI Extension implementation, this method is exposed for lifecycle management by the framework.
     *
     * @returns {any | null} optionally returns data needed to persist client side state if a
     *      {@see KnimeService.dataGetter} has been registered. If no data getter is present,
     *      returns {@type null}.
     */
    getData() {
        return Promise.resolve(typeof this.dataGetter === 'function'
            ? this.dataGetter()
            : null);
    }
}

export { KnimeService };
