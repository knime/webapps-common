import{C as f}from"./CodeExample-OjdxNUc1.js";import{B as g}from"./BaseRadioButtons-PYg2e0F_.js";import{_ as b,r as c,o as v,j as B,n as _,c as y,b as e,d,t as u,w as m,e as i,p as V,f as w}from"./index--jPh-4CA.js";const z={components:{BaseRadioButtons:g},props:{id:{type:String,default:null},modelValue:{type:String,default:""},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[]},alignment:{type:String,default:"horizontal",validator(l){return["horizontal","vertical"].includes(l)}}},emits:["update:modelValue"],methods:{hasSelection(){return this.$refs.radioButton.$refs.input.some(l=>l.checked)}}};function k(l,t,a,x,o,p){const s=c("BaseRadioButtons");return v(),B(s,{id:a.id,ref:"radioButton","possible-values":a.possibleValues,"model-value":a.modelValue,disabled:a.disabled,class:_(["radio-buttons",a.alignment,{disabled:a.disabled}]),"onUpdate:modelValue":t[0]||(t[0]=r=>l.$emit("update:modelValue",r))},null,8,["id","possible-values","model-value","disabled","class"])}const S=b(z,[["render",k],["__scopeId","data-v-a2e6db4f"]]),R=`<script>
import BaseRadioButtons from "./BaseRadioButtons.vue";

export default {
  components: {
    BaseRadioButtons,
  },
  props: {
    // these props are passed to BaseRadioButtons
    id: {
      type: String,
      default: null,
    },
    modelValue: {
      type: String,
      default: "",
    },
    disabled: {
      default: false,
      type: Boolean,
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
      default: () => [],
    },

    // additional props
    alignment: {
      type: String,
      default: "horizontal",
      validator(value) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
  },
  emits: ["update:modelValue"],
  methods: {
    hasSelection() {
      /* looks in the DOM if one radio button is checked */
      return this.$refs.radioButton.$refs.input.some((x) => x.checked);
    },
  },
};
<\/script>

<template>
  <BaseRadioButtons
    :id="id"
    ref="radioButton"
    :possible-values="possibleValues"
    :model-value="modelValue"
    :disabled="disabled"
    :class="['radio-buttons', alignment, { disabled }]"
    @update:model-value="$emit('update:modelValue', $event)"
  />
</template>

<style lang="postcss" scoped>
.radio-buttons :deep() {
  user-select: none;

  & label {
    position: relative;
    display: block;
    font-weight: 300;
    font-size: 13px;
    line-height: 18px;
    padding: 3px 3px 3px 23px;
    max-width: 100%;
    width: max-content;
    cursor: pointer;

    &.disabled {
      opacity: 0.5;
      cursor: default;
    }

    & input {
      opacity: 0;
      position: absolute;
      width: 0;
      height: 0;

      & + span {
        display: inline-block;
        width: 100%;
        min-width: 1em;
        color: var(--knime-masala);
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* ◯ */
      & + span::before {
        border: 1px solid var(--theme-radio-border-color);
        background: var(--theme-radio-background-color);
        display: inline-block;
        content: "";
        width: 14px;
        height: 14px;
        border-radius: 100%;
        left: 0;
        top: 5px;
        position: absolute;
        vertical-align: top;
        text-align: center;
      }

      &:enabled:hover + span::before {
        border: 1px solid var(--theme-radio-border-color-hover);
        background: var(--theme-radio-background-color-hover);
        cursor: pointer;
      }

      /* 🔘 */
      &:checked {
        /* stylelint-disable no-descending-specificity */
        & + span::before {
          background: var(--theme-radio-foreground-color-selected);
          border-color: var(--theme-radio-border-color-selected);
          content: "";
          box-shadow: inset 0 0 0 4px
            var(--theme-radio-background-color-selected);
        }
        /* stylelint-enable no-descending-specificity */

        &:enabled:hover + span::before {
          box-shadow: unset;
          background: radial-gradient(
            ellipse at center,
            var(--theme-radio-foreground-color-selected-hover) 0%,
            var(--theme-radio-foreground-color-selected-hover) 25%,
            var(--theme-radio-background-color-selected-hover) 26%,
            var(--theme-radio-background-color-selected-hover) 100%
          );
          border-color: var(--theme-radio-border-color-selected-hover);
        }
      }
    }
  }
}

.radio-buttons:focus-within :deep(label input:not(:disabled) + span::before) {
  border: 1px solid var(--theme-radio-border-color-focus);
}

.horizontal :deep() {
  display: flex;
  flex-wrap: wrap;

  & label {
    min-width: 0; /* sizing and text overflow with flexbox - see https://stackoverflow.com/a/26535469 */

    &:not(:last-of-type) {
      padding-right: 12px;
    }
  }
}
</style>
`,E=`<RadioButtons
  v-model="selected"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>
<RadioButtons
  v-model="selected"
  alignment="vertical"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>
`,F={components:{RadioButtons:S,CodeExample:f},data(){return{codeExample:E,selected:"bar"}},computed:{code(){return R}}},h=l=>(V("data-v-c2b20cd0"),l=l(),w(),l),C=h(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[i(" A list of choices the user must choose one of. It emits an "),e("code",null,"input"),i(" event when something is selected, and it has a "),e("code",null,"value"),i(". ")])])],-1)),U={class:"grid-container"},I={class:"grid-item-5"},A={class:"grid-item-5"},D={class:"grid-item-5"},N={class:"grid-item-5"},L={class:"grid-item-2"},O=h(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[i(" Horizontal and vertical layout with subtext. Optionally, a margin can be specified by setting the CSS variable "),e("code",null,"--radio-button-margin"),i(", which defaults to 0. ")])])],-1)),j={class:"grid-container"},H={class:"grid-item-5"},M={class:"grid-item-5"},P={class:"grid-item-5"},T={class:"grid-item-5"},X={class:"grid-container"},q={class:"grid-item-12"};function G(l,t,a,x,o,p){const s=c("RadioButtons",!0),r=c("CodeExample");return v(),y("div",null,[e("section",null,[C,e("div",U,[e("div",I,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=n=>o.selected=n),"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",A,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[1]||(t[1]=n=>o.selected=n),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",D,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[2]||(t[2]=n=>o.selected=n),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",N,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[3]||(t[3]=n=>o.selected=n),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar",disabled:!0},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",L,"selected id: "+u(o.selected),1)]),O,e("div",j,[e("div",H,[e("div",M,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[4]||(t[4]=n=>o.selected=n),"possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])]),e("div",P,[e("div",T,[d(s,{modelValue:o.selected,"onUpdate:modelValue":t[5]||(t[5]=n=>o.selected=n),alignment:"vertical",class:"radio-button-margin","possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])])])]),e("section",null,[e("div",X,[e("div",q,[d(r,{summary:"Show usage example"},{default:m(()=>[i(u(o.codeExample),1)]),_:1}),d(r,{summary:"Show RadioButtons.vue source code"},{default:m(()=>[i(u(p.code),1)]),_:1})])])])])}const W=b(F,[["render",G],["__scopeId","data-v-c2b20cd0"]]);export{W as default};
