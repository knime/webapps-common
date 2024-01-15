import { IframeDispatchEvent } from "./pushEvents";
import type {
  UIExtensionAPILayer,
  UIExtensionMessageExchange,
} from "../serviceTypes";

/**
 * Sets up the necessary handler on the window to receive
 * message requests (See: service-proxy)
 *
 * A message received will be processed here by calling the appropriate
 * method on the API layer, and then the response will be forwarded back
 * via postmessage using the message exchange's `Response` format
 * @param iframe
 * @param apiLayer
 * @returns
 */
const enableRequestsToMethods = (
  iframeContentWindow: Window,
  apiLayer: UIExtensionAPILayer,
) => {
  const isUIExtensionMessageExchangeRequest = (
    event: MessageEvent,
  ): event is MessageEvent<UIExtensionMessageExchange.Request> => {
    return event.data?.type === "UIExtensionRequest";
  };

  // handles events received in parent
  const messageHandler = async (event: MessageEvent) => {
    if (isUIExtensionMessageExchangeRequest(event)) {
      if (event.data.source !== iframeContentWindow) {
        return;
      }

      const { method, params } = event.data.payload;
      // @ts-expect-error
      const response = await apiLayer[method](...params);

      const message: UIExtensionMessageExchange.Response = {
        requestId: event.data.requestId,
        type: "UIExtensionResponse",
        payload: response,
      };
      iframeContentWindow.postMessage(message, "*");
    }
  };

  window.addEventListener("message", messageHandler);

  return () =>
    iframeContentWindow.removeEventListener("message", messageHandler);
};

export const setUpIframeEmbedderService = (
  apiLayer: UIExtensionAPILayer,
  iframeContentWindow: Window,
) => {
  enableRequestsToMethods(iframeContentWindow, apiLayer);
  const dispatchEventService = new IframeDispatchEvent(iframeContentWindow);
  const boundDispatchPushEvent = dispatchEventService.dispatchPushEvent.bind(
    dispatchEventService,
  ) as typeof dispatchEventService.dispatchPushEvent;
  return {
    dispatchPushEvent: boundDispatchPushEvent,
  };
};
