import { KnimeService } from 'src';
import { JSONRpcServices, ViewDataServiceMethods } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';

// TODO: NXTEXT-80 add JSDoc comments
export class JSONDataService<T = any> {
    private knimeService: KnimeService<T>;

    private initData: T;

    constructor(knimeService: KnimeService<T>) {
        this.knimeService = knimeService;
        this.initData = null;

        const initData = this.knimeService.extInfo?.initData || null;
        if (initData) {
            this.initData = typeof initData === 'string' ? JSON.parse(initData) : initData;
        }
    }

    private callDataService(serviceType: ViewDataServiceMethods, request = '') {
        return this.knimeService.callService(
            JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE,
            serviceType,
            request
        );
    }

    getInitialData() {
        if (this.initData) {
            return Promise.resolve(this.initData);
        }

        return this.callDataService(ViewDataServiceMethods.INITIAL_DATA, '');
    }

    getDataByMethodName(method: string, ...params) {
        // TODO: NXT-737 handle errors

        return this.callDataService(
            ViewDataServiceMethods.DATA,
            createJsonRpcRequest(method, params)
        );
    }

    getData(...params) {
        return this.getDataByMethodName('getData', ...params);
    }

    // TODO: NXTEXT-77 implement apply data
    applyData(/* data */) {
        return this.callDataService(ViewDataServiceMethods.APPLY_DATA, '');
    }
}
