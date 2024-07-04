import{C as u}from"./CodeExample-Py2TKdaF.js";import{C as p}from"./Checkbox-ESGT-VfT.js";import{_ as b,r as i,o as m,c as g,b as e,d as r,w as s,e as n,t as a}from"./index-RyhvXRhb.js";const x=`<script>
export default {
  props: {
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    /**
     * Controls the size of the label
     * supported values:
     * - regular
     * - large
     */
    labelSize: {
      type: String,
      default: "regular",
      validator: (value) => ["regular", "large"].includes(value),
    },
  },
  emits: ["update:modelValue"],
  computed: {
    classes() {
      return ["checkbox", this.labelSize, { disabled: this.disabled }];
    },
  },
  methods: {
    onInput($event) {
      /**
       * Fired when the checkbox value changes.
       *
       * @event input
       * @type {Boolean}
       */
      let { checked } = $event.target;
      consola.trace("Checkbox value changed to", checked);
      this.$emit("update:modelValue", checked);
    },
    isChecked() {
      return this.$refs.input.checked;
    },
  },
};
<\/script>

<template>
  <label :class="[classes, { invalid }]">
    <input
      :id="id"
      ref="input"
      :name="name"
      :checked="modelValue"
      :disabled="disabled"
      type="checkbox"
      @change="onInput"
    />
    <span>
      <slot />
    </span>
  </label>
</template>

<style lang="postcss" scoped>
/* if you consider removing this class: don't!
   selector specificity requires it for container system used in page-builder */
.checkbox {
  display: inline-block;
  position: relative;
  isolation: isolate;
  padding: 3px 0 3px 24px;
  max-width: 100%;
  cursor: pointer;

  /* invalid value */
  &.invalid {
    color: var(--theme-color-error);
  }

  &.disabled {
    cursor: initial;
    opacity: 0.5;
  }

  & input {
    user-select: none;
    display: flex;
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;

    & + span {
      display: inline-block;
      overflow: hidden;
      min-width: 1em;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }

    & + span::before {
      /* □ */
      border: 1px solid var(--theme-checkbox-border-color);
      background: var(--theme-checkbox-background-color);
      display: inline-block;
      content: "";
      width: 14px;
      height: 14px;
    }

    & + span::before, /* □ */
    & + span::after {
      /* ✓ */
      position: absolute;
      left: 0;
      top: 4px; /* based on regular line-height of 18px; container will be 24px(2x3px padding) 24-14=10/2 = 5-1 = 4
      to let higher letters appear more centered */
    }

    &:checked {
      /* □ */
      & + span::before {
        /* default */
        border-color: var(--theme-checkbox-border-color-selected);
        background: var(--theme-checkbox-background-color-selected);
      }

      &:focus + span::before {
        border-color: var(--theme-checkbox-border-color-selected-focus);
        background: var(--theme-checkbox-background-color-selected-focus);
      }

      &:hover:enabled + span::before {
        border-color: var(--theme-checkbox-border-color-selected-hover);
        background: var(--theme-checkbox-background-color-selected-hover);
      }

      &:hover:disabled + span::before {
        border-color: var(--theme-checkbox-border-color-selected);
        background: var(--theme-checkbox-background-color-selected);
      }

      /* ✓ */
      & + span::after {
        /* default */
        content: "";
        position: absolute;
        display: block;
        transform: translate(4px, 3.5px) rotate(-45deg);
        left: -1px;
        width: 8px;
        height: 5px;
        border-style: solid;
        border-width: 0 0 1.3px 1.3px;
        border-color: var(--theme-checkbox-foreground-color-selected);
      }

      &:focus + span::after {
        border-color: var(--theme-checkbox-foreground-color-selected-focus);
      }

      &:hover:enabled + span::after {
        border-color: var(--theme-checkbox-foreground-color-selected-hover);
      }

      &:hover:disabled + span::after {
        border-color: var(--theme-checkbox-foreground-color-selected);
      }
    }

    &:not(:checked) {
      background: var(--theme-checkbox-background-color);

      /* □ */
      &:hover:enabled + span::before {
        border-color: var(--theme-checkbox-border-color-hover);
      }

      &:focus:not(:hover) + span::before {
        border-color: var(--theme-checkbox-border-color-focus);
      }
    }
  }

  /* label size */
  &.regular {
    --regular-height: 18px;

    font-size: 13px;
    font-weight: 300;
    line-height: var(--regular-height);

    & > span {
      min-height: var(--regular-height);
    }
  }

  &.large {
    --large-height: 20px;

    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    font-size: 16px;
    font-weight: 700;
    line-height: var(--large-height);

    & > span {
      min-height: var(--large-height);
    }

    /* stylelint-disable no-descending-specificity */
    & input + span::before,
    & input + span::after {
      /* ✓ */
      top: 5px; /* line height 20px; container 26px(2x3px padding) 26-14=12/2=6  -1=5 to center higher letters better */
    }
    /* stylelint-enable no-descending-specificity */
  }
}
</style>
`,f=`<Checkbox v-model="selected">
  I want cookies!
</Checkbox>
<Checkbox v-model="selectedLarge" label-size="large">
  I want larger cookies!
</Checkbox>`,v={components:{Checkbox:p,CodeExample:u},data(){return{codeExample:f,selected:!1,selectedMissing:!0,selectedLarge:!1}},computed:{code(){return x}}},k=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[n(" A checkbox component. It acts as a form element, so it emits an "),e("code",null,"input"),n(" event when (de-)selected, and it has a "),e("code",null,"value"),n(". The "),e("code",null,"label-size"),n(" property can be set to "),e("code",null,"large"),n(" for larger labels. ")])])],-1),_={class:"grid-container"},y={class:"grid-item-6"},w=e("br",null,null,-1),C=e("br",null,null,-1),V=e("br",null,null,-1),z={class:"grid-item-6"},S=e("br",null,null,-1),B=e("br",null,null,-1),I=e("br",null,null,-1),E=e("br",null,null,-1),L={class:"grid-container"},M={class:"grid-item-12"};function T(U,l,N,q,o,h){const c=i("Checkbox",!0),d=i("CodeExample");return m(),g("div",null,[e("section",null,[k,e("div",_,[e("div",y,[r(c,{modelValue:o.selected,"onUpdate:modelValue":l[0]||(l[0]=t=>o.selected=t)},{default:s(()=>[n(" I want cookies! ")]),_:1},8,["modelValue"]),w,r(c,{modelValue:o.selectedLarge,"onUpdate:modelValue":l[1]||(l[1]=t=>o.selectedLarge=t),"label-size":"large"},{default:s(()=>[n(" I want larger cookies! ")]),_:1},8,["modelValue"]),C,r(c,{modelValue:o.selected,"onUpdate:modelValue":l[2]||(l[2]=t=>o.selected=t),disabled:""},{default:s(()=>[n(" This checkbox is disabled! ")]),_:1},8,["modelValue"]),V,r(c,{modelValue:o.selectedMissing,"onUpdate:modelValue":l[3]||(l[3]=t=>o.selectedMissing=t),invalid:"",disabled:""},{default:s(()=>[n(" This checkbox is invalid! ")]),_:1},8,["modelValue"])]),e("div",z,[n(" value: "+a(o.selected),1),S,n(" value: "+a(o.selectedLarge)+" ",1),B,I,E,n(" value: "+a(o.selectedMissing),1)])])]),e("section",null,[e("div",L,[e("div",M,[r(d,{summary:"Show usage example"},{default:s(()=>[n(a(o.codeExample),1)]),_:1}),r(d,{summary:"Show Checkbox.vue source code"},{default:s(()=>[n(a(h.code),1)]),_:1})])])])])}const j=b(v,[["render",T]]);export{j as default};
