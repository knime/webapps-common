<script setup lang="ts">
import { computed } from "vue";

import { DateTimeInput } from "@knime/components/date-time-input";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const options = computed(() => props.control.uischema.options);
const minimum = computed(() =>
  options.value?.minimum ? new Date(options.value.minimum) : null,
);
const maximum = computed(() =>
  options.value?.maximum ? new Date(options.value.maximum) : null,
);
</script>

<template>
  <DateTimeInput
    :id="labelForId"
    two-lines
    :model-value="new Date(control.data)"
    :required="true"
    :show-time="options?.showTime"
    :show-seconds="options?.showSeconds"
    :show-milliseconds="options?.showMilliseconds"
    :timezone="options?.timezone"
    :date-format="options?.dateFormat"
    :min="minimum"
    :max="maximum"
    compact
    :disabled="disabled"
    @update:model-value="changeValue"
  />
</template>
