import { KnimeService } from 'src';
import { JSONRpcServices, DataServiceTypes } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';

// TODO: NXTEXT-80 add JSDoc comments
export class JSONDataService<T = any> {
    private knimeService: KnimeService<T>;

    private initialData: T;

    constructor(knimeService: KnimeService<T>) {
        this.knimeService = knimeService;
        this.initialData = null;

        const initialData = this.knimeService.extensionConfig?.initialData || null;
        if (initialData) {
            this.initialData = typeof initialData === 'string' ? JSON.parse(initialData) : initialData;
        }
    }

    private callDataService(serviceType: DataServiceTypes, request = '') {
        return this.knimeService.callService(
            JSONRpcServices.CALL_NODE_DATA_SERVICE,
            serviceType,
            request
        );
    }

    getInitialData() {
        if (this.initialData) {
            return Promise.resolve(this.initialData);
        }

        return this.callDataService(DataServiceTypes.INITIAL_DATA, '');
    }

    getDataByMethodName(method: string, ...params) {
        // TODO: NXT-737 handle errors

        return this.callDataService(
            DataServiceTypes.DATA,
            createJsonRpcRequest(method, params)
        );
    }

    // TODO this is just a temporary short-cut - see NXT-761
    getData(...params) {
        return this.getDataByMethodName('getData', ...params);
    }

    // TODO: NXTEXT-77 implement apply data
    applyData(/* data */) {
        return this.callDataService(DataServiceTypes.APPLY_DATA, '');
    }
}
