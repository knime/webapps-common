import { type MaybeRef, type UnwrapRef, onMounted, ref, unref } from "vue";

import inject from "../../utils/inject";

export default <T>(
  stateProviderId: MaybeRef<string | undefined>,
  defaultValue: T,
) => {
  const addStateProviderListener = inject("addStateProviderListener");

  const state = ref<T>(defaultValue);

  onMounted(() => {
    const id = unref(stateProviderId);
    if (id) {
      addStateProviderListener({ id }, (providedValue: T) => {
        state.value = providedValue as UnwrapRef<T>;
      });
    }
  });

  return state;
};
