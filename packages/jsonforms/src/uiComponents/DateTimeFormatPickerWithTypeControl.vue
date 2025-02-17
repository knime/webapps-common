<script setup lang="ts">
import { computed } from "vue";

import {
  DateTimeFormatInput,
  type DateTimeFormatModel,
  type FormatDateType,
  type FormatWithExample,
  ValueSwitch,
} from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import useProvidedState from "./composables/useProvidedState";

const props =
  defineProps<VueControlPropsForLabelContent<DateTimeFormatModel>>();

const options = computed(() => {
  return props.control.uischema.options;
});

const allowedFormats = computed<FormatDateType[]>(() => {
  return options.value?.allowedFormats;
});

// TODO: take the initial value from the control and put it
// into the recents if it is not already there. For this you
// will need to check its validity and generate an example,
// using backend communication.
const allBaseFormats = useProvidedState<FormatWithExample[] | null>(
  computed(() => options.value?.formatProvider),
  null,
);

// TODO: Listen to the 'committed' event of the DateTimeFormatInput.

// If the format is not in the list and is valid,
// get an example from the backend, add it to the list of formats.

const possibleValueSwitchChoices = [
  {
    id: "DATE",
    text: "Date",
  },
  {
    id: "DATE_TIME",
    text: "Date & time",
  },
  {
    id: "TIME",
    text: "Time",
  },
  {
    id: "ZONED_DATE_TIME",
    text: "Zoned date & time",
  },
];

const modelValue = computed({
  get: () => props.control.data,
  set: (value) => {
    props.changeValue(value);
  },
});

const temporalTypeModel = computed({
  get: () => modelValue.value.temporalType,
  set: (value) => {
    modelValue.value = {
      ...modelValue.value,
      temporalType: value,
    };
  },
});
</script>

<template>
  <div :id="labelForId" class="control-container">
    <ValueSwitch
      v-model="temporalTypeModel"
      compact
      :possible-values="possibleValueSwitchChoices"
      :disabled="disabled"
    />
    <DateTimeFormatInput
      v-model="modelValue"
      compact
      :disabled="disabled"
      :show-type-switch-in-popover="false"
      :allowed-formats="allowedFormats"
      :all-default-formats="allBaseFormats"
      :is-valid="true"
    />
  </div>
</template>

<style lang="postcss" scoped>
.control-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}
</style>
