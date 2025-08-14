<script setup lang="ts">
import { computed } from "vue";

import { DateTimeInput } from "@knime/components/date-time-input";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";
import { fromUTCTime, toUTCTime } from "../utils/localTimeUtils";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const modelValue = computed<Date>({
  get: () => toUTCTime(props.control.data),
  set: (utcTime: Date) => props.changeValue(fromUTCTime(utcTime)),
});
</script>

<template>
  <DateTimeInput
    :id="labelForId"
    v-model="modelValue"
    two-lines
    :required="true"
    :show-time="false"
    compact
    :disabled="disabled"
    timezone="UTC"
  />
</template>
