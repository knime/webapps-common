import type { UIExtensionMessageExchange } from "./types";

const requestTracker = new Map<
  string,
  {
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
    handler: (...args: any[]) => void;
  }
>();

export const REQUEST_TIMEOUT_MS = 10000;

/**
 * Helper to execute a message exchange (request/response) via postmessage by wrapping
 * the message sending and reception in a promise and simulate a standard `fetch`
 * @param payload
 * @returns
 */
export const request = <T = unknown>(
  payload: UIExtensionMessageExchange.Request["payload"],
) => {
  let timeoutID: ReturnType<typeof setTimeout>;

  const promise = new Promise<T>((resolve, reject) => {
    const requestId = window.crypto.randomUUID();
    const requestMessage: UIExtensionMessageExchange.Request = {
      requestId,
      type: "UIExtensionRequest",
      payload,
    };

    timeoutID = setTimeout(() => {
      const request = requestTracker.get(requestId);

      if (!request) {
        return;
      }

      self.removeEventListener("message", request.handler);
      const error = new Error(`Request timedout: ${JSON.stringify(payload)}`);
      request.reject(error);
      requestTracker.delete(requestId);
    }, REQUEST_TIMEOUT_MS);

    const handler = (event: MessageEvent) => {
      if (event.data.type !== "UIExtensionResponse") {
        return;
      }

      const { requestId } = event.data;
      if (!requestId) {
        return;
      }

      const request = requestTracker.get(requestId);

      if (!request) {
        return;
      }

      request.resolve(event.data.payload);
      self.removeEventListener("message", request.handler);
      requestTracker.delete(requestId);
    };

    requestTracker.set(requestId, { resolve, reject, handler });

    self.addEventListener("message", handler);
    window.parent.postMessage(requestMessage, "*");
  });

  return promise.then((response) => {
    clearTimeout(timeoutID);
    return response;
  });
};
