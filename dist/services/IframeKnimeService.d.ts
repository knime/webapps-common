import { ExtensionConfig, JsonRpcResponse } from "../index-efc413bb";
import { KnimeService } from "./KnimeService";
declare class IframeKnimeService<T> extends KnimeService {
    private pendingJsonRpcRequests;
    extensionConfig: ExtensionConfig<T>;
    constructor(extensionConfig?: ExtensionConfig);
    onMessageReceived(event: MessageEvent): void;
    executeServiceCall(jsonRpcRequest: any): Promise<JsonRpcResponse>;
}
export { IframeKnimeService };
