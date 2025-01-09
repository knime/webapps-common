<script setup lang="ts">
import { NumberInput } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";

import useProvidedState from "./composables/useProvidedState";

const props = defineProps<
  VueControlPropsForLabelContent<number> & {
    type: "integer" | "double";
  }
>();

const min = useProvidedState(
  props.control.uischema.options?.minProvider,
  props.control.uischema.options?.min,
);

const max = useProvidedState(
  props.control.uischema.options?.maxProvider,
  props.control.uischema.options?.max,
);

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
    compact
    @update:model-value="changeValue"
    @focusout="onFocusOut"
  />
</template>
