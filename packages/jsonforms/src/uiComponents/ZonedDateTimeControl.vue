<script setup lang="ts">
import { computed } from "vue";

import { Dropdown } from "@knime/components";
import { DateTimeInput } from "@knime/components/date-time-input";

import { type VueControlPropsForLabelContent } from "../higherOrderComponents";

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
  get: () => new Date(modelValue.value.dateTime),
  set: (value: Date) => {
    modelValue.value = {
      ...modelValue.value,
      dateTime: value.toISOString(),
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
      compact
      :disabled="disabled"
    />
    <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
    <Dropdown
      v-model="zonePart"
      compact
      :possible-values="choices"
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
