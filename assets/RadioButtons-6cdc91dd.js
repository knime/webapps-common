import{C as f}from"./CodeExample-c495b379.js";import{B as x}from"./BaseRadioButtons-1aafd87d.js";import{_ as b,r as u,o as h,j as g,n as B,c as _,b as e,d as s,t as c,w as m,e as i}from"./index-02da3112.js";const y={components:{BaseRadioButtons:x},props:{id:{type:String,default:null},modelValue:{type:String,default:""},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[]},alignment:{type:String,default:"horizontal",validator(a){return["horizontal","vertical"].includes(a)}}},emits:["update:modelValue"],methods:{hasSelection(){return this.$refs.radioButton.$refs.input.some(a=>a.checked)}}};function V(a,n,t,v,o,p){const d=u("BaseRadioButtons");return h(),g(d,{id:t.id,ref:"radioButton","possible-values":t.possibleValues,"model-value":t.modelValue,disabled:t.disabled,class:B(["radio-buttons",t.alignment,{disabled:t.disabled}]),"onUpdate:modelValue":n[0]||(n[0]=r=>a.$emit("update:modelValue",r))},null,8,["id","possible-values","model-value","disabled","class"])}const w=b(y,[["render",V],["__scopeId","data-v-708ea0e9"]]),k=`<script>
import BaseRadioButtons from "./BaseRadioButtons.vue";

export default {
  components: {
    BaseRadioButtons,
  },
  props: {
    // this props are passed to BaseRadioButtons
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

.disabled {
  opacity: 0.5;

  & :deep(label) {
    cursor: initial;
  }
}

.radio-buttons:focus-within :deep(label input + span::before) {
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
`,z=`<RadioButtons
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
`,R={components:{RadioButtons:w,CodeExample:f},data(){return{codeExample:z,selected:"bar"}},computed:{code(){return k}}},S=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[i(" A list of choices the user must choose one of. It emits an "),e("code",null,"input"),i(" event when something is selected, and it has a "),e("code",null,"value"),i(". ")])])],-1),E={class:"grid-container"},C={class:"grid-item-5"},F={class:"grid-item-5"},U={class:"grid-item-5"},A={class:"grid-item-2"},D={class:"grid-container"},N={class:"grid-item-12"};function $(a,n,t,v,o,p){const d=u("RadioButtons",!0),r=u("CodeExample");return h(),_("div",null,[e("section",null,[S,e("div",E,[e("div",C,[s(d,{modelValue:o.selected,"onUpdate:modelValue":n[0]||(n[0]=l=>o.selected=l),"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",F,[s(d,{modelValue:o.selected,"onUpdate:modelValue":n[1]||(n[1]=l=>o.selected=l),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",U,[s(d,{modelValue:o.selected,"onUpdate:modelValue":n[2]||(n[2]=l=>o.selected=l),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",A,"selected id: "+c(o.selected),1)])]),e("section",null,[e("div",D,[e("div",N,[s(r,{summary:"Show usage example"},{default:m(()=>[i(c(o.codeExample),1)]),_:1}),s(r,{summary:"Show RadioButtons.vue source code"},{default:m(()=>[i(c(p.code),1)]),_:1})])])])])}const M=b(R,[["render",$]]);export{M as default};
