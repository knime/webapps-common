import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { ExtensionConfig, JsonRpcResponse } from 'src/types';
import { KnimeService } from './KnimeService';

export class IframeKnimeService<T> extends KnimeService {
    private pendingJsonRpcRequests: Map<Number, any> = new Map();

    extensionConfig: ExtensionConfig<T>;

    constructor(extensionConfig: ExtensionConfig = null /* windowReference */) {
        super(extensionConfig);

        window.addEventListener('message', this.onMessageReceived.bind(this));
        window.parent.postMessage(
            {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`,
            },
            '*',
        ); // TODO security
    }

    onMessageReceived(event: MessageEvent) {
        // TODO security check
        const { data } = event;

        if (!data.type?.startsWith(UI_EXT_POST_MESSAGE_PREFIX)) {
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
                throw new Error(
                    `Received jsonrpcResponse for non-existing pending request with id ${id}`,
                );
            }

            const { result, error } = responseJSON;

            if (result) {
                request.resolve(JSON.parse(result));
            } else {
                request.reject(
                    new Error(
                        `Error code: ${error?.code || 'UNKNOWN'}. Message: ${
                            error?.message || 'not provided'
                        }`,
                    ),
                );
            }

            this.pendingJsonRpcRequests.delete(id);
        }
    }

    executeServiceCall(jsonRpcRequest) {
        const id = JSON.parse(jsonRpcRequest).id; // TODO find better way
        const promise = new Promise<JsonRpcResponse>((resolve, reject) => {
            this.pendingJsonRpcRequests.set(id, { resolve, reject });
        });

        window.parent.postMessage(
            {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                request: jsonRpcRequest,
            },
            '*',
        ); // TODO security

        // TODO handle timeouts: reject promise when there was no response after e.g. 10 seconds
        return promise;
    }
}
