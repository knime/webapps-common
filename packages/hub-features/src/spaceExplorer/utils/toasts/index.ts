import { computed } from "vue";

import { type ToastService } from "@knime/components";

import { getGlobalContext } from "../../config";
import { logger } from "../logger";

export const getToastsProvider = (): ToastService => {
  const globalContext = getGlobalContext();

  if (!globalContext?.toastService) {
    const noop =
      (methodName: string) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (...args: any[]): any => {
        logger().error(
          `Toast provider not found calling ${methodName} with args:`,
          ...args,
        );
      };

    return {
      show: noop("show"),
      autoRemove: noop("autoRemove"),
      remove: noop("remove"),
      removeAll: noop("removeAll"),
      removeBy: noop("removeBy"),
      toasts: computed(() => []),
    };
  }

  return globalContext.toastService;
};
