<script setup lang="ts">
import { computed } from "vue";

import { KdsNumberInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

const props = defineProps<VueControlPropsForLabelContent<number>>();

const min = computed(() => props.control.schema.minimum ?? 0);
const max = computed(() => props.control.schema.maximum ?? Infinity);
const step = computed(() => props.control.uischema.options?.step ?? 1);
const unit = computed(() => props.control.uischema.options?.unit || "");
const disabled = computed(
  () => props.control.uischema.options?.disabled || false,
);
const readonly = computed(
  () => props.control.uischema.options?.readOnly || false,
);

const onChange = (value: number) => {
  props.handleChange(props.control.path, value);
};
</script>

<template>
  <KdsNumberInput
    :id="labelForId"
    :model-value="control.data"
    :min="min"
    :max="max"
    :step="step"
    :unit="unit"
    :disabled="disabled"
    :readonly="readonly"
    @update:model-value="onChange"
  />
</template>
