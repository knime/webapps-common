import { UI_EXT_POST_MESSAGE_PREFIX, UI_EXT_POST_MESSAGE_TIMEOUT } from '../constants/index.js';
import { KnimeService } from './KnimeService.js';

/**
 * The main API entry point for iframe based UI extensions. Handles all extension side communication
 * between current window and parent window.
 *
 * Parent window communication should be setup with instance of IFrameKnimeServiceAdapter.
 *
 * Other services should be initialized with instance of the class.
 */
class IFrameKnimeService extends KnimeService {
    constructor(extensionConfig = null) {
        super(extensionConfig);
        this.pendingJsonRpcRequests = new Map();
        this.boundOnMessageReceived = this.onMessageReceived.bind(this);
        window.addEventListener('message', this.boundOnMessageReceived);
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`
        }, '*'); // TODO NXT-793 security
    }
    /**
     * Method that listens for postMessage events, identifies them, and handles if their type matches supported event types.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with payload and event type.
     * @returns {null | boolean} - null if event prefix unrecognized, false if no event type matches, true on success.
     */
    onMessageReceived(event) {
        var _a;
        // TODO NXT-793 security
        const { data } = event;
        if (!((_a = data.type) === null || _a === void 0 ? void 0 : _a.startsWith(UI_EXT_POST_MESSAGE_PREFIX))) {
            return null;
        }
        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:init`:
                this.extensionConfig = event.data.payload;
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`:
                {
                    const { payload } = data;
                    const responseJSON = JSON.parse(payload);
                    const { id } = responseJSON;
                    const request = this.pendingJsonRpcRequests.get(id);
                    if (!request) {
                        throw new Error(`Received jsonrpcResponse for non-existing pending request with id ${id}`);
                    }
                    const { result, error } = responseJSON;
                    if (result) {
                        request.resolve(JSON.parse(result));
                    }
                    else {
                        request.reject(new Error(`Error code: ${(error === null || error === void 0 ? void 0 : error.code) || 'UNKNOWN'}. Message: ${(error === null || error === void 0 ? void 0 : error.message) || 'not provided'}`));
                    }
                    this.pendingJsonRpcRequests.delete(id);
                }
                break;
            default:
                return false;
        }
        return true;
    }
    /**
     * Overrides method of KnimeService to implement how request should be processed at iframe environment.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeSerivce callService method.
     * @returns {Promise<JsonRpcResponse>} - promise that resolves with JsonRpcResponse or error message.
     */
    executeServiceCall(jsonRpcRequest) {
        let rejectTimeoutId;
        const promise = new Promise((resolve, reject) => {
            const { id } = jsonRpcRequest;
            this.pendingJsonRpcRequests.set(id, { resolve, reject });
            rejectTimeoutId = setTimeout(() => {
                resolve({
                    error: {
                        message: `Request with id: ${id} rejected due to timeout.`,
                        code: 'req-timeout'
                    },
                    result: null
                });
            }, UI_EXT_POST_MESSAGE_TIMEOUT);
        });
        // clearing reject timeout on promise resolve
        promise.then(() => {
            clearTimeout(rejectTimeoutId);
        });
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
            payload: jsonRpcRequest
        }, '*'); // TODO NXT-793 security
        return promise;
    }
    /**
     * Method that should be used before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy() {
        window.removeEventListener('message', this.boundOnMessageReceived);
    }
}

export { IFrameKnimeService };
