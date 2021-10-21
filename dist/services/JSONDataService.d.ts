import { KnimeService } from "../index";
/**
 * Class represents JSONDataService used to fetch data with window.jsonrpc provided by backend in json format
 */
declare class JSONDataService<T = any> {
    private knimeService;
    /**
     * @param {KnimeService} knimeService knimeService instance, used to provide initialData && callService functionality
     */
    /**
     * @param {KnimeService} knimeService knimeService instance, used to provide initialData && callService functionality
     */
    constructor(knimeService: KnimeService<T>);
    /**
     * Calls knimeService callService with defined service type CALL_NODE_DATA_SERVICE
     * @param {DataServiceTypes} serviceType one of available method names for CALL_NODE_DATA_SERVICE
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    /**
     * Calls knimeService callService with defined service type CALL_NODE_DATA_SERVICE
     * @param {DataServiceTypes} serviceType one of available method names for CALL_NODE_DATA_SERVICE
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    private callDataService;
    /**
     * @returns {Promise} node initial data provided by knime service, or received with window.jsonrpc
     */
    /**
     * @returns {Promise} node initial data provided by knime service, or received with window.jsonrpc
     */
    getInitialData(): Promise<any>;
    /**
     * @param {string} method name of method that should be called
     * @param {any} params that should be passed to called method
     * @returns {Promise} resolve value depends on called method
     */
    /**
     * @param {string} method name of method that should be called
     * @param {any} params that should be passed to called method
     * @returns {Promise} resolve value depends on called method
     */
    getData(method: string, ...params: any[]): Promise<any>;
    applyData(): Promise<any>;
    // should be promise
    registerDataGetter(callback: () => any): void;
}
export { JSONDataService };
