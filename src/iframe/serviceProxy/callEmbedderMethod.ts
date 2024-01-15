import { v4 as uuidv4 } from "uuid";
import type { UIExtensionMessageExchange } from "../../serviceTypes";
import { toWrappedEventOfType } from "../utils/events";
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Helper to execute a message exchange (request/response) via postmessage by wrapping
 * the message sending and reception in a promise and simulate a standard `fetch`
 * @param payload
 * @returns
 */
export default <T = unknown>(
  payload: UIExtensionMessageExchange.Request["payload"],
  iframeWindow: Window,
) => {
  let timeoutID: ReturnType<typeof setTimeout>;

  const requestId = uuidv4();
  const promise = new Promise<T>((resolve, reject) => {
    const handler = (event: MessageEvent) => {
      if (event.data.type !== "UIExtensionResponse") {
        return;
      }

      const { requestId: receivedRequestId } = event.data;
      if (receivedRequestId !== requestId) {
        return;
      }

      resolve(event.data.payload);
      iframeWindow.removeEventListener("message", handler);
    };
    iframeWindow.addEventListener("message", handler);
    iframeWindow.parent.postMessage(
      {
        requestId,
        source: iframeWindow,
        ...toWrappedEventOfType(payload, "UIExtensionRequest"),
      },
      "*",
    );

    timeoutID = setTimeout(() => {
      self.removeEventListener("message", handler);
      const error = new Error(`Request timedout: ${JSON.stringify(payload)}`);
      reject(error);
    }, REQUEST_TIMEOUT_MS);
  });

  return promise.then((response) => {
    clearTimeout(timeoutID);
    return response;
  });
};
