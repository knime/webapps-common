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
     * Method that checks if message source is secure.
     * @param {MessageEvent} event - postMessage event.
     * @returns {boolean} - returns true if postMessage source is secure.
     */
    /**
     * Method that checks if message source is secure.
     * @param {MessageEvent} event - postMessage event.
     * @returns {boolean} - returns true if postMessage source is secure.
     */
    checkMessageSource(event: MessageEvent): boolean;
    /**
     * Method that listens for postMessage events, identifies them, and handles if their type matches supported event types.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with payload and event type.
     * @returns {null | boolean} - null if event prefix unrecognized, false if no event type matches, true on success.
     */
    /**
     * Method that listens for postMessage events, identifies them, and handles if their type matches supported event types.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with payload and event type.
     * @returns {null | boolean} - null if event prefix unrecognized, false if no event type matches, true on success.
     */
    onMessageFromIFrame(event: MessageEvent): void;
    /**
     * Method that should be used before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    /**
     * Method that should be used before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy(): void;
}
export { IFrameKnimeServiceAdapter };
