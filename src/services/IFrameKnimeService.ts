import {
  UI_EXT_POST_MESSAGE_PREFIX,
  UI_EXT_POST_MESSAGE_TIMEOUT,
} from "src/constants";
import { ServiceParameters } from "src/types";
import { Alert } from "src/types/Alert";
import { AlertTypes } from "src/types/AlertTypes";
import { generateRequestId } from "src/utils";
import { KnimeService } from "./KnimeService";

/**
 * The main API entry point for IFrame-based UI extensions. Handles all communication between the extension
 * IFrame and parent window via window.postMessage.
 *
 * The parent window needs to have a instance of IFrameKnimeServiceAdapter.
 *
 * Other services should be initialized with instance of the class.
 */
export class IFrameKnimeService extends KnimeService {
  private pendingServiceCalls: Map<Number, any> = new Map();

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

    this.callablePushEvent = IFrameKnimeService.iframePushEvent;

    this.boundOnMessageFromParent = this.onMessageFromParent.bind(this);
    window.addEventListener("message", this.boundOnMessageFromParent);

    IFrameKnimeService.postMessage({ messageType: "ready" });
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

    const messageType = data.type?.replace(
      `${UI_EXT_POST_MESSAGE_PREFIX}:`,
      "",
    );
    switch (messageType) {
      case "init":
        this.onInit(data);
        break;

      case "callServiceResponse":
        this.onCallServiceResponse(data);
        break;

      case "serviceEvent":
        this.onServiceEvent(data.payload);
        break;

      default:
    }
  }

  private onInit(data) {
    this.extensionConfig = data.payload;
    this.initializationPromiseResolve();
  }

  private onCallServiceResponse(data) {
    const {
      payload: { response, requestId },
    } = data;
    const request = this.pendingServiceCalls.get(requestId);

    if (request) {
      request.resolve(response);
      this.pendingServiceCalls.delete(requestId);
      return;
    }
    const errorMessage: Alert = this.createAlert({
      code: "404",
      subtitle: "Request not found",
      type: AlertTypes.ERROR,
      message: `Received callService response for non-existing pending request with id ${requestId}`,
    });
    this.sendError(errorMessage);
  }

  /**
   * Overrides method of KnimeService to implement how request should be processed in IFrame environment.
   * @param {ServiceParameters} serviceParams - parameters for the service call.
   * @returns {Promise<string>} - promise that resolves with response from the service call string or error message.
   */
  protected executeServiceCall(serviceParams: ServiceParameters) {
    let rejectTimeoutId;
    const requestId = generateRequestId();

    const promise = new Promise<string>((resolve, reject) => {
      this.pendingServiceCalls.set(requestId, { resolve, reject });
      rejectTimeoutId = setTimeout(() => {
        const errorMessage = this.createAlert({
          code: "408",
          subtitle: "Request Timeout",
          type: AlertTypes.ERROR,
          message: `Request with id ${requestId} aborted due to timeout.`,
        });
        this.sendError(errorMessage);

        resolve(JSON.stringify({ error: errorMessage }));
      }, UI_EXT_POST_MESSAGE_TIMEOUT);
    });

    // clearing reject timeout on promise resolve
    promise.then(() => {
      clearTimeout(rejectTimeoutId);
    });

    IFrameKnimeService.postMessage({
      payload: { requestId, serviceParams },
      messageType: "callService",
    });

    return promise;
  }

  private static postMessage(messageParams: {
    payload?: any;
    messageType: string;
  }) {
    const { payload, messageType } = messageParams;
    // TODO NXT-793 security
    window.parent.postMessage(
      { type: `${UI_EXT_POST_MESSAGE_PREFIX}:${messageType}`, payload },
      "*",
    );
  }

  private static iframePushEvent(event: Event) {
    IFrameKnimeService.postMessage({
      payload: { event },
      messageType: "event",
    });
    return Promise.resolve();
  }

  /**
   * Should be called before destroying IFrameKnimeService, to remove event listeners from window object,
   * preventing memory leaks and unexpected behavior.
   * @returns {void}
   */
  destroy() {
    window.removeEventListener("message", this.boundOnMessageFromParent);
  }

  /**
   * Called when an image has been generated. Posts the generated image to the parent via an 'imageGenerated' message.
   *
   * @param {string} generatedImage - the generated PNG image (as string)
   * @returns {void}
   */
  static imageGenerated(generatedImage: string): void {
    IFrameKnimeService.postMessage({
      payload: generatedImage,
      messageType: "imageGenerated",
    });
  }
}
