import{C as r}from"./CodeExample-35ef23ba.js";import{L as l}from"./LoadingIcon-66bf69fc.js";import{_ as m,r as a,o as _,c as g,b as n,d as e,w as c,e as i,t as d,p as u,f}from"./index-3921be4d.js";import"./svgWithTitle-96bc1be4.js";const I=`<script>
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
`;const x=`
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
`,h={components:{LoadingIcon:l,CodeExample:r},data(){return{code:I,codeExample:x}}},v=o=>(u("data-v-aeb9bcf2"),o=o(),f(),o),L={class:"grid-container"},y={class:"grid-item-12"},b=v(()=>n("p",null,"Animated loading icon",-1));function w(o,k,C,E,t,S){const p=a("LoadingIcon",!0),s=a("CodeExample");return _(),g("section",null,[n("div",L,[n("div",y,[b,e(p,{class:"loading-icon"}),e(s,{summary:"Show usage example"},{default:c(()=>[i(d(t.codeExample),1)]),_:1}),e(s,{summary:"Show LoadingIcon.vue source code"},{default:c(()=>[i(d(t.code),1)]),_:1})])])])}const V=m(h,[["render",w],["__scopeId","data-v-aeb9bcf2"]]);export{V as default};
