import { addDefaults } from "../embedder";
import type { UIExtensionServiceAPILayer } from "../types/uiExtensionService";

import { IframeDispatchEvent } from "./pushEvents";
import type { PayloadForKey, RequestFor, Response } from "./types";

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
  apiLayer: UIExtensionServiceAPILayer,
) => {
  const isUIExtensionMessageExchangeRequest = (
    event: MessageEvent,
  ): event is MessageEvent<RequestFor<UIExtensionServiceAPILayer>> => {
    return event.data?.type === "UIExtensionRequest";
  };

  const callApiLayer = <K extends keyof UIExtensionServiceAPILayer>(
    payload: PayloadForKey<UIExtensionServiceAPILayer, K>,
  ) => {
    // @ts-expect-error
    return apiLayer[payload.method](...payload.params);
  };

  // handles events received in parent
  const messageHandler = (event: MessageEvent) => {
    if (isUIExtensionMessageExchangeRequest(event)) {
      if (event.source !== iframeContentWindow) {
        return;
      }
      Promise.resolve(callApiLayer(event.data.payload)).then((response) => {
        const responseMessage: Response = {
          requestId: event.data.requestId,
          type: "UIExtensionResponse",
          payload: response,
        };
        iframeContentWindow.postMessage(responseMessage, "*");
      });
    }
  };

  window.addEventListener("message", messageHandler);

  return () =>
    iframeContentWindow.removeEventListener("message", messageHandler);
};

export const setUpIframeEmbedderService = (
  apiLayer: UIExtensionServiceAPILayer,
  iframeContentWindow: Window,
) => {
  enableRequestsToMethods(iframeContentWindow, addDefaults(apiLayer));
  const dispatchEventService = new IframeDispatchEvent(iframeContentWindow);
  const boundDispatchPushEvent = dispatchEventService.dispatchPushEvent.bind(
    dispatchEventService,
  ) as typeof dispatchEventService.dispatchPushEvent;
  return {
    dispatchPushEvent: boundDispatchPushEvent,
  };
};
