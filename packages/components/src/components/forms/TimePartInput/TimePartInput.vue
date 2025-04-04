<script>
import ArrowIcon from "@knime/styles/img/icons/arrow-dropdown.svg";
import { numIntegerDigits } from "@knime/utils";
import "../variables.css";

const INTERVAL_TIMEOUT_DELAY = 200;
const MOUSE_DOWN_CHANGE_INTERVAL = 50;
const DEFAULT_STEP_SIZE_INTEGER = 1;
/**
 * A number input field similar to the NumberInput component but for time units like hours, minutes, seconds and
 * milliseconds.
 *
 * Some special features like:
 *  - @bounds event with detection of min/max violations and handling by parent.
 *  - Limit input to number of chars that max input has.
 *  - Format to fixed length with leading zeros.
 */
export default {
  name: "TimePartInput",
  components: {
    ArrowIcon,
  },
  props: {
    modelValue: {
      default: 0,
      type: [Number, String],
    },
    id: {
      type: String,
      default: null,
    },
    min: {
      default: Number.MIN_SAFE_INTEGER,
      type: Number,
    },
    max: {
      default: Number.MAX_SAFE_INTEGER,
      type: Number,
    },
    /**
     * Minimum number of digits shown, non existent digits will be filled with zeros (0)
     * e.g 3 -> 001, no leading zeros with the default 0
     */
    minDigits: {
      default: 0,
      type: Number,
    },
    /**
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
      default: true,
      type: Boolean,
    },
    inputClasses: {
      default: "",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    compact: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:modelValue", "bounds"],
  data() {
    return {
      clicked: false, // false to prevent unintended 'mouseup' or 'mouseleave' events.
      hovered: false, // if the input field is currently hovered or not
      /* @type {String|Number} */
      localValue: this.modelValue, // value with leading zeros
    };
  },
  computed: {
    stepSize() {
      return DEFAULT_STEP_SIZE_INTEGER;
    },
    inputClassList() {
      let classes = this.inputClasses;
      if (this.hovered) {
        classes += " hover";
      }
      return classes;
    },
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.localValue = this.padValue(newValue);
      },
      immediate: true,
    },
  },
  /**
   * The reference to the timeout which is set when
   * a user clicks one of the numeric spinner wheels. This
   * Timeout will trigger the spinnerArrowInterval.
   */
  spinnerArrowTimeout: null,
  /**
   * This interval rapid calls the change value method until the
   * user releases the mouse.
   */
  spinnerArrowInterval: null,
  mounted() {
    /**
     * This value is the last valid input value for the number input.
     * It is used as a fallback if the user enters invalid values.
     */
    this.initialValue = this.modelValue;
  },
  methods: {
    /**
     * Check min/max limits and return details about it
     * @param {Number} value - value to check for min/max bounds
     * @returns {Object} - bounds info object also used for @bounds event
     */
    limitBounds(value) {
      // use min value if value is too low
      if (value < this.min) {
        return {
          type: "min",
          limit: this.min,
          input: value,
          value: this.min,
        };
        // or use the max if value is too high
      } else if (value > this.max) {
        return {
          type: "max",
          limit: this.max,
          input: value,
          value: this.max,
        };
      }
      return {
        value,
      };
    },
    /**
     * Pad with zeros based on minDigits prop
     *
     * @param {Number} value
     * @returns {String|Number}
     */
    padValue(value) {
      // do not format NaN values nor falsy values (e.g. null)
      // also skip format for negative values
      if (isNaN(value) || (!value && value !== 0) || value < 0) {
        return value;
      }
      const strValue = value.toString(10);
      return this.minDigits < 1
        ? strValue
        : strValue.padStart(this.minDigits, "0");
    },
    getValue() {
      return parseInt(this.$refs.input.value, 10);
    },
    onBlur() {
      // set display value back to value
      this.localValue = this.padValue(this.modelValue);
    },
    onInput(event) {
      // get input as number (this method is also called without a real event)
      const rawValue = event.target.value;
      const inputNum = parseInt(rawValue, 10);
      // prevent input of NaN values or values with more digits as the max value
      if (rawValue === "") {
        // keep empty input value
        this.localValue = "";
      } else {
        // use parsed value and convert back to string to remove leading zeros etc.
        const inputLength = inputNum.toString(10).length;
        // skip empty values (they become NaN which is 3 long)
        if (rawValue === "") {
          return; // end here
        }
        // check input
        if (isNaN(inputNum) || inputLength > numIntegerDigits(this.max)) {
          this.$refs.input.value = this.padValue(this.localValue);
          return;
        }
      }
      const bounds = this.limitBounds(inputNum);
      if (bounds.type) {
        this.$emit("bounds", bounds);
      } else {
        this.$emit("update:modelValue", bounds.value);
      }
    },
    validate(value) {
      let isValid = true;
      let errorMessage;
      value = typeof value === "undefined" ? this.getValue() : value;
      if (typeof value !== "number" || isNaN(value)) {
        isValid = false;
        errorMessage = "Current value is not a number.";
      } else if (this.min > value || this.max < value) {
        isValid = false;
        errorMessage = "Current value is outside allowed range.";
      }
      return { isValid, errorMessage };
    },
    /**
     * Change value updates the actual value of the input field if a valid new value
     * can be found. It prevents users from further invalidating the value in the input
     * by moving in the wrong direction (lower than min/higher than max).
     *
     * @param  {Number} increment - the amount by which to change the current value.
     * @returns {undefined}
     */
    changeValue(increment) {
      let value = this.getValue();
      /**
       * If value is currently invalid, find the nearest valid value.
       */
      if (!this.validate(value).isValid) {
        // use the min if value too low
        if (value < this.min) {
          value = this.min;
          // or use the max if value too high
        } else if (value > this.max) {
          value = this.max;
          // fallback, use the initial value
        } else {
          value = this.initialValue;
        }
      }

      /** Mimic stepping to nearest step with safe value rounding */
      let parsedVal = value + increment;
      parsedVal = Math.round(parsedVal * 10) / 10;

      /**
       * All measures have been taken to ensure a valid value at this point, so if the last
       * step fails, we will not update the value. This prevents things like clicking the
       * '^' increment option when you already have an invalid value that is greater than
       * the max, etc. This mimics native behavior.
       */
      if (this.validate(parsedVal).isValid) {
        this.$refs.input.value = this.padValue(parsedVal);
        this.onInput({ target: this.$refs.input });
      } else {
        // we skip the onInput but still need to inform our parent
        // about the bounds over/underflow if there is one (e.g. minutes 11:59 + 1 = 12:00)
        const bounds = this.limitBounds(parsedVal);
        if (bounds.type) {
          this.$emit("bounds", bounds);
        }
      }
    },
    /**
     * This method is the callback handler for mouse events on the input field controls.
     * It is fired when either the up-arrow or down-arrow is pressed by the user. It manages
     * both mousedown and mouseup events. It clears any existing timeouts or intervals which
     * may have been set previously. It also recognizes when the mouse leaves the button
     * (which could cause a mouseup event to be missed) and therefore uses the this.clicked
     * data property to ensure it doesn't get stuck in an interval.
     *
     * @param {Event} e - the DOM event object which triggered the handler.
     * @param {String} type - the type of button pressed (either 'increased' or 'decreased').
     * @returns {undefined}
     */
    mouseEvent(e, type) {
      if (this.disabled) {
        return;
      }
      // on any mouse event, clear existing timers and intervals
      clearTimeout(this.spinnerArrowInterval);
      clearInterval(this.spinnerArrowTimeout);
      // set the increment size
      let valueDifference = this.stepSize;
      // if the decrease button has been selected, make negative
      if (type === "decrease") {
        valueDifference *= -1;
      }
      // on 'mousedown' trigger timer to start rapid increments
      if (e.type === "mousedown") {
        // enable 'mouseup' and 'mouseleave' events by setting clicked to true
        this.clicked = true;
        this.spinnerArrowTimeout = setTimeout(() => {
          this.spinnerArrowInterval = setInterval(() => {
            this.changeValue(valueDifference);
          }, MOUSE_DOWN_CHANGE_INTERVAL);
        }, INTERVAL_TIMEOUT_DELAY);
        return;
      }
      if (this.clicked) {
        // disable additional events from being fired
        this.clicked = false;
        // on 'mouseup' or 'mouseleave' publish change
        this.changeValue(valueDifference);
      }
    },
    toggleHover() {
      this.hovered = !this.hovered;
    },
  },
};
</script>

<template>
  <div :class="['wrapper', { disabled, compact }]">
    <input
      :id="id"
      ref="input"
      type="number"
      role="spinButton"
      :value="localValue"
      :min="min"
      :max="max"
      :step="stepSize"
      :class="inputClassList"
      :disabled="disabled"
      @input="onInput"
      @blur="onBlur"
      @mouseenter="toggleHover"
      @mouseleave="toggleHover"
    />
    <span v-if="!isValid" class="invalid-marker" />
    <span
      :class="['increase', { disabled }]"
      @mousedown.prevent="(e) => mouseEvent(e, 'increase')"
      @mouseup.prevent="(e) => mouseEvent(e, 'increase')"
      @mouseleave="(e) => mouseEvent(e, 'increase')"
    >
      <ArrowIcon />
    </span>
    <span
      :class="['decrease', { disabled }]"
      @mousedown.prevent="(e) => mouseEvent(e, 'decrease')"
      @mouseup.prevent="(e) => mouseEvent(e, 'decrease')"
      @mouseleave="(e) => mouseEvent(e, 'decrease')"
    >
      <ArrowIcon />
    </span>
  </div>
</template>

<style lang="postcss" scoped>
.wrapper {
  position: relative;
  isolation: isolate;
  width: 100%;
  border: var(--form-border-width) solid var(--knime-stone-gray);

  &.disabled {
    opacity: 0.5;
  }

  &:focus-within {
    border-color: var(--knime-masala);
  }

  & input[type="number"] {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: inherit;
    height: calc(var(--single-line-form-height) - 2 * var(--form-border-width));
    line-height: normal;
    border: 0;
    margin: 0;
    padding: 0 10px;
    border-radius: 0;
    width: calc(100% - 32px);
    outline: none;
    background-color: var(--theme-time-part-input-background-color);

    /* remove browser spinners FF */
    appearance: textfield;

    /* remove browser spinners WebKit/Blink */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      appearance: none;
      margin: 0;
    }

    /* css3 invalid state */
    &:invalid {
      box-shadow: none; /* override default browser styling */
    }

    &:disabled {
      opacity: 0.5;
    }

    &.hover:not(:focus) {
      /* not native :hover because of WEBP-297 */
      background-color: var(--theme-time-part-input-background-color-hover);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: calc(-1 * var(--form-border-width));
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */
  }

  & .increase {
    transform: scaleY(-1);
  }

  & .decrease {
    bottom: 0;
  }

  & .increase,
  & .decrease {
    position: absolute;
    width: 32px;
    height: 20px;
    padding-left: 10px;
    padding-right: 9px;
    background-color: var(--theme-time-part-input-background-color);

    &:not(.disabled):hover {
      background-color: var(--theme-time-part-input-background-color-hover);
      cursor: pointer;
    }

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }
  }

  &:not(.disabled) {
    & .increase:active,
    & .decrease:active {
      color: var(--knime-white);
      background-color: var(--knime-masala);

      & svg {
        stroke: var(--knime-white);
      }
    }
  }

  &.compact {
    & input[type="number"] {
      height: calc(
        var(--single-line-form-height-compact) - 2 * var(--form-border-width)
      );
    }

    /* stylelint-disable no-descending-specificity */
    & .increase,
    & .decrease {
      height: calc(
        (var(--single-line-form-height-compact) - 2 * var(--form-border-width)) /
          2
      );
      line-height: 14px;
    }
  }
}
</style>
