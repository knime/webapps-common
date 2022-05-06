import { NodeServices } from '../types/NodeServices.js';
import { DataServiceTypes } from '../types/DataServiceTypes.js';
import '../types/SelectionModes.js';
import '../types/ExtensionTypes.js';
import { EventTypes } from '../types/EventTypes.js';
import '../types/ResourceTypes.js';
import { AlertTypes } from '../types/AlertTypes.js';
import { createJsonRpcRequest } from '../utils/createJsonRpcRequest.js';

const MAX_MESSAGE_LEN = 160;
/**
 * A utility class to interact with JsonDataServices implemented by a UI Extension node.
 */
class JsonDataService {
    /**
     * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
     *      with the framework.
     */
    constructor(knimeService) {
        this.knimeService = knimeService;
    }
    /**
     * Calls the node data service with optional request body. The service to call is specified by the service type
     * and needs to correspond directly to a {@see DataServiceType} supported by the node.
     *
     * @param {DataServiceType} dataServiceType - the data service type.
     * @param {string} [request] - an optional request payload.
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    callDataService(dataServiceType, request = '') {
        return this.knimeService.callService([NodeServices.CALL_NODE_DATA_SERVICE, dataServiceType, request])
            // empty string check is required because it cannot be parsed but is a valid/expected response
            .then((response) => typeof response === 'string' && response !== '' ? JSON.parse(response) : response);
    }
    /**
     * Retrieves the initial data for the client-side UI Extension implementation from either the local configuration
     * (if it exists) or by fetching the data from the node DataService implementation.
     *
     * @returns {Promise} node initial data provided by the local configuration or by fetching from the DataService.
     */
    async initialData() {
        var _a, _b;
        let initialData;
        if ((_a = this.knimeService.extensionConfig) === null || _a === void 0 ? void 0 : _a.initialData) {
            initialData = await Promise.resolve((_b = this.knimeService.extensionConfig) === null || _b === void 0 ? void 0 : _b.initialData);
        }
        else {
            initialData = await this.callDataService(DataServiceTypes.INITIAL_DATA);
        }
        if (typeof initialData === 'string') {
            initialData = JSON.parse(initialData);
        }
        const { result, warningMessages, userError, internalError } = initialData || {};
        if (userError || internalError) {
            this.handleError(userError || internalError);
        }
        if (warningMessages) {
            this.handleWarnings(warningMessages);
        }
        return Promise.resolve(result);
    }
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
    async data(params = {}) {
        const response = await this.callDataService(DataServiceTypes.DATA, JSON.stringify(createJsonRpcRequest(params.method || 'getData', params.options)));
        let wrappedResult = (response === null || response === void 0 ? void 0 : response.result) || {};
        if (typeof wrappedResult === 'string') {
            wrappedResult = JSON.parse(wrappedResult);
        }
        const { error, warningMessages, result } = wrappedResult;
        if (error) {
            this.handleError(Object.assign(Object.assign({}, error.data || {}), error));
        }
        if (warningMessages) {
            this.handleWarnings(warningMessages);
        }
        return Promise.resolve(result);
    }
    /**
     * Sends the current client-side data to the backend to be persisted. A data getter method which returns the
     * data to be applied/saved should be registered *prior* to invoking this method. If none is registered, a
     * default payload of "null" will be sent instead.
     *
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    async applyData() {
        const data = await this.knimeService.getData();
        return this.callDataService(DataServiceTypes.APPLY_DATA, data);
    }
    /**
     * Registers a function with the framework is used to provide the current state of the client-side UI Extension.
     *
     * @param {Function} callback - function which provides the current client side state when invoked.
     * @returns {undefined}
     */
    registerDataGetter(callback) {
        this.knimeService.registerDataGetter(() => JSON.stringify(callback()));
    }
    /**
     * Adds callback that will be triggered when data changes.
     * @param {Function} callback - called on data change.
     * @param {Notification} response - the data update event object.
     * @returns {void}
     */
    addOnDataChangeCallback(callback) {
        this.knimeService.addNotificationCallback(EventTypes.DataEvent, callback);
    }
    /**
     * Publish a data update notification to other UIExtensions registered in the current page.
     * @param {any} data - the data to send.
     * @returns {void}
     */
    publishData(data) {
        this.knimeService.pushNotification({
            event: { data, method: EventTypes.DataEvent }
        });
    }
    handleError(error = {}) {
        const { details = '', stackTrace = '', typeName = '', message = '', code } = error;
        let messageSubject = '';
        let messageBody = '';
        if (message) {
            if (message.length <= MAX_MESSAGE_LEN) {
                messageSubject = message;
            }
            else {
                messageBody = message;
            }
        }
        if (typeName) {
            if (messageSubject) {
                messageBody = typeName;
            }
            else {
                messageSubject = typeName;
            }
        }
        if (details) {
            messageBody = messageBody ? `${messageBody}\n\n${details}` : details;
        }
        if (Array.isArray(stackTrace)) {
            const formattedStack = stackTrace.join('\n\t');
            messageBody = messageBody ? `${messageBody}\n\n${formattedStack}` : formattedStack;
        }
        messageBody = messageBody.trim();
        this.knimeService.sendError(this.knimeService.createAlert({
            subtitle: messageSubject || 'Something went wrong',
            message: messageBody || 'No further information available. Please check the workflow configuration.',
            type: AlertTypes.ERROR,
            code
        }));
    }
    handleWarnings(warningMessages) {
        let subtitle;
        const message = warningMessages === null || warningMessages === void 0 ? void 0 : warningMessages.join('\n\n');
        if ((warningMessages === null || warningMessages === void 0 ? void 0 : warningMessages.length) > 1) {
            subtitle = `${warningMessages === null || warningMessages === void 0 ? void 0 : warningMessages.length} messages`;
        }
        else if ((message === null || message === void 0 ? void 0 : message.length) > MAX_MESSAGE_LEN) {
            subtitle = 'Expand for details';
        }
        this.knimeService.sendWarning(this.knimeService.createAlert({ type: AlertTypes.WARN, message, subtitle }));
    }
}

export { JsonDataService };
