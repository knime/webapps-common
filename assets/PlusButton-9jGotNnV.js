import{C as h}from"./CodeExample-rABFehML.js";import{B as v}from"./Button-ewE3BiET.js";import{o as p,c,b as o,q as k,T as x,_ as m,r as i,j as g,w as r,d as t,v as B,k as y,e as l,t as u}from"./index-3TViJsqC.js";import{b as P}from"./Button-owOaj85Z.js";const w={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#3E3A39",viewBox:"0 0 32 32"},C=o("path",{"stroke-linejoin":"round","stroke-miterlimit":"10",d:"M8.417 16h15.166M16 8.417v15.166"},null,-1),$=[C];function I(e,d){return p(),c("svg",w,[...$])}const T={render:I},E=k({components:{Button:v,Tooltip:x,PlusIcon:T},inheritAttrs:!1,props:{title:{type:String,default:null}}});function S(e,d,_,b,a,f){const n=i("PlusIcon"),s=i("Button");return p(),g(y(e.title?"Tooltip":"div"),{text:e.title},{default:r(()=>[t(s,B({class:"plus-button"},e.$attrs),{default:r(()=>[t(n)]),_:1},16)]),_:1},8,["text"])}const D=m(E,[["render",S],["__scopeId","data-v-8570bfe7"]]),j=`<script lang="ts">
import { defineComponent } from "vue";
import Button from "./Button.vue";
import Tooltip from "./Tooltip.vue";
import PlusIcon from "../assets/img/icons/plus-small.svg";

export default defineComponent({
  components: {
    Button,
    Tooltip,
    PlusIcon,
  },
  inheritAttrs: false,
  props: {
    /**
     * @see {@link Button.vue}
     */

    /**
     * Button's title rendered as tooltip
     * if null, the tooltip won't be rendered
     */
    title: {
      type: String,
      default: null,
    },
  },
});
<\/script>

<template>
  <Component :is="title ? 'Tooltip' : 'div'" :text="title">
    <Button class="plus-button" v-bind="$attrs">
      <PlusIcon />
    </Button>
  </Component>
</template>

<style lang="postcss" scoped>
.tooltip {
  width: 60px;
}

.plus-button {
  --theme-button-border-radius: 9999px;

  width: 60px;
  height: 60px;
  border: 0;
  cursor: pointer;
  background-color: transparent;
  box-shadow:
    0 0 10px var(--knime-gray-dark-semi),
    0 0 4px var(--knime-gray-dark-semi);
  display: flex;
  justify-content: center;

  &:hover {
    box-shadow:
      0 0 10px var(--knime-gray-dark-semi),
      0 0 10px var(--knime-gray-dark-semi);
  }

  &.button {
    display: flex;

    & :deep(svg) {
      width: 60px;
      height: 60px;
      stroke: var(--knime-dove-gray);
      stroke-width: calc(32px / 60);
      position: absolute;
      margin: 0;
      top: 0;
    }
  }

  &.primary:hover {
    background-color: var(--theme-button-background-color);

    & :deep(svg) {
      stroke: var(--theme-button-foreground-color);
    }
  }
}
</style>
`,A=`
  <PlusButton title="Plus button"/>

  <PlusButton
    title="Plus button on dark"
    on-dark
    with-border
  />

  <PlusButton
    title="Primary plus button"
    primary
  />

  <PlusButton
    title="Primary plus button on dark"
    primary
    on-dark
  />

  <PlusButton
    title="Disabled plus button"
    primary
    disabled
  />
`,N={components:{PlusButton:D,CodeExample:h},data(){return{PlusButtonCode:j,buttonCode:P,codeExample:A}}},V={class:"grid-container"},M={class:"grid-item-12"},q={class:"wrapper"},z={class:"background"},F={class:"background"};function G(e,d,_,b,a,f){const n=i("PlusButton",!0),s=i("CodeExample");return p(),c("section",null,[o("div",V,[o("div",M,[o("div",q,[t(n,{title:"Plus button"}),o("div",z,[t(n,{title:"Plus button on dark","on-dark":!0,"with-border":""})]),t(n,{title:"Primary plus button",primary:""}),o("div",F,[t(n,{title:"Primary plus button on dark",primary:"","on-dark":!0})]),t(n,{title:"Disabled plus button",primary:"",disabled:""})]),t(s,{summary:"Show usage example"},{default:r(()=>[l(u(a.codeExample),1)]),_:1}),t(s,{summary:"Show PlusButton.vue source code"},{default:r(()=>[l(u(a.PlusButtonCode),1)]),_:1}),t(s,{summary:"Show Button.vue source code"},{default:r(()=>[l(u(a.buttonCode),1)]),_:1})])])])}const O=m(N,[["render",G],["__scopeId","data-v-d4cf8648"]]);export{O as default};
