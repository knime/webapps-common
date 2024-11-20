import { type InjectionKey, type Ref, inject, provide, ref } from "vue";

/**
 * Exported for tests
 */
export const injectionKey: InjectionKey<Ref<boolean>> = Symbol("hasNodeView");

export const useHasNodeView = () => {
  const hasNodeView = ref(false);

  provide(injectionKey, hasNodeView);

  return hasNodeView;
};

export const injectHasNodeView = () => inject(injectionKey)!;
