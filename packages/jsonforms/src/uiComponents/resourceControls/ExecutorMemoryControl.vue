<script setup lang="ts">
import { computed } from "vue";
import type { JsonSchema } from "@jsonforms/core";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents";

import ResourceControlBase from "./ResourceControlBase.vue";

const props = defineProps<VueControlPropsForLabelContent<number>>();

const secondaryValue = computed(
  () =>
    (props.control.schema as JsonSchema & { secondaryValue?: number })
      .secondaryValue || 0,
);
const donutTitle = computed(
  () => props.control.uischema.options?.donutTitle || "",
);
const currentUsage = computed(
  () => props.control.uischema.options?.currentUsage ?? 0,
);
const donutMax = computed(
  () => props.control.uischema.options?.donutMax ?? Infinity,
);

const totalUse = computed(() => secondaryValue.value + currentUsage.value);

const infoText = computed(
  () =>
    `This execution context will use a maximum of ${secondaryValue.value} GB RAM.
    In total, ${totalUse.value} GB of ${donutMax.value} GB available for this team will be used.`,
);
</script>

<template>
  <ResourceControlBase v-bind="props">
    <template #donut-info>
      <div class="info-container">
        <div class="chart-title">{{ donutTitle }}</div>
        <div class="chart-description">
          {{ infoText }}
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
