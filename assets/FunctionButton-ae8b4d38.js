import{C as b}from"./CodeExample-b9a91e7f.js";import{o as h,c as m,b as t,_,s as B,L as x,r as s,d as n,w as e,e as l,t as d,p as k,f as w}from"./index-e772f7ee.js";import{b as y}from"./BaseButton-4d386d09.js";import{M as F}from"./menu-options-2a4bb0d1.js";const I=`<script>
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
      return this.$slots.default().length === 1;
    },
  },
  methods: {
    focus() {
      // This can be called from outside via focus on a $ref */
      this.$refs.baseButton.focus();
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
`,S={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},C=t("path",{d:"M9.3 26V4.7m-6.8 6.8 6.8-6.8 6.7 6.8M22.7 6v21.3m6.8-6.8-6.8 6.8-6.7-6.8"},null,-1),M=[C];function O(i,r){return h(),m("svg",S,M)}const E={render:O};const L=`
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
`,V={components:{FunctionButton:B,MenuOptionsIcon:F,LensIcon:x,SorterIcon:E,CodeExample:b},data(){return{functionButtonCode:I,baseButtonCode:y,codeExample:L,active1:!1,active2:!1,active3:!1,subMenuItems:[{href:"http://apple.com",text:"Apples"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges"},{to:"/testing-nuxt-link",text:"Ananas"}]}}},a=i=>(k("data-v-2f7c7f96"),i=i(),w(),i),A={class:"grid-container"},D={class:"grid-item-12"},N=a(()=>t("p",null," The function button is a button with an optional active state, e.g. when a dropdown menu is expanded and can also be disabled. ",-1)),T=a(()=>t("p",null," Its primary use is together with the SubMenu component where it is included, but can also be used standalone. Works with an icon & text combination or a single icon. ",-1)),z={class:"align-horizontal"},W=a(()=>t("span",null,"Function",-1)),$=a(()=>t("span",null,"Function",-1)),j=a(()=>t("span",null,"Disabled Function",-1));function q(i,r,G,H,o,J){const g=s("LensIcon"),c=s("FunctionButton",!0),f=s("MenuOptionsIcon"),p=s("SorterIcon"),u=s("CodeExample");return h(),m("section",null,[t("div",A,[t("div",D,[N,T,t("div",z,[n(c,{active:o.active1,onClick:r[0]||(r[0]=v=>o.active1=!o.active1)},{default:e(()=>[n(g),W]),_:1},8,["active"]),n(c,{active:o.active2,onClick:r[1]||(r[1]=v=>o.active2=!o.active2)},{default:e(()=>[n(f)]),_:1},8,["active"]),n(c,{active:o.active3,onClick:r[2]||(r[2]=v=>o.active3=!o.active3)},{default:e(()=>[$,n(p)]),_:1},8,["active"]),n(c,{primary:""},{default:e(()=>[n(f)]),_:1}),n(c,{disabled:""},{default:e(()=>[j,n(p)]),_:1})]),n(u,{summary:"Show usage example"},{default:e(()=>[l(d(o.codeExample),1)]),_:1}),n(u,{summary:"Show FunctionButton.vue source code"},{default:e(()=>[l(d(o.functionButtonCode),1)]),_:1}),n(u,{summary:"Show BaseButton.vue source code"},{default:e(()=>[l(d(o.baseButtonCode),1)]),_:1})])])])}const U=_(V,[["render",q],["__scopeId","data-v-2f7c7f96"]]);export{U as default};
