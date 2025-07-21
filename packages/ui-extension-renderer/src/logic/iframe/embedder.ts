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
    const method = apiLayer[payload.method] as (...args: unknown[]) => unknown;

    if (!method) {
      consola.warn(
        "UI Extension Renderer:: Failed calling API layer method. Implementation missing",
        { method: payload.method, params: payload.params, apiLayer },
      );

      return Promise.resolve();
    }

    return method(...payload.params);
  };

  // handles events received in parent
  const messageHandler = (event: MessageEvent) => {
    if (
      !isUIExtensionMessageExchangeRequest(event) ||
      event.source !== iframeContentWindow
    ) {
      return;
    }

    const requestId = event.data.requestId;

    Promise.resolve(callApiLayer(event.data.payload))
      .then((response) => {
        const responseMessage: Response = {
          requestId,
          type: "UIExtensionResponse",
          payload: response,
        };
        iframeContentWindow.postMessage(responseMessage, "*");
      })
      .catch((error) => {
        consola.error(
          "UI Extension Renderer:: Unexpected error sending response to iframe",
          { error, requestId },
        );
      });
  };

  window.addEventListener("message", messageHandler);

  return () =>
    iframeContentWindow.removeEventListener("message", messageHandler);
};

const waitForIframeReady = (iframeContentWindow: Window) => {
  return new Promise<void>((resolve) => {
    const handleIFrameReady = (event: MessageEvent) => {
      if (
        event.source === iframeContentWindow &&
        event.data.type === "UIExtensionReady"
      ) {
        window.removeEventListener("message", handleIFrameReady);
        resolve();
      }
    };

    window.addEventListener("message", handleIFrameReady);
  });
};

export const setUpIframeEmbedderService = async (
  apiLayer: UIExtensionServiceAPILayer,
  iframeContentWindow: Window,
) => {
  enableRequestsToMethods(iframeContentWindow, addDefaults(apiLayer));
  const dispatchEventService = new IframeDispatchEvent(iframeContentWindow);

  await waitForIframeReady(iframeContentWindow);

  const boundDispatchPushEvent =
    dispatchEventService.dispatchPushEvent.bind(dispatchEventService);

  return {
    dispatchPushEvent: boundDispatchPushEvent,
  };
};
