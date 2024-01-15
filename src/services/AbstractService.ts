import { createProxy } from "src/iframe/serviceProxy";
import {
  CustomUIExtensionService,
  UIExtensionAPILayer,
  UIExtensionService,
} from "src/serviceTypes";

/**
 * exported for test purposes
 */
export const getInitializedBaseServiceProxy = async (
  iframeWindow: Window,
): Promise<{ serviceProxy: UIExtensionService }> => {
  const baseService = createProxy(iframeWindow);
  const extensionConfig = await baseService.getConfig();
  // @ts-expect-error
  const initializedBaseService = baseService as Omit<
    typeof baseService,
    "getConfig"
  > & { getConfig: () => typeof extensionConfig };
  initializedBaseService.getConfig = () => extensionConfig;
  return { serviceProxy: initializedBaseService };
};

export class AbstractService<
  T extends Partial<Omit<UIExtensionAPILayer, "getConfig">> & {
    getConfig?: () => Partial<ReturnType<UIExtensionAPILayer["getConfig"]>>;
  },
> {
  baseService: CustomUIExtensionService<T>;

  constructor(baseService: CustomUIExtensionService<T>) {
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
