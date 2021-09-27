export class JSONDataService {
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
