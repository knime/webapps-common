import{C as p}from"./CodeExample-ab3ea217.js";import{V as m}from"./ValueSwitch-6a91c09b.js";import{_ as x,r as c,o as h,c as v,b as e,d as o,t as a,w as r,e as l}from"./index-19536967.js";import"./BaseRadioButtons-3dbef4ab.js";const b=`<script>
import BaseRadioButtons from './BaseRadioButtons.vue';

export default {
    components: {
        BaseRadioButtons
    },
    props: {
        // this props are passed to BaseRadioButtons
        id: {
            type: String,
            default: null
        },
        modelValue: {
            type: String,
            default: null
        },
        name: {
            type: String,
            default: null
        },
        disabled: {
            default: false,
            type: Boolean
        },
        /**
         * List of possible values. Each item must have an \`id\` and a \`text\` property
         * @example
         * [{
         *   id: 'pdf',
         *   text: 'PDF'
         * }, {
         *   id: 'XLS',
         *   text: 'Excel',
         * }]
         */
        possibleValues: {
            type: Array,
            default: () => []
        }
    },
    emits: ['update:modelValue']
};
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
    :class="{disabled}"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<style lang="postcss" scoped>
.value-switch {
  display: flex;
  align-items: center;
  height: 30px;
  width: max-content;
  padding: 3px;
  border-radius: 50px;
  border: 1px solid var(--knime-stone-gray);

  & :deep(span) {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    min-width: 41px;
    padding: 0 10px;
    font-weight: 300;
    font-size: 13px;
    line-height: 18px;
    cursor: pointer;
    border-radius: 50px;
  }

  & :deep(input) {
    user-select: none;
    display: none;

    &:checked + span {
      background-color: var(--theme-value-switch-background-color-checked);
      color: var(--theme-value-switch-background-color);
    }
  }
}

.value-switch:not(.disabled) :deep(span:hover) {
  background-color: var(--theme-value-switch-background-color-hover);
}

.value-switch.disabled {
  opacity: 0.5;
}

</style>
`,g=`<ValueSwitch
  v-model="selected"
  :possible-values="[{
    id: 'eur',
    text: 'EUR'
  }, {
    id: 'usd',
    text: 'USD'
  }]"
/>
<ValueSwitch
  v-model="selected"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'barbaz',
    text: 'Barbaz'
  }, {
    id: 'qux',
    text: 'Qux'
  }]"
/>
<ValueSwitch
  v-model="selected"
  disabled
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'barbaz',
    text: 'Barbaz'
  }, {
    id: 'qux',
    text: 'Qux'
  }]"
/>
`,f={components:{ValueSwitch:m,CodeExample:p},data(){return{codeExample:g,selected:"eur",selectedLarge:"foobar"}},computed:{code(){return b}}},V=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"ValueSwitch"),e("p",null,[l(" A list of choices the user must choose one of. It emits an "),e("code",null,"input"),l(" event when something is selected, and it has a "),e("code",null,"value"),l(". ")])])],-1),_={class:"grid-container"},w={class:"grid-item-4"},B={class:"grid-item-4"},S={class:"grid-container"},y={class:"grid-item-4"},k={class:"grid-item-4"},E={class:"grid-item-4"},z={class:"grid-container"},L={class:"grid-item-12"};function R(U,n,C,F,t,u){const d=c("ValueSwitch",!0),i=c("CodeExample");return h(),v("div",null,[e("section",null,[V,e("div",_,[e("div",w,[o(d,{modelValue:t.selected,"onUpdate:modelValue":n[0]||(n[0]=s=>t.selected=s),"possible-values":[{id:"eur",text:"EUR"},{id:"usd",text:"USD"}]},null,8,["modelValue"])]),e("div",B," selected id: "+a(t.selected),1)]),e("div",S,[e("div",y,[o(d,{modelValue:t.selectedLarge,"onUpdate:modelValue":n[1]||(n[1]=s=>t.selectedLarge=s),"possible-values":[{id:"baz",text:"Baz"},{id:"foobar",text:"Foobar"},{id:"qux",text:"Qux"}]},null,8,["modelValue"])]),e("div",k,[o(d,{modelValue:t.selectedLarge,"onUpdate:modelValue":n[2]||(n[2]=s=>t.selectedLarge=s),disabled:"","possible-values":[{id:"baz",text:"Baz"},{id:"foobar",text:"Foobar"},{id:"qux",text:"Qux"}]},null,8,["modelValue"])]),e("div",E," selected id: "+a(t.selectedLarge),1)])]),e("section",null,[e("div",z,[e("div",L,[o(i,{summary:"Show usage example"},{default:r(()=>[l(a(t.codeExample),1)]),_:1}),o(i,{summary:"Show ValueSwitch.vue source code"},{default:r(()=>[l(a(u.code),1)]),_:1})])])])])}const A=x(f,[["render",R]]);export{A as default};
