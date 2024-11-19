import { type InjectionKey, inject, provide } from "vue";

/**
 * Exported for testing only
 */
export const injectionKey: InjectionKey<boolean> = Symbol(
  "isChildOfAddedArrayLayoutElement",
);

/**
 * The initialization of settings states depends on the initial values.
 * With the here provided boolean, it becomes determinable whether the
 * initial value is given by the child controls data or should be undefined instead.
 */

export const provideForAddedArrayLayoutElements = () =>
  provide(injectionKey, true);

export const injectIsChildOfAddedArrayLayoutElement = () =>
  inject(injectionKey, false);
