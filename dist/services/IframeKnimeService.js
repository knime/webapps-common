import { UI_EXT_POST_MESSAGE_PREFIX, UI_EXT_POST_MESSAGE_TIMEOUT } from '../constants/index.js';
import { KnimeService } from './KnimeService.js';

class IFrameKnimeService extends KnimeService {
    constructor(extensionConfig = null) {
        super(extensionConfig);
        this.pendingJsonRpcRequests = new Map();
        this.boundOnMessageReceived = this.onMessageReceived.bind(this);
        window.addEventListener('message', this.boundOnMessageReceived);
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`,
        }, '*'); // TODO NXT-793 security
    }
    onMessageReceived(event) {
        var _a;
        // TODO NXT-793 security
        const { data } = event;
        if (!((_a = data.type) === null || _a === void 0 ? void 0 : _a.startsWith(UI_EXT_POST_MESSAGE_PREFIX))) {
            return;
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
        }
    }
    executeServiceCall(jsonRpcRequest) {
        let rejectTimeoutId;
        const promise = new Promise((resolve, reject) => {
            const { id } = jsonRpcRequest;
            this.pendingJsonRpcRequests.set(id, { resolve, reject });
            rejectTimeoutId = setTimeout(() => {
                resolve({
                    error: {
                        message: `Request with id: ${id} rejected due to timeout.`,
                        code: 'req-timeout',
                    },
                    result: null,
                });
            }, UI_EXT_POST_MESSAGE_TIMEOUT);
        });
        // clearing reject timeout on promise resolve
        promise.then(() => {
            clearTimeout(rejectTimeoutId);
        });
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
            payload: jsonRpcRequest,
        }, '*'); // TODO NXT-793 security
        return promise;
    }
    destroy() {
        window.removeEventListener('message', this.boundOnMessageReceived);
    }
}

export { IFrameKnimeService };
