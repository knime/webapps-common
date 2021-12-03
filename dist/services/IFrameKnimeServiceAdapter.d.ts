import { ExtensionConfig } from "../index-af6571f7";
import { CallableService } from "../CallableService-d52d8345";
import { KnimeService } from "./KnimeService";
/**
 * Handles postMessage communication with iframes on side of parent window.
 *
 * Iframe window communication should be setup with instance of IFrameKnimeService.
 *
 * Should be instantiated by class that persists at root window object.
 */
declare class IFrameKnimeServiceAdapter extends KnimeService {
    iFrameWindow: Window;
    extensionConfig: ExtensionConfig;
    boundOnMessageFromIFrame: any;
    constructor(extensionConfig?: ExtensionConfig, callableService?: CallableService);
    /**
     * A setter method to update the child iframe window referenced by the service.
     *
     * @param {Window} iFrameWindow - the content window of the child frame where the @see IFrameKnimeService
     *      is running.
     * @returns {void}
     */
    /**
     * A setter method to update the child iframe window referenced by the service.
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
