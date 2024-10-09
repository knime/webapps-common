<script lang="ts">
import type { InputHTMLAttributes, PropType } from "vue";

import ArrowIcon from "@knime/styles/img/icons/arrow-dropdown.svg";
import "../variables.css";

const INTERVAL_TIMEOUT_DELAY = 200;
const MOUSE_DOWN_CHANGE_INTERVAL = 50;
const DEFAULT_STEP_SIZE_DOUBLE = 0.1;
const DEFAULT_STEP_SIZE_INTEGER = 1;

export default {
  name: "NumberInput",
  components: {
    ArrowIcon,
  },
  props: {
    modelValue: {
      default: 0,
      type: [Number, String] as PropType<string | number>,
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
      type: String as PropType<"double" | "integer">,
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
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      clicked: false, // false to prevent unintended 'mouseup' or 'mouseleave' events.
      hovered: false,
      initialValue: 0,
      localValue: "" as string | number,
      spinnerArrowTimeout: null as null | Parameters<typeof clearInterval>[0],
      spinnerArrowInterval: null as null | Parameters<typeof clearTimeout>[0],
    };
  },
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
      if (typeof this.localValue === "number" && isNaN(this.localValue)) {
        return "";
      }
      /**
       * For type double, the conversion to string is needed to ensure that the decimal separator does not disappear
       * when the last digit behind the separator is removed.
       */
      return this.isInteger ? this.localValue : this.localValue.toString();
    },
  },
  watch: {
    modelValue: {
      handler() {
        if (
          this.parseValue(this.localValue) !== this.parseValue(this.modelValue)
        ) {
          this.localValue = this.parseValue(this.modelValue);
        }
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
    getInputRef() {
      return this.$refs.input as HTMLInputElement;
    },
    parseValue(value: string | number) {
      return this.isInteger
        ? parseInt(value.toString(), 10)
        : parseFloat(value.toString());
    },
    getParsedValue() {
      return this.parseValue(this.localValue);
    },
    onInput(event: InputEvent) {
      const newValue = (event.target as InputHTMLAttributes).value;
      /**
       * do not emit input event when decimal point or minus sign is
       * used because number input field treats them as invalid
       */
      if (event && !newValue && (event.data === "." || event.data === "-")) {
        return;
      }
      if (!newValue) {
        /**
         * This explicit update is needed when the decimal separator is a comma, but the user types a period. In that
         * case, the input value is invalid (NaN) when all digits behind the separator are deleted, e.g. "1.3" -> "1.".
         * We therefore delete all digits of the input field to have the same state.
         */
        this.getInputRef().value = "";
      }
      this.updateAndEmit({ newValue });
    },
    updateAndEmit({ newValue }: { newValue: string | number }) {
      this.localValue = newValue;
      this.$emit("update:modelValue", this.getParsedValue());
    },
    onBlur() {
      this.localValue = this.getParsedValue();
      /**
       * Without this explicit update the decimal separator is not removed when there
       * is no digit behind the separator
       */
      this.getInputRef().valueAsNumber = this.localValue;
    },
    validate(value: undefined | number | string) {
      let isValid = true;
      let errorMessage;
      value =
        typeof value === "undefined"
          ? this.getParsedValue()
          : this.parseValue(value);
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
    changeValue(increment: number) {
      let value = this.getParsedValue();
      if (!this.validate(value).isValid) {
        value = this.findNearestValidValue(value);
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
        this.updateAndEmit({ newValue: parsedVal });
      }
    },
    findNearestValidValue(value: number) {
      if (value < this.min) {
        return this.min;
      }
      if (value > this.max) {
        return this.max;
      }
      return this.initialValue;
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
    mouseEvent(e: MouseEvent, type: "increase" | "decrease") {
      if (this.disabled) {
        return;
      }
      // on any mouse event, clear existing timers and intervals
      if (this.spinnerArrowInterval !== null) {
        clearTimeout(this.spinnerArrowInterval);
      }
      if (this.spinnerArrowTimeout !== null) {
        clearInterval(this.spinnerArrowTimeout);
      }
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
      :name="name"
      type="number"
      role="spinButton"
      :value="inputValue"
      :min="min"
      :max="max"
      :step="stepSize"
      :class="inputClassList"
      :disabled="disabled"
      @input="onInput($event as InputEvent)"
      @blur="onBlur"
      @mouseenter="toggleHover"
      @mouseleave="toggleHover"
    />
    <span v-if="!isValid" class="invalid-marker" />
    <span
      :class="['increase', { disabled }]"
      @mousedown.prevent="mouseEvent($event, 'increase')"
      @mouseup.prevent="mouseEvent($event, 'increase')"
      @mouseleave="mouseEvent($event, 'increase')"
    >
      <ArrowIcon />
    </span>
    <span
      :class="['decrease', { disabled }]"
      @mousedown.prevent="mouseEvent($event, 'decrease')"
      @mouseup.prevent="mouseEvent($event, 'decrease')"
      @mouseleave="mouseEvent($event, 'decrease')"
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

  &.compact {
    height: 30px;

    /* stylelint-disable no-descending-specificity */
    & .increase,
    & .decrease {
      height: calc(
        (var(--single-line-form-height-compact) - 2 * var(--form-border-width)) /
          2
      );
      line-height: calc(
        (var(--single-line-form-height-compact) - 2 * var(--form-border-width)) /
          2
      );
    }
  }
}
</style>
