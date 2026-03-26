import { type InjectionKey, computed, inject, provide } from "vue";

import type { ToastService } from "@knime/components";

import type { RepositoryItem } from "../../api/types";
import { logger } from "../utils/logger";

type DownloadProvider = {
  startDownload: (item: { id: string; name: string }) => Promise<void>;
};

export type NavigationEvent =
  | { type: "to-parent-dir" }
  | { type: "to-child-dir"; item: RepositoryItem }
  | { type: "to-item-details"; item: RepositoryItem; openInNewTab?: boolean };

type NavigationProvider = {
  navigate: (event: NavigationEvent) => void;
};

export type GlobalContext = {
  toasts: ToastService;
  navigation: NavigationProvider;

  features?: {
    editing?: {
      isEnabled: boolean;
      editingURL: string;
      editingECIds: string[];
    };

    download?: {
      provider: DownloadProvider;
    };
  };
};

export const GLOBAL_CONTEXT: InjectionKey<GlobalContext> =
  Symbol("GLOBAL_CONTEXT");

export const initGlobalContext = (ctx: GlobalContext) => {
  provide(GLOBAL_CONTEXT, ctx);
};

export const globalContext = {
  navigation: () => {
    const ctx = inject(GLOBAL_CONTEXT);

    if (!ctx) {
      throw new Error("Unexpected state. Global context not found");
    }

    return ctx.navigation;
  },

  toastService: () => {
    const globalContext = inject(GLOBAL_CONTEXT);

    if (!globalContext?.toasts) {
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

    return globalContext.toasts;
  },

  downloadProvider: (): DownloadProvider => {
    const globalContext = inject(GLOBAL_CONTEXT);

    if (!globalContext?.features?.download?.provider) {
      logger().error("Download provider not found");

      return {
        startDownload: () =>
          Promise.reject(new Error("Download provider not available")),
      };
    }

    return globalContext?.features?.download?.provider;
  },
};
