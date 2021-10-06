import { JSONRpcServices } from "../types/JSONRpcServices";
import { ViewDataServiceMethods } from "../types/ViewDataServiceMethods";
type ExtInfo<T = any> = {
    uicomponent: boolean;
    url: string;
    name: string;
    initData: T;
};
declare class KnimeService<T = any> {
    extInfo: ExtInfo<T>;
    private jsonRpcSupported;
    private requestId;
    constructor(extInfo?: any);
    // for now we only need any kind of id, not even unique, later will need unique ones
    private generateRequestId;
    callService(service: JSONRpcServices, method: ViewDataServiceMethods, request?: string): Promise<any>;
}
export { ExtInfo, KnimeService };
