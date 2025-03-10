import { type MaybeRef, type Ref, onMounted, ref, unref } from "vue";

import inject from "../../utils/inject";

export default <T>(
  stateProviderId: MaybeRef<string | undefined>,
  defaultValue: T,
) => {
  const addStateProviderListener = inject("addStateProviderListener");

  const state = ref(defaultValue) as Ref<T>;

  onMounted(() => {
    const id = unref(stateProviderId);
    if (id) {
      addStateProviderListener({ id }, (providedValue: T) => {
        state.value = providedValue;
      });
    }
  });

  return state;
};
