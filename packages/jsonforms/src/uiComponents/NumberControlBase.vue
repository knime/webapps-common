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
const stepSize =
  props.type === "integer"
    ? DEFAULT_STEP_SIZE_INTEGER
    : DEFAULT_STEP_SIZE_DOUBLE;

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
  const num = props.control.data;
  if (minParams.value && !respectsMin(minParams.value)(num)) {
    const { min, isExclusive } = minParams.value;
    if (isExclusive) {
      props.changeValue(min + stepSize);
    } else {
      props.changeValue(min);
    }
  } else if (maxParams.value && !respectsMax(maxParams.value)(num)) {
    const { max, isExclusive } = maxParams.value;
    if (isExclusive) {
      props.changeValue(max - stepSize);
    } else {
      props.changeValue(max);
    }
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
    :is-valid
    compact
    @update:model-value="changeValue"
    @focusout="onFocusOut"
  />
</template>
