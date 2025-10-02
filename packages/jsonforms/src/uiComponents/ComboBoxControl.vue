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

const willHavePossibleValues = computed(
  () =>
    props.control.uischema.providedOptions?.includes("possibleValues") ||
    props.control.uischema.options?.possibleValues !== undefined,
);

const isDisabled = computed(
  () =>
    props.disabled ||
    (noPossibleValuesPresent.value && willHavePossibleValues.value),
);
</script>

<template>
  <ComboBox
    :id="labelForId"
    :allow-new-values="!willHavePossibleValues"
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
