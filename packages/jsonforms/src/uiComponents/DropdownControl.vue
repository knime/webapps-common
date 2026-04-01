<script setup lang="ts">
import { toRef } from "vue";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import { usePossibleValues } from "./composables/usePossibleValues";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

const props = defineProps<VueControlPropsForLabelContent<string | null>>();

const { possibleValues } = usePossibleValues(toRef(props, "control"));
</script>

<template>
  <LoadingDropdown
    :id="labelForId ?? ''"
    :ariaLabel="control.label"
    :disabled="disabled"
    :model-value="control.data ?? ''"
    :possible-values="possibleValues"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
