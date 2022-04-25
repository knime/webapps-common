import { UI_EXT_POST_MESSAGE_PREFIX } from '../constants/index.js';
import { KnimeService } from './KnimeService.js';

/**
 * Handles postMessage communication with iframes on side of the parent window.
 *
 * IFrame window communication should be setup with instance of IFrameKnimeService.
 *
 * Should be instantiated by class that persists at root window object.
 */
class IFrameKnimeServiceAdapter extends KnimeService {
    constructor(extensionConfig = null, callableService = null, pushNotification = null) {
        super(extensionConfig, callableService, pushNotification);
        this.boundOnMessageFromIFrame = this.onMessageFromIFrame.bind(this);
        window.addEventListener('message', this.boundOnMessageFromIFrame);
    }
    /**
     * Sets the child iframe window referenced by the service.
     *
     * @param {Window} iFrameWindow - the content window of the child frame where the @see IFrameKnimeService
     *      is running.
     * @returns {void}
     */
    setIFrameWindow(iFrameWindow) {
        this.iFrameWindow = iFrameWindow;
    }
    /**
     * Adds a new message event listener
     *
     * @returns {void}
     */
    updateEventListener() {
        window.removeEventListener('message', this.boundOnMessageFromIFrame);
        window.addEventListener('message', this.boundOnMessageFromIFrame);
    }
    /**
     * Checks if message is coming from the correct IFrame and therefore is secure.
     * @param {MessageEvent} event - postMessage event.
     * @returns {boolean} - returns true if postMessage source is secure.
     */
    checkMessageSource(event) {
        return event.source !== this.iFrameWindow;
    }
    /**
     * Listens for postMessage events, identifies and handles them if event type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    async onMessageFromIFrame(event) {
        if (this.checkMessageSource(event)) {
            return;
        }
        const { data } = event;
        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:ready`:
                this.postMessage({ payload: this.extensionConfig, messageType: 'init' });
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:callService`:
                {
                    const { payload: { requestId, serviceParams } } = data;
                    const response = await this.callService(serviceParams);
                    this.postMessage({ payload: { response, requestId }, messageType: 'callServiceResponse' });
                }
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:notification`:
                {
                    const { payload: { notification } } = data;
                    this.pushNotification(notification);
                }
                break;
        }
    }
    onServiceNotification(notification) {
        const payload = typeof notification === 'string' ? JSON.parse(notification) : notification;
        this.postMessage({ payload, messageType: 'serviceNotification' });
    }
    /**
     * Should be called before destroying the IFrame to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy() {
        window.removeEventListener('message', this.boundOnMessageFromIFrame);
        this.iFrameWindow = null;
    }
    postMessage(messageParams) {
        const { payload, messageType } = messageParams;
        this.iFrameWindow.postMessage({ type: `${UI_EXT_POST_MESSAGE_PREFIX}:${messageType}`, payload }, '*');
    }
}

export { IFrameKnimeServiceAdapter };
