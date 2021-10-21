'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

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
        this.extensionConfig = extensionConfig;
        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }
    /**
     * Generic method to call services provided by the UI Extension node implementation.
     *
     * @param {IServiceMethod} method - the framework method to target with this service call.
     * @param {IService} service - the service which should be called.
     * @param {string} request - the serialized request payload.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    callService(method, service, request) {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }
        const jsonRpcRequest = createJsonRpcRequest.createJsonRpcRequest(method, [
            this.extensionConfig.projectId,
            this.extensionConfig.workflowId,
            this.extensionConfig.nodeId,
            this.extensionConfig.extensionType,
            service,
            request || ''
        ]);
        const requestResult = JSON.parse(window.jsonrpc(jsonRpcRequest));
        const { result, error = {} } = requestResult;
        if (result) {
            return Promise.resolve(JSON.parse(result));
        }
        return Promise.reject(new Error(`Error code: ${error.code || 'UNKNOWN'}. Message: ${error.message || 'not provided'}`));
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

exports.KnimeService = KnimeService;
