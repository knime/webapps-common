import { ExtensionConfig, JSONRpcServices, DataServiceTypes } from "../index-833c032c";
declare class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;
    private jsonRpcSupported;
    constructor(extensionConfig?: ExtensionConfig);
    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(method: JSONRpcServices, serviceType: DataServiceTypes, request?: string): Promise<any>;
}
export { KnimeService };
