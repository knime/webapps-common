import{C as p}from"./CodeExample-6UIRh-UI.js";import{C as u}from"./Checkbox-7B7z2ut9.js";import{_ as b,r as i,o as m,c as g,b as e,d as r,w as a,e as n,t as c}from"./index-rGGpuWpM.js";const x=`<script>
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
  <label :class="classes">
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
</Checkbox>`,k={components:{Checkbox:u,CodeExample:p},data(){return{codeExample:f,selected:!1,selectedLarge:!1}},computed:{code(){return x}}},v=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[n(" A checkbox component. It acts as a form element, so it emits an "),e("code",null,"input"),n(" event when (de-)selected, and it has a "),e("code",null,"value"),n(". The "),e("code",null,"label-size"),n(" property can be set to "),e("code",null,"large"),n(" for larger labels. ")])])],-1),y={class:"grid-container"},_={class:"grid-item-6"},w=e("br",null,null,-1),C=e("br",null,null,-1),V={class:"grid-item-6"},z=e("br",null,null,-1),S={class:"grid-container"},I={class:"grid-item-12"};function B(E,t,L,N,o,h){const s=i("Checkbox",!0),d=i("CodeExample");return m(),g("div",null,[e("section",null,[v,e("div",y,[e("div",_,[r(s,{modelValue:o.selected,"onUpdate:modelValue":t[0]||(t[0]=l=>o.selected=l)},{default:a(()=>[n(" I want cookies! ")]),_:1},8,["modelValue"]),w,r(s,{modelValue:o.selectedLarge,"onUpdate:modelValue":t[1]||(t[1]=l=>o.selectedLarge=l),"label-size":"large"},{default:a(()=>[n(" I want larger cookies! ")]),_:1},8,["modelValue"]),C,r(s,{modelValue:o.selected,"onUpdate:modelValue":t[2]||(t[2]=l=>o.selected=l),disabled:""},{default:a(()=>[n(" This checkbox is disabled! ")]),_:1},8,["modelValue"])]),e("div",V,[n(" value: "+c(o.selected),1),z,n(" value: "+c(o.selectedLarge),1)])])]),e("section",null,[e("div",S,[e("div",I,[r(d,{summary:"Show usage example"},{default:a(()=>[n(c(o.codeExample),1)]),_:1}),r(d,{summary:"Show Checkbox.vue source code"},{default:a(()=>[n(c(h.code),1)]),_:1})])])])])}const A=b(k,[["render",B]]);export{A as default};
