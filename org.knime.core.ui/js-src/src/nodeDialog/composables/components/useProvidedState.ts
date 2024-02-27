import inject from "@/nodeDialog/utils/inject";
import { type Ref, onMounted, ref } from "vue";

export default <T>(
  stateProviderId: Ref<string | undefined>,
  defaultValue: T,
) => {
  const addStateProviderListener = inject("addStateProviderListener");

  const state = ref(defaultValue);

  onMounted(() => {
    if (stateProviderId.value) {
      addStateProviderListener(stateProviderId.value, (providedValue) => {
        state.value = providedValue;
      });
    }
  });

  return state;
};
