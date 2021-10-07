import { KnimeService } from 'src';
import { JSONRpcServices, ViewDataServiceMethods } from 'src/types';

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

    getData() {
        // TODO: NXT-737 handle errors
        return this.callDataService(ViewDataServiceMethods.DATA, '');
    }

    // TODO: NXTEXT-77 implement apply data
    applyData(/* data */) {
        return this.callDataService(ViewDataServiceMethods.APPLY_DATA, '');
    }
}
