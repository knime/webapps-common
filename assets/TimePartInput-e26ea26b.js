import{C as p}from"./CodeExample-2a09304f.js";import{T as c}from"./TimePartInput-1eb082fe.js";import{L as v}from"./Label-ec23d485.js";import{_ as g,o as f,c as b,b as s,d as n,w as a,t as o,e as h,a as w,r as d}from"./index-abe20171.js";import"./arrow-dropdown-11b56d0a.js";const V=`<script>
import ArrowIcon from "../../assets/img/icons/arrow-dropdown.svg";
import numIntegerDigits from "../../../util/numIntegerDigits";

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
      // eslint-disable-next-line no-magic-numbers
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
        // eslint-disable-next-line no-magic-numbers
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
      parsedVal = Math.round(parsedVal * 10) / 10; // eslint-disable-line no-magic-numbers

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
<\/script>

<template>
  <div class="wrapper">
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
      @input="onInput"
      @blur="onBlur"
      @mouseenter="toggleHover"
      @mouseleave="toggleHover"
    />
    <span v-if="!isValid" class="invalid-marker" />
    <span
      class="increase"
      @mousedown.prevent="(e) => mouseEvent(e, 'increase')"
      @mouseup.prevent="(e) => mouseEvent(e, 'increase')"
      @mouseleave="(e) => mouseEvent(e, 'increase')"
    >
      <ArrowIcon />
    </span>
    <span
      class="decrease"
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

  &:focus-within {
    border-color: var(--knime-masala);
  }

  & input[type="number"] {
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

    &.hover:not(:focus) {
      /* not native :hover because of WEBP-297 */
      background-color: var(--theme-time-part-input-background-color-hover);
    }
  }

  & .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    left: -1px;
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
    cursor: pointer;
    background-color: var(--theme-time-part-input-background-color);

    &:hover {
      background-color: var(--theme-time-part-input-background-color-hover);
    }

    & svg {
      width: 100%;
      height: 100%;
      stroke-width: 1.5px;
    }
  }

  & .increase:active,
  & .decrease:active {
    color: var(--knime-white);
    background-color: var(--knime-masala);

    & svg {
      stroke: var(--knime-white);
    }
  }
}
</style>
`;const x=`<Label text="Hours">
  <TimePartInput
    type="integer"
    :min="0"
    :max="23"
    :min-digits="2"
    :value="hours"
    @bounds="hoursBound"
  />
</Label>`,y={components:{TimePartInput:c,CodeExample:p,Label:v},data(){return{codeExample:x,hours:18,minutes:53,seconds:22,milliseconds:320}},computed:{code(){return V}},methods:{hoursBound(){this.hours=0},minutesBound(){this.minutes=0},secondsBound(){this.seconds=0},millisecondsBound(){this.milliseconds=0}}},_=w('<div class="grid-container" data-v-0da4b2a9><div class="grid-item-12" data-v-0da4b2a9><h2 data-v-0da4b2a9>TimePartInput</h2><p data-v-0da4b2a9> A number input field similar to the NumberInput component but for time units like hours, minutes, seconds and milliseconds. It acts as a form element, so it emits <code data-v-0da4b2a9>input</code> events and it has a <code data-v-0da4b2a9>value</code>. It also has <code data-v-0da4b2a9>min</code> &amp; <code data-v-0da4b2a9>max</code> property to set bounds and a <code data-v-0da4b2a9>bounds</code> event to determine what should happen if a bound is reached. </p></div></div>',1),k={class:"grid-container"},I={class:"grid-item-6 inputs"},N={class:"grid-item-4"},E={class:"grid-container"},T={class:"grid-item-12"};function B(A,t,S,D,e,r){const l=d("TimePartInput",!0),u=d("Label"),m=d("CodeExample");return f(),b("div",null,[s("section",null,[_,s("div",k,[s("div",I,[n(u,{text:"Hours"},{default:a(()=>[n(l,{modelValue:e.hours,"onUpdate:modelValue":t[0]||(t[0]=i=>e.hours=i),type:"integer",min:0,max:23,"min-digits":2,onBounds:r.hoursBound},null,8,["modelValue","onBounds"])]),_:1}),n(u,{text:"Minutes"},{default:a(()=>[n(l,{modelValue:e.minutes,"onUpdate:modelValue":t[1]||(t[1]=i=>e.minutes=i),type:"integer",min:0,max:59,"min-digits":2,onBounds:r.minutesBound},null,8,["modelValue","onBounds"])]),_:1}),n(u,{text:"Seconds"},{default:a(()=>[n(l,{modelValue:e.seconds,"onUpdate:modelValue":t[2]||(t[2]=i=>e.seconds=i),type:"integer",min:0,max:59,"min-digits":2,onBounds:r.secondsBound},null,8,["modelValue","onBounds"])]),_:1}),n(u,{text:"Milliseconds"},{default:a(()=>[n(l,{modelValue:e.milliseconds,"onUpdate:modelValue":t[3]||(t[3]=i=>e.milliseconds=i),type:"integer",min:0,max:999,"min-digits":3,onBounds:r.millisecondsBound},null,8,["modelValue","onBounds"])]),_:1})]),s("div",N," Time: "+o(e.hours)+"h : "+o(e.minutes)+"m : "+o(e.seconds)+"s : "+o(e.milliseconds)+"ms ",1)])]),s("section",null,[s("div",E,[s("div",T,[n(m,{summary:"Show usage example"},{default:a(()=>[h(o(e.codeExample),1)]),_:1}),n(m,{summary:"Show TimeInputPart.vue source code"},{default:a(()=>[h(o(r.code),1)]),_:1})])])])])}const U=g(y,[["render",B],["__scopeId","data-v-0da4b2a9"]]);export{U as default};
