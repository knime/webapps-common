<script setup lang="ts">
import { computed, toRef } from "vue";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import { usePossibleValues } from "./composables/usePossibleValues";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

const props = defineProps<VueControlPropsForLabelContent<string | null>>();

const { possibleValues } = usePossibleValues(toRef(props, "control"));

const allowNewValue = computed(() => {
  return props.control.uischema?.options?.allowNewValue;
});
</script>

<template>
  <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
  <LoadingDropdown
    :id="labelForId ?? ''"
    :ariaLabel="control.label"
    :disabled="disabled"
    :model-value="control.data ?? ''"
    :possible-values="possibleValues"
    :is-valid
    :allow-new-value
    compact
    @update:model-value="changeValue"
  />
</template>
