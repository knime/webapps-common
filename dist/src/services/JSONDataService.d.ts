import { KnimeService } from 'src';
export declare class JSONDataService<T = any> {
    knimeService: KnimeService<T>;
    initData: T;
    constructor(knimeService: any);
    getInitialData(): Promise<T>;
}
