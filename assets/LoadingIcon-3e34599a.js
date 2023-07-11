import{C as I}from"./CodeExample-2463251c.js";import{o as a,c as _,b as n,_ as m,r as c,j as h,d as s,w as p,e as r,t as l,p as v,f as x}from"./index-4e987e65.js";import{s as L}from"./svgWithTitle-b6ee9971.js";const w={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},y=n("path",{d:"m11.9 22.3 2.7 4.4-4.5 2.8m4.5-2.8C9 26 4.7 21.7 4.7 16c0-5.1 3.4-9.4 8.1-10.8M20 9.7l-2.6-4.4 4.5-2.8m-4.5 2.8c5.6.7 9.9 5 9.9 10.7 0 5.1-3.4 9.4-8.1 10.8"},null,-1),$=[y];function k(o,i){return a(),_("svg",w,$)}const b={render:k};const R={components:{ReloadIcon:L(b,"Loading…")}};function C(o,i,g,u,e,f){const t=c("ReloadIcon");return a(),h(t)}const E=m(R,[["render",C],["__scopeId","data-v-a882068f"]]),S=`<script>
import ReloadIcon from "../../ui/assets/img/icons/reload.svg";
import svgWithTitle from "../../ui/util/svgWithTitle";

export default {
  components: {
    ReloadIcon: svgWithTitle(ReloadIcon, "Loading…"),
  },
};
<\/script>

<template>
  <ReloadIcon />
</template>

<style type="postcss" scoped>
@keyframes spin {
  100% {
    transform: rotate(-360deg);
  }
}

svg {
  animation: spin 2s linear infinite;
}
</style>
`;const B=`
<script>
import LoadingIcon from '~/webapps-common/ui/components/LoadingIcon.vue';

export default {
    components: {
        LoadingIcon
    }
};
<\/script>

<template>
  <LoadingIcon class="loading-icon" />
</template>

<style lang="postcss" scoped>
  .loading-icon {
    width: 24px;
    height: 24px;
    stroke-width: calc(32px / 24);
    margin: auto;
    stroke: var(--knime-masala);
  }
</style>
`,T={components:{LoadingIcon:E,CodeExample:I},data(){return{code:S,codeExample:B}}},W=o=>(v("data-v-aeb9bcf2"),o=o(),x(),o),N={class:"grid-container"},V={class:"grid-item-12"},j=W(()=>n("p",null,"Animated loading icon",-1));function A(o,i,g,u,e,f){const t=c("LoadingIcon",!0),d=c("CodeExample");return a(),_("section",null,[n("div",N,[n("div",V,[j,s(t,{class:"loading-icon"}),s(d,{summary:"Show usage example"},{default:p(()=>[r(l(e.codeExample),1)]),_:1}),s(d,{summary:"Show LoadingIcon.vue source code"},{default:p(()=>[r(l(e.code),1)]),_:1})])])])}const z=m(T,[["render",A],["__scopeId","data-v-aeb9bcf2"]]);export{z as default};
