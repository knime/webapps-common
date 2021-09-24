export class JSONDataService {
    constructor(knimeService) {
        this.knimeService = knimeService;

        const initData = this.knimeService.extInfo.initData;
        this.initData = typeof initData === 'string' ? JSON.parse(initData) : initData;
    }

    getInitialData() {
        return Promise.resolve(this.initData);
    }
}
