import { ExtensionConfig, JSONRpcServices, ViewDataServiceMethods } from "../index-ebf00fee";
declare class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;
    private jsonRpcSupported;
    constructor(extensionConfig?: ExtensionConfig);
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(method: JSONRpcServices, serviceMethod: ViewDataServiceMethods, request?: string): Promise<any>;
}
export { KnimeService };
