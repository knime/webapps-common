<script setup lang="ts">
import { computed, toRef } from "vue";

import { ComboBox } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import { usePossibleValues } from "./composables/usePossibleValues";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const { possibleValues } = usePossibleValues(toRef(props, "control"));

const noPossibleValuesPresent = computed(
  () => possibleValues.value === null || possibleValues.value.length === 0,
);
const isDisabled = computed(
  () => props.disabled || noPossibleValuesPresent.value,
);
</script>

<template>
  <!--
        TODO Enable unsing :allow-new-values="noPossibleValuesPresent"
        (see https://github.com/vuejs/vue/issues/2169)
      -->
  <ComboBox
    :id="labelForId"
    :allow-new-values="noPossibleValuesPresent ? ('' as any) : false"
    :aria-label="control.label"
    :disabled="isDisabled"
    :possible-values="
      noPossibleValuesPresent
        ? control.data.map((id) => ({ id, text: id }))
        : possibleValues!
    "
    :model-value="control.data"
    :is-valid
    compact
    @update:model-value="(newValue: any[]) => changeValue(newValue)"
  />
</template>

<style scoped>
:deep(.multiselect) {
  background-color: var(--knime-white);
}
</style>
