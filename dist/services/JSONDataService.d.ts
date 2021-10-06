declare class JSONDataService<T = any> {
    private knimeService;
    private initData;
    constructor(knimeService: any);
    private callDataService;
    getInitialData(): Promise<any>;
    getData(): Promise<any>;
    // @TODO: should receive some kind of data, stringifyed JSON?
    applyData(): Promise<any>;
}
export { JSONDataService };
