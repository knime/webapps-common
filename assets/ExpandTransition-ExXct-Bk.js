import{C as h}from"./CodeExample-g9VWYbMy.js";import{E as x}from"./ExpandTransition-79xGUrMM.js";import{B as _}from"./Button-WI8MN0_n.js";import{_ as u,r as a,o as f,c as E,b as e,d as t,w as o,e as i,x as g,y as v,t as l,p as y,f as T}from"./index-CT8S6amr.js";const B=`<script>
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
`,C={components:{ExpandTransition:x,Button:_,CodeExample:h},data(){return{isExpanded:!1,codeExample:`<ExpandTransition :is-expanded="isExpanded" >
    <p>Lorem ipsum…</p>
</ExpandTransition>`}},computed:{code(){return B}},methods:{onClick(){this.isExpanded=!this.isExpanded}}},p=n=>(y("data-v-13b7da69"),n=n(),T(),n),w={class:"grid-container"},k={class:"grid-item-12"},S={class:"grid-container demo"},b={class:"grid-item-3 content"},L=p(()=>e("h5",null,"Expand Transition",-1)),I=p(()=>e("div",null,[e("p",null,"Lorem ipsum…")],-1));function K(n,N,V,A,d,s){const c=a("Button"),m=a("ExpandTransition",!0),r=a("CodeExample");return f(),E("section",null,[e("div",w,[e("div",k,[e("div",S,[t(c,{compact:"",primary:"",onClick:s.onClick,onKeydown:g(v(s.onClick,["stop","prevent"]),["space"])},{default:o(()=>[i(" Trigger Expand ")]),_:1},8,["onClick","onKeydown"]),e("div",b,[L,t(m,{"is-expanded":d.isExpanded},{default:o(()=>[I]),_:1},8,["is-expanded"])])]),t(r,{summary:"Show usage example"},{default:o(()=>[i(l(d.codeExample),1)]),_:1}),t(r,{summary:"Show ExpandTransition.vue source code"},{default:o(()=>[i(l(s.code),1)]),_:1})])])])}const j=u(C,[["render",K],["__scopeId","data-v-13b7da69"]]);export{j as default};
