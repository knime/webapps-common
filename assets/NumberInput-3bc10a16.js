import{C as I}from"./CodeExample-fbe44cf1.js";import{_,r as g,o as b,c as V,b as s,n as v,l as E,d as r,y as f,w as c,e as u,t as o,p as x,f as T}from"./index-a79407f6.js";import{A as N}from"./arrow-dropdown-9316206f.js";import{L as k}from"./Label-c4c86cbe.js";const S=200,A=50,M=.1,C=1,L={components:{ArrowIcon:N},props:{modelValue:{default:0,type:[Number,String],validator(n){return typeof n=="string"?n.toLowerCase().includes("e"):typeof n=="number"}},id:{type:String,default:null},name:{type:String,default:null},min:{default:Number.MIN_SAFE_INTEGER,type:Number},max:{default:Number.MAX_SAFE_INTEGER,type:Number},isValid:{default:!0,type:Boolean},type:{default:"double",type:String,validator(n){return["double","integer"].includes(n)}},inputClasses:{default:"",type:String},disabled:{default:!1,type:Boolean}},emits:["update:modelValue"],data(){return{clicked:!1,hovered:!1,initialValue:null,localValue:null}},spinnerArrowTimeout:null,spinnerArrowInterval:null,computed:{stepSize(){return this.type==="integer"?C:M},inputClassList(){let n=this.inputClasses;return this.hovered&&(n+=" hover"),n}},watch:{modelValue:{handler(){this.localValue=this.parseValue(this.modelValue)},immediate:!0}},mounted(){this.localValue=this.parseValue(this.modelValue),this.initialValue=this.localValue},methods:{parseValue(n){return this.type==="integer"?parseInt(n,10):parseFloat(n)},getValue(){return this.parseValue(this.$refs.input.value)},onInput(n){if(n&&n.data==="."&&!n.target.value)return;let e;n&&n.inputType==="deleteContentBackward"&&this.localValue.toString().length>1?e=this.parseValue(this.localValue.toString().slice(0,-1)):e=this.getValue(),this.$emit("update:modelValue",e)},validate(n){let e=!0,i;return n=typeof n>"u"?this.getValue():this.parseValue(n),typeof n!="number"||isNaN(n)?(e=!1,i="Current value is not a number."):(this.min>n||this.max<n)&&(e=!1,i="Current value is outside allowed range."),{isValid:e,errorMessage:i}},changeValue(n){let e=this.getValue();this.validate(e).isValid||(e<this.min?e=this.min:e>this.max?e=this.max:e=this.initialValue);let i=e+n;i=Math.round(i*10)/10,this.validate(i).isValid&&(this.$refs.input.value=i,this.onInput())},mouseEvent(n,e){if(this.disabled)return;clearTimeout(this.spinnerArrowInterval),clearInterval(this.spinnerArrowTimeout);let i=this.stepSize;if(e==="decrease"&&(i*=-1),n.type==="mousedown"){this.clicked=!0,this.spinnerArrowTimeout=setTimeout(()=>{this.spinnerArrowInterval=setInterval(()=>{this.changeValue(i)},A)},S);return}this.clicked&&(this.clicked=!1,this.changeValue(i))},toggleHover(){this.hovered=!this.hovered}}},D=["id","name","value","min","max","step","disabled"],U={key:0,class:"invalid-marker"};function B(n,e,i,y,t,a){const d=g("ArrowIcon");return b(),V("div",{class:v(["wrapper",{disabled:i.disabled}])},[s("input",{id:i.id,ref:"input",name:i.name,type:"number",role:"spinButton",value:t.localValue,min:i.min,max:i.max,step:a.stepSize,class:v(a.inputClassList),disabled:i.disabled,onInput:e[0]||(e[0]=(...l)=>a.onInput&&a.onInput(...l)),onMouseenter:e[1]||(e[1]=(...l)=>a.toggleHover&&a.toggleHover(...l)),onMouseleave:e[2]||(e[2]=(...l)=>a.toggleHover&&a.toggleHover(...l))},null,42,D),i.isValid?E("",!0):(b(),V("span",U)),s("span",{class:v(["increase",{disabled:i.disabled}]),onMousedown:e[3]||(e[3]=f(l=>a.mouseEvent(l,"increase"),["prevent"])),onMouseup:e[4]||(e[4]=f(l=>a.mouseEvent(l,"increase"),["prevent"])),onMouseleave:e[5]||(e[5]=l=>a.mouseEvent(l,"increase"))},[r(d)],34),s("span",{class:v(["decrease",{disabled:i.disabled}]),onMousedown:e[6]||(e[6]=f(l=>a.mouseEvent(l,"decrease"),["prevent"])),onMouseup:e[7]||(e[7]=f(l=>a.mouseEvent(l,"decrease"),["prevent"])),onMouseleave:e[8]||(e[8]=l=>a.mouseEvent(l,"decrease"))},[r(d)],34)],2)}const F=_(L,[["render",B],["__scopeId","data-v-d7cf20e2"]]),z=`<script>
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
    stepSize() {
      return this.type === "integer"
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
      return this.type === "integer" ? parseInt(value, 10) : parseFloat(value);
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
      if (
        e &&
        e.inputType === "deleteContentBackward" &&
        this.localValue.toString().length > 1
      ) {
        // manually slice and parse the value (in case the new input value ends with a decimal point)
        // in which case the number input field treats it as invalid
        inputValue = this.parseValue(this.localValue.toString().slice(0, -1));
      } else {
        inputValue = this.getValue();
      }
      this.$emit("update:modelValue", inputValue);
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
<\/script>

<template>
  <div :class="['wrapper', { disabled }]">
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
`;const O=`<NumberInput
  v-model="inputValue1"
  :min="min"
  :max="max"
  :is-valid="isValid1"
  type="integer"
  title="I am the integer"
  @input="validate1"
/>
<NumberInput
  v-model="inputValue2"
  :min="min"
  :max="max"
  :is-valid="isValid2"
  type="double"
  title="I am the double"
  @input="validate2"
/>
<NumberInput
  v-model="inputValue3"
  :min="min"
  :max="max"
  :is-valid="isValid3"
  type="integer"
  title="My starting value is invalid"
  @input="validate3"
/>`,R={components:{NumberInput:F,CodeExample:I,Label:k},data(){return{codeExample:O,min:-1e7,max:1e7,inputValue1:0,inputValue2:"4.5324526E6",inputValue3:-15e6,isValid1:!0,isValid2:!0,isValid3:!0}},computed:{code(){return z},input3Text(){return this.isValid3?"Valid":"Invalid"}},mounted(){this.validate1(),this.validate2(),this.validate3()},methods:{validate1(){this.isValid1=this.$refs.input1.validate().isValid},validate2(){this.isValid2=this.$refs.input2.validate().isValid},validate3(){this.isValid3=this.$refs.input3.validate().isValid}}},h=n=>(x("data-v-55c7bf0b"),n=n(),T(),n),H=h(()=>s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null,[u(" Numeric input field with either type double or integer to set the step size. Spinner controls allow the user to increment the value with the mouse or keyboard. It acts as a form element, so it emits "),s("code",null,"input"),u(" events and it has a "),s("code",null,"value"),u(". It also has a valid and invalid state for styling purposes. ")])])],-1)),G={class:"grid-container"},P={class:"grid-item-6 inputs"},Z={class:"grid-item-2"},W=h(()=>s("br",null,null,-1)),Y=h(()=>s("br",null,null,-1)),X={class:"grid-item-2"},j=h(()=>s("u",null,"All",-1)),K=h(()=>s("br",null,null,-1)),q=h(()=>s("br",null,null,-1)),J=h(()=>s("div",{class:"grid-item-2"},null,-1)),Q={class:"grid-container"},$={class:"grid-item-12"};function ee(n,e,i,y,t,a){const d=g("NumberInput",!0),l=g("Label"),w=g("CodeExample");return b(),V("div",null,[s("section",null,[H,s("div",G,[s("div",P,[r(l,{text:"Integer (step-size = 1)",large:""},{default:c(({labelForId:m})=>[r(d,{id:m,ref:"input1",modelValue:t.inputValue1,"onUpdate:modelValue":[e[0]||(e[0]=p=>t.inputValue1=p),a.validate1],min:t.min,max:t.max,"is-valid":t.isValid1,type:"integer",title:"I am the integer"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1}),r(l,{text:"Double (step-size = .1)",large:""},{default:c(({labelForId:m})=>[r(d,{id:m,ref:"input2",modelValue:t.inputValue2,"onUpdate:modelValue":[e[1]||(e[1]=p=>t.inputValue2=p),a.validate2],min:t.min,max:t.max,"is-valid":t.isValid2,type:"double",title:"I am the double"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1}),r(l,{text:a.input3Text,large:""},{default:c(({labelForId:m})=>[r(d,{id:m,ref:"input3",modelValue:t.inputValue3,"onUpdate:modelValue":[e[2]||(e[2]=p=>t.inputValue3=p),a.validate3],min:t.min,max:t.max,"is-valid":t.isValid3,type:"integer",title:"My starting value is invalid"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1},8,["text"]),r(l,{text:"Disabled",large:""},{default:c(({labelForId:m})=>[r(d,{id:m,modelValue:t.inputValue1,"onUpdate:modelValue":[e[3]||(e[3]=p=>t.inputValue1=p),a.validate1],min:t.min,max:t.max,"is-valid":t.isValid1,type:"integer",title:"Disabled",disabled:""},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),s("div",Z,[u(" Integer: "+o(t.inputValue1)+" ",1),W,u(" Double: "+o(t.inputValue2)+" ",1),Y,u(" "+o(a.input3Text)+": "+o(t.inputValue3),1)]),s("div",X,[j,K,u(" min: "+o(t.min)+" ",1),q,u(" max = "+o(t.max),1)]),J])]),s("section",null,[s("div",Q,[s("div",$,[r(w,{summary:"Show usage example"},{default:c(()=>[u(o(t.codeExample),1)]),_:1}),r(w,{summary:"Show NumberInput.vue source code"},{default:c(()=>[u(o(a.code),1)]),_:1})])])])])}const le=_(R,[["render",ee],["__scopeId","data-v-55c7bf0b"]]);export{le as default};
