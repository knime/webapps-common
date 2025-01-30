<script setup lang="ts">
import { computed } from "vue";

import { DateTimeInput } from "@knime/components/date-time-input";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";
import { fromUTCTime, toUTCTime } from "../utils/localTimeUtils";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const options = computed(() => props.control.uischema.options);
const minimum = computed(() =>
  options.value?.minimum ? toUTCTime(options.value.minimum) : null,
);
const maximum = computed(() =>
  options.value?.maximum ? toUTCTime(options.value.maximum) : null,
);

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
    :show-time="options?.showTime"
    :show-seconds="options?.showSeconds"
    :show-milliseconds="options?.showMilliseconds"
    timezone="UTC"
    :date-format="options?.dateFormat"
    :min="minimum"
    :max="maximum"
    compact
    :disabled="disabled"
  />
</template>
