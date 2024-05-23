import{C as r}from"./CodeExample-paad31RA.js";import{L as l}from"./LoadingIcon-eoswyz_y.js";import{_ as m,r as a,o as g,c as u,b as n,d as e,w as c,e as i,t as p,p as _,f}from"./index-I9l7b4pS.js";import"./svgWithTitle-Ta6Tvzje.js";const I=`<script>
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
    transform: scaleY(-1) rotate(-360deg);
  }
}

svg {
  transform: scaleY(-1);
  animation: spin 2s linear infinite;
}
</style>
`,h=`
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
`,x={components:{LoadingIcon:l,CodeExample:r},data(){return{code:I,codeExample:h}}},v=o=>(_("data-v-aeb9bcf2"),o=o(),f(),o),L={class:"grid-container"},y={class:"grid-item-12"},w=v(()=>n("p",null,"Animated loading icon",-1));function b(o,k,C,E,t,S){const d=a("LoadingIcon",!0),s=a("CodeExample");return g(),u("section",null,[n("div",L,[n("div",y,[w,e(d,{class:"loading-icon"}),e(s,{summary:"Show usage example"},{default:c(()=>[i(p(t.codeExample),1)]),_:1}),e(s,{summary:"Show LoadingIcon.vue source code"},{default:c(()=>[i(p(t.code),1)]),_:1})])])])}const V=m(x,[["render",b],["__scopeId","data-v-aeb9bcf2"]]);export{V as default};
