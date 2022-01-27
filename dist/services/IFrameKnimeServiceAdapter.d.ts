import { ExtensionConfig, Notification } from "../index-692f6f4e";
import { CallableService } from "../CallableService-8f4e5800";
import { KnimeService } from "./KnimeService";
/**
 * Handles postMessage communication with iframes on side of the parent window.
 *
 * IFrame window communication should be setup with instance of IFrameKnimeService.
 *
 * Should be instantiated by class that persists at root window object.
 */
declare class IFrameKnimeServiceAdapter extends KnimeService {
    private iFrameWindow;
    private boundOnMessageFromIFrame;
    constructor(extensionConfig?: ExtensionConfig, callableService?: CallableService);
    /**
     * Sets the child iframe window referenced by the service.
     *
     * @param {Window} iFrameWindow - the content window of the child frame where the @see IFrameKnimeService
     *      is running.
     * @returns {void}
     */
    /**
     * Sets the child iframe window referenced by the service.
     *
     * @param {Window} iFrameWindow - the content window of the child frame where the @see IFrameKnimeService
     *      is running.
     * @returns {void}
     */
    setIFrameWindow(iFrameWindow: Window): void;
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
    onServiceNotification(notification: Notification | string): void;
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
