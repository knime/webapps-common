<script setup lang="ts">
import { computed } from "vue";

import { DateTimeInput } from "@knime/components/date-time-input";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";
import { localTimeUtils } from "../utils/localTimeUtils";

const props = defineProps<VueControlPropsForLabelContent<string>>();
const model = computed(() => localTimeUtils.fromString(props.control.data));
const options = computed(() => props.control.uischema.options);

const showMilliseconds = computed(
  () => options.value?.showMilliseconds ?? true,
);
</script>

<template>
  <DateTimeInput
    :id="labelForId"
    :model-value="model"
    :required="true"
    compact
    :disabled="disabled"
    :show-date="false"
    :show-time="true"
    :show-seconds="options?.showSeconds"
    :show-milliseconds="showMilliseconds"
    :is-valid
    @update:model-value="
      (newValue) => changeValue(localTimeUtils.toString(newValue))
    "
  />
</template>
