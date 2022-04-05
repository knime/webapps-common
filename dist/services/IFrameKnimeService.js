import { UI_EXT_POST_MESSAGE_PREFIX, UI_EXT_POST_MESSAGE_TIMEOUT } from '../constants/index.js';
import { AlertTypes } from '../types/AlertTypes.js';
import { generateRequestId } from '../utils/generateRequestId.js';
import { KnimeService } from './KnimeService.js';

/**
 * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
 * IFrame and parent window via window.postMessage.
 *
 * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
 *
 * Other services should be initialized with instance of the class.
 */
class IFrameKnimeService extends KnimeService {
    constructor() {
        super();
        this.pendingServiceCalls = new Map();
        // to allow awaiting the initialization via waitForInitialization()
        // TODO NXTEXT-135 remove the need for this
        this.initializationPromise = new Promise((resolve) => {
            this.initializationPromiseResolve = resolve;
        });
        if (this.extensionConfig) {
            this.initializationPromiseResolve();
        }
        this.callableService = this.executeServiceCall;
        this.callablePushNotification = IFrameKnimeService.iframePushNotification;
        this.boundOnMessageFromParent = this.onMessageFromParent.bind(this);
        window.addEventListener('message', this.boundOnMessageFromParent);
        IFrameKnimeService.postMessage({ messageType: 'ready' });
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
    onMessageFromParent(event) {
        var _a;
        // TODO NXT-793 security
        const { data } = event;
        if (!((_a = data.type) === null || _a === void 0 ? void 0 : _a.startsWith(UI_EXT_POST_MESSAGE_PREFIX))) {
            return;
        }
        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:init`:
                this.onInit(data);
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:callServiceResponse`:
                this.onCallServiceResponse(data);
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:serviceNotification`:
                this.onServiceNotification(data.payload.data);
                break;
        }
    }
    onInit(data) {
        this.extensionConfig = data.payload;
        this.initializationPromiseResolve();
    }
    onCallServiceResponse(data) {
        const { payload: { response, requestId } } = data;
        const request = this.pendingServiceCalls.get(requestId);
        if (!request) {
            const message = `Received callService response for non-existing pending request with id ${requestId}`;
            const errorMessage = this.createAlert({
                code: '404',
                subtitle: 'Request not found',
                type: AlertTypes.ERROR,
                message
            });
            this.sendError(errorMessage);
            request.resolve(JSON.stringify({ error: errorMessage }));
        }
        request.resolve(JSON.parse(response));
        this.pendingServiceCalls.delete(requestId);
    }
    /**
     * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
     * @param {ServiceParameters} serviceParams - parameters for the service call.
     * @returns {Promise<string>} - promise that resolves with response from the service call string or error message.
     */
    executeServiceCall(serviceParams) {
        let rejectTimeoutId;
        const requestId = generateRequestId();
        const promise = new Promise((resolve, reject) => {
            this.pendingServiceCalls.set(requestId, { resolve, reject });
            rejectTimeoutId = setTimeout(() => {
                const errorMessage = this.createAlert({
                    code: '408',
                    subtitle: 'Request Timeout',
                    type: AlertTypes.ERROR,
                    message: `Request with id ${requestId} aborted due to timeout.`
                });
                this.sendError(errorMessage);
                resolve(JSON.stringify({ error: errorMessage }));
            }, UI_EXT_POST_MESSAGE_TIMEOUT);
        });
        // clearing reject timeout on promise resolve
        promise.then(() => {
            clearTimeout(rejectTimeoutId);
        });
        IFrameKnimeService.postMessage({ payload: { requestId, serviceParams }, messageType: 'callService' });
        return promise;
    }
    static postMessage(messageParams) {
        const { payload, messageType } = messageParams;
        // TODO NXT-793 security
        window.parent.postMessage({ type: `${UI_EXT_POST_MESSAGE_PREFIX}:${messageType}`, payload }, '*');
    }
    static iframePushNotification(notification) {
        IFrameKnimeService.postMessage({ payload: { notification }, messageType: 'notification' });
        return Promise.resolve();
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

export { IFrameKnimeService };
