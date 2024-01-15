import type {
  CustomUIExtensionService,
  UIExtensionAPILayer,
} from "../../serviceTypes";
import callEmbedderMethod from "./callEmbedderMethod";
import { IframeAddEventListener } from "../pushEvents";

/**
 * This method can be used to proxy all
 * @param obj
 * @param handleMethodCall
 * @returns
 */
// eslint-disable-next-line func-style
function proxyMissingMethods<T extends Record<string, any>>(
  obj: T,
  handleMethodCall: (methodName: string, ...parameters: any[]) => any,
) {
  return new Proxy(obj, {
    get(target, methodName: string) {
      if (typeof target[methodName] !== "undefined") {
        return target[methodName];
      }

      return function (...args: any[]) {
        // Add the method name as the first argument
        return handleMethodCall(methodName, ...args);
      };
    },
  });
}

type Asyncify<F extends (...args: any[]) => any> = F extends (
  ...args: any[]
) => Promise<any>
  ? F
  : (...args: Parameters<F>) => Promise<ReturnType<F>>;

type AsyncUIExtensionAPILayer = {
  [K in keyof UIExtensionAPILayer]: Asyncify<UIExtensionAPILayer[K]>;
};

/**
 * Creates a proxy for the ui-extension service. It conforms to the
 * UIExtensionService contract and calls to methods on this service
 * will be automatically proxied from the iframe to the parent window
 * via postmessage
 * @returns
 */
export const createProxy = (iframeWindow: Window) => {
  const iframeAddEventListener = new IframeAddEventListener(iframeWindow);

  /**
   * The proxy forwards all methods except the ones listed here via postmessage to the iframe parent
   */
  const methodsWithImplementation = {
    addPushEventListener: iframeAddEventListener.addPushEventListener.bind(
      iframeAddEventListener,
    ),
  };

  const proxiedService = proxyMissingMethods(
    methodsWithImplementation,
    (method: keyof UIExtensionAPILayer, ...params: any[]) => {
      return callEmbedderMethod({ method, params }, iframeWindow);
    },
  ) as CustomUIExtensionService<AsyncUIExtensionAPILayer>;

  return proxiedService;
};
