<script setup lang="ts">
import { computed } from "vue";

import { KdsNumberInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

import { useBuiltinValidation } from "./composables/useBuiltinValidations";

const props = defineProps<
  VueControlPropsForLabelContent<number> & {
    type: "integer" | "double";
  }
>();

const DEFAULT_STEP_SIZE_INTEGER = 1;
const DEFAULT_STEP_SIZE_DOUBLE = 0.1;

const stepSize = computed<number>(
  () =>
    props.control.uischema.options?.stepSize ??
    (props.type === "integer"
      ? DEFAULT_STEP_SIZE_INTEGER
      : DEFAULT_STEP_SIZE_DOUBLE),
);

type BoundValidationParameters = {
  isExclusive: boolean;
};

type MinValidationParameters = BoundValidationParameters & { min: number };

type MaxValidationParameters = BoundValidationParameters & { max: number };

const respectsMin =
  ({ min, isExclusive }: MinValidationParameters) =>
  (value: number) =>
    isNaN(value) || (isExclusive ? value > min : value >= min);

const respectsMax =
  ({ max, isExclusive }: MaxValidationParameters) =>
  (value: number) =>
    isNaN(value) || (isExclusive ? value < max : value <= max);

const validationParams = useBuiltinValidation(
  {
    min: respectsMin,
    max: respectsMax,
  },
  props,
);

const min = computed<number | undefined>(() => {
  const params = validationParams.value.min;
  if (!params || params.min === null) {
    return undefined;
  }
  return params.min + (params.isExclusive ? stepSize.value : 0);
});

const max = computed<number | undefined>(() => {
  const params = validationParams.value.max;
  if (!params || params.max === null) {
    return undefined;
  }
  return params.max - (params.isExclusive ? stepSize.value : 0);
});
</script>

<template>
  <KdsNumberInput
    :id="labelForId"
    class="number-input"
    :disabled="disabled"
    :model-value="control.data"
    :min="min"
    :max="max"
    :step="stepSize"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
