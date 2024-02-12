import{C as E}from"./CodeExample-g9VWYbMy.js";import{_ as I,r as f,o as V,c as b,b as t,n as v,l as y,d as r,y as g,e as p,t as u,w as h,p as x,f as N}from"./index-CT8S6amr.js";import{A}from"./arrow-dropdown-_6ZVxssb.js";import{L as T}from"./Label-mO2UyI-y.js";const S=200,k=50,M=.1,L=1,C={components:{ArrowIcon:A},props:{modelValue:{default:0,type:[Number,String],validator(n){return typeof n=="string"?n.toLowerCase().includes("e"):typeof n=="number"}},id:{type:String,default:null},name:{type:String,default:null},min:{default:Number.MIN_SAFE_INTEGER,type:Number},max:{default:Number.MAX_SAFE_INTEGER,type:Number},isValid:{default:!0,type:Boolean},type:{default:"double",type:String},inputClasses:{default:"",type:String},disabled:{default:!1,type:Boolean}},emits:["update:modelValue"],data(){return{clicked:!1,hovered:!1,initialValue:0,localValue:"",spinnerArrowTimeout:null,spinnerArrowInterval:null}},computed:{isInteger(){return this.type==="integer"},stepSize(){return this.isInteger?L:M},inputClassList(){let n=this.inputClasses;return this.hovered&&(n+=" hover"),n},inputValue(){return typeof this.localValue=="number"&&isNaN(this.localValue)?"":this.isInteger?this.localValue:this.localValue.toString()}},watch:{modelValue:{handler(){this.parseValue(this.localValue)!==this.parseValue(this.modelValue)&&(this.localValue=this.parseValue(this.modelValue))},immediate:!0}},mounted(){this.localValue=this.parseValue(this.modelValue),this.initialValue=this.localValue},methods:{getInputRef(){return this.$refs.input},parseValue(n){return this.isInteger?parseInt(n.toString(),10):parseFloat(n.toString())},getParsedValue(){return this.parseValue(this.localValue)},onInput(n){const e=n.target.value;n&&n.data==="."&&!e||(e||(this.getInputRef().value=""),this.updateAndEmit({newValue:e}))},updateAndEmit({newValue:n}){this.localValue=n,this.$emit("update:modelValue",this.getParsedValue())},onBlur(){this.localValue=this.getParsedValue(),this.getInputRef().valueAsNumber=this.localValue},validate(n){let e=!0,l;return n=typeof n>"u"?this.getParsedValue():this.parseValue(n),typeof n!="number"||isNaN(n)?(e=!1,l="Current value is not a number."):(this.min>n||this.max<n)&&(e=!1,l="Current value is outside allowed range."),{isValid:e,errorMessage:l}},changeValue(n){let e=this.getParsedValue();this.validate(e).isValid||(e=this.findNearestValidValue(e));let l=e+n;l=Math.round(l*10)/10,this.validate(l).isValid&&this.updateAndEmit({newValue:l})},findNearestValidValue(n){return n<this.min?this.min:n>this.max?this.max:this.initialValue},mouseEvent(n,e){if(this.disabled)return;this.spinnerArrowInterval!==null&&clearTimeout(this.spinnerArrowInterval),this.spinnerArrowTimeout!==null&&clearInterval(this.spinnerArrowTimeout);let l=this.stepSize;if(e==="decrease"&&(l*=-1),n.type==="mousedown"){this.clicked=!0,this.spinnerArrowTimeout=setTimeout(()=>{this.spinnerArrowInterval=setInterval(()=>{this.changeValue(l)},k)},S);return}this.clicked&&(this.clicked=!1,this.changeValue(l))},toggleHover(){this.hovered=!this.hovered}}},D=["id","name","value","min","max","step","disabled"],P={key:0,class:"invalid-marker"};function U(n,e,l,_,i,a){const o=f("ArrowIcon");return V(),b("div",{class:v(["wrapper",{disabled:l.disabled}])},[t("input",{id:l.id,ref:"input",name:l.name,type:"number",role:"spinButton",value:a.inputValue,min:l.min,max:l.max,step:a.stepSize,class:v(a.inputClassList),disabled:l.disabled,onInput:e[0]||(e[0]=s=>a.onInput(s)),onBlur:e[1]||(e[1]=(...s)=>a.onBlur&&a.onBlur(...s)),onMouseenter:e[2]||(e[2]=(...s)=>a.toggleHover&&a.toggleHover(...s)),onMouseleave:e[3]||(e[3]=(...s)=>a.toggleHover&&a.toggleHover(...s))},null,42,D),l.isValid?y("",!0):(V(),b("span",P)),t("span",{class:v(["increase",{disabled:l.disabled}]),onMousedown:e[4]||(e[4]=g(s=>a.mouseEvent(s,"increase"),["prevent"])),onMouseup:e[5]||(e[5]=g(s=>a.mouseEvent(s,"increase"),["prevent"])),onMouseleave:e[6]||(e[6]=s=>a.mouseEvent(s,"increase"))},[r(o)],34),t("span",{class:v(["decrease",{disabled:l.disabled}]),onMousedown:e[7]||(e[7]=g(s=>a.mouseEvent(s,"decrease"),["prevent"])),onMouseup:e[8]||(e[8]=g(s=>a.mouseEvent(s,"decrease"),["prevent"])),onMouseleave:e[9]||(e[9]=s=>a.mouseEvent(s,"decrease"))},[r(o)],34)],2)}const B=I(C,[["render",U],["__scopeId","data-v-54d1779a"]]),R=`<script lang="ts">
import "./variables.css";
import ArrowIcon from "../../assets/img/icons/arrow-dropdown.svg";
import type { PropType, InputHTMLAttributes } from "vue";

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
       * do not emit input event when decimal point is being
       * used because number input field treats it as invalid
       */
      if (event && event.data === "." && !newValue) {
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
<\/script>

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
      @input="onInput($event as InputEvent)"
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
`,F=`<NumberInput
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
/>`,H={components:{NumberInput:B,CodeExample:E,Label:T},data(){return{codeExample:F,min:-1e7,max:1e7,inputValue1:0,inputValue2:"4.5324526E6",inputValue3:-15e6,isValid1:!0,isValid2:!0,isValid3:!0}},computed:{code(){return R},input3Text(){return this.isValid3?"Valid":"Invalid"}},mounted(){this.validate1(),this.validate2(),this.validate3()},methods:{validate1(){this.isValid1=this.$refs.input1.validate().isValid},validate2(){this.isValid2=this.$refs.input2.validate().isValid},validate3(){this.isValid3=this.$refs.input3.validate().isValid}}},c=n=>(x("data-v-b1fbae80"),n=n(),N(),n),z=c(()=>t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null,[p(" Numeric input field with either type double or integer to set the step size. Spinner controls allow the user to increment the value with the mouse or keyboard. It acts as a form element, so it emits "),t("code",null,"input"),p(" events and it has a "),t("code",null,"value"),p(". It also has a valid and invalid state for styling purposes. ")])])],-1)),O={class:"grid-container"},G={class:"grid-item-4"},W=c(()=>t("u",null,"All",-1)),Z=c(()=>t("br",null,null,-1)),Y=c(()=>t("br",null,null,-1)),X={class:"grid-container"},j={class:"grid-item-8"},K={class:"grid-container"},q={class:"grid-item-6 inputs"},J={class:"grid-item-2"},Q={class:"grid-container"},$={class:"grid-item-6 inputs"},ee={class:"grid-item-2"},ne={class:"grid-container"},te={class:"grid-item-6 inputs"},ie={class:"grid-item-2"},ae={class:"grid-container"},se={class:"grid-item-6 inputs"},le=c(()=>t("div",{class:"grid-item-2"},null,-1)),re={class:"grid-container"},ue={class:"grid-item-12"};function oe(n,e,l,_,i,a){const o=f("NumberInput",!0),s=f("Label"),w=f("CodeExample");return V(),b("div",null,[t("section",null,[z,t("div",O,[t("div",G,[W,Z,p(" min: "+u(i.min)+" ",1),Y,p(" max: "+u(i.max),1)])]),t("div",X,[t("div",j,[t("div",K,[t("div",q,[r(s,{text:"Integer (step-size = 1)",large:""},{default:h(({labelForId:d})=>[r(o,{id:d,ref:"input1",modelValue:i.inputValue1,"onUpdate:modelValue":[e[0]||(e[0]=m=>i.inputValue1=m),a.validate1],min:i.min,max:i.max,"is-valid":i.isValid1,type:"integer",title:"I am the integer"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),t("div",J,"Integer: "+u(i.inputValue1),1)]),t("div",Q,[t("div",$,[r(s,{text:"Double (step-size = .1)",large:""},{default:h(({labelForId:d})=>[r(o,{id:d,ref:"input2",modelValue:i.inputValue2,"onUpdate:modelValue":[e[1]||(e[1]=m=>i.inputValue2=m),a.validate2],min:i.min,max:i.max,"is-valid":i.isValid2,type:"double",title:"I am the double"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),t("div",ee,"Double: "+u(i.inputValue2),1)]),t("div",ne,[t("div",te,[r(s,{text:a.input3Text,large:""},{default:h(({labelForId:d})=>[r(o,{id:d,ref:"input3",modelValue:i.inputValue3,"onUpdate:modelValue":[e[2]||(e[2]=m=>i.inputValue3=m),a.validate3],min:i.min,max:i.max,"is-valid":i.isValid3,type:"integer",title:"My starting value is invalid"},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1},8,["text"])]),t("div",ie,u(a.input3Text)+": "+u(i.inputValue3),1)]),t("div",ae,[t("div",se,[r(s,{text:"Disabled",large:""},{default:h(({labelForId:d})=>[r(o,{id:d,modelValue:i.inputValue1,"onUpdate:modelValue":[e[3]||(e[3]=m=>i.inputValue1=m),a.validate1],min:i.min,max:i.max,"is-valid":i.isValid1,type:"integer",title:"Disabled",disabled:""},null,8,["id","modelValue","min","max","is-valid","onUpdate:modelValue"])]),_:1})]),le])])])]),t("section",null,[t("div",re,[t("div",ue,[r(w,{summary:"Show usage example"},{default:h(()=>[p(u(i.codeExample),1)]),_:1}),r(w,{summary:"Show NumberInput.vue source code"},{default:h(()=>[p(u(a.code),1)]),_:1})])])])])}const ce=I(H,[["render",oe],["__scopeId","data-v-b1fbae80"]]);export{ce as default};
