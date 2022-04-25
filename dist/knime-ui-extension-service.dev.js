var KnimeUIExtensionService=function(){"use strict";
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
     */class KnimeService{
/**
         * @param {ExtensionConfig} extensionConfig - the extension configuration for the associated UI Extension.
         * @param {CallableService} callableService - the environment-specific "call service" API method.
         * @param {CallableService} pushNotification - the environment-specific "push notification" API method.
         */
constructor(extensionConfig=null,callableService=null,pushNotification=null){
/**
             *
             */
this.extensionConfig=extensionConfig,this.callableService=callableService,this.callablePushNotification=pushNotification,
/**
             * Stores registered callbacks for notifications called via backend implementation.
             * Should be only used by internal service methods.
             */
this.notificationCallbacksMap=new Map}
/**
         * Public service call wrapper with error handling which can be used by subclasses/typed service implementations.
         *
         * @param {ServiceParameters} serviceParams - service parameters for the service call.
         * @returns {Promise} - rejected or resolved depending on response success.
         */async callService(serviceParams){if(!this.extensionConfig)return Promise.reject(new Error("Cannot call service without extension config"));if(!this.callableService)return Promise.reject(new Error("Callable service is not available"));const response=await this.executeServiceCall(serviceParams),{error:error,result:result}=response||{};return error?(this.pushError(error.message,error.code),Promise.resolve({error:error})):Promise.resolve(result)}
/**
         * Inner service call wrapper which can be overridden by subclasses which require specific behavior (e.g. iframes).
         * Default behavior is to use the member callable service directly.
         *
         * @param {ServiceParameters} serviceParams - parameters for the service call.
         * @returns {Promise} - rejected or resolved depending on response success.
         */executeServiceCall(serviceParams){return this.callableService(...serviceParams)}
/**
         * Register a callback method which returns relevant data to provide when "applying" client-side state
         * changes to the framework (i.e. when settings change and should be persisted).
         *
         * @param {Function} callback - method which returns any data needed by the framework to persist the client-
         *      side state.
         * @returns {undefined}
         */registerDataGetter(callback){this.dataGetter=callback}
/**
         * A framework method to get any data which is needed for state persistence. Not intended to be called directly
         * by a UI Extension implementation, this method is exposed for lifecycle management by the framework.
         *
         * @returns {any | null} optionally returns data needed to persist client side state if a
         *      {@see KnimeService.dataGetter} has been registered. If no data getter is present,
         *      returns {@type null}.
         */getData(){return Promise.resolve("function"==typeof this.dataGetter?this.dataGetter():null)}
/**
         * To be called by the parent application to sent a notification to all services. Calls registered callbacks by
         * notification type.
         * @param {Notification} notification - notification object, which is provided by backend implementation.
         * @returns {void}
         */onServiceNotification(notification){(this.notificationCallbacksMap.get(notification.method)||[]).forEach((callback=>{callback(notification)}))}
/**
         * Registers callback that will be triggered on received notification.
         * @param {EventTypes} notificationType - notification type that callback should be registered for.
         * @param {function} callback - callback that should be called on received notification, will be called with {Notification} param
         * @returns {void}
         */addNotificationCallback(notificationType,callback){this.notificationCallbacksMap.set(notificationType,[...this.notificationCallbacksMap.get(notificationType)||[],callback])}
/**
         * Unregisters previously registered callback for notifications.
         * @param {EventTypes} notificationType - notification type that matches registered callback notification type.
         * @param {function} callback - previously registered callback.
         * @returns {void}
         */removeNotificationCallback(notificationType,callback){this.notificationCallbacksMap.set(notificationType,(this.notificationCallbacksMap.get(notificationType)||[]).filter((cb=>cb!==callback)))}
/**
         * Unregisters all previously registered notification callbacks of provided notification type.
         * @param {string} notificationType - notification type that matches registered callbacks notification type.
         * @returns {void}
         */resetNotificationCallbacksByType(notificationType){this.notificationCallbacksMap.set(notificationType,[])}
/**
         * Unregisters all previously registered notification callbacks of all notifications types.
         * @returns {void}
         */resetNotificationCallbacks(){this.notificationCallbacksMap.clear()}
/**
         * Public push notification wrapper with error handling. This broadcasts an event or notifications
         * via the callable function provided during instantiation.
         *
         * @param {Notification} notification - the notification payload.
         * @returns {any} - the result of the callable function.
         */pushNotification(notification){return this.extensionConfig?this.callablePushNotification?this.callablePushNotification(Object.assign({callerId:this.serviceId},notification)):Promise.reject(new Error("Push notification is not available")):Promise.reject(new Error("Cannot push notification without extension config"))}
/**
         * Pushes error to Knime Pagebuilder to be displayed with node view overlay.
         * @param {string} message - error message.
         * @param {string} code - error code.
         * @returns {void}
         */pushError(message,code=""){this.pushNotification({message:message,code:code,type:"ERROR"})}
/**
         * Creates an instance ID from a @type {KnimeService}. This ID unique among node instances in a workflow but shared
         * between KnimeService instances instantiated by the same node instance (i.e. between sessions, refreshes, reloads,
         * etc.).
         *
         * @param {KnimeService} knimeService - the service from which to derive an ID.
         * @returns {String} the id derived from the provided service.
         */get serviceId(){const{nodeId:nodeId,projectId:projectId,workflowId:workflowId,extensionType:extensionType}=this.extensionConfig||{};return`${nodeId}.${projectId}.${workflowId}.${extensionType}`}}
/**
     * Collection of RPC method signatures registered as node services with the framework. Each signature
     * targets specific workflow-level node service functionality for UI Extensions.
     */var NodeServices,DataServiceTypes,SelectionModes,ExtensionTypes,EventTypes,ResourceTypes;!function(NodeServices){
// Data service method signature.
NodeServices.CALL_NODE_DATA_SERVICE="NodeService.callNodeDataService",
// Selection service method signature.
NodeServices.CALL_NODE_SELECTION_SERVICE="NodeService.updateDataPointSelection"}(NodeServices||(NodeServices={})),function(DataServiceTypes){
// Returns the initial data as provided by the node implementation. Requires no parameters.
DataServiceTypes.INITIAL_DATA="initial_data",
// Expects request to provide correct method parameters to retrieve data from the referenced data service method.
DataServiceTypes.DATA="data",
// Expects request body to contain the update data to apply/persist/update depending on node implementation.
DataServiceTypes.APPLY_DATA="apply_data"}(DataServiceTypes||(DataServiceTypes={})),function(SelectionModes){SelectionModes.ADD="ADD",SelectionModes.REMOVE="REMOVE",SelectionModes.REPLACE="REPLACE"}(SelectionModes||(SelectionModes={})),function(ExtensionTypes){ExtensionTypes.DIALOG="dialog",ExtensionTypes.VIEW="view"}(ExtensionTypes||(ExtensionTypes={})),function(EventTypes){EventTypes.DataEvent="DataEvent",EventTypes.SelectionEvent="SelectionEvent"}(EventTypes||(EventTypes={})),function(ResourceTypes){
/** Indicates the resource should be loaded as a complete HTML page. */
ResourceTypes.HTML="HTML",
/** Indicates the resource is a Vue component and should be treated as a library. */
ResourceTypes.VUE_COMPONENT_LIB="VUE_COMPONENT_LIB"}(ResourceTypes||(ResourceTypes={}));var index=Object.freeze({__proto__:null,get NodeServices(){return NodeServices},get DataServiceTypes(){return DataServiceTypes},get SelectionModes(){return SelectionModes},get ExtensionTypes(){return ExtensionTypes},get EventTypes(){return EventTypes},get ResourceTypes(){return ResourceTypes}});let requestId=0;
// for now we only need any kind of id, not even unique, later will need unique ones
const generateRequestId=()=>(requestId+=1,requestId),createJsonRpcRequest=(method,params=[])=>({jsonrpc:"2.0",method:method,params:params,id:generateRequestId()})
/**
     * A utility class to interact with JsonDataServices implemented by a UI Extension node.
     */;// 10s
var KnimeConstants=Object.freeze({__proto__:null,UI_EXT_POST_MESSAGE_PREFIX:"knimeUIExtension",UI_EXT_POST_MESSAGE_TIMEOUT:1e4});
/**
     * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
     * IFrame and parent window via window.postMessage.
     *
     * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
     *
     * Other services should be initialized with instance of the class.
     */const KnimeUtils=Object.assign({generateRequestId:generateRequestId,createJsonRpcRequest:createJsonRpcRequest},KnimeConstants);var KnimeUIExtensionService=Object.freeze({__proto__:null,KnimeTypes:index,KnimeService:KnimeService,JsonDataService:class{
/**
         * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
         *      with the framework.
         */
constructor(knimeService){this.knimeService=knimeService}
/**
         * Calls the node data service with optional request body. The service to call is specified by the service type
         * and needs to correspond directly to a {@see DataServiceType} supported by the node.
         *
         * @param {DataServiceType} dataServiceType - the data service type.
         * @param {string} [request] - an optional request payload.
         * @returns {Promise} rejected or resolved depending on backend response.
         */callDataService(dataServiceType,request=""){return this.knimeService.callService([NodeServices.CALL_NODE_DATA_SERVICE,dataServiceType,request]).then((response=>"string"==typeof response&&""!==response?JSON.parse(response):response))}
/**
         * Retrieves the initial data for the client-side UI Extension implementation from either the local configuration
         * (if it exists) or by fetching the data from the node DataService implementation.
         *
         * @returns {Promise} node initial data provided by the local configuration or by fetching from the DataService.
         */initialData(){var _a;const initialData=(null===(_a=this.knimeService.extensionConfig)||void 0===_a?void 0:_a.initialData)||null;return initialData?Promise.resolve(initialData).then((response=>"string"==typeof response?JSON.parse(response):response)):this.callDataService(DataServiceTypes.INITIAL_DATA)}
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
         */data(params={}){return this.callDataService(DataServiceTypes.DATA,JSON.stringify(createJsonRpcRequest(params.method||"getData",params.options)))}
/**
         * Sends the current client-side data to the backend to be persisted. A data getter method which returns the
         * data to be applied/saved should be registered *prior* to invoking this method. If none is registered, a
         * default payload of "null" will be sent instead.
         *
         * @returns {Promise} rejected or resolved depending on backend response.
         */async applyData(){const data=await this.knimeService.getData();return this.callDataService(DataServiceTypes.APPLY_DATA,data)}
/**
         * Registers a function with the framework is used to provide the current state of the client-side UI Extension.
         *
         * @param {Function} callback - function which provides the current client side state when invoked.
         * @returns {undefined}
         */registerDataGetter(callback){this.knimeService.registerDataGetter((()=>JSON.stringify(callback())))}
/**
         * Adds callback that will be triggered when data changes.
         * @param {Function} callback - called on data change.
         * @param {Notification} response - the data update event object.
         * @returns {void}
         */addOnDataChangeCallback(callback){this.knimeService.addNotificationCallback(EventTypes.DataEvent,callback)}
/**
         * Publish a data update notification to other UIExtensions registered in the current page.
         * @param {any} data - the data to send.
         * @returns {void}
         */publishData(data){this.knimeService.pushNotification({method:EventTypes.DataEvent,event:{data:data}})}}
/**
     * KNIME Analytics Platform constant.
     */,IFrameKnimeService:class extends KnimeService{constructor(){super(),this.pendingServiceCalls=new Map,
// to allow awaiting the initialization via waitForInitialization()
// TODO NXTEXT-135 remove the need for this
this.initializationPromise=new Promise((resolve=>{this.initializationPromiseResolve=resolve})),this.extensionConfig&&this.initializationPromiseResolve(),this.callableService=this.executeServiceCall,this.boundOnMessageFromParent=this.onMessageFromParent.bind(this),window.addEventListener("message",this.boundOnMessageFromParent),window.parent.postMessage({type:"knimeUIExtension:ready"},"*")}
/**
         * Needs to be awaited before the service is ready to be used.
         * @returns {void}
         */async waitForInitialization(){await this.initializationPromise}
/**
         * Called when a new message is received, identifies and handles it if type is supported.
         * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
         * @returns {void}
         */onMessageFromParent(event){var _a;
// TODO NXT-793 security
const{data:data}=event;if(null===(_a=data.type)||void 0===_a?void 0:_a.startsWith("knimeUIExtension"))switch(data.type){case"knimeUIExtension:init":this.onInit(data);break;case"knimeUIExtension:callServiceResponse":this.onCallServiceResponse(data);break;case"knimeUIExtension:serviceNotification":
// TODO: remove when UIEXT-136 implemented
this.onServiceNotification(data.payload.data||data.payload)}}onInit(data){this.extensionConfig=data.payload,this.initializationPromiseResolve()}onCallServiceResponse(data){const{payload:{response:response,requestId:requestId}}=data,request=this.pendingServiceCalls.get(requestId);if(!request){const message=`Received callService response for non-existing pending request with id ${requestId}`;throw this.pushError(message,"req-not-found"),new Error(message)}request.resolve(JSON.parse(response)),this.pendingServiceCalls.delete(requestId)}
/**
         * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
         * @param {ServiceParameters} serviceParams - parameters for the service call.
         * @returns {Promise<string>} - promise that resolves with response from the service call string or error message.
         */executeServiceCall(serviceParams){let rejectTimeoutId;const requestId=generateRequestId(),promise=new Promise(((resolve,reject)=>{this.pendingServiceCalls.set(requestId,{resolve:resolve,reject:reject}),rejectTimeoutId=setTimeout((()=>{const message=`Request with id ${requestId} aborted due to timeout.`;this.pushError(message,"req-not-found"),resolve(JSON.stringify({error:{message:message,code:"req-timeout"},result:null}))}),1e4)}));// TODO NXT-793 security
// clearing reject timeout on promise resolve
return promise.then((()=>{clearTimeout(rejectTimeoutId)})),window.parent.postMessage({type:"knimeUIExtension:callService",payload:{requestId:requestId,serviceParams:serviceParams}},"*"),promise}
/**
         * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
         * preventing memory leaks and unexpected behavior.
         * @returns {void}
         */destroy(){window.removeEventListener("message",this.boundOnMessageFromParent)}}
/**
     * Handles postMessage communication with iframes on side of the parent window.
     *
     * IFrame window communication should be setup with instance of IFrameKnimeService.
     *
     * Should be instantiated by class that persists at root window object.
     */,IFrameKnimeServiceAdapter:class extends KnimeService{constructor(extensionConfig=null,callableService=null){super(extensionConfig,callableService),this.boundOnMessageFromIFrame=this.onMessageFromIFrame.bind(this),window.addEventListener("message",this.boundOnMessageFromIFrame)}
/**
         * Sets the child iframe window referenced by the service.
         *
         * @param {Window} iFrameWindow - the content window of the child frame where the @see IFrameKnimeService
         *      is running.
         * @returns {void}
         */setIFrameWindow(iFrameWindow){this.iFrameWindow=iFrameWindow}
/**
         * Adds a new message event listener
         *
         * @returns {void}
         */updateEventListener(){window.removeEventListener("message",this.boundOnMessageFromIFrame),window.addEventListener("message",this.boundOnMessageFromIFrame)}
/**
         * Checks if message is coming from the correct IFrame and therefore is secure.
         * @param {MessageEvent} event - postMessage event.
         * @returns {boolean} - returns true if postMessage source is secure.
         */checkMessageSource(event){return event.source!==this.iFrameWindow}
/**
         * Listens for postMessage events, identifies and handles them if event type is supported.
         * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
         * @returns {void}
         */async onMessageFromIFrame(event){if(this.checkMessageSource(event))return;const{data:data}=event;switch(data.type){case"knimeUIExtension:ready":this.iFrameWindow.postMessage({type:"knimeUIExtension:init",payload:this.extensionConfig},"*");break;case"knimeUIExtension:callService":{const{payload:{requestId:requestId,serviceParams:serviceParams}}=data,response=await this.callService(serviceParams);this.iFrameWindow.postMessage({type:"knimeUIExtension:callServiceResponse",payload:{response:response,requestId:requestId}},"*")}}}onServiceNotification(notification){this.iFrameWindow.postMessage({type:"knimeUIExtension:serviceNotification",payload:"string"==typeof notification?JSON.parse(notification):notification},"*")}
/**
         * Should be called before destroying the IFrame to remove event listeners from window object,
         * preventing memory leaks and unexpected behavior.
         * @returns {void}
         */destroy(){window.removeEventListener("message",this.boundOnMessageFromIFrame),this.iFrameWindow=null}}
/**
     * SelectionService provides methods to handle data selection.
     * To use it, the relating Java implementation also needs to use the SelectionService.
     */,SelectionService:class{
/**
         * @param {KnimeService} knimeService - instance should be provided to use notifications.
         */
constructor(knimeService){this.knimeService=knimeService}
/**
         * Calls a selection service via the node service `updateDataPointSelection` method with provided request body.
         * The selection service to call is specified by the service type and needs to correspond directly to
         * a {@see SelectionServices}.
         *
         * @param {SelectionMode} selectionMode - the selection mode.
         * @param {string} request - the request payload.
         * @returns {Promise} rejected or resolved depending on backend response.
         */callSelectionService(selectionMode,request){return this.knimeService.callService([NodeServices.CALL_NODE_SELECTION_SERVICE,selectionMode,request]).then((response=>"string"==typeof response?JSON.parse(response):response))}
/**
         * Adds data to currently selected data set.
         * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
         * @returns {Promise<Object>} based on backend implementation.
         */add(keys){return this.callSelectionService(SelectionModes.ADD,keys)}
/**
         * Removes data from currently selected data set.
         * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
         * @returns {Promise<Object>} - based on backend implementation.
         */remove(keys){return this.callSelectionService(SelectionModes.REMOVE,keys)}
/**
         * Replaces current selection with provided data.
         * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
         * @returns {Promise<Object>} - based on backend implementation.
         */replace(keys){return this.callSelectionService(SelectionModes.REPLACE,keys)}
/**
         * Adds callback that will be triggered on data selection change by backend.
         * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
         * @param {Notification} response - object that backend will trigger callback with.
         * @returns {void}
         */addOnSelectionChangeCallback(callback){this.knimeService.addNotificationCallback(EventTypes.SelectionEvent,callback)}
/**
         * Removes previously added callback.
         * @param {function} callback - that needs to be removed from notifications.
         * @param {Notification} response - object that backend will trigger callback with.
         * @returns {void}
         */removeOnSelectionChangeCallback(callback){this.knimeService.removeNotificationCallback(EventTypes.SelectionEvent,callback)}},KnimeUtils:KnimeUtils});return Object.defineProperty(window,"KnimeUIExtensionService",KnimeUIExtensionService),KnimeUIExtensionService}();
