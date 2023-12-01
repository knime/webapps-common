import{C as x}from"./CodeExample-56d6e6d2.js";import{o as v,c as f,b as n,_ as I,I as w,s as b,ak as _,O as k,r as d,d as e,w as s,t as p,e as r,p as V,f as F}from"./index-a42662e3.js";const C={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},S=n("path",{d:"M2.5 7h27v18h-27zm22.96 3.224L16 17.771 2.5 7"},null,-1),$=[S];function B(l,t){return v(),f("svg",C,$)}const R={render:B},z=`<script>
import "./variables.css";
export default {
  props: {
    modelValue: {
      default: "",
      type: [Number, String],
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    /**
     * Sets the error styling, validity needs to be controlled by the parent component to be flexible
     */
    isValid: {
      default: true,
      type: Boolean,
    },
    type: {
      default: "text",
      type: String,
    },
    pattern: {
      default: null,
      type: String,
    },
    placeholder: {
      default: null,
      type: String,
    },
    autocomplete: {
      default: null,
      type: String,
    },
    autofocus: {
      default: false,
      type: Boolean,
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
  emits: ["update:modelValue", "focus", "keyup", "keypress", "keydown"],
  computed: {
    hasLeftIcon() {
      return this.$slots.icon && this.$slots.icon().length;
    },
    hasRightIcon() {
      return this.$slots.iconRight && this.$slots.iconRight().length;
    },
    inputClassList() {
      let classes = this.inputClasses;
      if (this.hasLeftIcon) {
        classes += " with-icon";
      }
      if (this.hasRightIcon) {
        classes += " with-icon-right";
      }
      if (!this.isValid) {
        classes += " invalid";
      }
      return classes;
    },
  },
  methods: {
    getValue() {
      return this.$refs.input.value;
    },
    onInput() {
      this.$emit("update:modelValue", this.getValue());
    },
    focus() {
      this.$refs.input.focus();
    },
    /*
     * checks if value matches the provided pattern
     */
    validate() {
      let isValid = true;
      let errorMessage = null;
      const value = this.getValue();
      if (typeof value === "undefined") {
        isValid = false;
        errorMessage = "Invalid input";
      } else if (this.pattern) {
        if (this.$refs.input.validity.patternMismatch) {
          isValid = false;
          errorMessage = "Input does not match the expected pattern";
        }
      }
      return { isValid, errorMessage };
    },
  },
};
<\/script>

<template>
  <div class="input-wrapper">
    <div v-if="hasLeftIcon" class="icon">
      <slot name="icon" />
    </div>
    <input
      :id="id"
      ref="input"
      :name="name"
      :value="modelValue"
      :class="inputClassList"
      :type="type"
      :pattern="pattern"
      :placeholder="placeholder"
      :autofocus="autofocus"
      :autocomplete="autocomplete"
      :disabled="disabled"
      @input="onInput"
      @focus="$emit('focus', $event)"
      @keyup="$emit('keyup', $event)"
      @keypress="$emit('keypress', $event)"
      @keydown="$emit('keydown', $event)"
    />
    <div v-if="hasRightIcon" class="icon icon-right">
      <slot name="iconRight" />
    </div>
    <span class="invalid-marker" />
  </div>
</template>

<style lang="postcss" scoped>
.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  border: var(--form-border-width) solid var(--knime-stone-gray);
  background-color: var(--theme-input-field-background-color);
  height: var(--single-line-form-height);
  padding: 0 5px;

  &:focus {
    border-color: var(--knime-masala);
  }

  & .icon {
    --icon-size: 18;

    display: flex;
    padding: 5px;
    pointer-events: none;

    /* The gap is needed if there are adjacent activated buttons, to keep some space. */
    gap: 1px;

    & :slotted(svg) {
      vertical-align: top;
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);

      /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
      stroke-width: calc(32px / var(--icon-size));
      stroke: var(--knime-masala);
    }
  }

  &:has(:deep(.function-button)) {
    padding-right: 0;
  }

  & :deep(.function-button) {
    --icon-size: 18;

    pointer-events: auto; /* otherwise, we won't be able to :hover the button */

    & :deep(svg) {
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);

      /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
      stroke-width: calc(32px / var(--icon-size));
    }
  }
}

input {
  flex-grow: 1;
  font-size: 13px;
  font-weight: 300;
  height: 100%;
  line-height: normal;
  padding: 0 5px;
  border: 0;
  background-color: transparent;
  min-width: 1em;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: var(--knime-dove-gray);
  }

  &:disabled {
    opacity: 0.5;
  }

  &.invalid + .invalid-marker {
    position: absolute;
    display: block;
    width: 3px;
    margin: 0;
    background-color: var(--theme-color-error);
    pointer-events: none; /* otherwise :hover of the field doesn't work when hovering the marker */

    /* "Outside" location corresponds to wrapper border. */
    left: calc(-1 * var(--form-border-width));
    top: calc(-1 * var(--form-border-width));
    bottom: calc(-1 * var(--form-border-width));
  }
}

/* This is handled outside of the input element, because hovering inside slots
 * would otherwise not be noticed within the input element. */
.input-wrapper:hover:not(:focus):has(input:not(:focus, :disabled)) {
  background-color: var(--theme-input-field-background-color-focus);
}
</style>
`;const M=`<InputField
  v-model="inputValue"
  type="text"
  title="Insert text"
/>
<Label text="Label of the Input Field">
  <InputField
    v-model="inputValue2"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>
<InputField
  v-model="inputValue"
  type="text"
  :is-valid="false"
/>
<InputField
  v-model="inputValue3"
  type="text"
  placeholder="Required field"
  required
/>
<InputField
  :model-value="no edit here"
  type="text"
  disabled
/>
<InputField
  type="password"
  model-value="secret-password"
/>
<InputField
  v-model="inputValue"
  @focus="onFocus"
/>
<InputField
  v-model="inputValue"
  type="text"
>
  <template v-slot:icon><MailIcon /></template>
</InputField>
<InputField
  model-value="demo with right aligned slot"
  type="text"
>
  <template v-slot:iconRight><CircleCheckIcon /></template>
</InputField>
<InputField
  model-value="demo with right aligned button"
  type="text"
  ref="buttonDemo"
>
  <template v-slot:iconRight>
    <FunctionButton
      @click="alert('demo')"
    >
      <CircleCheckIcon />
    </FunctionButton>
    <FunctionButton
      @click="alert('demo 2')"
    >
      <CloseIcon />
    </FunctionButton>
  </template>
</InputField>`,L={components:{InputField:w,FunctionButton:b,CircleCheckIcon:_,CloseIcon:k,MailIcon:R,CodeExample:x},data(){return{codeExample:M,inputValue:"demo text",inputValue2:"",inputValue3:""}},computed:{code(){return z}},methods:{alert(l){window.alert(l),this.$refs.buttonDemo.focus()}}},E=l=>(V("data-v-9f6143aa"),l=l(),F(),l),T=E(()=>n("div",{class:"grid-container"},[n("div",{class:"grid-item-12"},[n("p",null,[r(" Single line string input with optional icon and validity styling. It acts as a form element, so it emits "),n("code",null,"input"),r(" events and it has a "),n("code",null,"value"),r(". ")])])],-1)),D={class:"grid-container"},O={class:"grid-item-6 inputs"},U={class:"grid-item-6"},q={class:"grid-container"},N={class:"grid-item-12"};function j(l,t,X,A,o,u){const i=d("InputField",!0),g=d("MailIcon"),c=d("CircleCheckIcon"),h=d("FunctionButton"),y=d("CloseIcon"),m=d("CodeExample");return v(),f("div",null,[n("section",null,[T,n("div",D,[n("div",O,[e(i,{modelValue:o.inputValue,"onUpdate:modelValue":t[0]||(t[0]=a=>o.inputValue=a),type:"text",title:"Insert text"},null,8,["modelValue"]),e(i,{modelValue:o.inputValue2,"onUpdate:modelValue":t[1]||(t[1]=a=>o.inputValue2=a),type:"text",placeholder:"I'm a placeholder"},null,8,["modelValue"]),e(i,{modelValue:o.inputValue3,"onUpdate:modelValue":t[2]||(t[2]=a=>o.inputValue3=a),type:"text",placeholder:"Required field",required:""},null,8,["modelValue"]),e(i,{"model-value":"disabled: no edit here",type:"text",disabled:""}),e(i,{"model-value":"invalid","is-valid":!1,type:"text"}),e(i,{"model-value":"demo with left icon",type:"text"},{icon:s(()=>[e(g)]),_:1}),e(i,{"model-value":"demo with right icon",type:"text"},{iconRight:s(()=>[e(c)]),_:1}),e(i,{ref:"buttonDemo","model-value":"demo with right aligned buttons",type:"text"},{iconRight:s(()=>[e(h,{onClick:t[3]||(t[3]=a=>u.alert("demo"))},{default:s(()=>[e(c)]),_:1}),e(h,{onClick:t[4]||(t[4]=a=>u.alert("demo 2"))},{default:s(()=>[e(y)]),_:1})]),_:1},512)]),n("div",U,"input value: "+p(o.inputValue),1)])]),n("section",null,[n("div",q,[n("div",N,[e(m,{summary:"Show usage example"},{default:s(()=>[r(p(o.codeExample),1)]),_:1}),e(m,{summary:"Show InputField.vue source code"},{default:s(()=>[r(p(u.code),1)]),_:1})])])])])}const J=I(L,[["render",j],["__scopeId","data-v-9f6143aa"]]);export{J as default};
