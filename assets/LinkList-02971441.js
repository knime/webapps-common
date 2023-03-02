import{C as x}from"./CodeExample-ab3ea217.js";import{o as e,c as o,b as s,q as v,_ as k,r as a,F as w,g as y,d as r,e as c,t as d,l as u,w as m}from"./index-19536967.js";const L={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},b=s("path",{d:"M17.3 3.3 30 16 17.3 28.7M30 16H2"},null,-1),$=[b];function I(t,p){return e(),o("svg",L,$)}const E={render:I},A=v({components:{ArrowIcon:E},props:{links:{type:Array,default:()=>[]}}});const C={key:0,class:"link-list"},N=["href"];function M(t,p,_,h,g,i){const l=a("ArrowIcon");return t.links&&t.links.length?(e(),o("ul",C,[(e(!0),o(w,null,y(t.links,(n,f)=>(e(),o("li",{key:f},[n.url?(e(),o("a",{key:0,href:n.url,rel:"ugc noopener"},[r(l),c(" "+d(n.text||n.url),1)],8,N)):u("",!0)]))),128))])):u("",!0)}const z=k(A,[["render",M],["__scopeId","data-v-5d44b221"]]),B=`<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import ArrowIcon from '../assets/img/icons/arrow-right.svg';

interface LinkItem {
  text: string;
  url: string;
}

/**
 * Renders a list of clickable links displayed with an arrow icon and text
 *
 * Example:
 * -> Google
 * -> KNIME Hub
*/
export default defineComponent({
    components: {
        ArrowIcon
    },
    props: {
        links: {
            type: Array as PropType<Array<LinkItem>>,
            default: () => []
        }
    }
});
<\/script>

<template>
  <ul
    v-if="links && links.length"
    class="link-list"
  >
    <li
      v-for="(link, index) of links"
      :key="index"
    >
      <a
        v-if="link.url"
        :href="link.url"
        rel="ugc noopener"
      >
        <ArrowIcon />
        {{ link.text || link.url }}
      </a>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
ul {
  --icon-size: 18px;
  --icon-spacing: 6px;

  list-style: none;
  padding: 0;
  column-count: 2;
  column-gap: 24px;
  font-weight: 500;

  & li {
    padding-left: calc(var(--icon-size) + var(--icon-spacing));
    margin-bottom: 8px;
    position: relative;
    display: block;
    text-overflow: ellipsis;
  }

  & a {
    color: var(--knime-dove-gray);
    line-height: 20px;
    text-decoration: none;
    overflow-wrap: break-word;
    display: inline-block;
    width: 100%; /* Works together with break-word. Use instead of overflow:hidden which invokes a bug in chrome. */

    & svg {
      position: absolute;
      stroke: var(--knime-dove-gray);
      width: var(--icon-size);
      height: var(--icon-size);
      stroke-width: calc(32px / 18);
      left: 0;
    }

    &:hover,
    &:focus,
    &:active {
      outline: none;
      color: var(--knime-masala);
      text-decoration: none;

      & svg {
        stroke: var(--knime-masala);
      }
    }
  }
}
</style>
`,H=`<LinkList
  :links="[
    { text: 'Google', url: 'https://google.com' },
    { text: 'KNIME Hub', url: 'https://hub.knime.com' }
  ]"
/>`,V={components:{LinkList:z,CodeExample:x},computed:{codeExample(){return H},code(){return B}}},G={class:"grid-container"},K={class:"grid-item-12"},S=s("h2",null,"LinkList",-1),T=s("p",null," A list of clickable links displayed with an arrow icon and text. On small screens there is one column of links. On larger screens there are two. ",-1);function F(t,p,_,h,g,i){const l=a("LinkList",!0),n=a("CodeExample");return e(),o("section",null,[s("div",G,[s("div",K,[S,T,r(l,{links:[{text:"Google",url:"https://google.com"},{text:"KNIME Hub",url:"https://hub.knime.com"}]},null,8,["links"]),r(n,{summary:"Show usage example"},{default:m(()=>[c(d(i.codeExample),1)]),_:1}),r(n,{summary:"Show LinkList.vue source code"},{default:m(()=>[c(d(i.code),1)]),_:1})])])])}const j=k(V,[["render",F]]);export{j as default};
