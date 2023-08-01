import {
  ExtensionConfig,
  Event,
  EventTypes,
  CallableService,
  ServiceParameters,
  CallServiceResponse,
  NodeInfo,
} from "src/types";
import { Alert } from "src/types/Alert";
import { AlertTypes } from "src/types/AlertTypes";

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
export class KnimeService<T = any> {
  extensionConfig: ExtensionConfig<T>;

  protected callableService: CallableService;
  protected callablePushEvent: CallableService;

  private dataGetter: () => any;

  eventCallbacksMap: Map<string, ((event: Event) => void)[]>;

  /**
   * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
   * @param {CallableService} callableService - the environment-specific "call service" API method.
   * @param {CallableService} pushEvent - the environment-specific "push event" API method.
   */
  constructor(
    extensionConfig: ExtensionConfig = null,
    callableService: CallableService = null,
    pushEvent: CallableService = null,
  ) {
    /**
     *
     */
    this.extensionConfig = extensionConfig;

    this.callableService = callableService;
    this.callablePushEvent = pushEvent;

    /**
     * Stores registered callbacks for events called via backend implementation.
     * Should be only used by internal service methods.
     */
    this.eventCallbacksMap = new Map();
  }

  /**
   * Public service call wrapper with full error handling which can be used by subclasses/typed service
   * implementations.
   *
   * @param {ServiceParameters} serviceParams - service parameters for the service call.
   * @returns {Promise<CallServiceResponse>} - resolved promise containing error or result depending on response
   *      success.
   */
  async callService(serviceParams: ServiceParameters) {
    if (!this.extensionConfig) {
      const error = this.createAlert({
        subtitle: "Missing extension config",
        message: "Cannot call service without extension config",
      });
      this.sendError(error);
      return Promise.resolve({} as CallServiceResponse);
    }

    if (!this.callableService) {
      const error = this.createAlert({
        message: "Callable service is not available",
        subtitle: "Service not found",
      });
      this.sendError(error);
      return Promise.resolve({} as CallServiceResponse);
    }

    const response: CallServiceResponse = await this.executeServiceCall(
      serviceParams,
    );

    // handle top level RPC errors only
    const { error, result } = response || {};

    if (error) {
      this.sendError(error as Alert);
    }

    return Promise.resolve({ result });
  }

  /**
   * Inner service call wrapper which can be overridden by subclasses which require specific behavior (e.g. iframes).
   * Default behavior is to use the member callable service directly.
   *
   * @param {ServiceParameters} serviceParams - parameters for the service call.
   * @returns {Promise} - rejected or resolved depending on response success.
   */
  protected executeServiceCall(serviceParams: ServiceParameters): Promise<any> {
    return this.callableService(...serviceParams);
  }

  /**
   * Register a callback method which returns relevant data to provide when "applying" client-side state
   * changes to the framework (i.e. when settings change and should be persisted).
   *
   * @param {Function} callback - method which returns any data needed by the framework to persist the client-
   *      side state.
   * @returns {undefined}
   */
  registerDataGetter(callback: () => any) {
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
    return Promise.resolve(
      typeof this.dataGetter === "function" ? this.dataGetter() : null,
    );
  }

  /**
   * To be called by the parent application to sent an event to all services. Calls registered callbacks by
   * event type.
   * @param {Event} event - event object, which is provided by backend implementation.
   * @returns {void}
   */
  onServiceEvent(event: Event) {
    const callbacks = this.eventCallbacksMap.get(event.eventType) || [];

    callbacks.forEach((callback) => {
      callback(event);
    });
  }

  /**
   * Registers callback that will be triggered on received events.
   * @param {EventTypes} eventType - event type that callback should be registered for.
   * @param {function} callback - callback that should be called on received events, will be called with {Event} param
   * @returns {void}
   */
  addEventCallback(eventType: EventTypes, callback: (event: Event) => void) {
    this.eventCallbacksMap.set(eventType, [
      ...(this.eventCallbacksMap.get(eventType) || []),
      callback,
    ]);
  }

  /**
   * Unregisters previously registered callback for events.
   * @param {EventTypes} eventType - event type that matches registered callback event type.
   * @param {function} callback - previously registered callback.
   * @returns {void}
   */
  removeEventCallback(eventType: EventTypes, callback: (event: Event) => void) {
    this.eventCallbacksMap.set(
      eventType,
      (this.eventCallbacksMap.get(eventType) || []).filter(
        (cb) => cb !== callback,
      ),
    );
  }

  /**
   * Unregisters all previously registered event callbacks of provided event type.
   * @param {string} eventType - event type that matches registered callbacks event type.
   * @returns {void}
   */
  resetEventCallbacksByType(eventType: string) {
    this.eventCallbacksMap.set(eventType, []);
  }

  /**
   * Unregisters all previously registered event callbacks of all event types.
   * @returns {void}
   */
  resetEventCallbacks() {
    this.eventCallbacksMap.clear();
  }

  /**
   * Public push event wrapper with error handling. This broadcasts an event or event
   * via the callable function provided during instantiation.
   *
   * @param {Event} event - the event payload.
   * @returns {any} - the result of the callable function.
   */
  pushEvent(event: Event) {
    if (!this.extensionConfig) {
      const error = this.createAlert({
        subtitle: "Missing extension config",
        message: "Cannot push event without extension config",
      });
      this.sendError(error);
      return Promise.resolve({});
    }

    if (!this.callablePushEvent) {
      const error = this.createAlert({
        subtitle: "Push event failed",
        message: "Push event is not available",
      });
      this.sendError(error);
      return Promise.resolve({});
    }

    return this.callablePushEvent({
      callerId: this.serviceId,
      ...event,
    });
  }

  /**
   * Pushes error to framework to be displayed to the user.
   *
   * @param {Alert} alert - the error alert.
   * @returns {void}
   */
  sendError(alert: Alert) {
    if (this.callablePushEvent) {
      this.callablePushEvent({
        callerId: this.serviceId,
        alert,
        type: "alert",
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(alert);
    }
  }

  /**
   * Pushes warning to framework to be displayed to the user.
   *
   * @param {Alert} alert - the warning alert.
   * @returns {void}
   */
  sendWarning(alert: Alert) {
    if (this.callablePushEvent) {
      this.callablePushEvent({
        callerId: this.serviceId,
        alert,
        type: "alert",
      });
    } else {
      // eslint-disable-next-line no-console
      console.warn(alert);
    }
  }

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
  }) {
    const { type = AlertTypes.ERROR, message, code, subtitle } = alertParams;
    return {
      nodeId: this.extensionConfig?.nodeId || "MISSING",
      nodeInfo: this.extensionConfig?.nodeInfo || ({} as NodeInfo),
      type,
      message,
      code,
      subtitle,
    };
  }

  /**
   * Creates an instance ID from a @type {KnimeService}. This ID unique among node instances in a workflow but shared
   * between KnimeService instances instantiated by the same node instance (i.e. between sessions, refreshes, reloads,
   * etc.).
   *
   * @param {KnimeService} knimeService - the service from which to derive an ID.
   * @returns {String} the id derived from the provided service.
   */
  get serviceId() {
    const { nodeId, projectId, workflowId, extensionType } =
      this.extensionConfig || {};
    return `${nodeId}.${projectId}.${workflowId}.${extensionType}`;
  }
}
