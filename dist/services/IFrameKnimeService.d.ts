import { ExtensionConfig, JsonRpcRequest, JsonRpcResponse } from "../index-af6571f7";
import { KnimeService } from "./KnimeService";
/**
 * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
 * IFrame and parent window via window.postMessage.
 *
 * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
 *
 * Other services should be initialized with instance of the class.
 */
declare class IFrameKnimeService extends KnimeService {
    private pendingJsonRpcRequests;
    private boundOnMessageFromParent;
    constructor(extensionConfig?: ExtensionConfig);
    /**
     * Called when a new message is received, identifies and handles it if type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    /**
     * Called when a new message is received, identifies and handles it if type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    private onMessageFromParent;
    private onInit;
    private onJsonRpcResponse;
    /**
     * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeService callService method.
     * @returns {Promise<JsonRpcResponse>} - promise that resolves with JsonRpcResponse or error message.
     */
    /**
     * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeService callService method.
     * @returns {Promise<JsonRpcResponse>} - promise that resolves with JsonRpcResponse or error message.
     */
    protected executeServiceCall(jsonRpcRequest: JsonRpcRequest): Promise<JsonRpcResponse>;
    /**
     * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    /**
     * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy(): void;
}
export { IFrameKnimeService };
