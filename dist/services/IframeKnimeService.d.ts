import { ExtensionConfig, JsonRpcResponse } from "../index-0a8c878e";
import { KnimeService } from "./KnimeService";
declare class IFrameKnimeService<T = any> extends KnimeService {
    private pendingJsonRpcRequests;
    extensionConfig: ExtensionConfig<T>;
    constructor(extensionConfig?: ExtensionConfig);
    onMessageReceived(event: MessageEvent): void;
    executeServiceCall(jsonRpcRequest: any): Promise<JsonRpcResponse>;
}
export { IFrameKnimeService };
