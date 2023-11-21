<script>
import "./variables.css";
import ArrowIcon from "../../assets/img/icons/arrow-dropdown.svg";

const INTERVAL_TIMEOUT_DELAY = 200;
const MOUSE_DOWN_CHANGE_INTERVAL = 50;
const DEFAULT_STEP_SIZE_DOUBLE = 0.1;
const DEFAULT_STEP_SIZE_INTEGER = 1;

export default {
  components: {
    ArrowIcon,
  },
  props: {
    modelValue: {
      default: 0,
      type: [Number, String],
      validator(value) {
        if (typeof value === "string") {
          // possible scientific notation
          return value.toLowerCase().includes("e");
        }
        return typeof value === "number";
      },
    },
    id: {
      type: String,
      default: null,
    },
    name: {
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
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
      default: true,
      type: Boolean,
    },
    /**
     * Sets the significant digit of the spinner input.
     *
     * Possible values: 'double' | 'integer'
     */
    type: {
      default: "double",
      type: String,
      validator(value) {
        return ["double", "integer"].includes(value);
      },
    },
    inputClasses: {
      default: "",
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      clicked: false, // false to prevent unintended 'mouseup' or 'mouseleave' events.
      hovered: false, // if the input field is currently hovered or not
      initialValue: null,
      localValue: null,
    };
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
  computed: {
    isInteger() {
      return this.type === "integer";
    },
    stepSize() {
      return this.isInteger
        ? DEFAULT_STEP_SIZE_INTEGER
        : DEFAULT_STEP_SIZE_DOUBLE;
    },
    inputClassList() {
      let classes = this.inputClasses;
      if (this.hovered) {
        classes += " hover";
      }
      return classes;
    },
    inputValue() {
      // For type double, the conversion to string is needed to ensure that the decimal separator does not disappear
      // when the last digit behind the separator is removed. The check for NaN is needed for int and double to remove
      // the warning of the browser that the specified value is out of range or cannot be parsed.
      if (isNaN(this.localValue)) {
        return "";
      }
      return this.isInteger ? this.localValue : this.localValue.toString();
    },
  },
  watch: {
    modelValue: {
      handler() {
        this.localValue = this.parseValue(this.modelValue);
      },
      immediate: true,
    },
  },
  mounted() {
    /**
     * This value is the last valid input value for the number input.
     * It is used as a fallback if the user enters invalid values.
     */
    this.localValue = this.parseValue(this.modelValue);
    this.initialValue = this.localValue;
  },
  methods: {
    parseValue(value) {
      return this.isInteger ? parseInt(value, 10) : parseFloat(value);
    },
    getValue() {
      return this.parseValue(this.$refs.input.value);
    },
    onInput(e) {
      // do not emit input event when decimal point is being
      // used because number input field treats it as invalid
      if (e && e.data === "." && !e.target.value) {
        return;
      }
      let inputValue;
      if (e && e.inputType === "deleteContentBackward" && !e.target.value) {
        // This condition is true in two cases:
        // 1. When the decimal separator of the system is a comma, but the user typed in a period and removes all
        //    digits after the period. (The used separator is unknown, since it can be different than the locale,
        //    specified by navigator.language)
        // 2. When the user removes all digits
        // We cannot distinguish between 1. and 2., but 2. is fulfilled for correct inputs, while 1. is fulfilled for
        // incorrect inputs. Therefore, we just delete all digits.
        inputValue = NaN;
        this.$refs.input.value = "";
      } else {
        inputValue = this.getValue();
      }
      this.$emit("update:modelValue", inputValue);
    },
    onBlur() {
      // Passing a number instead of a string to the input removes the decimal separator when the input field looses
      // focus and there is no digit behind the separator
      this.$refs.input.value = this.getValue();
    },
    validate(value) {
      let isValid = true;
      let errorMessage;
      value =
        typeof value === "undefined" ? this.getValue() : this.parseValue(value);
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
      parsedVal = Math.round(parsedVal * 10) / 10; // eslint-disable-line no-magic-numbers

      /**
       * All measures have been taken to ensure a valid value at this point, so if the last
       * step fails, we will not update the value. This prevents things like clicking the
       * '^' increment option when you already have an invalid value that is greater than
       * the max, etc. This mimics native behavior.
       */
      if (this.validate(parsedVal).isValid) {
        this.$refs.input.value = parsedVal;
        this.onInput();
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
  <div :class="['wrapper', { disabled }]">
    <input
      :id="id"
      ref="input"
      :name="name"
      type="number"
      role="spinButton"
      :value="inputValue"
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
  height: var(--single-line-form-height);
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
    height: 100%;
    line-height: normal;
    border: 0;
    margin: 0;
    padding: 0 10px;
    border-radius: 0;
    width: calc(100% - 32px);
    outline: none;
    background-color: var(--theme-input-number-background-color);

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

    &:hover:not(:focus, :disabled) {
      /* not native :hover because of WEBP-297 */
      background-color: var(--theme-input-number-background-color-hover);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: calc(-1 * var(--form-border-width));
    top: calc(-1 * var(--form-border-width));
    height: calc(100% + 2px);
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
    background-color: var(--theme-input-number-background-color);

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }

    &:not(.disabled) {
      &:hover {
        cursor: pointer;
        background-color: var(--theme-input-number-background-color-hover);
      }

      &:active {
        color: var(--knime-white);
        background-color: var(--theme-input-number-background-color-active);

        & svg {
          stroke: var(--knime-white);
        }
      }
    }
  }
}
</style>
