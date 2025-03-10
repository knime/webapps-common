<script setup lang="ts">
import { computed } from "vue";

import { NumberInput } from "@knime/components";

import type { Messages } from "../higherOrderComponents/control/validation/types";
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import useProvidedState from "./composables/useProvidedState";

type ProvidedState = {
  value: number;
  errorMessage: string;
};

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

const {
  min: constantMin,
  minProvider,
  max: constantMax,
  maxProvider,
  minErrorMessage,
  maxErrorMessage,
  minIsExclusive,
  maxIsExclusive,
} = props.control.uischema.options || {};

const minStateDefault: ProvidedState = {
  value: constantMin,
  errorMessage: minErrorMessage,
};
const maxStateDefault: ProvidedState = {
  value: constantMax,
  errorMessage: maxErrorMessage,
};

const minState = useProvidedState(minProvider, minStateDefault);
const maxState = useProvidedState(maxProvider, maxStateDefault);

const respectsMin = (value: number, minimum: number) =>
  minIsExclusive ? value > minimum : value >= minimum;
const respectsMax = (value: number, maximum: number) =>
  maxIsExclusive ? value < maximum : value <= maximum;

if (
  typeof [minProvider, maxProvider, constantMin, constantMax].find(
    (prop) => typeof prop !== "undefined",
  ) !== "undefined"
) {
  const createErrors = ({
    value,
    minState,
    maxState,
  }: {
    value: number;
    minState?: ProvidedState;
    maxState?: ProvidedState;
  }): Messages => {
    if (
      typeof minState?.value === "number" &&
      !respectsMin(value, minState.value)
    ) {
      return { errors: [minState.errorMessage] };
    }
    if (
      typeof maxState?.value === "number" &&
      !respectsMax(value, maxState.value)
    ) {
      return { errors: [maxState.errorMessage] };
    }
    return { errors: [] };
  };
  const minMaxValidator = computed(
    () => (value: number) =>
      createErrors({
        value,
        minState: minState.value,
        maxState: maxState.value,
      }),
  );
  props.onRegisterValidation(minMaxValidator);
}

const onFocusOut = () => {
  const num = props.control.data;
  const { value: min } = minState.value;
  const { value: max } = maxState.value;
  if (typeof min === "number" && !respectsMin(num, min)) {
    if (minIsExclusive) {
      props.changeValue(min + stepSize);
    } else {
      props.changeValue(min);
    }
  } else if (typeof max === "number" && !respectsMax(num, max)) {
    if (maxIsExclusive) {
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
    :min="minState.value"
    :max="maxState.value"
    :is-valid
    compact
    @update:model-value="changeValue"
    @focusout="onFocusOut"
  />
</template>
