<script setup lang="ts">
import { computed } from "vue";

import {
  type AllowedIntervalFormatsType,
  IntervalInput,
} from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

type IntervalControlOptions = {
  intervalType?: AllowedIntervalFormatsType;
};

type IntervalControlUiSchema =
  UiSchemaWithProvidedOptions<IntervalControlOptions>;

const props = defineProps<VueControlPropsForLabelContent<string>>();

const uischema = computed(
  () => props.control.uischema as IntervalControlUiSchema,
);

const intervalType = useProvidedState(
  uischema,
  "intervalType",
  "DATE_OR_TIME" as AllowedIntervalFormatsType,
);
</script>

<template>
  <IntervalInput
    :id="labelForId"
    compact
    :disabled="disabled"
    :model-value="control.data"
    :format="intervalType"
    @update:model-value="changeValue"
  />
</template>
