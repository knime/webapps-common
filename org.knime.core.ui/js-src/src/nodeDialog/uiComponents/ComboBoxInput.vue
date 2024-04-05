<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ComboBox from "webapps-common/ui/components/forms/ComboBox.vue";
import type { PossibleValue } from "../types/ChoicesUiSchema";
import useDialogControl from "../composables/components/useDialogControl";
import LabeledInput from "./label/LabeledInput.vue";
import { rendererProps } from "@jsonforms/vue";
import useProvidedState from "../composables/components/useProvidedState";
import { withSpecialChoices } from "../utils/getPossibleValuesFromUiSchema";
const props = defineProps(rendererProps());
const {
  control,
  onChange,
  disabled: disabledByDefault,
} = useDialogControl<string[]>({ props });

const choicesProvider = computed<string | undefined>(
  () => control.value.uischema?.options?.choicesProvider,
);
const options = withSpecialChoices(
  useProvidedState<PossibleValue[]>(choicesProvider, []),
  control.value,
);
const selectedIds = ref([] as string[]);
const loaded = ref(false);

onMounted(() => {
  selectedIds.value = control.value.data;
  if (!choicesProvider.value) {
    options.value = control.value.uischema?.options?.possibleValues;
  }
  loaded.value = true;
});

const noPossibleValuesPresent = computed(
  () => typeof options.value === "undefined",
);
const disabled = computed(
  () =>
    disabledByDefault.value ||
    noPossibleValuesPresent.value ||
    options.value?.length === 0,
);
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <!--
        TODO Enable unsing :allow-new-values="noPossibleValuesPresent"
        (see https://github.com/vuejs/vue/issues/2169)
      -->
    <ComboBox
      v-if="loaded"
      :id="labelForId"
      :allow-new-values="noPossibleValuesPresent ? ('' as any) : false"
      :aria-label="control.label"
      :disabled="disabled"
      :possible-values="noPossibleValuesPresent ? [] : options"
      :model-value="selectedIds"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>

<style scoped>
:deep(.multiselect) {
  background-color: white;
}
</style>
