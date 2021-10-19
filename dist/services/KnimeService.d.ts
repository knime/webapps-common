import { ExtInfo, JSONRpcServices, SelectionServiceMethods, ViewDataServiceMethods } from "../index-bf67a413";
declare class KnimeService<T = any> {
    extInfo: ExtInfo<T>;
    private jsonRpcSupported;
    constructor(extInfo?: ExtInfo);
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(method: JSONRpcServices, serviceMethod: ViewDataServiceMethods | SelectionServiceMethods, request: string | string[]): Promise<any>;
}
export { KnimeService };
