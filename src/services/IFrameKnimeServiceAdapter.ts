import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { ExtensionConfig, Notification } from 'src/types';
import { CallableService } from 'src/types/CallableService';
import { KnimeService } from './KnimeService';

/**
 * Handles postMessage communication with iframes on side of the parent window.
 *
 * IFrame window communication should be setup with instance of IFrameKnimeService.
 *
 * Should be instantiated by class that persists at root window object.
 */
export class IFrameKnimeServiceAdapter extends KnimeService {
    private iFrameWindow: Window;

    private boundOnMessageFromIFrame: any;

    constructor(extensionConfig: ExtensionConfig = null, callableService: CallableService = null) {
        super(extensionConfig, callableService);
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
    setIFrameWindow(iFrameWindow: Window) {
        this.iFrameWindow = iFrameWindow;
    }

    /**
     * Checks if message is coming from the correct IFrame and therefore is secure.
     * @param {MessageEvent} event - postMessage event.
     * @returns {boolean} - returns true if postMessage source is secure.
     */
    private checkMessageSource(event: MessageEvent) {
        return event.source !== this.iFrameWindow;
    }

    /**
     * Listens for postMessage events, identifies and handles them if event type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    private async onMessageFromIFrame(event: MessageEvent) {
        if (this.checkMessageSource(event)) {
            return;
        }
        const { data } = event;

        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:ready`:
                this.iFrameWindow.postMessage(
                    {
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                        payload: this.extensionConfig
                    },
                    '*'
                );
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:callService`:
                {
                    const { payload } = data;
                    const response = await this.callService(payload);
                    this.iFrameWindow.postMessage(
                        {
                            type: `${UI_EXT_POST_MESSAGE_PREFIX}:callServiceResponse`,
                            payload: {
                                response,
                                requestId: payload.requestId
                            }
                        },
                        '*'
                    );
                }
                break;

            default:
                break;
        }
    }

    onServiceNotification(notification: Notification | string) {
        this.iFrameWindow.postMessage(
            {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:serviceNotification`,
                payload: typeof notification === 'string' ? JSON.parse(notification) : notification
            },
            '*'
        );
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
}
