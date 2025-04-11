<script setup lang="ts">
import { computed } from "vue";

import {
  DateTimeFormatInput,
  type DateTimeFormatModel,
  type FormatDateType,
  type FormatWithExample,
} from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";
import inject from "../utils/inject";

import useProvidedState from "./composables/useProvidedState";

const getData = inject("getData");

const props = defineProps<VueControlPropsForLabelContent<string>>();

const options = computed(() => props.control.uischema.options);

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

const performValidation = async (newValue: string) => {
  const receivedData = await getData({
    method: "settings.performCustomValueValidation",
    options: [props.control.uischema.options!.customValidation, newValue],
  });
  props.onRegisterCustomValidationMessages({ errors: [receivedData.result] });
};

// TODO: Listen to the 'committed' event of the DateTimeFormatInput.
// If the format is not in the list and is valid,
// get an example from the backend, add it to the list of formats.

const modelValue = computed<DateTimeFormatModel>({
  get: () =>
    ({
      format: props.control.data,
      temporalType: "DATE",
    }) satisfies DateTimeFormatModel,
  set: (value: DateTimeFormatModel) => {
    props.changeValue(value.format);
    performValidation(value.format);
  },
});
</script>

<template>
  <DateTimeFormatInput
    :id="labelForId"
    v-model="modelValue"
    compact
    :disabled="disabled"
    :show-type-switch-in-popover="true"
    :allowed-formats="allowedFormats"
    :all-default-formats="allBaseFormats"
    :is-valid="true"
  />
</template>
