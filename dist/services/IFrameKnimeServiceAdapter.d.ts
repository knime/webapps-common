import { ExtensionConfig } from "../index-af6571f7";
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
declare class IFrameKnimeServiceAdapter {
    iFrameWindow: Window;
    extensionConfig: ExtensionConfig;
    boundOnMessageFromIFrame: any;
    constructor({ iFrameWindow, extensionConfig }: IFrameKnimeServiceAdapterOptions);
    /**
     * Checks if message is coming from the correct IFrame and therefore is secure.
     * @param {MessageEvent} event - postMessage event.
     * @returns {boolean} - returns true if postMessage source is secure.
     */
    /**
     * Checks if message is coming from the correct IFrame and therefore is secure.
     * @param {MessageEvent} event - postMessage event.
     * @returns {boolean} - returns true if postMessage source is secure.
     */
    private checkMessageSource;
    /**
     * Listens for postMessage events, identifies and handles them if event type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    /**
     * Listens for postMessage events, identifies and handles them if event type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    private onMessageFromIFrame;
    /**
     * Should be called before destroying the IFrame to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    /**
     * Should be called before destroying the IFrame to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy(): void;
}
export { IFrameKnimeServiceAdapter };
