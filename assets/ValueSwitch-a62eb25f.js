import{V as c}from"./ValueSwitch-9043af1a.js";import{C as p}from"./CodeExample-01e8e195.js";import{q as m,_ as h,r,o as v,c as b,b as n,e as t,d as a,t as d,w as u}from"./index-57b7b166.js";import"./BaseRadioButtons-f5b59f99.js";const g=`<script lang="ts">
import { defineComponent, type PropType } from "vue";
import BaseRadioButtons, {
  type BaseRadioButtonItem,
} from "./BaseRadioButtons.vue";

// renamed and re-exported to prevent exposing BaseRadioButton's type.
// also, if we want to add custom properties to the ValueSwitch's type, we can do so here
export type ValueSwitchItem = BaseRadioButtonItem;

export default defineComponent({
  components: {
    BaseRadioButtons,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    modelValue: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    possibleValues: {
      type: Array as PropType<Array<ValueSwitchItem>>,
      default: () => [],
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
});
<\/script>

<template>
  <BaseRadioButtons
    :id="id"
    ref="radioButton"
    :possible-values="possibleValues"
    :model-value="modelValue"
    :name="name"
    :disabled="disabled"
    class="value-switch"
    :class="{
      disabled,
      compact: compact,
      normal: !compact,
    }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </BaseRadioButtons>
</template>

<style lang="postcss" scoped>
.value-switch {
  --border-radius: 50px;

  display: flex;
  align-items: center;
  border: 1px solid var(--knime-stone-gray);
  border-radius: var(--border-radius);
  width: max-content;
  height: calc(var(--wrapper-height) * 1px);

  & :deep(span) {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: var(--border-radius);
    min-width: 41px;
    padding: 0 10px;
    font-weight: 300;
    font-size: 13px;
    line-height: 20px;
    height: calc(var(--wrapper-height) * 1px);
  }

  &.disabled {
    opacity: 0.5;
  }

  &.normal {
    --wrapper-height: 30;
  }

  &.compact {
    --wrapper-height: 20;
  }

  & :deep(input[disabled]) + span {
    opacity: 0.5;
    pointer-events: none;
  }

  & :deep(input) {
    user-select: none;
    display: none;

    & + span:hover {
      background-color: var(--theme-value-switch-background-color-hover);
    }

    &:checked + span {
      background-color: var(--theme-value-switch-background-color-checked);
      color: var(--theme-value-switch-background-color);
      pointer-events: none;
    }
  }
}
</style>
`,y=`<ValueSwitch
  v-model="selected"
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  variant="compact"
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  disabled
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD', disabled: true },
    { id: 'cad', text: 'CAD' }
  ]"
/>
`,w=m({components:{ValueSwitch:c,CodeExample:p},data(){return{codeExample:y,selectedCurrency:"eur",currencies:[{id:"eur",text:"EUR"},{id:"usd",text:"USD"},{id:"cad",text:"CAD"}]}},computed:{code(){return g},withDisabledItem(){return this.currencies.map(e=>e.id==="usd"?{...e,disabled:!0}:e)}}});const V=n("div",{class:"grid-container"},[n("div",{class:"grid-item-12"},[n("p",null,[t(" A list of choices the user must choose one of. It emits an "),n("code",null,"input"),t(" event when something is selected, and it has a "),n("code",null,"value"),t(". ")])])],-1),f={class:"grid-container"},x={class:"grid-item-4"},C={class:"grid-item-4"},S={class:"grid-item-4"},B={class:"grid-container"},_={class:"grid-item-4"},U={class:"grid-item-4"},D=n("div",{class:"grid-item-4"},null,-1),R={class:"grid-container"},E={class:"grid-item-12"};function k(e,s,A,I,$,N){const l=r("ValueSwitch",!0),i=r("CodeExample");return v(),b("div",null,[n("section",null,[V,n("div",f,[n("div",x,[t(" Normal mode "),a(l,{modelValue:e.selectedCurrency,"onUpdate:modelValue":s[0]||(s[0]=o=>e.selectedCurrency=o),"possible-values":e.currencies},null,8,["modelValue","possible-values"])]),n("div",C,[t(" Compact mode "),a(l,{modelValue:e.selectedCurrency,"onUpdate:modelValue":s[1]||(s[1]=o=>e.selectedCurrency=o),compact:"","possible-values":e.currencies},null,8,["modelValue","possible-values"])]),n("div",S,"selected id: "+d(e.selectedCurrency),1)]),n("div",B,[n("div",_,[t(" Completely disabled "),a(l,{modelValue:e.selectedCurrency,"onUpdate:modelValue":s[2]||(s[2]=o=>e.selectedCurrency=o),disabled:"","possible-values":e.currencies},null,8,["modelValue","possible-values"])]),n("div",U,[t(" With single disabled option "),a(l,{modelValue:e.selectedCurrency,"onUpdate:modelValue":s[3]||(s[3]=o=>e.selectedCurrency=o),"possible-values":e.withDisabledItem},null,8,["modelValue","possible-values"])]),D])]),n("section",null,[n("div",R,[n("div",E,[a(i,{summary:"Show usage example"},{default:u(()=>[t(d(e.codeExample),1)]),_:1}),a(i,{summary:"Show ValueSwitch.vue source code"},{default:u(()=>[t(d(e.code),1)]),_:1})])])])])}const z=h(w,[["render",k]]);export{z as default};
