import { UI_EXT_POST_MESSAGE_PREFIX } from '../constants/index.js';
import { KnimeService } from './KnimeService.js';

const REQUEST_TIMEOUT = 10000;
class IFrameKnimeService extends KnimeService {
    constructor(extensionConfig = null) {
        super(extensionConfig);
        this.pendingJsonRpcRequests = new Map();
        window.addEventListener('message', this.onMessageReceived.bind(this));
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`,
        }, '*'); // TODO security
    }
    onMessageReceived(event) {
        var _a;
        // TODO security check
        const { data } = event;
        if (!((_a = data.type) === null || _a === void 0 ? void 0 : _a.startsWith(UI_EXT_POST_MESSAGE_PREFIX))) {
            return;
        }
        // TODO: fix global rule for switches?
        /*eslint indent: [2, 4, {"SwitchCase": 1}]*/
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
        const id = JSON.parse(jsonRpcRequest).id; // TODO find better way
        const promise = new Promise((resolve, reject) => {
            this.pendingJsonRpcRequests.set(id, { resolve, reject });
            setTimeout(() => {
                reject(new Error(`Request with id: ${id} rejected due to timeout.`));
            }, REQUEST_TIMEOUT);
        });
        window.parent.postMessage({
            type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
            request: jsonRpcRequest,
        }, '*'); // TODO security
        return promise;
    }
}

export { IFrameKnimeService };
