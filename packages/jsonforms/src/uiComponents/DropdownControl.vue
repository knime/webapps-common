<script setup lang="ts">
import { computed, toRef } from "vue";

import { KdsTextInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import { usePossibleValues } from "./composables/usePossibleValues";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

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
  <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
  <LoadingDropdown
    v-else
    :id="labelForId ?? ''"
    :ariaLabel="control.label"
    :disabled="disabled"
    :model-value="control.data ?? ''"
    :possible-values="possibleValues"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
