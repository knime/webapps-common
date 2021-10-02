import { KnimeService } from 'src';

export class JSONDataService<T = any> {
    knimeService: KnimeService<T>;

    initData: T;

    constructor(knimeService) {
        this.knimeService = knimeService;
        this.initData = null;

        const { initData } = this.knimeService.extInfo;
        if (initData) {
            this.initData = typeof initData === 'string' ? JSON.parse(initData) : initData;
        }
    }

    getInitialData() {
        // TODO fetch it if not there yet + error handling
        return Promise.resolve(this.initData);
    }
}

/*
export class JSONDataService {
    constructor(knimeService) {
        this.knimeService = knimeService;
        this.initData = null;

        const { initData } = this.knimeService.extInfo;
        if (initData) {
            this.initData = typeof initData === 'string' ? JSON.parse(initData) : initData;
        }
    }

    async getInitialData() {
        // TODO error handling
        return JSON.parse(await this.knimeService.getInitialData());
    }

    async getData(method, params) {
        let jsonRpcRequest = {
            jsonrpc: '2.0',
            method,
            params,
            id: 1 // fixed for now
        };

        // TODO error handling
        let response = JSON.parse(await this.knimeService.getData(jsonRpcRequest));
        return Promise.resolve(response.result);
    }
  }
 */
