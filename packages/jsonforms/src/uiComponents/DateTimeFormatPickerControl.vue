<script setup lang="ts">
import { computed, ref, watch } from "vue";

import {
  DateTimeFormatInput,
  ValueSwitch,
  type FormatDateType,
  type FormatWithExample,
  type DateTimeFormatModel,
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

const modelValue = ref(props.control.data);

const onValueSwitchUpdated = (value: string) => {
  modelValue.value = {
    ...modelValue.value,
    temporalType: value as FormatDateType,
  };
};

const onFormatUpdated = (value: DateTimeFormatModel) => {
  modelValue.value = value;
};

watch(modelValue, (newValue) => {
  props.changeValue(newValue);
  console.log("modelValue updated so watcher is notifying control");
});
</script>

<template>
  <ValueSwitch
    compact
    :possible-values="possibleValueSwitchChoices"
    :model-value="modelValue.temporalType"
    @update:model-value="onValueSwitchUpdated"
  />
  <DateTimeFormatInput
    :id="labelForId"
    compact
    :disabled="disabled"
    :model-value="modelValue"
    :allowed-formats="allowedFormats"
    :all-default-formats="allBaseFormats"
    :is-valid="true"
    @update:model-value="onFormatUpdated"
  />
</template>
