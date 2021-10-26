'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var createJsonRpcRequest = require('../utils/createJsonRpcRequest.js');

// TODO: NXTEXT-80 add JSDoc comments
class KnimeService {
    constructor(extensionConfig = null) {
        this.extensionConfig = extensionConfig;
        /**
         * Stores registered callbacks for notifications called via backend implementation.
         * Should be only used by internal service methods.
         */
        this.notificationCallbacksMap = new Map();
        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(method, serviceMethod, request) {
        var _a, _b, _c;
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }
        const jsonRpcRequest = createJsonRpcRequest.createJsonRpcRequest(method, [
            (_a = this.extensionConfig) === null || _a === void 0 ? void 0 : _a.projectId,
            (_b = this.extensionConfig) === null || _b === void 0 ? void 0 : _b.workflowId,
            (_c = this.extensionConfig) === null || _c === void 0 ? void 0 : _c.nodeId,
            serviceMethod,
            request || ''
        ]);
        const requestResult = JSON.parse(window.jsonrpc(jsonRpcRequest));
        const { result, error } = requestResult;
        if (!error) {
            return Promise.resolve(JSON.parse(result));
        }
        return Promise.reject(new Error(`Error code: ${error.code || 'UNKNOWN'}. Message: ${error.message ||
            'not provided'} ${!(error.message || error.code) &&
            JSON.stringify(error, null, 2)}`));
    }
    /**
     * Internal method that is triggered by backend implementation. Calls registered callbacks by notification type.
     * @param {Notification} notification - notification object, which is provided by backend implementation.
     * @returns {void}
     */
    onJsonrpcNotification(notification) {
        const callbacks = this.notificationCallbacksMap.get(notification.method) || [];
        callbacks.forEach((cb) => {
            cb(notification);
        });
    }
    /**
     * Registers callback that will be triggered on received notification.
     * @param {string} notificationType - notification type that callback should be registered for.
     * @param {function} callback - callback that should be called on received notification, will be called with {Notification} param
     * @returns {void}
     */
    addNotificationCallback(notificationType, callback) {
        if (!window.jsonrpcNotification) {
            window.jsonrpcNotification = this.onJsonrpcNotification.bind(this);
        }
        this.notificationCallbacksMap.set(notificationType, [
            ...this.notificationCallbacksMap.get(notificationType) || [],
            callback
        ]);
    }
    /**
     * Unregisters previously registered callback for notifications.
     * @param {string} notificationType - notification type that matches registered callback notification type.
     * @param {function} callback - previously registered callback.
     * @returns {void}
     */
    removeNotificationCallback(notificationType, callback) {
        this.notificationCallbacksMap.set(notificationType, (this.notificationCallbacksMap.get(notificationType) || []).filter((cb) => cb !== callback));
    }
    /**
     * Unregisters all previously registered notification callbacks of provided notification type.
     * @param {string} notificationType - notification type that matches registered callbacks notification type.
     * @returns {void}
     */
    resetNotificationCallbacksByType(notificationType) {
        this.notificationCallbacksMap.set(notificationType, []);
    }
    /**
     * Unregisters all previously registered notification callbacks of all notifications types.
     * @returns {void}
     */
    resetNotificationCallbacks() {
        this.notificationCallbacksMap.clear();
    }
}

exports.KnimeService = KnimeService;
