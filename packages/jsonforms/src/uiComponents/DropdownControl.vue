<script setup lang="ts">
import { computed, toRef } from "vue";

import { KdsDropdown, KdsTextInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

import { usePossibleValues } from "./composables/usePossibleValues";

const props = defineProps<VueControlPropsForLabelContent<string | null>>();

const { possibleValues } = usePossibleValues(toRef(props, "control"));

const allowNewValue = computed(() => {
  return props.control.uischema?.options?.allowNewValue;
});
const hasNoSuggestions = computed(
  () =>
    allowNewValue.value &&
    possibleValues.value !== null &&
    possibleValues.value.length === 0,
);
</script>

<template>
  <KdsTextInput
    v-if="hasNoSuggestions"
    :id="labelForId"
    :disabled="disabled"
    :model-value="control.data"
    :error="!isValid"
    @update:model-value="changeValue"
  />
  <KdsDropdown
    v-else
    :id="labelForId"
    :disabled="disabled"
    :model-value="control.data"
    :possible-values="possibleValues"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
