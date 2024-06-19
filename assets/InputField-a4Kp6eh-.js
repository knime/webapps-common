import{C as w}from"./CodeExample-ZdzjPAyy.js";import{o as f,c as g,b as t,_ as x,I,v as b,as as k,P as V,r as d,d as e,w as o,t as m,e as u,p as _,f as C}from"./index-AasCiagl.js";const F={xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 32 32"},S=t("path",{stroke:"#000","stroke-linecap":"round","stroke-linejoin":"round",d:"M2.5 7h27m-27 0v18h27V7m-27 0L16 17.771 29.5 7"},null,-1),$=[S];function B(s,n){return f(),g("svg",F,[...$])}const R={render:B},M=`<script>
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
    ariaActivedescendant: {
      type: String,
      default: null,
    },
    ariaOwns: {
      type: String,
      default: null,
    },
    compact: {
      type: Boolean,
      default: false,
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
  <div class="input-wrapper" :class="{ compact }">
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
      :aria-activedescendant="ariaActivedescendant"
      :aria-owns="ariaOwns"
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

  &.compact {
    height: var(--single-line-form-height-compact);
  }

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
`,z=`<InputField
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
</InputField>`,L={components:{InputField:I,FunctionButton:b,CircleCheckIcon:k,CloseIcon:V,MailIcon:R,CodeExample:w},data(){return{codeExample:z,inputValue:"demo text",inputValue2:"",inputValue3:""}},computed:{code(){return M}},methods:{alert(s){window.alert(s),this.$refs.buttonDemo.focus()}}},E=s=>(_("data-v-6608dbee"),s=s(),C(),s),D=E(()=>t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null,[u(" Single line string input with optional icon and validity styling. It acts as a form element, so it emits "),t("code",null,"input"),u(" events and it has a "),t("code",null,"value"),u(". ")])])],-1)),O={class:"grid-container"},T={class:"grid-item-6 inputs"},U={class:"grid-item-6"},q={class:"grid-container"},N={class:"grid-item-12"};function j(s,n,A,X,a,r){const i=d("InputField",!0),y=d("MailIcon"),p=d("CircleCheckIcon"),c=d("FunctionButton"),h=d("CloseIcon"),v=d("CodeExample");return f(),g("div",null,[t("section",null,[D,t("div",O,[t("div",T,[e(i,{modelValue:a.inputValue,"onUpdate:modelValue":n[0]||(n[0]=l=>a.inputValue=l),type:"text",title:"Insert text"},null,8,["modelValue"]),e(i,{modelValue:a.inputValue2,"onUpdate:modelValue":n[1]||(n[1]=l=>a.inputValue2=l),type:"text",placeholder:"I'm a placeholder"},null,8,["modelValue"]),e(i,{modelValue:a.inputValue3,"onUpdate:modelValue":n[2]||(n[2]=l=>a.inputValue3=l),type:"text",placeholder:"Required field",required:""},null,8,["modelValue"]),e(i,{"model-value":"disabled: no edit here",type:"text",disabled:""}),e(i,{"model-value":"invalid","is-valid":!1,type:"text"}),e(i,{"model-value":"demo with left icon",type:"text"},{icon:o(()=>[e(y)]),_:1}),e(i,{"model-value":"demo with right icon",type:"text"},{iconRight:o(()=>[e(p)]),_:1}),e(i,{ref:"buttonDemo","model-value":"demo with right aligned buttons",type:"text"},{iconRight:o(()=>[e(c,{onClick:n[3]||(n[3]=l=>r.alert("demo"))},{default:o(()=>[e(p)]),_:1}),e(c,{onClick:n[4]||(n[4]=l=>r.alert("demo 2"))},{default:o(()=>[e(h)]),_:1})]),_:1},512),e(i,{ref:"buttonDemo","model-value":"demo with compact mode",type:"text",compact:""},{iconRight:o(()=>[e(c,{onClick:n[5]||(n[5]=l=>r.alert("demo"))},{default:o(()=>[e(p)]),_:1}),e(c,{onClick:n[6]||(n[6]=l=>r.alert("demo 2"))},{default:o(()=>[e(h)]),_:1})]),_:1},512)]),t("div",U,"input value: "+m(a.inputValue),1)])]),t("section",null,[t("div",q,[t("div",N,[e(v,{summary:"Show usage example"},{default:o(()=>[u(m(a.codeExample),1)]),_:1}),e(v,{summary:"Show InputField.vue source code"},{default:o(()=>[u(m(r.code),1)]),_:1})])])])])}const H=x(L,[["render",j],["__scopeId","data-v-6608dbee"]]);export{H as default};
