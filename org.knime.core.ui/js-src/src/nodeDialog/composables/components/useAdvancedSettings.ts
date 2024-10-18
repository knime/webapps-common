import type { Ref } from "vue";
import { inject, InjectionKey, provide, ref } from "vue";

/**
 * Exported for tests
 */
export const injectionKey: InjectionKey<Ref<boolean>> = Symbol(
  "showAdvancedSettings",
);

export const useShowAdvancedSettings = () => {
  const showAdvancedSettings = ref(false);

  provide(injectionKey, showAdvancedSettings);

  return showAdvancedSettings;
};

export const injectShowAdvancedSettings = () => inject(injectionKey)!;
