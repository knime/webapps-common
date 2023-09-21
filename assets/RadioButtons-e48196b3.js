import{C as h}from"./CodeExample-765fa6a6.js";import{B as f}from"./BaseRadioButtons-43674159.js";import{_ as m,r as c,o as v,j as g,n as B,c as _,b as e,d as s,t as u,w as b,e as i}from"./index-79858142.js";const y={components:{BaseRadioButtons:f},props:{id:{type:String,default:null},modelValue:{type:String,default:""},bold:{default:!1,type:Boolean},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[]},alignment:{type:String,default:"horizontal",validator(a){return["horizontal","vertical"].includes(a)}}},emits:["update:modelValue"],methods:{hasSelection(){return this.$refs.radioButton.$refs.input.some(a=>a.checked)}}};function V(a,o,l,x,t,p){const d=c("BaseRadioButtons");return v(),g(d,{id:l.id,ref:"radioButton",bold:l.bold,"possible-values":l.possibleValues,"model-value":l.modelValue,disabled:l.disabled,class:B(["radio-buttons",l.alignment,{disabled:l.disabled}]),"onUpdate:modelValue":o[0]||(o[0]=r=>a.$emit("update:modelValue",r))},null,8,["id","bold","possible-values","model-value","disabled","class"])}const w=m(y,[["render",V],["__scopeId","data-v-0eb96edd"]]),z=`<script>
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
    bold: {
      default: false,
      type: Boolean,
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
    :bold="bold"
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
`,k=`<RadioButtons
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
`,R={components:{RadioButtons:w,CodeExample:h},data(){return{codeExample:k,selected:"bar"}},computed:{code(){return z}}},S=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[i(" A list of choices the user must choose one of. It emits an "),e("code",null,"input"),i(" event when something is selected, and it has a "),e("code",null,"value"),i(". ")])])],-1),E={class:"grid-container"},F={class:"grid-item-5"},C={class:"grid-item-5"},U={class:"grid-item-5"},A={class:"grid-item-2"},D=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Horizontal and vertical layout with bold options and subtext")])],-1),N={class:"grid-container"},I={class:"grid-item-5"},L={class:"grid-item-5"},j={class:"grid-item-5"},H={class:"grid-item-5"},M={class:"grid-container"},O={class:"grid-item-12"};function P(a,o,l,x,t,p){const d=c("RadioButtons",!0),r=c("CodeExample");return v(),_("div",null,[e("section",null,[S,e("div",E,[e("div",F,[s(d,{modelValue:t.selected,"onUpdate:modelValue":o[0]||(o[0]=n=>t.selected=n),"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",C,[s(d,{modelValue:t.selected,"onUpdate:modelValue":o[1]||(o[1]=n=>t.selected=n),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",U,[s(d,{modelValue:t.selected,"onUpdate:modelValue":o[2]||(o[2]=n=>t.selected=n),alignment:"vertical","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}],disabled:""},null,8,["modelValue"])]),e("div",A,"selected id: "+u(t.selected),1)]),D,e("div",N,[e("div",I,[e("div",L,[s(d,{modelValue:t.selected,"onUpdate:modelValue":o[3]||(o[3]=n=>t.selected=n),bold:!0,"possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])]),e("div",j,[e("div",H,[s(d,{modelValue:t.selected,"onUpdate:modelValue":o[4]||(o[4]=n=>t.selected=n),alignment:"vertical",bold:!0,"possible-values":[{id:"foo",text:"Foo",subtext:"Subtext"},{id:"bar",text:"Bar",subtext:"Even longer subtext"},{id:"baz",text:"Baz",subtext:"Very very looooong subtext below the option"}]},null,8,["modelValue"])])])])]),e("section",null,[e("div",M,[e("div",O,[s(r,{summary:"Show usage example"},{default:b(()=>[i(u(t.codeExample),1)]),_:1}),s(r,{summary:"Show RadioButtons.vue source code"},{default:b(()=>[i(u(p.code),1)]),_:1})])])])])}const G=m(R,[["render",P]]);export{G as default};
