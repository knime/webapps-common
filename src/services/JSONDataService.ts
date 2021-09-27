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
