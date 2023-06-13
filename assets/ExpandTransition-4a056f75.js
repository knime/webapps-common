import{C as m}from"./CodeExample-7f44cb71.js";import{E as x}from"./ExpandTransition-f57b5a5d.js";import{B as h}from"./Button-233165dd.js";import{_ as u,o as E,c as f,b as e,d as t,w as o,e as a,x as g,y as v,t as p,r as i,p as y,f as T}from"./index-fc2ac7a6.js";const B=`<script>
export default {
  props: {
    isExpanded: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onBeforeEnter(el) {
      el.style.height = 0;
    },
    onEnter(el) {
      el.style.height = \`\${el.scrollHeight}px\`;
    },
    onAfterEnter(el) {
      el.style.height = "";
    },
    onBeforeLeave(el) {
      el.style.height = \`\${el.scrollHeight}px\`;
      // force repaint to trigger animation correctly
      getComputedStyle(el).height; // eslint-disable-line no-unused-expressions
    },
    onLeave(el) {
      el.style.height = 0;
    },
  },
};
<\/script>

<template>
  <Transition
    name="expand"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-enter="onAfterEnter"
  >
    <div v-show="isExpanded" class="panel">
      <slot />
    </div>
  </Transition>
</template>

<style lang="postcss" scoped>
.panel {
  transition: height 0.4s ease-in-out;
  overflow: hidden;
}
</style>
`;const C={components:{ExpandTransition:x,Button:h,CodeExample:m},data(){return{isExpanded:!1,codeExample:`<ExpandTransition :is-expanded="isExpanded" >
    <p>Lorem ipsum…</p>
</ExpandTransition>`}},computed:{code(){return B}},methods:{onClick(){this.isExpanded=!this.isExpanded}}},l=n=>(y("data-v-13b7da69"),n=n(),T(),n),w={class:"grid-container"},b={class:"grid-item-12"},k={class:"grid-container demo"},S={class:"grid-item-3 content"},L=l(()=>e("h5",null,"Expand Transition",-1)),I=l(()=>e("div",null,[e("p",null,"Lorem ipsum…")],-1));function K(n,N,V,A,d,s){const c=i("Button"),_=i("ExpandTransition",!0),r=i("CodeExample");return E(),f("section",null,[e("div",w,[e("div",b,[e("div",k,[t(c,{compact:"",primary:"",onClick:s.onClick,onKeydown:g(v(s.onClick,["stop","prevent"]),["space"])},{default:o(()=>[a(" Trigger Expand ")]),_:1},8,["onClick","onKeydown"]),e("div",S,[L,t(_,{"is-expanded":d.isExpanded},{default:o(()=>[I]),_:1},8,["is-expanded"])])]),t(r,{summary:"Show usage example"},{default:o(()=>[a(p(d.codeExample),1)]),_:1}),t(r,{summary:"Show ExpandTransition.vue source code"},{default:o(()=>[a(p(s.code),1)]),_:1})])])])}const j=u(C,[["render",K],["__scopeId","data-v-13b7da69"]]);export{j as default};
