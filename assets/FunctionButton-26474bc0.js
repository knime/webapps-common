import{C as g}from"./CodeExample-58ee106e.js";import{o as h,c as m,b as t,_,s as B,L as x,d as o,w as e,e as l,t as d,r as u,p as k,f as w}from"./index-2e4a1f3e.js";import{b as y}from"./BaseButton-8a396430.js";import{M as F}from"./menu-options-27f64978.js";const I=`<script>
import BaseButton from './BaseButton.vue';

/**
 * Works with an icon & text combination or a single icon.
 */
export default {
    components: {
        BaseButton
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
            default: false
        },
        /**
         * switches colors
         */
        primary: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        single() {
            return this.$slots.default().length === 1;
        }
    },
    methods: {
        focus() {
            // This can be called from outside via focus on a $ref */
            this.$refs.baseButton.focus();
        }
    }
};
<\/script>

<template>
  <BaseButton
    v-bind="$attrs"
    ref="baseButton"
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

  &.disabled { /* via class since <a> elements don't have a native disabled attribute */
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
`,S={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},C=t("path",{d:"M9.3 26V4.7m-6.8 6.8 6.8-6.8 6.7 6.8M22.7 6v21.3m6.8-6.8-6.8 6.8-6.7-6.8"},null,-1),M=[C];function O(c,r){return h(),m("svg",S,M)}const E={render:O};const L=`
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

  <FunctionButton :disabled="disabled">
    <span>Disabled Function</span>
    <SorterIcon />
  </FunctionButton>
`,V={components:{FunctionButton:B,MenuOptionsIcon:F,LensIcon:x,SorterIcon:E,CodeExample:g},data(){return{functionButtonCode:I,baseButtonCode:y,codeExample:L,active1:!1,active2:!1,active3:!1,disabled:!0,subMenuItems:[{href:"http://apple.com",text:"Apples"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges"},{to:"/testing-nuxt-link",text:"Ananas"}]}}},i=c=>(k("data-v-8ff620bd"),c=c(),w(),c),A={class:"grid-container"},D={class:"grid-item-12"},N=i(()=>t("h2",null,"FunctionButton",-1)),T=i(()=>t("p",null," The function button is a button with an optional active state, e.g. when a dropdown menu is expanded and can also be disabled. ",-1)),z=i(()=>t("p",null," Its primary use is together with the SubMenu component where it is included, but can also be used standalone. Works with an icon & text combination or a single icon. ",-1)),W={class:"align-horizontal"},$=i(()=>t("span",null,"Function",-1)),j=i(()=>t("span",null,"Function",-1)),q=i(()=>t("span",null,"Disabled Function",-1));function G(c,r,H,J,n,K){const b=u("LensIcon"),s=u("FunctionButton",!0),f=u("MenuOptionsIcon"),p=u("SorterIcon"),a=u("CodeExample");return h(),m("section",null,[t("div",A,[t("div",D,[N,T,z,t("div",W,[o(s,{active:n.active1,onClick:r[0]||(r[0]=v=>n.active1=!n.active1)},{default:e(()=>[o(b),$]),_:1},8,["active"]),o(s,{active:n.active2,onClick:r[1]||(r[1]=v=>n.active2=!n.active2)},{default:e(()=>[o(f)]),_:1},8,["active"]),o(s,{active:n.active3,onClick:r[2]||(r[2]=v=>n.active3=!n.active3)},{default:e(()=>[j,o(p)]),_:1},8,["active"]),o(s,{primary:""},{default:e(()=>[o(f)]),_:1}),o(s,{disabled:n.disabled},{default:e(()=>[q,o(p)]),_:1},8,["disabled"])]),o(a,{summary:"Show usage example"},{default:e(()=>[l(d(n.codeExample),1)]),_:1}),o(a,{summary:"Show FunctionButton.vue source code"},{default:e(()=>[l(d(n.functionButtonCode),1)]),_:1}),o(a,{summary:"Show BaseButton.vue source code"},{default:e(()=>[l(d(n.baseButtonCode),1)]),_:1})])])])}const X=_(V,[["render",G],["__scopeId","data-v-8ff620bd"]]);export{X as default};
