import { KnimeService } from "../index";
declare class JSONDataService<T = any> {
    knimeService: KnimeService<T>;
    initData: T;
    constructor(knimeService: any);
    getInitialData(): Promise<T>;
}
export { JSONDataService };
