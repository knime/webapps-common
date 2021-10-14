import { ExtInfo, JSONRpcServices, ViewDataServiceMethods } from "../index-f4543387";
declare class KnimeService<T = any> {
    extInfo: ExtInfo<T>;
    private jsonRpcSupported;
    private registeredGetDataToApply;
    constructor(extInfo?: ExtInfo);
    // @TODO: add request types w/ DataService type/interface when request types defined
    // for now it should be a string
    callService(method: JSONRpcServices, serviceMethod: ViewDataServiceMethods, request?: string): Promise<any>;
    registerGetDataToApply(callback: () => any): void;
    getDataToApply(): Promise<any>;
}
export { KnimeService };
