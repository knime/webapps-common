import { KnimeService } from "../index";
declare class JSONDataService<T = any> {
    private knimeService;
    private initData;
    constructor(knimeService: KnimeService<T>);
    private callDataService;
    getInitialData(): Promise<any>;
    getDataByMethodName(method: string, ...params: any[]): Promise<any>;
    getData(...params: any[]): Promise<any>;
    registerGetDataToApply(callback: () => any): void;
}
export { JSONDataService };
