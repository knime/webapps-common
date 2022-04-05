import { IFrameKnimeService } from "../index";
import { Notification } from "../index-b3e43760";
import { KnimeService } from "./KnimeService";
/**
 * A utility class to interact with JsonDataServices implemented by a UI Extension node.
 */
declare class JsonDataService<T = any> {
    private knimeService;
    /**
     * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
     *      with the framework.
     */
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
    /**
     * Publish a data update notification to other UIExtensions registered in the current page.
     * @param {any} data - the data to send.
     * @returns {void}
     */
    publishData(data: any): void;
    private handleError;
    private handleWarnings;
}
export { JsonDataService };
