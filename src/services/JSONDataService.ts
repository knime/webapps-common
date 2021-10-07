import { KnimeService } from 'src';
import { JSONRpcServices, ViewDataServiceMethods } from 'src/types';

export class JSONDataService<T = any> {
    private knimeService: KnimeService<T>;

    private initData: T;

    constructor(knimeService) {
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
        // @TODO: if (this.extInfo.hasInitData) {
        // @TODO: how we should prioritize data sources?
        if (this.initData) {
            return Promise.resolve(this.initData);
        }

        return this.callDataService(ViewDataServiceMethods.INITIAL_DATA, '');
    }

    getData() {
        // @TODO: what kind of error handling we suppose here?
        return this.callDataService(ViewDataServiceMethods.DATA, '');
    }

    // @TODO: should receive some kind of data, stringifyed JSON?
    applyData(data) {
        return this.callDataService(ViewDataServiceMethods.APPLY_DATA, '');
    }
}
