import { UI_EXT_POST_MESSAGE_PREFIX } from '../constants/index.js';
import { KnimeService } from './KnimeService.js';

class IframeKnimeService extends KnimeService {
    constructor(extensionConfig = null /* windowReference */) {
        super(extensionConfig);
        this.pendingJsonRpcRequests = new Map();
        window.addEventListener('message', this.onMessageReceived.bind(this));
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`
        }, '*'); // TODO security
    }
    onMessageReceived(event) {
        var _a;
        // TODO security check
        const { data } = event;
        if (!((_a = data.type) === null || _a === void 0 ? void 0 : _a.startsWith(UI_EXT_POST_MESSAGE_PREFIX))) {
            return;
        }
        if (data.type === `${UI_EXT_POST_MESSAGE_PREFIX}:init`) {
            this.extensionConfig = event.data.payload;
        }
        if (data.type === `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`) {
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
    }
    executeServiceCall(jsonRpcRequest) {
        const id = JSON.parse(jsonRpcRequest).id; // TODO find better way
        const promise = new Promise((resolve, reject) => {
            this.pendingJsonRpcRequests.set(id, { resolve, reject });
        });
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
            request: jsonRpcRequest
        }, '*'); // TODO security
        // TODO handle timeouts: reject promise when there was no response after e.g. 10 seconds
        return promise;
    }
}

export { IframeKnimeService };
