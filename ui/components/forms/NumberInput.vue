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
            default: 0,
            type: Number
        },
        max: {
            default: 1,
            type: Number
        },
        isValid: {
            default: true,
            type: Boolean
        },
        /**
         * sets the significant digit of the spinner input.
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
        title: {
            default: null,
            type: String
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
     * Timeout will trigger the rapid change of the number input
     * value if the mouse is held down on an arrow.
     */
    spinnerArrowTimeout: null,
    /**
     * The reference to the interval which is set when
     * the Timeout expires and the user is still holding the mouse.
     * This interval rapid calls the change value method until the
     * user releases the mouse (emitting a 'mouseup' event) or
     * leaves the element (emitting a 'mouseleave' event).
     */
    spinnerArrowInterval: null,
    computed: {
        stepSize() {
            return this.type === 'integer' ? DEFAULT_STEP_SIZE_INTEGER : DEFAULT_STEP_SIZE_DOUBLE;
        },
        inputClassList() {
            let classes = this.inputClasses;

            if (!this.isValid) {
                classes += ' invalid';
            }
            return classes;
        }
    },
    mounted() {
        /**
         * We store the initial value as a worst-case-scenario fall back when the
         * user interaction leaves us no choice but to return to a known valid
         * value (mimicking native behavior). Ex: If the user invalidates the value
         * by accident when they are around -1,000,000 and there is a minimum on the
         * input of -Number.MAX_SAFE_INTEGER, when they interact with the arrows, we
         * will fall back to the initial value instead of either storing their prev
         * value (which looks weird and random when you restore it) or jumping to the
         * smallest value, which also looks strange because it has so many digits.
         * This behavior is the same as native behavior. We also set this value in the
         * mounted method so it is a static instance field and does not receive watchers
         * from Vue.
         */
        this.initialValue = this.value;
    },
    methods: {
        getValue() {
            let inputValue = this.$refs.input.valueAsNumber;
            // for IE11 support
            if (isNaN(inputValue)) {
                inputValue = this.$refs.input.value;
                // manually parse the value
                return this.type === 'integer'
                    ? parseInt(inputValue, 10)
                    : parseFloat(inputValue);
            }
            return inputValue;
        },
        onInput() {
            this.$emit('input', this.getValue());
        },
        validate(val) {
            let value = typeof val === 'undefined' ? this.getValue() : val;
            // type check the value
            if (typeof value !== 'number' || isNaN(value)) {
                return false;
            }
            // check against the configured maximum and minimum
            return this.min <= value && value <= this.max;
        },
        /**
         * This method is used by the input controls to change the value of the numeric input.
         * The provided value (increment) should be signed (+/-) based on which button was pressed
         * (negative for the down arrow, etc.). This method will attempt to parse the value. It also
         * steps based on the current value to the next nearest step, regardless of the number of
         * significant digits in the current value (1.00001 => 1.1). This mimics the behavior
         * native inputs.
         *
         * This method is different than the publishChangeEvent() method and the mouseEvent()
         * method because it contains additional validation steps and fallbacks to directly mani-
         * pulate the value of the input element. These are designed to mimic native input behavior
         * and the additional interim validation cannot be contained in the getValue() or validator()
         * methods because it is needed only for the direct value manipulation and native behavior.
         *
         * @param  {Number} increment - the amount by which to change the current value.
         * @returns {undefined}
         */
        changeValue(increment) {
            let value = this.getValue();
            /**
             * This logic mimics the expected behavior of a number input with spinner arrows. If
             * there is an invalid value, it will try to use fall backs, such as the closest valid
             * number (min or max) or worst case the initial value. Expected behavior is when the
             * value becomes invalid to return to the closest valid point.
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
         * may have been set previously and decides how the user would like the value updated
         * (holding the button will rapidly change the value after a short delay; quickly clicking
         * the button will use short increments instead).
         *
         * It also recognizes when the mouse leaves the button (which could cause a mouseup event
         * to be missed) and therefore uses the this.clicked data property to ensure it doesn't
         * get stuck in an interval.
         *
         * This method is different than the changeValue() method and the publishChangeEvent()
         * method because it interprets arrow events specifically on the icons and processes them
         * with additional logic to achieve the desired behavior.
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
  <div>
    <input
      ref="input"
      type="number"
      role="spinButton"
      :value="value"
      :min="min"
      :max="max"
      :step="stepSize"
      :class="inputClassList"
      :title="title"
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

div {
  position: relative;
  width: 100%;

  & input {
    font-size: 13px;
    font-weight: 500;
    color: var(--theme-color-masala);
    letter-spacing: inherit;
    line-height: 18px;
    background-color: var(--theme-color-porcelain);
    margin: 0;
    padding: 11px 10px 11px 10px;
    border-radius: 0;
    width: 100%;
    border-left-width: 3px;
    border-left-color: transparent;
    border-left-style: solid;
    border-top: none;
    border-bottom: none;
    outline: none;
  }

  & input.invalid {
    border-left-color: var(--theme-color-error);
  }

  & .increase,
  & .decrease {
    position: absolute;
    z-index: 1;
    right: 0;
    width: 33px;
    height: 20px;
    padding-left: 10px;
    padding-right: 9px;
    background-color: var(--theme-color-porcelain);

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }
  }

  & .increase {
    top: 0;
    transform: scaleY(-1);
  }

  & .decrease {
    bottom: 0;
  }

  & .increase:focus,
  & .increase:active,
  & .decrease:focus,
  & .decrease:active {
    background-color: var(--theme-color-silver-sand);
  }
}
</style>

