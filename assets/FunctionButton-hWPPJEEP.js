import{C as b}from"./CodeExample-bO3A3Wb_.js";import{o as v,c as m,b as t,_,v as B,L as x,r as s,d as n,w as e,e as u,t as d,p as k,f as w}from"./index-_HOv_LZu.js";import{b as y}from"./BaseButton-G6-JaIfT.js";import{M as F}from"./menu-options-fTN5yXJm.js";const I=`<script>
import BaseButton from "./BaseButton.vue";

/**
 * Works with an icon & text combination or a single icon.
 */
export default {
  components: {
    BaseButton,
  },
  props: {
    /**
     * @see {@link BaseButton.vue}
     */

    /**
     * Switches the active style of the component
     */
    active: {
      type: Boolean,
      default: false,
    },
    /**
     * switches colors
     */
    primary: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    single() {
      if (this.$slots.default().length !== 1) {
        return false;
      }
      return this.hasSingleChildren(this.$slots.default()[0]);
    },
  },
  methods: {
    /**
     * This can be called from outside via focus on a $ref
     */
    focus() {
      this.$refs.baseButton.focus();
    },
    /**
     * This can be called from outside via getComponent on a $ref
     */
    getComponent() {
      return this.$refs.baseButton.getComponent();
    },
    hasSingleChildren(slotElement) {
      if (!slotElement.children) {
        return true;
      }
      if (slotElement.children.length === 1) {
        return this.hasSingleChildren(slotElement.children[0]);
      } else {
        return false;
      }
    },
  },
};
<\/script>

<template>
  <BaseButton
    ref="baseButton"
    :disabled="disabled"
    :class="['function-button', { single, active, primary, disabled }]"
  >
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
.function-button {
  display: flex;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  font-family: var(--theme-text-medium-font-family);
  line-height: 18px;
  padding: 6px 15px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  color: var(--theme-button-function-foreground-color);
  background-color: var(--theme-button-function-background-color, transparent);

  /* best way to ensure pill shaped buttons with flexible 1/4 corners */
  border-radius: var(--theme-button-function-border-radius, 9999px);

  /*
  Add margin to first children, using last-child and first-child to avoid problems in build
  */
  & :deep(> *) {
    &:first-child {
      margin-right: 8px;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  &.single {
    padding: 6px;
  }

  & :deep(svg) {
    vertical-align: top;
    stroke: var(--theme-button-function-foreground-color);
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }

  & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
    fill: var(--theme-button-function-foreground-color);
  }

  &:hover {
    outline: none;
    color: var(--theme-button-function-foreground-color-hover);
    background-color: var(--theme-button-function-background-color-hover);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-hover);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-function-foreground-color-hover);
    }
  }

  &:focus {
    outline: none;
    color: var(--theme-button-function-foreground-color-focus);
    background-color: var(--theme-button-function-background-color-focus);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-focus);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-function-foreground-color-focus);
    }
  }

  &.active {
    color: var(--theme-button-function-foreground-color-active);
    background-color: var(--theme-button-function-background-color-active);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-active);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-function-foreground-color-active);
    }
  }

  &.primary {
    color: var(--theme-button-foreground-color);
    background-color: var(--theme-button-background-color);

    & :deep(svg) {
      stroke: var(--theme-button-foreground-color);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-foreground-color);
    }

    &:hover {
      outline: none;
      color: var(--theme-button-foreground-color-hover);
      background-color: var(--theme-button-background-color-hover);

      & :deep(svg) {
        stroke: var(--theme-button-foreground-color-hover);
      }

      & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
        fill: var(--theme-button-foreground-color-hover);
      }
    }

    &:active,
    &:focus {
      outline: none;
      color: var(--theme-button-foreground-color-focus);
      background-color: var(--theme-button-background-color-focus);

      & :deep(svg) {
        stroke: var(--theme-button-foreground-color-focus);
      }

      & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
        fill: var(--theme-button-foreground-color-focus);
      }
    }
  }

  &.disabled {
    /* via class since <a> elements don't have a native disabled attribute */
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
`,C={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},S=t("path",{d:"M9.3 26V4.7m-6.8 6.8 6.8-6.8 6.7 6.8M22.7 6v21.3m6.8-6.8-6.8 6.8-6.7-6.8"},null,-1),M=[S];function E(i,r){return v(),m("svg",C,[...M])}const O={render:E},L=`
  <FunctionButton :active="active1">
    <LensIcon />
    <span>Function</span>
  </FunctionButton>

  <FunctionButton :active="active2">
    <MenuOptionsIcon />
  </FunctionButton>

  <FunctionButton :active="active3">
    <span>Sorter</span>
    <SorterIcon />
  </FunctionButton>

  <FunctionButton primary>
    <MenuOptionsIcon />
  </FunctionButton>

  <FunctionButton disabled>
    <span>Disabled Function</span>
    <SorterIcon />
  </FunctionButton>
`,$={components:{FunctionButton:B,MenuOptionsIcon:F,LensIcon:x,SorterIcon:O,CodeExample:b},data(){return{functionButtonCode:I,baseButtonCode:y,codeExample:L,active1:!1,active2:!1,active3:!1,subMenuItems:[{href:"https://apple.com",text:"Apples"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges"},{to:"/testing-nuxt-link",text:"Ananas"}]}}},l=i=>(k("data-v-ecea09bf"),i=i(),w(),i),A={class:"grid-container"},T={class:"grid-item-12"},V=l(()=>t("p",null," The function button is a button with an optional active state, e.g. when a dropdown menu is expanded and can also be disabled. ",-1)),D=l(()=>t("p",null," Its primary use is together with the SubMenu component where it is included, but can also be used standalone. Works with an icon & text combination or a single icon. ",-1)),N={class:"align-horizontal"},z=l(()=>t("span",null,"Function",-1)),W=l(()=>t("span",null,"Function",-1)),j=l(()=>t("span",null,"Disabled Function",-1));function q(i,r,G,H,o,J){const g=s("LensIcon"),c=s("FunctionButton",!0),f=s("MenuOptionsIcon"),p=s("SorterIcon"),a=s("CodeExample");return v(),m("section",null,[t("div",A,[t("div",T,[V,D,t("div",N,[n(c,{active:o.active1,onClick:r[0]||(r[0]=h=>o.active1=!o.active1)},{default:e(()=>[n(g),z]),_:1},8,["active"]),n(c,{active:o.active2,onClick:r[1]||(r[1]=h=>o.active2=!o.active2)},{default:e(()=>[n(f)]),_:1},8,["active"]),n(c,{active:o.active3,onClick:r[2]||(r[2]=h=>o.active3=!o.active3)},{default:e(()=>[W,n(p)]),_:1},8,["active"]),n(c,{primary:""},{default:e(()=>[n(f)]),_:1}),n(c,{disabled:""},{default:e(()=>[j,n(p)]),_:1})]),n(a,{summary:"Show usage example"},{default:e(()=>[u(d(o.codeExample),1)]),_:1}),n(a,{summary:"Show FunctionButton.vue source code"},{default:e(()=>[u(d(o.functionButtonCode),1)]),_:1}),n(a,{summary:"Show BaseButton.vue source code"},{default:e(()=>[u(d(o.baseButtonCode),1)]),_:1})])])])}const U=_($,[["render",q],["__scopeId","data-v-ecea09bf"]]);export{U as default};
