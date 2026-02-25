<script setup lang="ts">
import { computed } from "vue";

import { Dropdown } from "@knime/components";
import { DateTimeInput } from "@knime/components/date-time-input";

import { type VueControlPropsForLabelContent } from "../higherOrderComponents";
import { fromUTCTime, toUTCTime } from "../utils/localTimeUtils";

type ZonedDateTime = {
  dateTime: string;
  timeZone: string;
};

const props = defineProps<VueControlPropsForLabelContent<ZonedDateTime>>();
const options = computed(() => props.control.uischema.options);

const modelValue = computed<ZonedDateTime>({
  get: () => props.control.data,
  set: props.changeValue,
});

const datePart = computed<Date>({
  get: () => toUTCTime(modelValue.value.dateTime),
  set: (value: Date) => {
    modelValue.value = {
      ...modelValue.value,
      // get wall time of UTC time
      dateTime: fromUTCTime(value),
    };
  },
});
const zonePart = computed<string>({
  get: () => modelValue.value.timeZone,
  set: (value: string) => {
    modelValue.value = {
      ...modelValue.value,
      timeZone: value,
    };
  },
});

const choices = computed(() => options.value?.possibleValues ?? []);
</script>

<template>
  <div :id="labelForId" class="layout-container">
    <DateTimeInput
      v-model="datePart"
      :required="true"
      :show-timezone="false"
      :show-seconds="options?.showSeconds"
      :show-milliseconds="options?.showMilliseconds"
      :timezone="'UTC'"
      :is-valid
      compact
      :disabled="disabled"
    />
    <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
    <Dropdown
      v-model="zonePart"
      :is-valid
      compact
      :possible-values="choices"
      :disabled="disabled"
      ariaLabel="Timezone"
    />
  </div>
</template>

<style lang="postcss" scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
