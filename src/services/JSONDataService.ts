import { KnimeService } from 'src';
import { JSONRpcMethods } from 'src/types/JSONRpcMethods';
import { ServiceTypes } from 'src/types/serviceTypes';

export class JSONDataService<T = any> {
    private knimeService: KnimeService<T>;

    private initData: T;

    constructor(knimeService) {
        this.knimeService = knimeService;
        this.initData = null;

        const { initData } = this.knimeService.extInfo;
        if (initData) {
            this.initData = typeof initData === 'string' ? JSON.parse(initData) : initData;
        }
    }

    private callDataService(serviceType: ServiceTypes, request = '') {
        return this.knimeService.callService(
            JSONRpcMethods.CALL_NODE_VIEW_DATA_SERVICE,
            serviceType,
            request,
        );
    }

    getInitialData() {
        // @TODO: if (this.extInfo.hasInitData) {
        // @TODO: how we should prioritize data sources?
        if (this.initData) {
            return Promise.resolve(this.initData);
        }

        return this.callDataService(ServiceTypes.INITIAL_DATA, '');
    }

    getData() {
        // @TODO: what kind of error handling we suppose here?
        return this.callDataService(ServiceTypes.DATA, '');
    }

    // @TODO: should receive some kind of data, stringifyed JSON?
    applyData(/* data */) {
        return this.callDataService(ServiceTypes.APPLY_DATA, '');
    }
}
