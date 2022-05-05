import { ExtensionConfig, Notification, EventTypes, CallableService, ServiceParameters, CallServiceResponse, NodeInfo } from "../index-b3e43760";
import { Alert } from "../Alert-3bf44dea";
import { AlertTypes } from "../types/AlertTypes";
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
declare class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;
    protected callableService: CallableService;
    protected callablePushNotification: CallableService;
    private dataGetter;
    notificationCallbacksMap: Map<string, ((notification: Notification) => void)[]>;
    /**
     * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
     * @param {CallableService} callableService - the environment-specific "call service" API method.
     * @param {CallableService} pushNotification - the environment-specific "push notification" API method.
     */
    /**
     * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
     * @param {CallableService} callableService - the environment-specific "call service" API method.
     * @param {CallableService} pushNotification - the environment-specific "push notification" API method.
     */
    constructor(extensionConfig?: ExtensionConfig, callableService?: CallableService, pushNotification?: CallableService);
    /**
     * Public service call wrapper with full error handling which can be used by subclasses/typed service
     * implementations.
     *
     * @param {ServiceParameters} serviceParams - service parameters for the service call.
     * @returns {Promise} - resolved promise containing error or result depending on response success.
     */
    /**
     * Public service call wrapper with full error handling which can be used by subclasses/typed service
     * implementations.
     *
     * @param {ServiceParameters} serviceParams - service parameters for the service call.
     * @returns {Promise} - resolved promise containing error or result depending on response success.
     */
    callService(serviceParams: ServiceParameters): Promise<CallServiceResponse>;
    /**
     * Inner service call wrapper which can be overridden by subclasses which require specific behavior (e.g. iframes).
     * Default behavior is to use the member callable service directly.
     *
     * @param {ServiceParameters} serviceParams - parameters for the service call.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    /**
     * Inner service call wrapper which can be overridden by subclasses which require specific behavior (e.g. iframes).
     * Default behavior is to use the member callable service directly.
     *
     * @param {ServiceParameters} serviceParams - parameters for the service call.
     * @returns {Promise} - rejected or resolved depending on response success.
     */
    protected executeServiceCall(serviceParams: ServiceParameters): Promise<any>;
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
     * To be called by the parent application to sent a notification to all services. Calls registered callbacks by
     * notification type.
     * @param {Notification} notification - notification object, which is provided by backend implementation.
     * @returns {void}
     */
    /**
     * To be called by the parent application to sent a notification to all services. Calls registered callbacks by
     * notification type.
     * @param {Notification} notification - notification object, which is provided by backend implementation.
     * @returns {void}
     */
    onServiceNotification(notification: Notification): void;
    /**
     * Registers callback that will be triggered on received notification.
     * @param {EventTypes} notificationType - notification type that callback should be registered for.
     * @param {function} callback - callback that should be called on received notification, will be called with {Notification} param
     * @returns {void}
     */
    /**
     * Registers callback that will be triggered on received notification.
     * @param {EventTypes} notificationType - notification type that callback should be registered for.
     * @param {function} callback - callback that should be called on received notification, will be called with {Notification} param
     * @returns {void}
     */
    addNotificationCallback(notificationType: EventTypes, callback: (notification: Notification) => void): void;
    /**
     * Unregisters previously registered callback for notifications.
     * @param {EventTypes} notificationType - notification type that matches registered callback notification type.
     * @param {function} callback - previously registered callback.
     * @returns {void}
     */
    /**
     * Unregisters previously registered callback for notifications.
     * @param {EventTypes} notificationType - notification type that matches registered callback notification type.
     * @param {function} callback - previously registered callback.
     * @returns {void}
     */
    removeNotificationCallback(notificationType: EventTypes, callback: (notification: Notification) => void): void;
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
    /**
     * Public push notification wrapper with error handling. This broadcasts an event or notifications
     * via the callable function provided during instantiation.
     *
     * @param {Notification} notification - the notification payload.
     * @returns {any} - the result of the callable function.
     */
    /**
     * Public push notification wrapper with error handling. This broadcasts an event or notifications
     * via the callable function provided during instantiation.
     *
     * @param {Notification} notification - the notification payload.
     * @returns {any} - the result of the callable function.
     */
    pushNotification(notification: Notification): Promise<any>;
    /**
     * Pushes error to framework to be displayed to the user.
     *
     * @param {Alert} alert - the error alert.
     * @returns {void}
     */
    /**
     * Pushes error to framework to be displayed to the user.
     *
     * @param {Alert} alert - the error alert.
     * @returns {void}
     */
    sendError(alert: Alert): void;
    /**
     * Pushes warning to framework to be displayed to the user.
     *
     * @param {Alert} alert - the warning alert.
     * @returns {void}
     */
    /**
     * Pushes warning to framework to be displayed to the user.
     *
     * @param {Alert} alert - the warning alert.
     * @returns {void}
     */
    sendWarning(alert: Alert): void;
    /**
     * Helper method to create framework compatible {@see Alert} from the available information.
     *
     * @param {Object} alertParams - optional parameters for the formatted alert.
     * @returns {Alert} the properly formatted alert.
     */
    /**
     * Helper method to create framework compatible {@see Alert} from the available information.
     *
     * @param {Object} alertParams - optional parameters for the formatted alert.
     * @returns {Alert} the properly formatted alert.
     */
    createAlert(alertParams: {
        type?: AlertTypes;
        message?: string;
        code?: string | number;
        subtitle?: string;
    }): {
        nodeId: string;
        nodeInfo: NodeInfo;
        type: AlertTypes;
        message: string;
        code: string | number;
        subtitle: string;
    };
    /**
     * Creates an instance ID from a @type {KnimeService}. This ID unique among node instances in a workflow but shared
     * between KnimeService instances instantiated by the same node instance (i.e. between sessions, refreshes, reloads,
     * etc.).
     *
     * @param {KnimeService} knimeService - the service from which to derive an ID.
     * @returns {String} the id derived from the provided service.
     */
    get serviceId(): string;
}
export { KnimeService };
