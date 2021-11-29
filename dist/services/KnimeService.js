/**
 * The main API entry point base class for UI Extensions, derived class being initialized depending on environment
 * and handles all of the communication between the environment (e.g. KNIME Analytics Platform) and the registered services.
 *
 * To utilize this functionality, services should be registered with an instance of derived class, after which their
 * functionality can be utilized by the UI Extension implementation.
 *
 * Derived classes: IFrameKnimeService - for usage with iframe extensions, ComponentKnimeService for usage with components.
 *
 * @template T - the {@type ExtensionConfig} generic type.
 */
class KnimeService {
    /**
     * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
     * @param {CallableService} callableService - the extension configuration for the associated UI Extension.
     */
    constructor(extensionConfig = null, callableService = null) {
        /**
         *
         */
        this.extensionConfig = extensionConfig;
        this.callableService = callableService;
        /**
         * Stores registered callbacks for notifications called via backend implementation.
         * Should be only used by internal service methods.
         */
        this.notificationCallbacksMap = new Map();
    }
    /**
     * Public service call wrapper with error handling which can be used by subclasses/typed service implementations.
     *
     * @param {JsonRpcRequest} jsonRpcRequest - the formatted request payload.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    callService(jsonRpcRequest) {
        if (!this.extensionConfig) {
            return Promise.reject(new Error('Cannot call service without extension config'));
        }
        if (!this.callableService) {
            return Promise.reject(new Error('Callable service is not available'));
        }
        return this.executeServiceCall(jsonRpcRequest);
    }
    /**
     * Inner service call wrapper which can be overridden by subclasses which require specific behavior (e.g. iframes).
     * Default behavior is to use the member callable service directly.
     *
     * @param {JsonRpcRequest} jsonRpcRequest - the formatted request payload.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    executeServiceCall(jsonRpcRequest) {
        return this.callableService(jsonRpcRequest);
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
        return Promise.resolve(typeof this.dataGetter === 'function' ? this.dataGetter() : null);
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

export { KnimeService };
