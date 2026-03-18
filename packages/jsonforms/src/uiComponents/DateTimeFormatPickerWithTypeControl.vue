<script setup lang="ts">
import { computed } from "vue";

import type {
  KdsDateTimeFormatEntry,
  KdsTemporalType,
} from "@knime/kds-components";
import { KdsDateTimeFormatInput, KdsValueSwitch } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type DateTimeFormatModel = {
  temporalType: KdsTemporalType;
  format: string;
};

type DateTimeFormatPickerWithTypeControlOptions = {
  allowedFormats?: KdsTemporalType[];
  dateTimeFormats: KdsDateTimeFormatEntry[];
};

type DateTimeFormatPickerControlUiSchema =
  UiSchemaWithProvidedOptions<DateTimeFormatPickerWithTypeControlOptions>;

const props =
  defineProps<VueControlPropsForLabelContent<DateTimeFormatModel>>();

const uischema = computed(
  () => props.control.uischema as DateTimeFormatPickerControlUiSchema,
);

// TODO: take the initial value from the control and put it
// into the recents if it is not already there. For this you
// will need to check its validity and generate an example,
// using backend communication.
const allBaseFormats = useProvidedState(uischema, "dateTimeFormats");

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

const formatModelValue = computed({
  get: () => modelValue.value.format,
  set: (value) => {
    modelValue.value = {
      ...modelValue.value,
      format: value,
    };
  },
});
</script>

<template>
  <div :id="labelForId" class="control-container">
    <KdsValueSwitch
      v-model="temporalTypeModel"
      aria-label="Format category"
      :possible-values="possibleValueSwitchChoices"
      :disabled="disabled"
    />
    <KdsDateTimeFormatInput
      v-model="formatModelValue"
      aria-label="Format string"
      :disabled="disabled"
      :allowed-formats="[temporalTypeModel]"
      :all-default-formats="allBaseFormats ?? []"
      :error="!isValid"
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
