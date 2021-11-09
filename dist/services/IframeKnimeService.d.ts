import { ExtensionConfig, JsonRpcRequest, JsonRpcResponse } from "../index-af6571f7";
import { KnimeService } from "./KnimeService";
declare class IFrameKnimeService<T = any> extends KnimeService {
    private pendingJsonRpcRequests;
    extensionConfig: ExtensionConfig<T>;
    boundOnMessageReceived: any;
    constructor(extensionConfig?: ExtensionConfig);
    onMessageReceived(event: MessageEvent): void;
    executeServiceCall(jsonRpcRequest: JsonRpcRequest): Promise<JsonRpcResponse>;
    destroy(): void;
}
export { IFrameKnimeService };
