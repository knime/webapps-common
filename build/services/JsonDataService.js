'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class JsonDataService {
    constructor(knimeService) {
        this.knimeService = knimeService;

        const initData = this.knimeService.extInfo.initData;
        this.initData = typeof initData === 'string' ? JSON.parse(initData) : initData;
    }

    getInitialData() {
        return Promise.resolve(typeof this.initData === 'string'
            ? JSON.parse(this.initData)
            : this.initData);
    }
}

exports.JsonDataService = JsonDataService;
