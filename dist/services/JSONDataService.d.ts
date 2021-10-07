import { KnimeService } from "../index";
declare class JSONDataService<T = any> {
    private knimeService;
    private initData;
    constructor(knimeService: KnimeService<T>);
    private callDataService;
    getInitialData(): Promise<any>;
    getData(): Promise<any>;
    // TODO: NXTEXT-77 implement apply data
    applyData(): Promise<any>;
}
export { JSONDataService };
