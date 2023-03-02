import{C as v}from"./CodeExample-ab3ea217.js";import{B as x}from"./Button-33718cfd.js";import{T as k}from"./Tooltip-aa7d8f45.js";import{o as p,c as m,b as e,_,r as u,j as B,w as r,d as t,v as f,k as g,e as i,t as d,p as y,f as P}from"./index-19536967.js";import{b as w}from"./Button-a2b135c6.js";const C={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#3E3A39",viewBox:"0 0 32 32"},I=e("path",{"stroke-linejoin":"round","stroke-miterlimit":"10",d:"M8.417 16h15.166M16 8.417v15.166"},null,-1),$=[I];function S(n,c){return p(),m("svg",C,$)}const T={render:S};const E={components:{Button:x,Tooltip:k,PlusIcon:T},props:{title:{type:String,default:null}}};function D(n,c,l,b,a,h){const o=u("PlusIcon"),s=u("Button");return p(),B(g(l.title?"Tooltip":"div"),{text:l.title},{default:r(()=>[t(s,f({class:"plus-button"},n.$attrs),{default:r(()=>[t(o)]),_:1},16)]),_:1},8,["text"])}const j=_(E,[["render",D],["__scopeId","data-v-5b02d806"]]),N=`<script>
import Button from './Button.vue';
import Tooltip from './Tooltip.vue';
import PlusIcon from '../assets/img/icons/plus-small.svg';

export default {
    components: {
        Button,
        Tooltip,
        PlusIcon
    },
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
};
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
`,M={components:{PlusButton:j,CodeExample:v},data(){return{PlusButtonCode:N,buttonCode:w,codeExample:V}}},A=n=>(y("data-v-873d8a71"),n=n(),P(),n),q={class:"grid-container"},z={class:"grid-item-12"},F=A(()=>e("h2",null,"PlusButton",-1)),G={class:"wrapper"},H={class:"background"},J={class:"background"};function K(n,c,l,b,a,h){const o=u("PlusButton",!0),s=u("CodeExample");return p(),m("section",null,[e("div",q,[e("div",z,[F,e("div",G,[t(o,{title:"Plus button"}),e("div",H,[t(o,{title:"Plus button on dark","on-dark":"","with-border":""})]),t(o,{title:"Primary plus button",primary:""}),e("div",J,[t(o,{title:"Primary plus button on dark",primary:"","on-dark":""})]),t(o,{title:"Disabled plus button",primary:"",disabled:""})]),t(s,{summary:"Show usage example"},{default:r(()=>[i(d(a.codeExample),1)]),_:1}),t(s,{summary:"Show PlusButton.vue source code"},{default:r(()=>[i(d(a.PlusButtonCode),1)]),_:1}),t(s,{summary:"Show Button.vue source code"},{default:r(()=>[i(d(a.buttonCode),1)]),_:1})])])])}const W=_(M,[["render",K],["__scopeId","data-v-873d8a71"]]);export{W as default};
