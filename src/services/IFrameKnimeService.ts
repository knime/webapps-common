import { UI_EXT_POST_MESSAGE_PREFIX, UI_EXT_POST_MESSAGE_TIMEOUT } from 'src/constants';
import { JsonRpcRequest } from 'src/types';
import { KnimeService } from './KnimeService';

/**
 * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
 * IFrame and parent window via window.postMessage.
 *
 * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
 *
 * Other services should be initialized with instance of the class.
 */
export class IFrameKnimeService extends KnimeService {
    private pendingJsonRpcRequests: Map<Number, any> = new Map();

    private boundOnMessageFromParent: any;

    private initializationPromise: Promise<void>;
    private initializationPromiseResolve: Function;

    constructor() {
        super();

        // to allow awaiting the initialization via waitForInitialization()
        // TODO NXTEXT-135 remove the need for this
        this.initializationPromise = new Promise((resolve) => {
            this.initializationPromiseResolve = resolve;
        });

        if (this.extensionConfig) {
            this.initializationPromiseResolve();
        }

        this.callableService = this.executeServiceCall;

        this.boundOnMessageFromParent = this.onMessageFromParent.bind(this);
        window.addEventListener('message', this.boundOnMessageFromParent);

        window.parent.postMessage(
            {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`
            },
            '*'
        ); // TODO NXT-793 security
    }

    /**
     * Needs to be awaited before the service is ready to be used.
     * @returns {void}
     */
    async waitForInitialization() {
        await this.initializationPromise;
    }

    /**
     * Called when a new message is received, identifies and handles it if type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    private onMessageFromParent(event: MessageEvent) {
        // TODO NXT-793 security
        const { data } = event;

        if (!data.type?.startsWith(UI_EXT_POST_MESSAGE_PREFIX)) {
            return;
        }

        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:init`:
                this.onInit(data);
                break;

            case `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`:
                this.onJsonRpcResponse(data);
                break;

            default:
        }
    }

    private onInit(data) {
        this.extensionConfig = data.payload;
        this.initializationPromiseResolve();
    }

    private onJsonRpcResponse(data) {
        const { payload: { response, requestId } } = data;
        const request = this.pendingJsonRpcRequests.get(requestId);

        if (!request) {
            throw new Error(
                `Received jsonrpcResponse for non-existing pending request with id ${requestId}`
            );
        }

        request.resolve(JSON.parse(response));

        this.pendingJsonRpcRequests.delete(requestId);
    }

    /**
     * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeService callService method.
     * @returns {Promise<string>} - promise that resolves with JsonRpcResponse string or error message.
     */
    protected executeServiceCall(jsonRpcRequest: JsonRpcRequest) {
        let rejectTimeoutId;

        const promise = new Promise<string>((resolve, reject) => {
            const { id } = jsonRpcRequest;
            this.pendingJsonRpcRequests.set(id, { resolve, reject });
            rejectTimeoutId = setTimeout(() => {
                resolve(JSON.stringify({
                    error: {
                        message: `Request with id ${id} aborted due to timeout.`,
                        code: 'req-timeout'
                    },
                    result: null
                }));
            }, UI_EXT_POST_MESSAGE_TIMEOUT);
        });

        // clearing reject timeout on promise resolve
        promise.then(() => {
            clearTimeout(rejectTimeoutId);
        });

        window.parent.postMessage(
            {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                payload: jsonRpcRequest
            },
            '*'
        ); // TODO NXT-793 security

        return promise;
    }

    /**
     * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy() {
        window.removeEventListener('message', this.boundOnMessageFromParent);
    }
}
