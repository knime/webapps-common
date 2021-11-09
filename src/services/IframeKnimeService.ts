import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { ExtensionConfig, JsonRpcRequest, JsonRpcResponse } from 'src/types';
import { KnimeService } from './KnimeService';

const REQUEST_TIMEOUT = 10000;
export class IFrameKnimeService<T = any> extends KnimeService {
    private pendingJsonRpcRequests: Map<Number, any> = new Map();

    extensionConfig: ExtensionConfig<T>;

    boundOnMessageReceived: any;

    constructor(extensionConfig: ExtensionConfig = null) {
        super(extensionConfig);

        this.boundOnMessageReceived = this.onMessageReceived.bind(this);
        window.addEventListener('message', this.boundOnMessageReceived);

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

        // TODO: fix global rule for switches?
        /* eslint indent: [2, 4, {"SwitchCase": 1}] */
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

                break;

            default:
                break;
        }
    }

    executeServiceCall(jsonRpcRequest: JsonRpcRequest) {
        let timeoutId;

        const promise = new Promise<JsonRpcResponse>((resolve, reject) => {
            const { id } = jsonRpcRequest;
            this.pendingJsonRpcRequests.set(id, { resolve, reject });
            timeoutId = setTimeout(() => {
                reject(new Error(`Request with id: ${id} rejected due to timeout.`));
            }, REQUEST_TIMEOUT);
        });

        // clearing reject timeout on promise resolve
        promise.then(() => {
            clearTimeout(timeoutId);
        });

        window.parent.postMessage(
            {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                payload: jsonRpcRequest,
            },
            '*',
        ); // TODO security

        return promise;
    }

    destroy() {
        window.removeEventListener('message', this.boundOnMessageReceived);
    }
}
