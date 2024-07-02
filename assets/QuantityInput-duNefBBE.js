import{C as I}from"./CodeExample-3obvIH87.js";import{o as w,c as y,b as e,u as B,E as s,G as S,d as i,w as g,Z as x,v as k,Q as D,au as M,_ as F,e as a,t as c,p as Q,f as C}from"./index-EckSR7mm.js";import{P as E}from"./plus-small-3tt4nlH5.js";const H={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#3E3A39",viewBox:"0 0 32 32"},P=e("path",{"stroke-linejoin":"round","stroke-miterlimit":"10",d:"M8.417 16h15.166"},null,-1),U=[P];function $(m,u){return w(),y("svg",H,[...U])}const N={render:$},q={class:"quantity-input"},T=["min","max","step","disabled"],j=B({__name:"QuantityInput",props:{modelValue:{},step:{default:1},min:{default:-1/0},max:{default:1/0},disabled:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(m,{emit:u}){const o=m,_=u,l=s(null),t=S({get:()=>o.modelValue,set:n=>{const v=Math.min(Math.max(n,o.min),o.max);_("update:modelValue",v)}}),b=()=>{l.value.stepUp(),t.value=parseInt(l.value.value,10)},h=()=>{l.value.stepDown(),t.value=parseInt(l.value.value,10)};return(n,v)=>(w(),y("div",q,[i(k,{disabled:n.disabled||t.value<=n.min,title:"Decrease",onClick:h},{default:g(()=>[i(x(N))]),_:1},8,["disabled"]),D(e("input",{ref_key:"numberField",ref:l,"onUpdate:modelValue":v[0]||(v[0]=V=>t.value=V),type:"number",min:n.min,max:n.max,step:n.step,disabled:n.disabled},null,8,T),[[M,t.value,void 0,{number:!0}]]),i(k,{disabled:n.disabled||t.value>=n.max,title:"Increase",onClick:b},{default:g(()=>[i(x(E))]),_:1},8,["disabled"])]))}}),f=F(j,[["__scopeId","data-v-b04d5612"]]),A=`<script lang="ts" setup>
import FunctionButton from "../FunctionButton.vue";
import { computed, ref, type WritableComputedRef } from "vue";
import PlusSmall from "../../assets/img/icons/plus-small.svg";
import MinusSmall from "../../assets/img/icons/minus-small.svg";

type Props = {
  modelValue: number;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  min: -Infinity,
  max: Infinity,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const numberField = ref<null | HTMLInputElement>(null);

const inputVal: WritableComputedRef<number> = computed({
  get: () => props.modelValue,
  set: (val) => {
    const number = Math.min(Math.max(val, props.min), props.max);
    emit("update:modelValue", number);
  },
});

const onIncrease = () => {
  numberField.value!.stepUp();
  inputVal.value = parseInt(numberField.value!.value, 10);
};

const onDecrease = () => {
  numberField.value!.stepDown();
  inputVal.value = parseInt(numberField.value!.value, 10);
};
<\/script>

<template>
  <div class="quantity-input">
    <FunctionButton
      :disabled="disabled || inputVal <= min"
      title="Decrease"
      @click="onDecrease"
    >
      <MinusSmall />
    </FunctionButton>

    <input
      ref="numberField"
      v-model.number="inputVal"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
    />

    <FunctionButton
      :disabled="disabled || inputVal >= max"
      title="Increase"
      @click="onIncrease"
    >
      <PlusSmall />
    </FunctionButton>
  </div>
</template>

<style lang="postcss" scoped>
.quantity-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  isolation: isolate;
  width: 100%;
  height: var(--single-line-form-height);

  & .function-button {
    flex: 0 0 30px;
  }

  & input {
    flex: 0 0 auto;
    font-size: 13px;
    font-weight: 300;
    text-align: center;
    height: 24px;
    padding: 0 10px;
    line-height: normal;
    border-radius: 0;
    min-width: 50px; /* prevent shrinking the input if the range is between 0 and 9999 */
    border: 1px solid var(--knime-stone-gray);
    outline: none;
    background-color: var(--theme-input-field-background-color);
    appearance: textfield; /* Hide native buttons in Firefox */

    /* Hide native buttons elsewhere */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    &:disabled {
      opacity: 0.5;
    }

    &:focus {
      border-color: var(--knime-cornflower);
      box-shadow: 0 0 0 1px var(--knime-cornflower);
    }

    &:hover:not(:focus, :disabled) {
      background-color: var(--theme-input-field-background-color-focus);
    }
  }
}
</style>
`,r=m=>(Q("data-v-6a827f08"),m=m(),C(),m),R=r(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[a(" Numeric input field with type integer to set a quantity with control over min and max values, as well as increment steps. Buttons allow the user to decrement or increment the value with the mouse or keyboard. It acts as a form element, so it emits "),e("code",null,"input"),a(" events and it has a "),e("code",null,"value"),a(". ")])])],-1)),W={class:"grid-container"},z={class:"grid-item-4"},G=r(()=>e("br",null,null,-1)),L={class:"grid-container"},Z={class:"grid-item-6"},J={class:"grid-container no-wrap"},K=r(()=>e("div",{class:"grid-item-6"},"How many workflows (steps: 1)",-1)),O={class:"grid-item-6"},X={class:"grid-container no-wrap"},Y=r(()=>e("div",{class:"grid-item-6"},"How many nodes (steps: 10)",-1)),ee={class:"grid-item-6"},ne={class:"grid-container no-wrap"},te=r(()=>e("div",{class:"grid-item-6"},"How many components (steps: 3)",-1)),se={class:"grid-item-6"},ae={class:"grid-container no-wrap"},ie=r(()=>e("div",{class:"grid-item-6"},"How many collections",-1)),oe={class:"grid-item-6"},le={class:"grid-container"},ue={class:"grid-item-4"},de=r(()=>e("br",null,null,-1)),re=r(()=>e("br",null,null,-1)),me={class:"grid-container"},pe={class:"grid-item-12"},ce=`<QuantityInput
  v-model="inputValue1"
  :min="min"
  :max="max"
  :step="1"
/>`,ve={__name:"QuantityInput",setup(m){const u=s(-99),o=s(99),_=s(2),l=s(3),t=s(5),b=s(7),h=s(1),n=s(10),v=s(3);return(V,d)=>(w(),y("div",null,[e("section",null,[R,e("div",W,[e("div",z,[a(" min: "+c(u.value)+" ",1),G,a(" max: "+c(o.value),1)])]),e("div",L,[e("div",Z,[e("div",J,[K,e("div",O,[i(f,{modelValue:_.value,"onUpdate:modelValue":d[0]||(d[0]=p=>_.value=p),min:u.value,max:o.value,step:h.value},null,8,["modelValue","min","max","step"])])]),e("div",X,[Y,e("div",ee,[i(f,{modelValue:l.value,"onUpdate:modelValue":d[1]||(d[1]=p=>l.value=p),min:u.value,max:o.value,step:n.value},null,8,["modelValue","min","max","step"])])]),e("div",ne,[te,e("div",se,[i(f,{modelValue:t.value,"onUpdate:modelValue":d[2]||(d[2]=p=>t.value=p),min:u.value,max:o.value,step:v.value},null,8,["modelValue","min","max","step"])])]),e("div",ae,[ie,e("div",oe,[i(f,{modelValue:b.value,"onUpdate:modelValue":d[3]||(d[3]=p=>b.value=p),min:u.value,max:o.value,step:h.value,disabled:!0},null,8,["modelValue","min","max","step"])])])])]),e("div",le,[e("div",ue,[a(" Quantity 1: "+c(_.value)+" ",1),de,a(" Quantity 2: "+c(l.value)+" ",1),re,a(" Quantity 3: "+c(t.value),1)])])]),e("section",null,[e("div",me,[e("div",pe,[i(I,{summary:"Show usage example"},{default:g(()=>[a(c(ce))]),_:1}),i(I,{summary:"Show NumberInput.vue source code"},{default:g(()=>[a(c(x(A)),1)]),_:1})])])])]))}},fe=F(ve,[["__scopeId","data-v-6a827f08"]]);export{fe as default};
