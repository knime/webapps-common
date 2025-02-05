<script setup lang="ts">
import { computed } from "vue";

import { NumberInput } from "@knime/components";

import type { Messages } from "../higherOrderComponents/control/validation/types";
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import useProvidedState from "./composables/useProvidedState";

const props = defineProps<
  VueControlPropsForLabelContent<number> & {
    type: "integer" | "double";
  }
>();

const {
  min: constantMin,
  minProvider,
  max: constantMax,
  maxProvider,
} = props.control.uischema.options || {};

const min = useProvidedState(minProvider, constantMin);
const max = useProvidedState(maxProvider, constantMax);

if (
  typeof [minProvider, maxProvider, constantMin, constantMax].find(
    (prop) => typeof prop !== "undefined",
  ) !== "undefined"
) {
  const createErrors = ({
    value,
    minimum,
    maximum,
  }: {
    value: number;
    minimum?: number;
    maximum?: number;
  }): Messages => {
    if (typeof minimum === "number" && value < minimum) {
      return { errors: [`The value has to be at least ${minimum}`] };
    }
    if (typeof maximum === "number" && value > maximum) {
      return { errors: [`The value has to be ${maximum} at max`] };
    }
    return { errors: [] };
  };
  const minMaxValidator = computed(
    () => (value: number) =>
      createErrors({
        value,
        minimum: min.value,
        maximum: max.value,
      }),
  );
  props.onRegisterValidation(minMaxValidator);
}

const onFocusOut = () => {
  const num = props.control.data;
  if (typeof min.value === "number" && num < min.value) {
    props.changeValue(min.value);
  } else if (typeof max.value === "number" && num > max.value) {
    props.changeValue(max.value);
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
    :min="min"
    :max="max"
    :is-valid
    compact
    @update:model-value="changeValue"
    @focusout="onFocusOut"
  />
</template>
