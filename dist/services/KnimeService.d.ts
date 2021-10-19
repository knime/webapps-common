import { ExtensionConfig, JSONRpcServices, ViewDataServiceMethods } from "../index-ebf00fee";
declare class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;
    private jsonRpcSupported;
    private registeredGetDataToApply;
    constructor(extensionConfig?: ExtensionConfig);
    // @TODO: add request types w/ DataService type/interface when request types defined
    // for now it should be a string
    callService(method: JSONRpcServices, serviceMethod: ViewDataServiceMethods, request?: string): Promise<any>;
    registerGetDataToApply(callback: () => any): void;
    getDataToApply(): Promise<any>;
}
export { KnimeService };
