<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { ComboBox } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";
import type { PossibleValue } from "../types/ChoicesUiSchema";
import { withSpecialChoices } from "../utils/getPossibleValuesFromUiSchema";

import useProvidedState from "./composables/useProvidedState";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const choicesProvider = computed<string | undefined>(
  () => props.control.uischema?.options?.choicesProvider,
);
const options = withSpecialChoices(
  useProvidedState<PossibleValue[]>(choicesProvider, []),
  props.control,
);
const selectedIds = ref([] as string[]);
const loaded = ref(false);

onMounted(() => {
  selectedIds.value = props.control.data;
  if (!choicesProvider.value) {
    options.value = props.control.uischema?.options?.possibleValues;
  }
  loaded.value = true;
});

const noPossibleValuesPresent = computed(
  () => typeof options.value === "undefined",
);
const isDisabled = computed(
  () =>
    props.disabled ||
    noPossibleValuesPresent.value ||
    options.value?.length === 0,
);
</script>

<template>
  <!--
        TODO Enable unsing :allow-new-values="noPossibleValuesPresent"
        (see https://github.com/vuejs/vue/issues/2169)
      -->
  <ComboBox
    v-if="loaded"
    :id="labelForId"
    :allow-new-values="noPossibleValuesPresent ? ('' as any) : false"
    :aria-label="control.label"
    :disabled="isDisabled"
    :possible-values="noPossibleValuesPresent ? [] : options"
    :model-value="selectedIds"
    :is-valid
    compact
    @update:model-value="(newValue: any[]) => changeValue(newValue)"
  />
</template>

<style scoped>
:deep(.multiselect) {
  background-color: white;
}
</style>
