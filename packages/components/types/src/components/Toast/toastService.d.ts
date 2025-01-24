import type { Plugin } from "vue";
import type { Toast, ToastService, ToastServiceComposableOptions, UseToastsOptions } from "./types";
export declare const defaultToastServiceSymbol: unique symbol;
export declare const defaultGlobalPropertyName = "$toast";
export declare class ToastServiceError extends Error {
    constructor(message?: string);
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
export declare class ToastServiceProvider {
    toasts: import("vue").Ref<{
        type?: "error" | "info" | "success" | "warning" | undefined;
        headline?: string | undefined;
        message?: string | undefined;
        buttons?: ({
            callback?: (() => void) | undefined;
            to?: string | undefined;
            href?: string | undefined;
            icon: import("vue").FunctionalComponent<import("vue").SVGAttributes, {}, any, {}>;
            text?: string | undefined;
        } | {
            callback?: (() => void) | undefined;
            to?: string | undefined;
            href?: string | undefined;
            icon?: import("vue").FunctionalComponent<import("vue").SVGAttributes, {}, any, {}> | undefined;
            text: string;
        })[] | undefined;
        component?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | null | undefined;
        autoRemove?: boolean | undefined;
        active?: boolean | undefined;
        id?: string | undefined;
        key?: string | undefined;
        meta?: any;
        stackId?: string | undefined;
    }[]>;
    show: (toast: Toast) => string;
    remove(id: string): void;
    removeBy: (predicate: (toast: Toast) => boolean) => void;
    autoRemove: () => void;
    removeAll: () => void;
    readonlyToasts: import("vue").ComputedRef<{
        type?: "error" | "info" | "success" | "warning" | undefined;
        headline?: string | undefined;
        message?: string | undefined;
        buttons?: ({
            callback?: (() => void) | undefined;
            to?: string | undefined;
            href?: string | undefined;
            icon: import("vue").FunctionalComponent<import("vue").SVGAttributes, {}, any, {}>;
            text?: string | undefined;
        } | {
            callback?: (() => void) | undefined;
            to?: string | undefined;
            href?: string | undefined;
            icon?: import("vue").FunctionalComponent<import("vue").SVGAttributes, {}, any, {}> | undefined;
            text: string;
        })[] | undefined;
        component?: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
            [key: string]: any;
        }> | null | undefined;
        autoRemove?: boolean | undefined;
        active?: boolean | undefined;
        id?: string | undefined;
        key?: string | undefined;
        meta?: any;
        stackId?: string | undefined;
    }[]>;
    toastServiceObject: ToastService;
    /** Methods for accessing the toast service object */
    /**
     * A composable to be used in the app's root component's `setup`. Provides
     * the service object to downstream components of the app via Vue's dependency
     * injection, which can then be accessed via the `useToasts` composable.
     *
     * @example
     * toastServiceProvider.useToastService({ serviceSymbol: Symbol("customToastService") });
     */
    useToastService: ({ serviceSymbol, }?: ToastServiceComposableOptions) => void;
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
    getToastServicePlugin: () => Plugin;
    /**
     * Returns the toast service object directly.
     */
    getToastServiceObject: () => ToastService;
}
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
export declare const useToasts: ({ serviceSymbol, propertyName, }?: UseToastsOptions) => ToastService;
