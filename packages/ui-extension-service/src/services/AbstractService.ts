import type { UIExtensionService } from "@knime/ui-extension-renderer/api";

import { createProxy } from "../iframe/";

/**
 * exported for test purposes
 */
export const getInitializedBaseServiceProxy = async (
  iframeWindow: Window,
): Promise<{ serviceProxy: UIExtensionService }> => {
  const baseService = createProxy(iframeWindow);
  const extensionConfig = await baseService.getConfig();
  // @ts-expect-error the type is not yet satisfied. We cannot spread baseService, because it is a proxy
  const initializedBaseService = baseService as Omit<
    typeof baseService,
    "getConfig"
  > & { getConfig: () => typeof extensionConfig };
  initializedBaseService.getConfig = () => extensionConfig;
  console.trace("UIExtensionService: initialized");
  setTimeout(() => {
    console.log("UIExtensionService: sending ready message");
    const readyMessage = { type: "UIExtensionReady" };
    iframeWindow.parent.postMessage(readyMessage, "*");
  }, 0);
  /**
   * Without nesting the result in an object, because this is an asynchronous method,
   * e.g. the 'then' method would also be proxied
   */
  return { serviceProxy: initializedBaseService };
};

export class AbstractService<T> {
  protected baseService: UIExtensionService<T>;

  constructor(baseService: UIExtensionService<T>) {
    if (new.target === AbstractService) {
      throw new Error("Cannot instantiate abstract class");
    }
    this.baseService = baseService;
  }

  private static initializedProxyService: UIExtensionService;

  static async getInstance<S>(this: new (baseService: any) => S): Promise<S> {
    if (!AbstractService.initializedProxyService) {
      AbstractService.initializedProxyService = (
        await getInitializedBaseServiceProxy(window)
      ).serviceProxy;
    }
    return new this(AbstractService.initializedProxyService);
  }
}
