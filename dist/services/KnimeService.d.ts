import { ExtensionConfig, JSONRpcServices, ViewDataServiceMethods, SelectionServiceMethods } from "../index-2b5b514a";
declare class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;
    private jsonRpcSupported;
    constructor(extensionConfig?: ExtensionConfig);
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(method: JSONRpcServices, serviceMethod: ViewDataServiceMethods | SelectionServiceMethods, request: string | string[]): Promise<any>;
}
export { KnimeService };
