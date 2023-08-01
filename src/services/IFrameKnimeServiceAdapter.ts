import { UI_EXT_POST_MESSAGE_PREFIX } from "src/constants";
import { ExtensionConfig, Event } from "src/types";
import { CallableService } from "src/types/CallableService";
import { KnimeService } from "./KnimeService";

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

  // TODO UIEXT-687 will introduce a generalized mechanism to forward method calls from parent to child iframe
  private imageGeneratedCallback: (image: string) => void;

  constructor(
    extensionConfig: ExtensionConfig = null,
    callableService: CallableService = null,
    pushEvent: CallableService = null,
  ) {
    super(extensionConfig, callableService, pushEvent);
    this.boundOnMessageFromIFrame = this.onMessageFromIFrame.bind(this);
    window.addEventListener("message", this.boundOnMessageFromIFrame);
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
   * Adds a new message event listener
   *
   * @returns {void}
   */
  updateEventListener() {
    window.removeEventListener("message", this.boundOnMessageFromIFrame);
    window.addEventListener("message", this.boundOnMessageFromIFrame);
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

    const messageType = data.type?.replace(
      `${UI_EXT_POST_MESSAGE_PREFIX}:`,
      "",
    );
    switch (messageType) {
      case "ready":
        this.postMessage({
          payload: this.extensionConfig,
          messageType: "init",
        });
        break;
      case "callService":
        {
          const {
            payload: { requestId, serviceParams },
          } = data;
          const response = await this.callService(serviceParams);
          this.postMessage({
            payload: { response, requestId },
            messageType: "callServiceResponse",
          });
        }
        break;
      case "event":
        {
          const {
            payload: { event },
          } = data;
          this.pushEvent(event);
        }
        break;
      case "imageGenerated":
        if (this.imageGeneratedCallback !== null) {
          this.imageGeneratedCallback(data.payload);
        }
        this.imageGeneratedCallback = null;
        break;
      default:
        break;
    }
  }

  /**
   * Registers a method that is to be called when the next 'imageGenerated' message is received.
   *
   * @param {Function} callback the to-be-registered callback
   * @returns {void}
   */
  registerImageGeneratedCallback(callback: (image: string) => void): void {
    this.imageGeneratedCallback = callback;
  }

  onServiceEvent(event: Event | string) {
    const payload = typeof event === "string" ? JSON.parse(event) : event;
    this.postMessage({ payload, messageType: "serviceEvent" });
  }

  /**
   * Should be called before destroying the IFrame to remove event listeners from window object,
   * preventing memory leaks and unexpected behavior.
   * @returns {void}
   */
  destroy() {
    window.removeEventListener("message", this.boundOnMessageFromIFrame);
    this.iFrameWindow = null;
  }

  private postMessage(messageParams: { payload?: any; messageType: string }) {
    const { payload, messageType } = messageParams;
    this.iFrameWindow.postMessage(
      { type: `${UI_EXT_POST_MESSAGE_PREFIX}:${messageType}`, payload },
      "*",
    );
  }
}
