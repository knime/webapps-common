import { ref } from "vue";

import type { UIExtensionServiceAPILayer } from "../../api";
import { addDefaults } from "../embedder";

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

const useIframeReady = (iframeContentWindow: Window) => {
  const iframeIsReady = ref(false);

  const handleIFrameReady = (event: MessageEvent) => {
    if (
      event.source === iframeContentWindow &&
      event.data.type === "UIExtensionReady"
    ) {
      iframeIsReady.value = true;
      window.removeEventListener("message", handleIFrameReady);
    }
  };

  window.addEventListener("message", handleIFrameReady);
  return { iframeIsReady };
};

export const setUpIframeEmbedderService = (
  apiLayer: UIExtensionServiceAPILayer,
  iframeContentWindow: Window,
) => {
  enableRequestsToMethods(iframeContentWindow, addDefaults(apiLayer));
  const dispatchEventService = new IframeDispatchEvent(iframeContentWindow);

  const iframeIsReady = useIframeReady(iframeContentWindow);
  const boundDispatchPushEvent =
    dispatchEventService.dispatchPushEvent.bind(dispatchEventService);
  return {
    dispatchPushEvent: boundDispatchPushEvent,
    iframeIsReady,
  };
};
