import{C as m}from"./CodeExample-7b407f07.js";import{E as x}from"./ExpandTransition-733bcc7a.js";import{B as h}from"./Button-476898be.js";import{_ as u,r as a,o as E,c as f,b as e,d as t,w as o,e as i,x as g,y as v,t as p,p as y,f as T}from"./index-0daf2d62.js";const B=`<script>

export default {
    props: {
        isExpanded: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onBeforeEnter(el) {
            el.style.height = 0;
        },
        onEnter(el) {
            el.style.height = \`\${el.scrollHeight}px\`;
        },
        onAfterEnter(el) {
            el.style.height = '';
        },
        onBeforeLeave(el) {
            el.style.height = \`\${el.scrollHeight}px\`;
            // force repaint to trigger animation correctly
            getComputedStyle(el).height; // eslint-disable-line no-unused-expressions
        },
        onLeave(el) {
            el.style.height = 0;
        }
    }
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
    <div
      v-show="isExpanded"
      class="panel"
    >
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
</ExpandTransition>`}},computed:{code(){return B}},methods:{onClick(){this.isExpanded=!this.isExpanded}}},d=n=>(y("data-v-7d4492e2"),n=n(),T(),n),w={class:"grid-container"},k={class:"grid-item-12"},S=d(()=>e("h2",null,"ExpandTransition",-1)),L={class:"grid-container demo"},b={class:"grid-item-3 content"},I=d(()=>e("h5",null,"Expand Transition",-1)),K=d(()=>e("div",null,[e("p",null,"Lorem ipsum…")],-1));function N(n,V,A,H,r,s){const c=a("Button"),_=a("ExpandTransition",!0),l=a("CodeExample");return E(),f("section",null,[e("div",w,[e("div",k,[S,e("div",L,[t(c,{compact:"",primary:"",onClick:s.onClick,onKeydown:g(v(s.onClick,["stop","prevent"]),["space"])},{default:o(()=>[i(" Trigger Expand ")]),_:1},8,["onClick","onKeydown"]),e("div",b,[I,t(_,{"is-expanded":r.isExpanded},{default:o(()=>[K]),_:1},8,["is-expanded"])])]),t(l,{summary:"Show usage example"},{default:o(()=>[i(p(r.codeExample),1)]),_:1}),t(l,{summary:"Show ExpandTransition.vue source code"},{default:o(()=>[i(p(s.code),1)]),_:1})])])])}const q=u(C,[["render",N],["__scopeId","data-v-7d4492e2"]]);export{q as default};
