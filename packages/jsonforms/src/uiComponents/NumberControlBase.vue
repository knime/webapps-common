<script setup lang="ts">
import { computed } from "vue";

import { KdsNumberInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

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

type MinValidationParameters = BoundValidationParameters & {
  min: number;
};

type MaxValidationParameters = BoundValidationParameters & {
  max: number;
};

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

const minParams = computed(() => validationParams.value.min);
const maxParams = computed(() => validationParams.value.max);
</script>

<template>
  <KdsNumberInput
    :id="labelForId"
    class="number-input"
    :disabled="disabled"
    :model-value="control.data"
    :min="minParams?.min + (minParams.isExclusive ? stepSize : 0)"
    :max="maxParams?.max - (maxParams.isExclusive ? stepSize : 0)"
    :step="stepSize"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
