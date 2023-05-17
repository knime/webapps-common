import{C as I}from"./CodeExample-ce65ae3a.js";import{o as a,c as _,b as n,_ as m,r as c,j as v,d as s,w as p,e as r,t as l,p as x,f as L}from"./index-aa2cfa53.js";import{s as w}from"./svgWithTitle-6e08061e.js";const y={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},$=n("path",{d:"m11.9 22.3 2.7 4.4-4.5 2.8m4.5-2.8C9 26 4.7 21.7 4.7 16c0-5.1 3.4-9.4 8.1-10.8M20 9.7l-2.6-4.4 4.5-2.8m-4.5 2.8c5.6.7 9.9 5 9.9 10.7 0 5.1-3.4 9.4-8.1 10.8"},null,-1),k=[$];function R(o,i){return a(),_("svg",y,k)}const C={render:R};const E={components:{ReloadIcon:w(C,"Loading…")}};function S(o,i,u,f,e,h){const t=c("ReloadIcon");return a(),v(t)}const B=m(E,[["render",S],["__scopeId","data-v-a882068f"]]),T=`<script>
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
`;const W=`
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
`,N={components:{LoadingIcon:B,CodeExample:I},data(){return{code:T,codeExample:W}}},g=o=>(x("data-v-f0d7f220"),o=o(),L(),o),V={class:"grid-container"},b={class:"grid-item-12"},j=g(()=>n("h2",null,"LoadingIcon",-1)),A=g(()=>n("p",null,"Animated loading icon",-1));function D(o,i,u,f,e,h){const t=c("LoadingIcon",!0),d=c("CodeExample");return a(),_("section",null,[n("div",V,[n("div",b,[j,A,s(t,{class:"loading-icon"}),s(d,{summary:"Show usage example"},{default:p(()=>[r(l(e.codeExample),1)]),_:1}),s(d,{summary:"Show LoadingIcon.vue source code"},{default:p(()=>[r(l(e.code),1)]),_:1})])])])}const F=m(N,[["render",D],["__scopeId","data-v-f0d7f220"]]);export{F as default};
