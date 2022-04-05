import { ServiceParameters } from "../index-b3e43760";
import { KnimeService } from "./KnimeService";
/**
 * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
 * IFrame and parent window via window.postMessage.
 *
 * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
 *
 * Other services should be initialized with instance of the class.
 */
declare class IFrameKnimeService extends KnimeService {
    private pendingServiceCalls;
    private boundOnMessageFromParent;
    private initializationPromise;
    private initializationPromiseResolve;
    constructor();
    /**
     * Needs to be awaited before the service is ready to be used.
     * @returns {void}
     */
    /**
     * Needs to be awaited before the service is ready to be used.
     * @returns {void}
     */
    waitForInitialization(): Promise<void>;
    /**
     * Called when a new message is received, identifies and handles it if type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    /**
     * Called when a new message is received, identifies and handles it if type is supported.
     * @param {MessageEvent} event - postMessage event that is sent by parent window with event type and payload.
     * @returns {void}
     */
    private onMessageFromParent;
    private onInit;
    private onCallServiceResponse;
    /**
     * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
     * @param {ServiceParameters} serviceParams - parameters for the service call.
     * @returns {Promise<string>} - promise that resolves with response from the service call string or error message.
     */
    /**
     * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
     * @param {ServiceParameters} serviceParams - parameters for the service call.
     * @returns {Promise<string>} - promise that resolves with response from the service call string or error message.
     */
    protected executeServiceCall(serviceParams: ServiceParameters): Promise<string>;
    private static postMessage;
    private static iframePushNotification;
    /**
     * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    /**
     * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
     * preventing memory leaks and unexpected behavior.
     * @returns {void}
     */
    destroy(): void;
}
export { IFrameKnimeService };
