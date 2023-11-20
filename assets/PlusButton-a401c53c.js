import{C as f}from"./CodeExample-76f94125.js";import{B as v}from"./Button-503170ef.js";import{q as y,T as P,_ as p,r as l,o as d,j as h,w as s,d as t,v as B,k,c as x,b as e,e as u,t as i}from"./index-98b2ef52.js";import{P as g}from"./plus-small-9f359c23.js";import{b as C}from"./Button-7a63cb3d.js";const w=y({components:{Button:v,Tooltip:P,PlusIcon:g},inheritAttrs:!1,props:{title:{type:String,default:null}}});function $(r,c,m,_,a,b){const n=l("PlusIcon"),o=l("Button");return d(),h(k(r.title?"Tooltip":"div"),{text:r.title},{default:s(()=>[t(o,B({class:"plus-button"},r.$attrs),{default:s(()=>[t(n)]),_:1},16)]),_:1},8,["text"])}const I=p(w,[["render",$],["__scopeId","data-v-8570bfe7"]]),T=`<script lang="ts">
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
`;const S=`
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
`,E={components:{PlusButton:I,CodeExample:f},data(){return{PlusButtonCode:T,buttonCode:C,codeExample:S}}},D={class:"grid-container"},N={class:"grid-item-12"},V={class:"wrapper"},j={class:"background"},A={class:"background"};function q(r,c,m,_,a,b){const n=l("PlusButton",!0),o=l("CodeExample");return d(),x("section",null,[e("div",D,[e("div",N,[e("div",V,[t(n,{title:"Plus button"}),e("div",j,[t(n,{title:"Plus button on dark","on-dark":!0,"with-border":""})]),t(n,{title:"Primary plus button",primary:""}),e("div",A,[t(n,{title:"Primary plus button on dark",primary:"","on-dark":!0})]),t(n,{title:"Disabled plus button",primary:"",disabled:""})]),t(o,{summary:"Show usage example"},{default:s(()=>[u(i(a.codeExample),1)]),_:1}),t(o,{summary:"Show PlusButton.vue source code"},{default:s(()=>[u(i(a.PlusButtonCode),1)]),_:1}),t(o,{summary:"Show Button.vue source code"},{default:s(()=>[u(i(a.buttonCode),1)]),_:1})])])])}const K=p(E,[["render",q],["__scopeId","data-v-cad4e619"]]);export{K as default};
