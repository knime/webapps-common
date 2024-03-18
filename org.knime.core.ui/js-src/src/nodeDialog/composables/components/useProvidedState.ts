import inject from "@/nodeDialog/utils/inject";
import { onMounted, ref, type MaybeRef, unref } from "vue";

export default <T>(
  stateProviderId: MaybeRef<string | undefined>,
  defaultValue: T,
) => {
  const addStateProviderListener = inject("addStateProviderListener");

  const state = ref<T>(defaultValue);

  onMounted(() => {
    const id = unref(stateProviderId);
    if (id) {
      addStateProviderListener(id, (providedValue) => {
        state.value = providedValue;
      });
    }
  });

  return state;
};
