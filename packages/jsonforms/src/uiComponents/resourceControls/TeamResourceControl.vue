<script setup lang="ts">
import { computed } from "vue";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents";

import ResourceControlBase from "./ResourceControlBase.vue";

const props = defineProps<VueControlPropsForLabelContent<number>>();

const donutTitle = computed(
  () => props.control.uischema.options?.donutTitle || "",
);
const donutText = computed(
  () => props.control.uischema.options?.donutText || "",
);
const currentUsage = computed(
  () => props.control.uischema.options?.currentUsage,
);
const textMax = computed(() =>
  props.control.data === -1 ? "unlimited" : props.control.data,
);
</script>

<template>
  <ResourceControlBase v-bind="props">
    <template #donut-info>
      <div class="info-container">
        <div class="chart-title">{{ donutTitle }}</div>
        <div class="chart-description">
          {{ `${currentUsage} of ${textMax} ${donutText}` }}
        </div>
      </div>
    </template>
  </ResourceControlBase>
</template>

<style lang="postcss" scoped>
.info-container {
  display: flex;
  flex-direction: column;

  & .chart-title {
    font: var(--kds-font-base-title-small);
  }

  & .chart-description {
    font: var(--kds-font-base-body-small);
  }
}
</style>
