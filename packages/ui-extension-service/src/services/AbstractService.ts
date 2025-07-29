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

  // @ts-expect-error Conversion of type may be a mistake because neither type sufficiently overlaps with the other.
  const initializedBaseService = baseService as Omit<
    typeof baseService,
    "getConfig"
  > & { getConfig: () => typeof extensionConfig };
  initializedBaseService.getConfig = () => extensionConfig;

  setTimeout(() => {
    const readyMessage = { type: "UIExtensionReady" };
    iframeWindow.parent.postMessage(readyMessage, "*");
  }, 0);

  iframeWindow.addEventListener("keydown", (event) => {
    // if someone along the chain of event handlers did prevent default we do not send it to the embedder
    // this way we can indicate that it has been already handled but still keep the propagation till the "end"
    if (!event.defaultPrevented && event.key === "Escape") {
      iframeWindow.parent.postMessage(
        { type: "UIExtensionEscapePressed" },
        "*",
      );
    }
  });

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

  static async getInstance<S>(
    this: new (baseService: UIExtensionService) => S,
  ): Promise<S> {
    if (!AbstractService.initializedProxyService) {
      AbstractService.initializedProxyService = (
        await getInitializedBaseServiceProxy(window)
      ).serviceProxy;
    }
    return new this(AbstractService.initializedProxyService);
  }
}
