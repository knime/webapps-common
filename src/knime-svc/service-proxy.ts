import type { UIExtensionAPILayer, UIExtensionService } from "./types";
import { request } from "./iframe-promise";
import { interceptMethodCalls } from "./util";
import { useIframeEventHandling } from "./iframe-service";

/**
 * Creates a proxy for the ui-extension service. It conforms to the
 * UIExtensionService contract and calls to methods on this service
 * will be automatically proxied from the iframe to the parent window
 * via postmessage
 * @returns
 */
const createProxy = () => {
  const { addPushEventListener, dispatchPushEvent } =
    useIframeEventHandling(self);

  // no need to implement api layer manually, since the proxy
  // will just forward all method calls via postmessage to the iframe parent
  const service = {
    addPushEventListener,
    dispatchPushEvent,
  } as UIExtensionService;

  const proxiedService = interceptMethodCalls(
    service,
    (method: keyof UIExtensionAPILayer, ...params: any[]) => {
      return request({ method, params });
    },
    // don't proxy these methods since they're only meant to run inside the iframe
    // and not forwarded to the parent (via postmessage)
    ["addPushEventListener", "dispatchPushEvent"],
  );

  return { service: proxiedService };
};

let singleton: ReturnType<typeof createProxy>;

export const createUIExtensionServiceProxy = () => {
  if (singleton) {
    return singleton;
  }

  singleton = createProxy();

  return singleton;
};
