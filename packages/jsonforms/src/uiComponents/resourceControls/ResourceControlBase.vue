<script setup lang="ts">
import { computed } from "vue";
import type { JsonSchema } from "@jsonforms/core";

import { Tooltip } from "@knime/components";
import { KdsNumberInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents";

import SmallDonutChart from "./SmallDonutChart.vue";

const props = defineProps<VueControlPropsForLabelContent<number>>();

// whether the input models the maximum value (relevant for the donut chart)
const modelMax = computed(
  () => props.control.uischema.options?.modelMax ?? false,
);
const currentUsage = computed(
  // if currentUsage is supplied the donut chart should use that since the data will model something else (e.g. the maximum usage)
  () => props.control.uischema.options?.currentUsage ?? props.control.data,
);
const secondaryValue = computed(
  () =>
    (props.control.schema as JsonSchema & { secondaryValue?: number })
      .secondaryValue ?? 0,
);
const donutMax = computed(() =>
  modelMax.value
    ? props.control.data
    : props.control.uischema.options?.donutMax ?? props.control.schema.maximum,
);
const disabled = computed(
  () => props.control.uischema.options?.disabled || false,
);
const disabledTooltip = computed(
  () => props.control.uischema.options?.disabledTooltip || "",
);
const tooltipOrDiv = computed(() => {
  if (disabled.value && disabledTooltip.value) {
    return Tooltip;
  }
  return "div";
});
const animate = computed(() => props.control.uischema.options?.animate ?? true);
const showDonut = computed(
  () => props.control.uischema.options?.showDonut ?? true,
);

// number input props
const min = computed(() => props.control.schema.minimum ?? 0);
const max = computed(() => props.control.schema.maximum ?? Infinity);
const step = computed(() => props.control.uischema.options?.step ?? 1);
const unit = computed(() => props.control.uischema.options?.unit ?? "");
</script>

<template>
  <div>
    <component :is="tooltipOrDiv" :text="disabledTooltip" class="input-wrapper">
      <KdsNumberInput
        :model-value="control.data"
        :min="min"
        :max="max"
        :step="step"
        :unit="unit"
        @update:model-value="changeValue"
      />
      <div v-if="showDonut" class="chart">
        <!-- replace with kds donut chart -->
        <SmallDonutChart
          :value="currentUsage"
          :secondary-value="secondaryValue"
          :max-value="donutMax"
          :animate="animate"
        />
        <slot name="donut-info" />
      </div>
    </component>
  </div>
</template>

<style lang="postcss" scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--kds-spacing-container-1x);

  & .chart {
    display: flex;
    flex-direction: row;
    gap: var(--kds-spacing-container-0-75x);
    align-items: center;
  }
}
</style>
