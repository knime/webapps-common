import { ExtensionConfig, JsonRpcRequest, JsonRpcResponse } from "../index-af6571f7";
import { KnimeService } from "./KnimeService";
/**
 * The main API entry point for iframe based UI extensions. Handles all extension side communication
 * between current window and parent window.
 *
 * Parent window communication should be setup with instance of IFrameKnimeServiceAdapter.
 *
 * Other services should be initialized with instance of the class.
 */
declare class IFrameKnimeService<T = any> extends KnimeService {
    private pendingJsonRpcRequests;
    extensionConfig: ExtensionConfig<T>;
    boundOnMessageReceived: any;
    constructor(extensionConfig?: ExtensionConfig);
    /**
     * Method that listens for postMessage events, identifies them, and handles if their type matches supported event types.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with payload and event type.
     * @returns {null | boolean} - null if event prefix unrecognized, false if no event type matches, true on success.
     */
    /**
     * Method that listens for postMessage events, identifies them, and handles if their type matches supported event types.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with payload and event type.
     * @returns {null | boolean} - null if event prefix unrecognized, false if no event type matches, true on success.
     */
    onMessageReceived(event: MessageEvent): boolean;
    /**
     * Overrides method of KnimeService to implement how request should be processed at iframe environment.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeSerivce callService method.
     * @returns {Promise<JsonRpcResponse>} - promise that resolves with JsonRpcResponse or error message.
     */
    /**
     * Overrides method of KnimeService to implement how request should be processed at iframe environment.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeSerivce callService method.
     * @returns {Promise<JsonRpcResponse>} - promise that resolves with JsonRpcResponse or error message.
     */
    executeServiceCall(jsonRpcRequest: JsonRpcRequest): Promise<JsonRpcResponse>;
    /**
     * Method that should be used before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    /**
     * Method that should be used before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy(): void;
}
export { IFrameKnimeService };
