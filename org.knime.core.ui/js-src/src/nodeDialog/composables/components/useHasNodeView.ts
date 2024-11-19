import { type Ref, inject, type InjectionKey, provide, ref } from "vue";

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
