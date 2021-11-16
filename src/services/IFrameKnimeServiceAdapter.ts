import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { ExtensionConfig } from 'src/types';

interface IFrameKnimeServiceAdapterOptions {
    iFrameWindow: Window;
    extensionConfig: ExtensionConfig;
}

/**
 * Handles postMessage communication with iframes on side of parent window.
 *
 * Iframe window communication should be setup with instance of IFrameKnimeService.
 *
 * Should be instantiated by class that persists at root window object.
 */
export class IFrameKnimeServiceAdapter {
    iFrameWindow: Window;

    extensionConfig: ExtensionConfig;

    boundOnMessageFromIFrame: any;

    constructor({ iFrameWindow, extensionConfig }: IFrameKnimeServiceAdapterOptions) {
        this.iFrameWindow = iFrameWindow;
        this.extensionConfig = extensionConfig;

        this.boundOnMessageFromIFrame = this.onMessageFromIFrame.bind(this);
        window.addEventListener('message', this.boundOnMessageFromIFrame);
    }

    /**
     * Method that checks if message source is secure.
     * @param {MessageEvent} event - postMessage event.
     * @returns {boolean} - returns true if postMessage source is secure.
     */
    checkMessageSource(event: MessageEvent) {
        return event.source !== this.iFrameWindow;
    }

    /**
     * Method that listens for postMessage events, identifies them, and handles if their type matches supported event types.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with payload and event type.
     * @returns {null | boolean} - null if event prefix unrecognized, false if no event type matches, true on success.
     */
    onMessageFromIFrame(event: MessageEvent) {
        if (this.checkMessageSource(event)) {
            return;
        }
        const { data } = event;

        // TODO: fix global rule for switches?
        /* eslint indent: [2, 4, {"SwitchCase": 1}] */
        switch (data.type) {
            case `${UI_EXT_POST_MESSAGE_PREFIX}:ready`:
                this.iFrameWindow.postMessage(
                    {
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                        payload: this.extensionConfig,
                    },
                    '*',
                );
                break;
            case `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`:
                {
                    const { payload } = event.data;
                    // TODO: NXT-732 this won't work in WebPortal
                    const response = window.jsonrpc(JSON.stringify(payload));
                    this.iFrameWindow.postMessage(
                        {
                            type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                            payload: response,
                        },
                        '*',
                    );
                }
                break;

            default:
                break;
        }
    }

    /**
     * Method that should be used before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy() {
        window.removeEventListener('message', this.boundOnMessageFromIFrame);
    }
}
