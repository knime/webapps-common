import { KnimeService } from "../index";
declare class JSONDataService<T = any> {
    private knimeService;
    private initialData;
    constructor(knimeService: KnimeService<T>);
    private callDataService;
    getInitialData(): Promise<any>;
    getDataByMethodName(method: string, ...params: any[]): Promise<any>;
    // TODO this is just a temporary short-cut - see NXT-761
    getData(...params: any[]): Promise<any>;
    registerGetDataToApply(callback: () => any): void;
    // TODO: NXTEXT-77 implement apply data
    applyData(): Promise<any>;
}
export { JSONDataService };
