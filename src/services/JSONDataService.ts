import { KnimeService } from 'src';
import { RPCNodeServices, DataServices } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';

/**
 * Class represents JSONDataService used to fetch data with window.jsonrpc provided by backend in json format
 */
export class JSONDataService<T = any> {
    private knimeService: KnimeService<T>;

    /**
     * @param {KnimeService} knimeService knimeService instance, used to provide initialData && callService functionality
     */
    constructor(knimeService: KnimeService<T>) {
        this.knimeService = knimeService;
    }

    /**
     * Calls knimeService callService with defined service type CALL_NODE_DATA_SERVICE
     * @param {DataServiceTypes} serviceType one of available method names for CALL_NODE_DATA_SERVICE
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    private callDataService(serviceType: DataServices, request = '') {
        return this.knimeService.callService(
            RPCNodeServices.CALL_NODE_DATA_SERVICE,
            serviceType,
            request
        );
    }

    /**
     * @returns {Promise} node initial data provided by knime service, or received with window.jsonrpc
     */
    getInitialData() {
        if (this.knimeService.extensionConfig?.initialData) {
            return Promise.resolve(this.knimeService.extensionConfig.initialData);
        }

        return this.callDataService(DataServices.INITIAL_DATA, '');
    }

    /**
     * @param {string} method name of method that should be called
     * @param {any} params that should be passed to called method
     * @returns {Promise} resolve value depends on called method
     */
    getDataByMethodName(method: string, ...params) {
        // @TODO: NXT-737 handle errors

        return this.callDataService(
            DataServices.DATA,
            createJsonRpcRequest(method, params)
        );
    }

    // TODO this is just a temporary short-cut - see NXT-761
    getData(...params) {
        return this.getDataByMethodName('getData', ...params);
    }

    registerGetDataToApply(callback: () => any) {
        this.knimeService.registerGetDataToApply(() => JSON.stringify(callback()));
    }

    // TODO: NXTEXT-77 implement apply data
    applyData(/* data */) {
        return this.callDataService(DataServices.APPLY_DATA, '');
    }
}
