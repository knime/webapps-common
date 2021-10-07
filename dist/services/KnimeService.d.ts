import { ExtInfo, JSONRpcServices, ViewDataServiceMethods } from "../index-f4543387";
declare class KnimeService<T = any> {
    extInfo: ExtInfo<T>;
    private jsonRpcSupported;
    private requestId;
    constructor(extInfo?: any);
    // for now we only need any kind of id, not even unique, later will need unique ones
    private generateRequestId;
    callService(service: JSONRpcServices, method: ViewDataServiceMethods, request?: string): Promise<any>;
}
export { KnimeService };
