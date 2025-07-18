import type {
  UIExtensionService,
  UIExtensionServiceAPILayer,
} from "@knime/ui-extension-renderer/api";
import type { API, ProxyMethodFor } from "@knime/ui-extension-renderer/iframe";

import callEmbedderMethod from "./callEmbedderMethod";
import { IframeAddEventListener } from "./pushEvents";

/**
 * Makes the given method asynchronous by making the return type a promise if not already so
 */
type Asyncify<F extends (...args: never[]) => unknown> = (
  ...args: Parameters<F>
) => Promise<Awaited<ReturnType<F>>>;

/**
 * Proxying any method via the created proxy makes its return value a promise,
 * so we need to express this in types accordingly
 */
type AsyncAPI<A extends API> = {
  [K in keyof A]: Asyncify<A[K]>;
};

/**
 * This method can be used to proxy all
 * @param obj
 * @param handleMethodCall
 * @returns
 */
function proxyMissingMethods<A extends API, T extends Record<string, unknown>>(
  obj: T,
  handleMethodCall: ProxyMethodFor<A>,
) {
  return new Proxy(obj, {
    get<K extends keyof A & string>(target: T, methodName: K) {
      if (typeof target[methodName] !== "undefined") {
        return target[methodName];
      }

      return (...args: Parameters<A[K]>) => {
        // Add the method name as the first argument
        return handleMethodCall(methodName, ...args);
      };
    },
  }) as AsyncAPI<A> & T;
}

/**
 * Creates a proxy for the ui-extension service. It conforms to the
 * UIExtensionService contract and calls to methods on this service
 * will be automatically proxied from the iframe to the parent window
 * via postmessage
 * @returns
 */
export const createProxy = (
  iframeWindow: Window,
): UIExtensionService<AsyncAPI<UIExtensionServiceAPILayer>> => {
  const iframeAddEventListener = new IframeAddEventListener(iframeWindow);

  /**
   * The proxy forwards all methods except the ones listed here via postmessage to the iframe parent
   */
  const methodsWithImplementation = {
    addPushEventListener: iframeAddEventListener.addPushEventListener.bind(
      iframeAddEventListener,
    ) as UIExtensionService["addPushEventListener"],
  };

  const proxiedService = proxyMissingMethods<
    UIExtensionServiceAPILayer,
    typeof methodsWithImplementation
  >(
    methodsWithImplementation,
    <K extends keyof UIExtensionServiceAPILayer>(
      method: K,
      // @ts-expect-error Type 'UIExtensionServiceAPILayer[K]' does not satisfy the constraint '(...args: any) => any'
      ...params: Parameters<UIExtensionServiceAPILayer[K]>
    ) => {
      return callEmbedderMethod({ method, params }, iframeWindow);
    },
  );

  return proxiedService;
};
