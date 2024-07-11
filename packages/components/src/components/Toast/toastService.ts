import type { App, Plugin } from "vue";
import { computed, getCurrentInstance, inject, provide, ref } from "vue";
import { cloneDeep, uniqueId } from "lodash-es";
import type {
  Toast,
  ToastService,
  ToastServiceComposableOptions,
  UseToastsOptions,
} from "./types";

export const defaultToastServiceSymbol = Symbol("toast");
export const defaultGlobalPropertyName = "$toast";

export class ToastServiceError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ToastServiceError";
  }
}

/**
 * Each instance of the class is bound to a reactive array of toasts, with which you
 * can interface via the properties of the `ToastService` object.
 *
 * You have the following options to access the toast service:
 * - `provide` the service object to downstream components by using the `useToastService`
 *   method in the `setup` of the app's root component;
 * - register the service object as a global property by getting a Plugin object via
 *   the `getToastServicePlugin` method, and binding it to the app via `app.use(toastPlugin)`
 *   in `main.js/ts`;
 * - get the toast service object directly via `getToastServiceObject` method.
 */
export class ToastServiceProvider {
  toasts = ref<Toast[]>([]);

  show = (toast: Toast): string => {
    const clonedToast = cloneDeep(toast);
    if (clonedToast.key) {
      const previousToast = this.toasts.value.find(
        ({ key }) => clonedToast.key === key,
      );
      if (previousToast) {
        return previousToast.id!;
      }
    }
    clonedToast.id = clonedToast.id
      ? `${clonedToast.id}-${uniqueId()}`
      : uniqueId();
    clonedToast.autoRemove = clonedToast.autoRemove ?? true;
    this.toasts.value.unshift(clonedToast);

    return clonedToast.id;
  };

  remove(id: string): void {
    this.toasts.value = this.toasts.value.filter(
      (toast: Toast) => toast.id !== id,
    );
  }

  removeBy = (predicate: (toast: Toast) => boolean): void => {
    this.toasts.value = this.toasts.value.filter(
      (toast: Toast) => !predicate(toast),
    );
  };

  autoRemove = (): void => {
    this.toasts.value = this.toasts.value.filter(
      (toast: Toast) => !toast.autoRemove,
    );
  };

  removeAll = (): void => {
    this.toasts.value = [];
  };

  readonlyToasts = computed(() => this.toasts.value);

  toastServiceObject: ToastService = {
    toasts: this.readonlyToasts,
    show: this.show,
    remove: this.remove.bind(this),
    removeBy: this.removeBy.bind(this),
    autoRemove: this.autoRemove,
    removeAll: this.removeAll,
  };

  /** Methods for accessing the toast service object */

  /**
   * A composable to be used in the app's root component's `setup`. Provides
   * the service object to downstream components of the app via Vue's dependency
   * injection, which can then be accessed via the `useToasts` composable.
   *
   * @example
   * toastServiceProvider.useToastService({ serviceSymbol: Symbol("customToastService") });
   */
  useToastService = ({
    serviceSymbol = defaultToastServiceSymbol as Symbol,
  }: ToastServiceComposableOptions = {}): void => {
    provide(serviceSymbol, this.toastServiceObject);
  };

  /**
   * Returns an object that can be used as a plugin with the `app.use()` syntax.
   * A custom `propertyName` property can be provided to be used as the global
   * property name instead of the default "$toast".
   *
   * @example
   * const toastPlugin = toastServiceProvider.getToastServicePlugin();
   * app.use(toastPlugin, {
   *    propertyName: "$customPropertyName" // "$toast" by default
   * })
   */
  getToastServicePlugin = (): Plugin => {
    return {
      install: (app: App, options?: { propertyName?: string }) => {
        const propertyName = options?.propertyName ?? defaultGlobalPropertyName;
        app.config.globalProperties[propertyName] = this.toastServiceObject;
      },
    };
  };

  /**
   * Returns the toast service object directly.
   */
  getToastServiceObject = (): ToastService => {
    return this.toastServiceObject;
  };
}

const useToastsFromSymbol = (serviceSymbol: Symbol): ToastService => {
  const toastService = inject<ToastService | null>(serviceSymbol, null);

  if (!toastService) {
    throw new ToastServiceError(
      `No toast service found using the symbol ${serviceSymbol.toString()}.`,
    );
  }

  return toastService;
};

const useToastsFromGlobalProperty = (propertyName: string): ToastService => {
  const toastService =
    getCurrentInstance()?.appContext.config.globalProperties[propertyName];

  if (!toastService) {
    throw new ToastServiceError(
      `No toast service found using the global property name '${propertyName}'.`,
    );
  }

  return toastService;
};

/**
 * Retrieves the toast service object either from the global injection or from the app's
 * global property via the app instance. If you have multiple instances of the toast
 * service in the app, you can use different injection key symbols or global property
 * names to differentiate them.
 *
 * @example
 * import { useToasts } from "@knime/components";
 *
 * // Using default options (the app has a shared toast service between components)
 * const { show } = useToasts();
 *
 * // Using a specific symbol (multiple toast services running across the app)
 * const { show } = useToasts({ serviceSymbol: mySpecialSymbol });
 *
 * show({
 *    type: "success",
 *    message: "I am an example toast."
 * });
 */

export const useToasts = ({
  serviceSymbol,
  propertyName,
}: UseToastsOptions = {}): ToastService => {
  if (serviceSymbol && propertyName) {
    throw new ToastServiceError(
      "Please provide either a custom injection key symbol or a custom global property name, but not both.",
    );
  }

  if (!serviceSymbol && !propertyName) {
    try {
      return useToastsFromSymbol(defaultToastServiceSymbol);
    } catch (error) {
      return useToastsFromGlobalProperty(defaultGlobalPropertyName);
    }
  }

  if (serviceSymbol) {
    return useToastsFromSymbol(serviceSymbol);
  }

  if (propertyName) {
    return useToastsFromGlobalProperty(propertyName);
  }

  throw new ToastServiceError("No toast service found.");
};
