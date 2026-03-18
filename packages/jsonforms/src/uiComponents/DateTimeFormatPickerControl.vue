<script setup lang="ts">
import { computed } from "vue";

import {
  type KdsDateTimeFormatEntry,
  KdsDateTimeFormatInput,
  type KdsTemporalType,
} from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type DateTimeFormatPickerControlOptions = {
  allowedFormats?: KdsTemporalType[];
  dateTimeFormats: KdsDateTimeFormatEntry[];
};

type DateTimeFormatPickerControlUiSchema =
  UiSchemaWithProvidedOptions<DateTimeFormatPickerControlOptions>;

const props = defineProps<VueControlPropsForLabelContent<string>>();

const uischema = computed(
  () => props.control.uischema as DateTimeFormatPickerControlUiSchema,
);

const options = computed(() => uischema.value.options);

const allowedFormats = computed(() => options.value?.allowedFormats);

// TODO: take the initial value from the control and put it
// into the recents if it is not already there. For this you
// will need to check its validity and generate an example,
// using backend communication.
const allBaseFormats = useProvidedState(uischema, "dateTimeFormats", []);

// TODO: Listen to the 'update:model-value' event of the KdsDateTimeFormatInput.
// If the format is not in the list and is valid,
// get an example from the backend, add it to the list of formats.
</script>

<template>
  <KdsDateTimeFormatInput
    :id="labelForId"
    :model-value="props.control.data"
    :disabled="disabled"
    :allowed-formats="allowedFormats"
    :all-default-formats="allBaseFormats ?? []"
    @update:model-value="changeValue"
  />
</template>
