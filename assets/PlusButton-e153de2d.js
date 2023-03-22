import{C as b}from"./CodeExample-ac577fc1.js";import{B as f}from"./Button-45dc88cf.js";import{T as k}from"./Tooltip-1d572e3d.js";import{o as p,c,b as e,q as B,_ as m,r as u,j as g,w as r,d as t,v as x,k as y,e as l,t as i,p as P,f as w}from"./index-69379855.js";import{b as C}from"./Button-236caf6c.js";const $={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#3E3A39",viewBox:"0 0 32 32"},I=e("path",{"stroke-linejoin":"round","stroke-miterlimit":"10",d:"M8.417 16h15.166M16 8.417v15.166"},null,-1),S=[I];function T(n,d){return p(),c("svg",$,S)}const E={render:T},D=B({components:{Button:f,Tooltip:k,PlusIcon:E},inheritAttrs:!1,props:{title:{type:String,default:null}}});function j(n,d,_,h,a,v){const o=u("PlusIcon"),s=u("Button");return p(),g(y(n.title?"Tooltip":"div"),{text:n.title},{default:r(()=>[t(s,x({class:"plus-button"},n.$attrs),{default:r(()=>[t(o)]),_:1},16)]),_:1},8,["text"])}const A=m(D,[["render",j],["__scopeId","data-v-05ccee43"]]),N=`<script lang="ts">
import { defineComponent } from 'vue';
import Button from './Button.vue';
import Tooltip from './Tooltip.vue';
import PlusIcon from '../assets/img/icons/plus-small.svg';

export default defineComponent({
    components: {
        Button,
        Tooltip,
        PlusIcon
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
            default: null
        }
    }
});
<\/script>

<template>
  <Component
    :is="title ? 'Tooltip' : 'div'"
    :text="title"
  >
    <Button
      class="plus-button"
      v-bind="$attrs"
    >
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
  box-shadow: 0 0 10px var(--knime-gray-dark-semi), 0 0 4px var(--knime-gray-dark-semi);
  display: flex;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 10px var(--knime-gray-dark-semi), 0 0 10px var(--knime-gray-dark-semi);
  }

  & :deep(svg) {
    width: 60px;
    height: 60px;
    stroke: var(--knime-dove-gray);
    stroke-width: calc(32px / 60);
    position: absolute;
    margin: 0;
    top: 0;
  }

  &.primary:hover {
    background-color: var(--theme-button-background-color);

    & :deep(svg) {
      stroke: var(--theme-button-foreground-color);
    }
  }
}
</style>
`;const V=`
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
`,M={components:{PlusButton:A,CodeExample:b},data(){return{PlusButtonCode:N,buttonCode:C,codeExample:V}}},q=n=>(P("data-v-0c47a172"),n=n(),w(),n),z={class:"grid-container"},F={class:"grid-item-12"},G=q(()=>e("h2",null,"PlusButton",-1)),H={class:"wrapper"},J={class:"background"},K={class:"background"};function L(n,d,_,h,a,v){const o=u("PlusButton",!0),s=u("CodeExample");return p(),c("section",null,[e("div",z,[e("div",F,[G,e("div",H,[t(o,{title:"Plus button"}),e("div",J,[t(o,{title:"Plus button on dark","on-dark":!0,"with-border":""})]),t(o,{title:"Primary plus button",primary:""}),e("div",K,[t(o,{title:"Primary plus button on dark",primary:"","on-dark":!0})]),t(o,{title:"Disabled plus button",primary:"",disabled:""})]),t(s,{summary:"Show usage example"},{default:r(()=>[l(i(a.codeExample),1)]),_:1}),t(s,{summary:"Show PlusButton.vue source code"},{default:r(()=>[l(i(a.PlusButtonCode),1)]),_:1}),t(s,{summary:"Show Button.vue source code"},{default:r(()=>[l(i(a.buttonCode),1)]),_:1})])])])}const X=m(M,[["render",L],["__scopeId","data-v-0c47a172"]]);export{X as default};
