<script setup lang="ts">
import { computed } from "vue";

import { AquamarineDark, Yellow } from "@knime/styles/colors/knimeColors";

const DEFAULT_PRIMARY_COLOR = Yellow;
const DEFAULT_SECONDARY_COLOR = AquamarineDark;

const BACKGROUND_STROKE_OFFSET = 0.5;

interface Props {
  /** The value of the wedge to be displayed, can exceed the maximum value */
  value: number;
  /**
   * An optional secondary value for a second wedge to be displayed, can exceed the maximum value.
   * Note this will not be displayed as inner value.
   */
  secondaryValue?: number;
  /** The maximum value on which the wedge size is calculated. Also 'Infinity' can be passed here */
  maxValue: number;
  /**
   * Whether or not values larger than the maximum are allowed. If this is false larger values will be clipped to
   * the maxValue.
   */
  acceptValuesLargerThanMax?: boolean;
  /** Optional parameter whether the transition between values should be animated or not */
  animate?: boolean;
}

const {
  value,
  maxValue,
  secondaryValue = 0,
  acceptValuesLargerThanMax = false,
  animate = true,
} = defineProps<Props>();

const radius = 22;
const innerRadius = 10;

const primarySegment = computed<Segment>(() =>
  typeof value === "number" ? { value, color: DEFAULT_PRIMARY_COLOR } : value,
);

const secondarySegment = computed<Segment>(() =>
  typeof secondaryValue === "number"
    ? { value: secondaryValue, color: DEFAULT_SECONDARY_COLOR }
    : secondaryValue,
);

const clippedValue = computed(() => {
  const value = Math.max(0, primarySegment.value.value);
  return acceptValuesLargerThanMax ? value : Math.min(value, maxValue);
});

const secondaryClippedValue = computed(() => {
  // calculate secondary value including the first value (to overlap the two svgs)
  const value = Math.max(0, secondarySegment.value.value + clippedValue.value);
  return acceptValuesLargerThanMax ? value : Math.min(value, maxValue);
});

const strokeWidth = computed(() => radius - innerRadius);

const backgroundStrokeWidth = computed(
  // to account for rendering inaccuracies the background stroke is slightly smaller than the wedge stroke
  () => strokeWidth.value - BACKGROUND_STROKE_OFFSET,
);

const r = computed(() => radius - strokeWidth.value / 2);

const diameter = computed(() => 2 * radius);

const viewBox = computed(() => `0 0 ${diameter.value} ${diameter.value}`);

const circumference = computed(() => 2 * Math.PI * r.value);

const calcStrokeDashOffset = (value: number): number => {
  // if the maximum is 0 or infinity, the circle is never filled
  if (maxValue <= 0 || !Number.isFinite(maxValue)) {
    return circumference.value;
  }
  // otherwise calculate the difference
  const strokeDiff = Math.min(
    (value / maxValue) * circumference.value,
    circumference.value,
  );
  return Math.max(circumference.value - strokeDiff, 0);
};

const strokeDashOffset = computed(() =>
  calcStrokeDashOffset(clippedValue.value),
);

const secondaryStrokeDashOffset = computed(() =>
  calcStrokeDashOffset(secondaryClippedValue.value),
);

const transformWedge = computed(() => `rotate(-90, ${radius}, ${radius})`);

const disabled = computed(() => !Number.isFinite(maxValue));
</script>

<template>
  <div class="donut-container">
    <svg
      v-if="disabled"
      :height="diameter"
      :width="diameter"
      :viewBox="viewBox"
      class="donut-chart"
    >
      <circle
        class="disabled-circle"
        :cx="radius"
        :cy="radius"
        :r="radius - 0.5"
        stroke-width="1"
        fill="transparent"
      />
      <circle
        class="disabled-inner-circle"
        :cx="radius"
        :cy="radius"
        :r="innerRadius + 0.5"
        stroke-width="1"
        fill="transparent"
      />
    </svg>
    <svg
      v-else
      :height="diameter"
      :width="diameter"
      :viewBox="viewBox"
      class="donut-chart"
    >
      <circle
        class="background-circle"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke-width="backgroundStrokeWidth"
        fill="transparent"
      />
      <circle
        v-if="secondarySegment"
        :class="['value-wedge', 'secondary-segment', { animate }]"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke="DEFAULT_SECONDARY_COLOR"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="secondaryStrokeDashOffset"
        fill="transparent"
        :transform="transformWedge"
      />
      <circle
        :class="['value-wedge', 'primary-segment', { animate }]"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke="DEFAULT_PRIMARY_COLOR"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashOffset"
        fill="transparent"
        :transform="transformWedge"
      />
    </svg>
  </div>
</template>

<style lang="postcss" scoped>
.donut-container {
  position: relative;

  & .background-circle {
    stroke: var(--theme-donut-chart-background-color);
  }

  & .disabled-circle {
    stroke: var(--theme-donut-chart-disabled-color);
  }

  & .disabled-inner-circle {
    stroke: var(--theme-donut-chart-disabled-color);
  }
}

svg {
  display: block;

  & circle.value-wedge {
    &.animate {
      transition:
        stroke-dashoffset 0.5s,
        stroke 0.5s;
    }
  }
}
</style>
