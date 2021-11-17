import { ExtensionConfig, ServiceMethod, Notification, Service } from "../index-c969ba90";
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
declare class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;
    private jsonRpcSupported;
    private dataGetter;
    notificationCallbacksMap: Map<string, ((notification: Notification) => void)[]>;
    /**
     * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
     */
    /**
     * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
     */
    constructor(extensionConfig?: ExtensionConfig);
    /**
     * Generic method to call services provided by the UI Extension node implementation.
     *
     * @param {ServiceMethod} method - the framework method to target with this service call.
     * @param {Service} service - the service which should be called.
     * @param {string} request - the serialized request payload.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    /**
     * Generic method to call services provided by the UI Extension node implementation.
     *
     * @param {ServiceMethod} method - the framework method to target with this service call.
     * @param {Service} service - the service which should be called.
     * @param {string} request - the serialized request payload.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    callService(method: ServiceMethod, service: Service, request: string): Promise<any>;
    /**
     * Register a callback method which returns relevant data to provide when "applying" client-side state
     * changes to the framework (i.e. when settings change and should be persisted).
     *
     * @param {Function} callback - method which returns any data needed by the framework to persist the client-
     *      side state.
     * @returns {undefined}
     */
    /**
     * Register a callback method which returns relevant data to provide when "applying" client-side state
     * changes to the framework (i.e. when settings change and should be persisted).
     *
     * @param {Function} callback - method which returns any data needed by the framework to persist the client-
     *      side state.
     * @returns {undefined}
     */
    registerDataGetter(callback: () => any): void;
    /**
     * A framework method to get any data which is needed for state persistence. Not intended to be called directly
     * by a UI Extension implementation, this method is exposed for lifecycle management by the framework.
     *
     * @returns {any | null} optionally returns data needed to persist client side state if a
     *      {@see KnimeService.dataGetter} has been registered. If no data getter is present,
     *      returns {@type null}.
     */
    /**
     * A framework method to get any data which is needed for state persistence. Not intended to be called directly
     * by a UI Extension implementation, this method is exposed for lifecycle management by the framework.
     *
     * @returns {any | null} optionally returns data needed to persist client side state if a
     *      {@see KnimeService.dataGetter} has been registered. If no data getter is present,
     *      returns {@type null}.
     */
    getData(): Promise<any>;
    /**
     * Internal method that is triggered by backend implementation. Calls registered callbacks by notification type.
     * @param {Notification} notification - notification object, which is provided by backend implementation.
     * @returns {void}
     */
    /**
     * Internal method that is triggered by backend implementation. Calls registered callbacks by notification type.
     * @param {Notification} notification - notification object, which is provided by backend implementation.
     * @returns {void}
     */
    private onJsonrpcNotification;
    /**
     * Registers callback that will be triggered on received notification.
     * @param {string} notificationType - notification type that callback should be registered for.
     * @param {function} callback - callback that should be called on received notification, will be called with {Notification} param
     * @returns {void}
     */
    /**
     * Registers callback that will be triggered on received notification.
     * @param {string} notificationType - notification type that callback should be registered for.
     * @param {function} callback - callback that should be called on received notification, will be called with {Notification} param
     * @returns {void}
     */
    addNotificationCallback(notificationType: string, callback: (notification: Notification) => void): void;
    /**
     * Unregisters previously registered callback for notifications.
     * @param {string} notificationType - notification type that matches registered callback notification type.
     * @param {function} callback - previously registered callback.
     * @returns {void}
     */
    /**
     * Unregisters previously registered callback for notifications.
     * @param {string} notificationType - notification type that matches registered callback notification type.
     * @param {function} callback - previously registered callback.
     * @returns {void}
     */
    removeNotificationCallback(notificationType: string, callback: (notification: Notification) => void): void;
    /**
     * Unregisters all previously registered notification callbacks of provided notification type.
     * @param {string} notificationType - notification type that matches registered callbacks notification type.
     * @returns {void}
     */
    /**
     * Unregisters all previously registered notification callbacks of provided notification type.
     * @param {string} notificationType - notification type that matches registered callbacks notification type.
     * @returns {void}
     */
    resetNotificationCallbacksByType(notificationType: string): void;
    /**
     * Unregisters all previously registered notification callbacks of all notifications types.
     * @returns {void}
     */
    /**
     * Unregisters all previously registered notification callbacks of all notifications types.
     * @returns {void}
     */
    resetNotificationCallbacks(): void;
}
export { KnimeService };
