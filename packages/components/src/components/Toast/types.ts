import type {
  ComputedRef,
  FunctionalComponent,
  SVGAttributes,
  VNode,
} from "vue";

type BaseToastButton = {
  /**
   * An optional callback function to be executed when the button is clicked.
   */
  callback?: () => void;
  /**
   * If provided, the button will act as a NuxtLink and navigate to the specified route.
   * Takes precedence over the `href` prop.
   */
  to?: string;
  /**
   * If provided, the button will act as a hyperlink directing to the given URL.
   * Only takes effect if `to` is not provided.
   */
  href?: string;
};

type ToastButtonWithIcon = {
  /**
   * The icon to be displayed alongside with, or instead of the button text.
   */
  icon: FunctionalComponent<SVGAttributes>;
  text?: string;
};

type ToastButtonWithText = {
  icon?: FunctionalComponent<SVGAttributes>;
  /**
   * The text content to be displayed on the button.
   */
  text: string;
};

export type ToastButton = BaseToastButton &
  (ToastButtonWithIcon | ToastButtonWithText);

export interface ToastStack {
  serviceSymbol?: symbol | null;
  propertyName?: string | null;
}

export interface Toast {
  /**
   * Set to "info" by default.
   */
  type?: "error" | "warning" | "success" | "info";
  /**
   * If not specified, the type is used as the headline, e.g. "Info".
   */
  headline?: string;
  message?: string;
  buttons?: ToastButton[];
  component?: VNode | null;
  /**
   * If set to true, the toast will have an animated progress bar indicating time before
   * being automatically dismissed.
   */
  autoRemove?: boolean;
  active?: boolean;
  /**
   * If set, only one toast with the same key will be in the stack. If a new toast with the same key is added, it will be dropped.
   */
  deduplicationKey?: string;
  meta?: Record<string, unknown>;
  stackId?: string;
}

export interface ToastWithId extends Toast {
  /**
   * auto-generated identifier
   */
  id: string;
}

export interface ToastService {
  /**
   * Reactive array of Toast objects.
   */
  toasts: ComputedRef<ToastWithId[]>;
  /**
   * Adds the provided Toast object to the `toasts` array.
   * @returns The generated id of the added toast; can be used to call `remove(id)`.
   */
  show: (toast: Toast) => string;
  /**
   * Removes toast with the given id (returned by `show()`).
   */
  remove: (id: string) => void;
  /**
   * Removes all Toast objects that match the provided predicate.
   */
  removeBy: (predicate: (toast: Toast) => boolean) => void;
  /**
   * Removes all Toast objects with `autoRemove` set to `true` from the `toasts` array.
   */
  autoRemove: () => void;
  /**
   * Removes all Toast objects from the `toasts` array.
   */
  removeAll: () => void;
}

export interface ToastServiceComposableOptions {
  /**
   * The Symbol for the toast service object properties to be bound to.
   */
  serviceSymbol?: symbol;
}

export interface UseToastsOptions {
  /**
   * Custom Symbol to be used as the injection key.
   */
  serviceSymbol?: symbol | null;

  /**
   * Custom global property name. "$toast" by default.
   */
  propertyName?: string | null;
}
