<script>
import { Yellow, AquamarineDark } from "@knime/styles/colors/knimeColors.mjs";

const DEFAULT_PRIMARY_COLOR = Yellow;
const DEFAULT_SECONDARY_COLOR = AquamarineDark;

export default {
  props: {
    /** The value of the wedge to be displayed, can exceed the maximum value */
    value: {
      type: [Number, Object],
      required: true,
    },
    /**
     * An optional secondary value for a second wedge to be displayed, can exceed the maximum value.
     * Note this will not be displayed as inner value.
     */
    secondaryValue: {
      type: [Number, Object],
      default: 0,
    },
    /** The maximum value on which the wedge size is calculated. Also 'Infinity' can be passed here */
    maxValue: {
      type: Number,
      required: true,
    },
    /** Wether or not values larger than the maximum are allowed. If this is false larger values will be clipped to
     * the maxValue. */
    acceptValuesLargerThanMax: {
      type: Boolean,
      default: false,
    },
    /** The outside radius of the donut chart. This also determines the overall size of the component. */
    radius: {
      type: Number,
      default: 50,
    },
    /** The inner radius. This can be seen as the radius of the donut hole. */
    innerRadius: {
      type: Number,
      default: 30,
    },
    /** Whether or not the wedge and max values are displayed as a label inside the donut hole. */
    displayValues: {
      type: Boolean,
      default: false,
    },
    /** An additional label string, which is shown beneath the value label, if present. Does not display
     * if 'displayValues === false' */
    additionalLabel: {
      type: String,
      default: null,
    },
    /** optional parameter wether the transition between values should be animated or not */
    animate: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      backgroundStrokeOffset: 0.5,
      smallLabelFontSize: 20,
      regularLabelFontSize: 30,
      regularLabelMaxValue: 999,
    };
  },

  computed: {
    primarySegment() {
      return typeof this.value === "number"
        ? {
            value: this.value,
            color: DEFAULT_PRIMARY_COLOR,
          }
        : this.value;
    },
    secondarySegment() {
      return typeof this.secondaryValue === "number"
        ? {
            value: this.secondaryValue,
            color: DEFAULT_SECONDARY_COLOR,
          }
        : this.secondaryValue;
    },
    clippedValue() {
      let value = Math.max(0, this.primarySegment.value);
      return this.acceptValuesLargerThanMax
        ? value
        : Math.min(value, this.maxValue);
    },
    secondaryClippedValue() {
      // calculate secondary value including the first value (to overlap the two svgs)
      let value = Math.max(0, this.secondarySegment.value + this.clippedValue);
      return this.acceptValuesLargerThanMax
        ? value
        : Math.min(value, this.maxValue);
    },
    strokeWidth() {
      return this.radius - this.innerRadius;
    },
    backgroundStrokeWidth() {
      // to account for rendering inaccuracies the background stroke is slightly smaller than the wedge stroke
      return this.strokeWidth - this.backgroundStrokeOffset;
    },
    r() {
      return this.radius - this.strokeWidth / 2;
    },
    diameter() {
      return 2 * this.radius;
    },
    viewBox() {
      return `0 0 ${this.diameter} ${this.diameter}`;
    },
    circumference() {
      return 2 * Math.PI * this.r;
    },
    strokeDashOffset() {
      return this.calcStrokeDashOffset(this.clippedValue);
    },
    secondaryStrokeDashOffset() {
      return this.calcStrokeDashOffset(this.secondaryClippedValue);
    },
    transformWedge() {
      return `rotate(-90, ${this.radius}, ${this.radius})`;
    },
    displayLabel() {
      return Boolean(this.displayValues && this.additionalLabel);
    },
    maxValueString() {
      return Number.isFinite(this.maxValue) ? String(this.maxValue) : "∞";
    },
    containerStyle() {
      return `width: ${this.diameter}px; height: ${this.diameter}px;`;
    },
    labelStyle() {
      // simple approach to account for larger numbers as the label inside the donut hole
      let valueExceedsLarge = this.clippedValue > this.regularLabelMaxValue;
      let maxValueExceedsLarge =
        Number.isFinite(this.maxValue) &&
        this.maxValue > this.regularLabelMaxValue;
      let size =
        valueExceedsLarge || maxValueExceedsLarge
          ? this.smallLabelFontSize
          : this.regularLabelFontSize;
      return `font-size: ${size}px; line-height: ${size}px;`;
    },
    disabled() {
      return !Number.isFinite(this.maxValue);
    },
  },
  methods: {
    calcStrokeDashOffset(value) {
      // if the maximum is 0 or infinity, the circle is never filled
      if (this.maxValue <= 0 || !Number.isFinite(this.maxValue)) {
        return this.circumference;
      }
      // otherwise calculate the difference
      const strokeDiff = Math.min(
        (value / this.maxValue) * this.circumference,
        this.circumference,
      );
      return Math.max(this.circumference - strokeDiff, 0);
    },
  },
};
</script>

<template>
  <div class="donut-container" :style="containerStyle">
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
        :class="['value-wedge', { animate }]"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke="secondarySegment.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="secondaryStrokeDashOffset"
        fill="transparent"
        :transform="transformWedge"
      />
      <circle
        :class="['value-wedge', { animate }]"
        :cx="radius"
        :cy="radius"
        :r="r"
        :stroke="primarySegment.color"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashOffset"
        fill="transparent"
        :transform="transformWedge"
      />
    </svg>

    <div class="label-container">
      <div v-if="displayValues" class="value-label" :style="labelStyle">
        {{ `${clippedValue} / ${maxValueString}` }}
      </div>
      <div v-if="displayLabel" class="additional-label">
        {{ additionalLabel }}
      </div>
    </div>
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

.label-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.value-label {
  font-family: var(--theme-text-bold-font-family);
  color: var(--theme-text-bold-color);
  font-size: 20px;
  line-height: 20px;
  font-weight: 700;
  width: 100%;
  text-align: center;
}

.additional-label {
  font-family: var(--theme-text-normal-font-family);
  color: var(--theme-text-normal-color);
  font-size: 15px;
  line-height: 30px;
  font-weight: 300;
  width: 100%;
  text-align: center;
}
</style>
