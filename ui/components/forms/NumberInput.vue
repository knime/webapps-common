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
            type: Number
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
        }
    },
    /**
     * @returns {Object} clicked should be false to prevent un-
     *      intended 'mouseup' or 'mouseleave' events.
     */
    data() {
        return {
            clicked: false
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
            return classes;
        }
    },
    mounted() {
        /**
         * This value is the last valid input value for the number input.
         * It is used as a fallback if the user enters invalid values.
         */
        this.initialValue = this.value;
    },
    methods: {
        getValue() {
            let inputValue = this.$refs.input.value;
            return this.type === 'integer'
                ? parseInt(inputValue, 10)
                : parseFloat(inputValue);
        },
        onInput() {
            this.$emit('input', this.getValue());
        },
        validate(val) {
            let value = typeof val === 'undefined' ? this.getValue() : val;
            if (typeof value !== 'number' || isNaN(value)) {
                return false;
            }
            return this.min <= value && value <= this.max;
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
            if (!this.validate(value)) {
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
            if (this.validate(parsedVal)) {
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
                        this.changeValue(valueDifference, e);
                    }, MOUSE_DOWN_CHANGE_INTERVAL);
                }, INTERVAL_TIMEOUT_DELAY);
                return;
            }
            if (this.clicked) {
                // disable additional events from being fired
                this.clicked = false;
                // on 'mouseup' or 'mouseleave' publish change
                this.changeValue(valueDifference, e);
            }
        }
    }
};
</script>

<template>
  <div class="wrapper">
    <span
      v-if="!isValid"
      class="invalid-marker"
    />
    <input
      ref="input"
      type="number"
      role="spinButton"
      :value="value"
      :min="min"
      :max="max"
      :step="stepSize"
      :class="['input', inputClassList]"
      @input="onInput"
    >
    <span
      class="increase"
      @mousedown="(e) => mouseEvent(e, 'increase')"
      @mouseup="(e) => mouseEvent(e, 'increase')"
      @mouseleave="(e) => mouseEvent(e, 'increase')"
    >
      <ArrowIcon />
    </span>
    <span
      class="decrease"
      @mousedown="(e) => mouseEvent(e, 'decrease')"
      @mouseup="(e) => mouseEvent(e, 'decrease')"
      @mouseleave="(e) => mouseEvent(e, 'decrease')"
    >
      <ArrowIcon />
    </span>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.wrapper {
  position: relative;
  width: 100%;
  border: 1px solid var(--theme-color-stone-gray);

  /* remove browser spinners FF */
  & input[type='number'] {
    -moz-appearance: textfield;
  }

  /* remove browser spinners WebKit/Blink */
  & input[type=number]::-webkit-inner-spin-button,
  & input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & .input {
    font-size: 13px;
    font-weight: 300;
    color: var(--theme-color-masala);
    letter-spacing: inherit;
    line-height: 18px;
    height: 40px;
    border: 0;
    margin: 0;
    padding: 11px 10px 11px 10px;
    border-radius: 0;
    width: calc(100% - 32px);
    outline: none;
    background-color: transparent;

    &:hover {
      border-color: var(--theme-color-masala);
    }

    /* css3 invalid state */
    &:invalid {
      box-shadow: none; /* override default browser styling */
    }

    &:hover:not(:focus):not(:disabled) {
      background-color: var(--theme-color-silver-sand-semi);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: -1px;
    top: 0;
    bottom: 0;
    z-index: 10;
    background-color: var(--theme-color-error);
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
    z-index: 1;
    width: 32px;
    height: 20px;
    padding-left: 10px;
    padding-right: 9px;
    background-color: transparent;

    &:hover {
      background-color: var(--theme-color-silver-sand-semi);
    }

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }
  }

  & .increase:active,
  & .decrease:active {
    color: var(--theme-color-white);
    background-color: var(--theme-color-masala);

    & svg {
      stroke: var(--theme-color-white);
    }
  }
}
</style>

