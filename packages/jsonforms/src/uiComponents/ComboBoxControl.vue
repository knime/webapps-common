<script setup lang="ts">
import { computed, toRef } from "vue";

import { KdsMultiSelectDropdown } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

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
  <KdsMultiSelectDropdown
    :id="labelForId"
    :model-value="control.data"
    :allow-new-values="!willHavePossibleValues"
    :ariaLabel="control.label"
    :disabled="isDisabled"
    :possible-values="
      noPossibleValuesPresent
        ? control.data.map((id) => ({ id, text: id }))
        : possibleValues!
    "
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
