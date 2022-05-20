declare namespace KnimeTypes {
    /**
     * Denotes whether the parent configuration references a node dialog or node view. As both are ui-extensions,
     * how they are rendered in a layout is determined by this type.
     *
     * @enum
     */
    enum ExtensionTypes {
        DIALOG = "dialog",
        VIEW = "view"
    }
    /**
     * @property {string} [nodeAnnotation] - the optional annotation associated with the node.
     * @property {string} nodeState - the current state of the node.
     * @property {string} [nodeErrorMessage] - the optional error message associated with a node in the failed state.
     * @property {string} [nodeWarnMessage] - the optional warning message associated with a node in the failed state.
     * @property {string} nodeName - the human-readable node name as it's registered with the node description.
     */
    type NodeInfo = {
        nodeAnnotation?: string;
        nodeState: string;
        nodeErrorMessage?: string;
        nodeWarnMessage?: string;
        nodeName: string;
    };
    /**
     * Enum for extension resource types.
     * @readonly
     * @enum {string}
     */
    enum ResourceTypes {
        /** Indicates the resource should be loaded as a complete HTML page. */
        HTML = "HTML",
        /** Indicates the resource is a Vue component and should be treated as a library. */
        VUE_COMPONENT_LIB = "VUE_COMPONENT_LIB"
    }
    /**
     * @property {string} id - unique identifier based on the factory class of the node.
     * @property {ResourceTypes} type - the resource type associated with the extension.
     * @property {string} [path] - the optional relative path of the resource (for remote resources).
     * @property {string} [url] - the optional absolute url of the resource (for local resources).
     */
    type ResourceInfo = {
        id: string;
        type: ResourceTypes;
        path?: string;
        url?: string;
    };
    /**
     * The base configuration of any UI Extension which contains all of the relevant information about the UI Extension
     * node it references. This information allows the framework to coordinate communication between the frontend
     * application and the target node in the workflow.
     *
     * Optionally, it may also contain the initial data to provide directly to the client-side UI Extension implementation.
     *
     * @property {string} nodeId - the id of the node in the workflow.
     * @property {string} projectId - the project id of the workflow.
     * @property {string} workflowId - the workflow id.
     * @property {ResourceInfo} resourceInfo - information regarding the client-side resources for this extension.
     * @property {NodeInfo} nodeInfo - additional information regarding the node itself.
     * @property {ExtensionTypes} extensionType - the type of the extension (effects the api behavior).
     * @property {T} [initialData] - optional initial data to provide directly to the UI Extension.
     * @property {T} [initialSelection] - optional initial selection to provide directly to the UI Extension.
     * @template T
     */
    type ExtensionConfig<T = any> = {
        nodeId: string;
        projectId: string;
        workflowId: string;
        resourceInfo: ResourceInfo;
        nodeInfo: NodeInfo;
        extensionType: ExtensionTypes;
        initialData?: T;
        initialSelection?: T;
    };
    /**
     * Selection service modes available by default to UI Extension nodes.
     *
     * @enum {string}
     */
    enum SelectionModes {
        ADD = "ADD",
        REMOVE = "REMOVE",
        REPLACE = "REPLACE"
    }
    type SelectionMode = SelectionModes;
    type Notification = {
        params?: {
            projectId: string;
            workflowId: string;
            nodeId: string;
            mode: SelectionModes | string;
            keys?: string[];
        }[];
        type?: "ERROR" | "WARNING" | string;
        nodeInfo?: {
            nodeName: string;
            nodeAnnotation: string;
        };
        message?: string;
        [key: string]: any;
    };
    /**
     * Collection of RPC method signatures registered as node services with the framework. Each signature
     * targets specific workflow-level node service functionality for UI Extensions.
     */
    enum NodeServices {
        // Data service method signature.
        CALL_NODE_DATA_SERVICE = "NodeService.callNodeDataService",
        // Selection service method signature.
        CALL_NODE_SELECTION_SERVICE = "NodeService.updateDataPointSelection"
    }
    /**
     * Any RPC-compliant method signature which directly targets a node service of the application. Each signature
     * is in the format `<service>.<method name>` where the `<service>` (i.e. NodeService) is provided by the framework
     * and implements the `<method name>` (i.e. `callNodeDataService`) to call.
     */
    type NodeService = NodeServices | any;
    /**
     * Data service service-types available by default to UI Extension nodes.
     *
     * @enum {string}
     */
    enum DataServiceTypes {
        // Returns the initial data as provided by the node implementation. Requires no parameters.
        INITIAL_DATA = "initial_data",
        // Expects request to provide correct method parameters to retrieve data from the referenced data service method.
        DATA = "data",
        // Expects request body to contain the update data to apply/persist/update depending on node implementation.
        APPLY_DATA = "apply_data"
    }
    type DataServiceType = DataServiceTypes;
    /**
     * Any node service request supported by that specific node service.
     */
    type ServiceRequest = DataServiceTypes | SelectionModes;
    enum EventTypes {
        DataEvent = "DataEvent",
        SelectionEvent = "SelectionEvent"
    }
    type CallServiceResponse = {
        error: {
            code: string;
            message: string;
        };
        result?: any;
    };
    /**
     * An environment-specific service function implementation (callable) which acts as an injectable API layer.
     *
     * @property {any} [env] - optional environment flag to denote where the service is executing.
     * @param {any[]} payload - the payload to pass during invocation.
     * @returns {Promise<any>} the service response as a Promise.
     */
    type CallableService = {
        env?: string;
        (...payload: any[]): Promise<any>;
    };
    /**
     * The parameters expected by the API layer for any callService call. The required members are:
     *
     *  - @member {NodeService} - the node service to call.
     *  - @member {ServiceRequest} - the request to make to the specified node service.
     *  - @member {any} [parameters] - optional parameters to pass to the call.
     */
    type ServiceParameters = [
        NodeService,
        ServiceRequest,
        any
    ];
}
declare namespace KnimeUIExtensionService {
    /**
     * Denotes whether the parent configuration references a node dialog or node view. As both are ui-extensions,
     * how they are rendered in a layout is determined by this type.
     *
     * @enum
     */
    enum ExtensionTypes {
        DIALOG = "dialog",
        VIEW = "view"
    }
    /**
     * @property {string} [nodeAnnotation] - the optional annotation associated with the node.
     * @property {string} nodeState - the current state of the node.
     * @property {string} [nodeErrorMessage] - the optional error message associated with a node in the failed state.
     * @property {string} [nodeWarnMessage] - the optional warning message associated with a node in the failed state.
     * @property {string} nodeName - the human-readable node name as it's registered with the node description.
     */
    type NodeInfo = {
        nodeAnnotation?: string;
        nodeState: string;
        nodeErrorMessage?: string;
        nodeWarnMessage?: string;
        nodeName: string;
    };
    /**
     * Enum for extension resource types.
     * @readonly
     * @enum {string}
     */
    enum ResourceTypes {
        /** Indicates the resource should be loaded as a complete HTML page. */
        HTML = "HTML",
        /** Indicates the resource is a Vue component and should be treated as a library. */
        VUE_COMPONENT_LIB = "VUE_COMPONENT_LIB"
    }
    /**
     * @property {string} id - unique identifier based on the factory class of the node.
     * @property {ResourceTypes} type - the resource type associated with the extension.
     * @property {string} [path] - the optional relative path of the resource (for remote resources).
     * @property {string} [url] - the optional absolute url of the resource (for local resources).
     */
    type ResourceInfo = {
        id: string;
        type: ResourceTypes;
        path?: string;
        url?: string;
    };
    /**
     * The base configuration of any UI Extension which contains all of the relevant information about the UI Extension
     * node it references. This information allows the framework to coordinate communication between the frontend
     * application and the target node in the workflow.
     *
     * Optionally, it may also contain the initial data to provide directly to the client-side UI Extension implementation.
     *
     * @property {string} nodeId - the id of the node in the workflow.
     * @property {string} projectId - the project id of the workflow.
     * @property {string} workflowId - the workflow id.
     * @property {ResourceInfo} resourceInfo - information regarding the client-side resources for this extension.
     * @property {NodeInfo} nodeInfo - additional information regarding the node itself.
     * @property {ExtensionTypes} extensionType - the type of the extension (effects the api behavior).
     * @property {T} [initialData] - optional initial data to provide directly to the UI Extension.
     * @property {T} [initialSelection] - optional initial selection to provide directly to the UI Extension.
     * @template T
     */
    type ExtensionConfig<T = any> = {
        nodeId: string;
        projectId: string;
        workflowId: string;
        resourceInfo: ResourceInfo;
        nodeInfo: NodeInfo;
        extensionType: ExtensionTypes;
        initialData?: T;
        initialSelection?: T;
    };
    /**
     * Selection service modes available by default to UI Extension nodes.
     *
     * @enum {string}
     */
    enum SelectionModes {
        ADD = "ADD",
        REMOVE = "REMOVE",
        REPLACE = "REPLACE"
    }
    type SelectionMode = SelectionModes;
    type Notification = {
        params?: {
            projectId: string;
            workflowId: string;
            nodeId: string;
            mode: SelectionModes | string;
            keys?: string[];
        }[];
        type?: "ERROR" | "WARNING" | string;
        nodeInfo?: {
            nodeName: string;
            nodeAnnotation: string;
        };
        message?: string;
        [key: string]: any;
    };
    /**
     * Collection of RPC method signatures registered as node services with the framework. Each signature
     * targets specific workflow-level node service functionality for UI Extensions.
     */
    enum NodeServices {
        // Data service method signature.
        CALL_NODE_DATA_SERVICE = "NodeService.callNodeDataService",
        // Selection service method signature.
        CALL_NODE_SELECTION_SERVICE = "NodeService.updateDataPointSelection"
    }
    /**
     * Any RPC-compliant method signature which directly targets a node service of the application. Each signature
     * is in the format `<service>.<method name>` where the `<service>` (i.e. NodeService) is provided by the framework
     * and implements the `<method name>` (i.e. `callNodeDataService`) to call.
     */
    type NodeService = NodeServices | any;
    /**
     * Data service service-types available by default to UI Extension nodes.
     *
     * @enum {string}
     */
    enum DataServiceTypes {
        // Returns the initial data as provided by the node implementation. Requires no parameters.
        INITIAL_DATA = "initial_data",
        // Expects request to provide correct method parameters to retrieve data from the referenced data service method.
        DATA = "data",
        // Expects request body to contain the update data to apply/persist/update depending on node implementation.
        APPLY_DATA = "apply_data"
    }
    type DataServiceType = DataServiceTypes;
    /**
     * Any node service request supported by that specific node service.
     */
    type ServiceRequest = DataServiceTypes | SelectionModes;
    /**
     * The parameters expected by the API layer for any callService call. The required members are:
     *
     *  - @member {NodeService} - the node service to call.
     *  - @member {ServiceRequest} - the request to make to the specified node service.
     *  - @member {any} [parameters] - optional parameters to pass to the call.
     */
    type ServiceParameters = [
        NodeService,
        ServiceRequest,
        any
    ];
    enum EventTypes {
        DataEvent = "DataEvent",
        SelectionEvent = "SelectionEvent"
    }
    type CallServiceResponse = {
        error: {
            code: string;
            message: string;
        };
        result?: any;
    };
    /**
     * An environment-specific service function implementation (callable) which acts as an injectable API layer.
     *
     * @property {any} [env] - optional environment flag to denote where the service is executing.
     * @param {any[]} payload - the payload to pass during invocation.
     * @returns {Promise<any>} the service response as a Promise.
     */
    type CallableService = {
        env?: string;
        (...payload: any[]): Promise<any>;
    };
    /**
     * @enum
     */
    enum AlertTypes {
        ERROR = "error",
        WARN = "warn"
    }
    /**
     *
     * @property {string} nodeId - the id of the node in the workflow.
     * @property {NodeInfo} nodeInfo - additional information regarding the node itself.
     * @property {AlertTypes} type - the type of the alert (@see AlertTypes).
     * @property {string | number} [code] - an optional error/status code.
     * @property {string} [subtitle] - an optional subtitle for the alert.
     * @property {string} [message] - an optional message body for the alert.
     */
    type Alert = {
        nodeId: string;
        nodeInfo: NodeInfo;
        type: AlertTypes | keyof typeof AlertTypes;
        code?: string | number;
        subtitle?: string;
        message?: string;
    };
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
    class KnimeService<T = any> {
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
        constructor(extensionConfig?: ExtensionConfig, callableService?: CallableService, pushNotification?: CallableService);
        /**
         * Public service call wrapper with full error handling which can be used by subclasses/typed service
         * implementations.
         *
         * @param {ServiceParameters} serviceParams - service parameters for the service call.
         * @returns {Promise<CallServiceResponse>} - resolved promise containing error or result depending on response
         *      success.
         */
        callService(serviceParams: ServiceParameters): Promise<CallServiceResponse | {
            result: any;
        }>;
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
        registerDataGetter(callback: () => any): void;
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
        onServiceNotification(notification: Notification): void;
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
        removeNotificationCallback(notificationType: EventTypes, callback: (notification: Notification) => void): void;
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
        resetNotificationCallbacks(): void;
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
        sendError(alert: Alert): void;
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
    const KnimeUtils: {
        UI_EXT_POST_MESSAGE_PREFIX: "knimeUIExtension";
        UI_EXT_POST_MESSAGE_TIMEOUT: 10000;
        generateRequestId: () => number;
        createJsonRpcRequest: (method: any, params?: any[]) => {
            jsonrpc: string;
            method: any;
            params: string | string[];
            id: number;
        };
    };
    /**
     * A utility class to interact with JsonDataServices implemented by a UI Extension node.
     */
    class JsonDataService<T = any> {
        private knimeService;
        /**
         * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
         *      with the framework.
         */
        constructor(knimeService: IFrameKnimeService | KnimeService<T>);
        /**
         * Calls the node data service with optional request body. The service to call is specified by the service type
         * and needs to correspond directly to a {@see DataServiceType} supported by the node.
         *
         * @param {DataServiceType} dataServiceType - the data service type.
         * @param {string} [request] - an optional request payload.
         * @returns {Promise} rejected or resolved depending on backend response.
         */
        private callDataService;
        /**
         * Retrieves the initial data for the client-side UI Extension implementation from either the local configuration
         * (if it exists) or by fetching the data from the node DataService implementation.
         *
         * @returns {Promise} node initial data provided by the local configuration or by fetching from the DataService.
         */
        initialData(): Promise<any>;
        /**
         * Retrieve data from the node using the {@see DataServiceType.DATA} api. Different method names can be registered
         * with the data service in the node implementation to provide targets (specified by the {@param method}). Any
         * optional parameter will be provided directly to the data service target and can be used to specify the nature of
         * the data returned.
         *
         * @param {Object} params - parameter options.
         * @param {string} [params.method] - optional target method in the node's DataService implementation
         *      (default 'getData').
         * @param {any} [params.options] - optional options that should be passed to called method.
         * @returns {Promise} rejected or resolved depending on backend response.
         */
        data(params?: {
            method?: string;
            options?: any;
        }): Promise<any>;
        /**
         * Sends the current client-side data to the backend to be persisted. A data getter method which returns the
         * data to be applied/saved should be registered *prior* to invoking this method. If none is registered, a
         * default payload of "null" will be sent instead.
         *
         * @returns {Promise} rejected or resolved depending on backend response.
         */
        applyData(): Promise<any>;
        /**
         * Registers a function with the framework is used to provide the current state of the client-side UI Extension.
         *
         * @param {Function} callback - function which provides the current client side state when invoked.
         * @returns {undefined}
         */
        registerDataGetter(callback: () => any): void;
        /**
         * Adds callback that will be triggered when data changes.
         * @param {Function} callback - called on data change.
         * @param {Notification} response - the data update event object.
         * @returns {void}
         */
        addOnDataChangeCallback(callback: (notification: Notification) => void): void;
        /**
         * Publish a data update notification to other UIExtensions registered in the current page.
         * @param {any} data - the data to send.
         * @returns {void}
         */
        publishData(data: any): void;
        private handleError;
        private handleWarnings;
    }
    /**
     * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
     * IFrame and parent window via window.postMessage.
     *
     * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
     *
     * Other services should be initialized with instance of the class.
     */
    class IFrameKnimeService extends KnimeService {
        private pendingServiceCalls;
        private boundOnMessageFromParent;
        private initializationPromise;
        private initializationPromiseResolve;
        constructor();
        /**
         * Needs to be awaited before the service is ready to be used.
         * @returns {void}
         */
        waitForInitialization(): Promise<void>;
        /**
         * Called when a new message is received, identifies and handles it if type is supported.
         * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
         * @returns {void}
         */
        private onMessageFromParent;
        private onInit;
        private onCallServiceResponse;
        /**
         * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
         * @param {ServiceParameters} serviceParams - parameters for the service call.
         * @returns {Promise<string>} - promise that resolves with response from the service call string or error message.
         */
        protected executeServiceCall(serviceParams: ServiceParameters): Promise<string>;
        private static postMessage;
        private static iframePushNotification;
        /**
         * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
         * preventing memory leaks and unexpected behavior.
         * @returns {void}
         */
        destroy(): void;
    }
    /**
     * Handles postMessage communication with iframes on side of the parent window.
     *
     * IFrame window communication should be setup with instance of IFrameKnimeService.
     *
     * Should be instantiated by class that persists at root window object.
     */
    class IFrameKnimeServiceAdapter extends KnimeService {
        private iFrameWindow;
        private boundOnMessageFromIFrame;
        constructor(extensionConfig?: ExtensionConfig, callableService?: CallableService, pushNotification?: CallableService);
        /**
         * Sets the child iframe window referenced by the service.
         *
         * @param {Window} iFrameWindow - the content window of the child frame where the @see IFrameKnimeService
         *      is running.
         * @returns {void}
         */
        setIFrameWindow(iFrameWindow: Window): void;
        /**
         * Adds a new message event listener
         *
         * @returns {void}
         */
        updateEventListener(): void;
        /**
         * Checks if message is coming from the correct IFrame and therefore is secure.
         * @param {MessageEvent} event - postMessage event.
         * @returns {boolean} - returns true if postMessage source is secure.
         */
        private checkMessageSource;
        /**
         * Listens for postMessage events, identifies and handles them if event type is supported.
         * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
         * @returns {void}
         */
        private onMessageFromIFrame;
        onServiceNotification(notification: Notification | string): void;
        /**
         * Should be called before destroying the IFrame to remove event listeners from window object,
         * preventing memory leaks and unexpected behavior.
         * @returns {void}
         */
        destroy(): void;
        private postMessage;
    }
    /**
     * SelectionService provides methods to handle data selection.
     * To use it, the relating Java implementation also needs to use the SelectionService.
     */
    class SelectionService<T = any> {
        private knimeService;
        private callbackMap;
        /**
         * @param {KnimeService} knimeService - instance should be provided to use notifications.
         */
        constructor(knimeService: IFrameKnimeService | KnimeService<T>);
        /**
         * Retrieves the initial data for the client-side UI Extension implementation from the extension configuration
         * if it exists.
         *
         * @returns {Promise} node initial selection provided by the extension configuration.
         */
        initialSelection(): Promise<any>;
        /**
         * Replaces current selection with provided data.
         * @param {SelectionMode} mode - the selection mode.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} - based on backend implementation.
         */
        private updateSelection;
        /**
         * Adds data to currently selected data set.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} based on backend implementation.
         */
        add(selection: string[]): Promise<any>;
        /**
         * Removes data from currently selected data set.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} based on backend implementation.
         */
        remove(selection: string[]): Promise<any>;
        /**
         * Replaces current selection with provided data.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} based on backend implementation.
         */
        replace(selection: string[]): Promise<any>;
        /**
         * Adds callback that will be triggered on data selection change outside the scope of the view.
         * @param {function} callback - that need to be added. Will be triggered by the framework on selection change.
         * @returns {void}
         */
        addOnSelectionChangeCallback(callback: (any: any) => void): void;
        /**
         * Removes previously added callback.
         * @param {function} callback - that needs to be removed from notifications.
         * @returns {void}
         */
        removeOnSelectionChangeCallback(callback: (any: any) => void): void;
    }
}
export { KnimeUIExtensionService as default };
