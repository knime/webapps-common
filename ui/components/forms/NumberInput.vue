<script>
import ArrowIcon from '../../assets/img/icons/arrow-dropdown.svg?inline';

const INTERVAL_TIMEOUT_DELAY = 200;
const MOUSE_DOWN_CHANGE_INTERVAL = 50;
const DEFAULT_STEP_SIZE_DOUBLE = 0.1;
const DEFAULT_STEP_SIZE_INTEGER = 1;

export default {
    components: {
        ArrowIcon
    },
    props: {
        value: {
            default: 0,
            type: [Number, String],
            validator(val) {
                if (typeof val === 'string') {
                    // possible scientific notation
                    return val.toLowerCase().includes('e');
                }
                return typeof val === 'number';
            }
        },
        id: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        min: {
            default: Number.MIN_SAFE_INTEGER,
            type: Number
        },
        max: {
            default: Number.MAX_SAFE_INTEGER,
            type: Number
        },
        /**
         * Validity controlled by the parent component to be flexible.
         */
        isValid: {
            default: true,
            type: Boolean
        },
        /**
         * Sets the significant digit of the spinner input.
         *
         * Possible values: 'double' | 'integer'
         */
        type: {
            default: 'double',
            type: String,
            validator(val) {
                return ['double', 'integer'].includes(val);
            }
        },
        inputClasses: {
            default: '',
            type: String
        },
        disabled: {
            default: false,
            type: Boolean
        }
    },
    data() {
        return {
            clicked: false, // false to prevent unintended 'mouseup' or 'mouseleave' events.
            hovered: false, // if the input field is currently hovered or not
            initialValue: null,
            localValue: null
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
        stepSize() {
            return this.type === 'integer' ? DEFAULT_STEP_SIZE_INTEGER : DEFAULT_STEP_SIZE_DOUBLE;
        },
        inputClassList() {
            let classes = this.inputClasses;
            if (this.hovered) {
                classes += ' hover';
            }
            return classes;
        }
    },
    watch: {
        value: {
            handler() {
                this.localValue = this.parseValue(this.value);
            },
            immediate: true
        }
    },
    mounted() {
        /**
         * This value is the last valid input value for the number input.
         * It is used as a fallback if the user enters invalid values.
         */
        console.log(this.disabled);
        this.localValue = this.parseValue(this.value);
        this.initialValue = this.localValue;
    },
    methods: {
        parseValue(value) {
            return this.type === 'integer' ? parseInt(value, 10) : parseFloat(value);
        },
        getValue() {
            return this.parseValue(this.$refs.input.value);
        },
        onInput() {
            this.$emit('input', this.getValue());
        },
        validate(val) {
            let isValid = true;
            let errorMessage;
            let value = typeof val === 'undefined' ? this.getValue() : this.parseValue(val);
            if (typeof value !== 'number' || isNaN(value)) {
                isValid = false;
                errorMessage = 'Current value is not a number.';
            } else if (this.min > value || this.max < value) {
                isValid = false;
                errorMessage = 'Current value is outside allowed range.';
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
            if (type === 'decrease') {
                valueDifference *= -1;
            }
            // on 'mousedown' trigger timer to start rapid increments
            if (e.type === 'mousedown') {
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
        }
    }
};
</script>

<template>
  <div :class="['wrapper' , { disabled: disabled }]">
    <input
      :id="id"
      ref="input"
      :name="name"
      type="number"
      role="spinButton"
      :value="localValue"
      :min="min"
      :max="max"
      :step="stepSize"
      :class="inputClassList"
      :disabled="disabled"
      @input="onInput"
      @mouseenter="toggleHover"
      @mouseleave="toggleHover"
    >
    <span
      v-if="!isValid"
      class="invalid-marker"
    />
    <span
      :class="['increase' , { disabled: disabled }]"
      @mousedown.prevent="(e) => mouseEvent(e, 'increase')"
      @mouseup.prevent="(e) => mouseEvent(e, 'increase')"
      @mouseleave="(e) => mouseEvent(e, 'increase')"
    >
      <ArrowIcon />
    </span>
    <span
      :class="['decrease' , { disabled: disabled }]"
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
  border: 1px solid var(--knime-stone-gray);

  &.disabled {
    color: var(--knime-dove-gray);
    opacity: 0.5;
  }

  &:focus-within {
    border-color: var(--knime-masala);
  }

  & input[type='number'] {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: inherit;
    height: 40px;
    line-height: normal;
    border: 0;
    margin: 0;
    padding: 0 10px;
    border-radius: 0;
    width: calc(100% - 32px);
    outline: none;
    background-color: var(--theme-input-number-background-color);

    /* remove browser spinners FF */
    -moz-appearance: textfield;

    &:disabled {
      color: var(--knime-dove-gray);
      opacity: 0.5;
    }

    /* remove browser spinners WebKit/Blink */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* css3 invalid state */
    &:invalid {
      box-shadow: none; /* override default browser styling */
    }

    &:hover:not(:focus):not(:disabled) { /* not native :hover because of WEBP-297 */
      background-color: var(--theme-input-number-background-color-hover);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: -1px;
    top: -1px;
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
    cursor: pointer;
    background-color: var(--theme-input-number-background-color);

    &.disabled {
      color: var(--knime-dove-gray);
      opacity: 0.5;
    }

    &:hover:not(.disabled) {
      background-color: var(--theme-input-number-background-color-hover);
    }

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }
  }

  & .increase:active:not(.disabled),
  & .decrease:active:not(.disabled) {
    color: var(--knime-white);
    background-color: var(--theme-input-number-background-color-active);

    & svg {
      stroke: var(--knime-white);
    }
  }
}
</style>

