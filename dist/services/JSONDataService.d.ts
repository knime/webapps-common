import { KnimeService } from "../index";
declare class JSONDataService<T = any> {
    private knimeService;
    private initialData;
    constructor(knimeService: KnimeService<T>);
    private callDataService;
    getInitialData(): Promise<any>;
    getDataByMethodName(method: string, ...params: any[]): Promise<any>;
    getData(...params: any[]): Promise<any>;
    // TODO: NXTEXT-77 implement apply data
    applyData(): Promise<any>;
}
export { JSONDataService };
