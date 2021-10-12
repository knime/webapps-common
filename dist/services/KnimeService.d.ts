import { ExtInfo, JSONRpcServices, ViewDataServiceMethods } from "../index-f4543387";
declare class KnimeService<T = any> {
    extInfo: ExtInfo<T>;
    private jsonRpcSupported;
    constructor(extInfo?: ExtInfo);
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(method: JSONRpcServices, serviceMethod: ViewDataServiceMethods, request?: string): Promise<any>;
}
export { KnimeService };
