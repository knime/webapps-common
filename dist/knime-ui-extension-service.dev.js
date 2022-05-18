var KnimeUIExtensionService=function(){"use strict";
/**
     * @enum
     */var AlertTypes,NodeServices,DataServiceTypes,SelectionModes,ExtensionTypes,EventTypes,ResourceTypes;!function(AlertTypes){AlertTypes.ERROR="error",AlertTypes.WARN="warn"}(AlertTypes||(AlertTypes={}));
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
class KnimeService{
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
         * Public service call wrapper with full error handling which can be used by subclasses/typed service
         * implementations.
         *
         * @param {ServiceParameters} serviceParams - service parameters for the service call.
         * @returns {Promise<CallServiceResponse>} - resolved promise containing error or result depending on response
         *      success.
         */async callService(serviceParams){if(!this.extensionConfig){const error=this.createAlert({subtitle:"Missing extension config",message:"Cannot call service without extension config"});return this.sendError(error),Promise.resolve({})}if(!this.callableService){const error=this.createAlert({message:"Callable service is not available",subtitle:"Service not found"});return this.sendError(error),Promise.resolve({})}const response=await this.executeServiceCall(serviceParams),{error:error,result:result}=response||{};
// handle top level RPC errors only
return error&&this.sendError(error),Promise.resolve({result:result})}
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
         */pushNotification(notification){if(!this.extensionConfig){const error=this.createAlert({subtitle:"Missing extension config",message:"Cannot push notification without extension config"});return this.sendError(error),Promise.resolve({})}if(!this.callablePushNotification){const error=this.createAlert({subtitle:"Push notification failed",message:"Push notification is not available"});return this.sendError(error),Promise.resolve({})}return this.callablePushNotification(Object.assign({callerId:this.serviceId},notification))}
/**
         * Pushes error to framework to be displayed to the user.
         *
         * @param {Alert} alert - the error alert.
         * @returns {void}
         */sendError(alert){this.callablePushNotification?this.callablePushNotification({callerId:this.serviceId,alert:alert,type:"alert"}):
// eslint-disable-next-line no-console
console.error(alert)}
/**
         * Pushes warning to framework to be displayed to the user.
         *
         * @param {Alert} alert - the warning alert.
         * @returns {void}
         */sendWarning(alert){this.callablePushNotification?this.callablePushNotification({callerId:this.serviceId,alert:alert,type:"alert"}):
// eslint-disable-next-line no-console
console.warn(alert)}
/**
         * Helper method to create framework compatible {@see Alert} from the available information.
         *
         * @param {Object} alertParams - optional parameters for the formatted alert.
         * @returns {Alert} the properly formatted alert.
         */createAlert(alertParams){var _a,_b;const{type:type=AlertTypes.ERROR,message:message,code:code,subtitle:subtitle}=alertParams;return{nodeId:(null===(_a=this.extensionConfig)||void 0===_a?void 0:_a.nodeId)||"MISSING",nodeInfo:(null===(_b=this.extensionConfig)||void 0===_b?void 0:_b.nodeInfo)||{},type:type,message:message,code:code,subtitle:subtitle}}
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
     */!function(NodeServices){
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
const generateRequestId=()=>(requestId+=1,requestId),createJsonRpcRequest=(method,params=[])=>({jsonrpc:"2.0",method:method,params:params,id:generateRequestId()});// 10s
var KnimeConstants=Object.freeze({__proto__:null,UI_EXT_POST_MESSAGE_PREFIX:"knimeUIExtension",UI_EXT_POST_MESSAGE_TIMEOUT:1e4});
/**
     * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
     * IFrame and parent window via window.postMessage.
     *
     * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
     *
     * Other services should be initialized with instance of the class.
     */class IFrameKnimeService extends KnimeService{constructor(){super(),this.pendingServiceCalls=new Map,
// to allow awaiting the initialization via waitForInitialization()
// TODO NXTEXT-135 remove the need for this
this.initializationPromise=new Promise((resolve=>{this.initializationPromiseResolve=resolve})),this.extensionConfig&&this.initializationPromiseResolve(),this.callableService=this.executeServiceCall,this.callablePushNotification=IFrameKnimeService.iframePushNotification,this.boundOnMessageFromParent=this.onMessageFromParent.bind(this),window.addEventListener("message",this.boundOnMessageFromParent),IFrameKnimeService.postMessage({messageType:"ready"})}
/**
         * Needs to be awaited before the service is ready to be used.
         * @returns {void}
         */async waitForInitialization(){await this.initializationPromise}
/**
         * Called when a new message is received, identifies and handles it if type is supported.
         * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
         * @returns {void}
         */onMessageFromParent(event){var _a,_b;
// TODO NXT-793 security
const{data:data}=event;if(!(null===(_a=data.type)||void 0===_a?void 0:_a.startsWith("knimeUIExtension")))return;switch(null===(_b=data.type)||void 0===_b?void 0:_b.replace("knimeUIExtension:","")){case"init":this.onInit(data);break;case"callServiceResponse":this.onCallServiceResponse(data);break;case"serviceNotification":this.onServiceNotification(data.payload)}}onInit(data){this.extensionConfig=data.payload,this.initializationPromiseResolve()}onCallServiceResponse(data){const{payload:{response:response,requestId:requestId}}=data,request=this.pendingServiceCalls.get(requestId);if(request)return request.resolve(response),void this.pendingServiceCalls.delete(requestId);const errorMessage=this.createAlert({code:"404",subtitle:"Request not found",type:AlertTypes.ERROR,message:`Received callService response for non-existing pending request with id ${requestId}`});this.sendError(errorMessage)}
/**
         * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
         * @param {ServiceParameters} serviceParams - parameters for the service call.
         * @returns {Promise<string>} - promise that resolves with response from the service call string or error message.
         */executeServiceCall(serviceParams){let rejectTimeoutId;const requestId=generateRequestId(),promise=new Promise(((resolve,reject)=>{this.pendingServiceCalls.set(requestId,{resolve:resolve,reject:reject}),rejectTimeoutId=setTimeout((()=>{const errorMessage=this.createAlert({code:"408",subtitle:"Request Timeout",type:AlertTypes.ERROR,message:`Request with id ${requestId} aborted due to timeout.`});this.sendError(errorMessage),resolve(JSON.stringify({error:errorMessage}))}),1e4)}));
// clearing reject timeout on promise resolve
return promise.then((()=>{clearTimeout(rejectTimeoutId)})),IFrameKnimeService.postMessage({payload:{requestId:requestId,serviceParams:serviceParams},messageType:"callService"}),promise}static postMessage(messageParams){const{payload:payload,messageType:messageType}=messageParams;
// TODO NXT-793 security
window.parent.postMessage({type:`knimeUIExtension:${messageType}`,payload:payload},"*")}static iframePushNotification(notification){return IFrameKnimeService.postMessage({payload:{notification:notification},messageType:"notification"}),Promise.resolve()}
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
     */const KnimeUtils=Object.assign({generateRequestId:generateRequestId,createJsonRpcRequest:createJsonRpcRequest},KnimeConstants);var KnimeUIExtensionService=Object.freeze({__proto__:null,KnimeTypes:index,KnimeService:KnimeService,JsonDataService:
/**
     * A utility class to interact with JsonDataServices implemented by a UI Extension node.
     */
class{
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
         */async initialData(){var _a,_b;let initialData;initialData=(null===(_a=this.knimeService.extensionConfig)||void 0===_a?void 0:_a.initialData)?await Promise.resolve(null===(_b=this.knimeService.extensionConfig)||void 0===_b?void 0:_b.initialData):await this.callDataService(DataServiceTypes.INITIAL_DATA),"string"==typeof initialData&&(initialData=JSON.parse(initialData));const{result:result,warningMessages:warningMessages,userError:userError,internalError:internalError}=initialData||{};return(userError||internalError)&&this.handleError(userError||internalError),warningMessages&&this.handleWarnings(warningMessages),Promise.resolve(result)}
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
         */async data(params={}){const response=await this.callDataService(DataServiceTypes.DATA,JSON.stringify(createJsonRpcRequest(params.method||"getData",params.options)));let wrappedResult=(null==response?void 0:response.result)||{};"string"==typeof wrappedResult&&(wrappedResult=JSON.parse(wrappedResult));const{error:error,warningMessages:warningMessages,result:result}=wrappedResult;return error&&this.handleError(Object.assign(Object.assign({},error.data||{}),error)),warningMessages&&this.handleWarnings(warningMessages),Promise.resolve(result)}
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
         */publishData(data){this.knimeService.pushNotification({event:{data:data,method:EventTypes.DataEvent}})}handleError(error={}){const{details:details="",stackTrace:stackTrace="",typeName:typeName="",message:message="",code:code}=error;let messageSubject="",messageBody="";if(message&&(message.length<=160?messageSubject=message:messageBody=message),typeName&&(messageSubject?messageBody=typeName:messageSubject=typeName),details&&(messageBody=messageBody?`${messageBody}\n\n${details}`:details),Array.isArray(stackTrace)){const formattedStack=stackTrace.join("\n\t");messageBody=messageBody?`${messageBody}\n\n${formattedStack}`:formattedStack}messageBody=messageBody.trim(),this.knimeService.sendError(this.knimeService.createAlert({subtitle:messageSubject||"Something went wrong",message:messageBody||"No further information available. Please check the workflow configuration.",type:AlertTypes.ERROR,code:code}))}handleWarnings(warningMessages){let subtitle;const message=null==warningMessages?void 0:warningMessages.join("\n\n");(null==warningMessages?void 0:warningMessages.length)>1?subtitle=`${null==warningMessages?void 0:warningMessages.length} messages`:(null==message?void 0:message.length)>160&&(subtitle="Expand for details"),this.knimeService.sendWarning(this.knimeService.createAlert({type:AlertTypes.WARN,message:message,subtitle:subtitle}))}}
/**
     * KNIME Analytics Platform constant.
     */,IFrameKnimeService:IFrameKnimeService,IFrameKnimeServiceAdapter:class extends KnimeService{constructor(extensionConfig=null,callableService=null,pushNotification=null){super(extensionConfig,callableService,pushNotification),this.boundOnMessageFromIFrame=this.onMessageFromIFrame.bind(this),window.addEventListener("message",this.boundOnMessageFromIFrame)}
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
         */async onMessageFromIFrame(event){var _a;if(this.checkMessageSource(event))return;const{data:data}=event;switch(null===(_a=data.type)||void 0===_a?void 0:_a.replace("knimeUIExtension:","")){case"ready":this.postMessage({payload:this.extensionConfig,messageType:"init"});break;case"callService":{const{payload:{requestId:requestId,serviceParams:serviceParams}}=data,response=await this.callService(serviceParams);this.postMessage({payload:{response:response,requestId:requestId},messageType:"callServiceResponse"})}break;case"notification":{const{payload:{notification:notification}}=data;this.pushNotification(notification)}}}onServiceNotification(notification){const payload="string"==typeof notification?JSON.parse(notification):notification;this.postMessage({payload:payload,messageType:"serviceNotification"})}
/**
         * Should be called before destroying the IFrame to remove event listeners from window object,
         * preventing memory leaks and unexpected behavior.
         * @returns {void}
         */destroy(){window.removeEventListener("message",this.boundOnMessageFromIFrame),this.iFrameWindow=null}postMessage(messageParams){const{payload:payload,messageType:messageType}=messageParams;this.iFrameWindow.postMessage({type:`knimeUIExtension:${messageType}`,payload:payload},"*")}}
/**
     * SelectionService provides methods to handle data selection.
     * To use it, the relating Java implementation also needs to use the SelectionService.
     */,SelectionService:class{
/**
         * @param {KnimeService} knimeService - instance should be provided to use notifications.
         */
constructor(knimeService){this.knimeService=knimeService}
/**
         * Replaces current selection with provided data.
         * @param {SelectionMode} mode - the selection mode.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} - based on backend implementation.
         */updateSelection(mode,selection){return this.knimeService.callService([NodeServices.CALL_NODE_SELECTION_SERVICE,mode,selection]).then((response=>"string"==typeof response?JSON.parse(response):response))}
/**
         * Adds data to currently selected data set.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} based on backend implementation.
         */add(selection){return this.updateSelection(SelectionModes.ADD,selection)}
/**
         * Removes data from currently selected data set.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} based on backend implementation.
         */remove(selection){return this.updateSelection(SelectionModes.REMOVE,selection)}
/**
         * Replaces current selection with provided data.
         * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
         * @returns {Promise<any>} based on backend implementation.
         */replace(selection){return this.updateSelection(SelectionModes.REPLACE,selection)}
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
