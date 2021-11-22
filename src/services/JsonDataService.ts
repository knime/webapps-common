import { IFrameKnimeService, ComponentKnimeService } from 'src';
import { NodeServiceMethods, DataServiceTypes } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';
import { KnimeService } from './KnimeService';

/**
 * A utility class to interact with JsonDataServices implemented by a UI Extension node.
 */
export class JsonDataService<T = any> {
    private knimeService: ComponentKnimeService | IFrameKnimeService | KnimeService<T>;

    /**
     * @param {ComponentKnimeService | IFrameKnimeService} knimeService - knimeService instance which is used to communicate with the framework.
     */
    constructor(knimeService: ComponentKnimeService | IFrameKnimeService | KnimeService<T>) {
        this.knimeService = knimeService;
    }

    /**
     * Calls a node's {@see DataService} with optional request body. The service to call is specified by the
     * service type and needs to correspond directly to a {@see DataService} implemented by the node. For
     * known service types, {@see DataServiceTypes}.
     *
     * @param {DataServiceTypes} dataService - the target service.
     * @param {string} [request] - an optional request payload.
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    private callDataService(dataService: DataServiceTypes, request = '') {
        return this.knimeService.callService(NodeServiceMethods.CALL_NODE_DATA_SERVICE, dataService, request);
    }

    /**
     * Retrieves the initial data for the client-side UI Extension implementation from either the local configuration
     * (if it exists) or by fetching the data from the node DataService implementation.
     *
     * @returns {Promise} node initial data provided by the local configuration or by fetching from the DataService.
     */
    initialData() {
        const initialData = this.knimeService.extensionConfig?.initialData || null;
        if (initialData) {
            return Promise.resolve(typeof initialData === 'string' ? JSON.parse(initialData) : initialData);
        }

        return this.callDataService(DataServiceTypes.INITIAL_DATA);
    }

    /**
     * Retrieve data from the node using the {@see DataServiceTypes.DATA} api. Different method names can be registered
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
    data(params: { method?: string, options?: any } = {}) {
        return this.callDataService(
            DataServiceTypes.DATA,
            JSON.stringify(createJsonRpcRequest(params.method || 'getData', params.options))
        );
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
        return this.callDataService(
            DataServiceTypes.APPLY_DATA,
            JSON.stringify(data)
        );
    }

    /**
     * Registers a function with the framework is used to provide the current state of the client-side UI Extension.
     *
     * @param {Function} callback - function which provides the current client side state when invoked.
     * @returns {undefined}
     */
    registerDataGetter(callback: () => any) {
        this.knimeService.registerDataGetter(() => JSON.stringify(callback()));
    }
}
