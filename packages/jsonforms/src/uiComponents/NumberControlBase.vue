<script setup lang="ts">
import { computed } from "vue";

import { NumberInput } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import { useBuiltinValidation } from "./composables/useBuiltinValidations";

const props = defineProps<
  VueControlPropsForLabelContent<number> & {
    type: "integer" | "double";
  }
>();

const DEFAULT_STEP_SIZE_INTEGER = 1;
const DEFAULT_STEP_SIZE_DOUBLE = 0.1;

const stepSize = computed(
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

const onFocusOut = () => {
  const currentDataValue = props.control.data;
  const isNotANumber =
    typeof currentDataValue !== "number" || isNaN(currentDataValue);
  let updatedValue = isNotANumber ? 0 : null;
  const comparisonValue = isNotANumber ? 0 : currentDataValue;
  if (minParams.value && !respectsMin(minParams.value)(comparisonValue)) {
    const { min, isExclusive } = minParams.value;
    if (isExclusive) {
      updatedValue = min + stepSize.value;
    } else {
      updatedValue = min;
    }
  } else if (
    maxParams.value &&
    !respectsMax(maxParams.value)(comparisonValue)
  ) {
    const { max, isExclusive } = maxParams.value;
    if (isExclusive) {
      updatedValue = max - stepSize.value;
    } else {
      updatedValue = max;
    }
  }
  if (updatedValue !== null) {
    props.changeValue(updatedValue);
  }
};
</script>

<template>
  <NumberInput
    :id="labelForId"
    class="number-input"
    :disabled="disabled"
    :model-value="control.data"
    :type="type"
    :min="minParams?.min"
    :max="maxParams?.max"
    :step="stepSize"
    :is-valid
    compact
    @update:model-value="changeValue"
    @focusout="onFocusOut"
  />
</template>
