import{C as g}from"./CodeExample-247a9bac.js";import{B as I}from"./Button-22f9dbe9.js";import{o as d,c as s,b as e,_ as v,A as C,r as u,j as y,w as m,n as k,u as b,l as r,e as h,t as c,k as D,F as S,g as T,d as _,p as R,f as M}from"./index-9feadc92.js";const O=`<script>
import Button from "./Button.vue";
import DownIcon from "../assets/img/icons/circle-arrow-down.svg";
import { resolveClientOnlyComponent } from "../util/nuxtComponentResolver";

export default {
  components: {
    Button,
    DownIcon,
  },
  props: {
    /**
     * Indicate idle state, e.g. loading
     */
    idle: {
      type: Boolean,
      default: false,
    },
    /**
     * Idle text
     */
    idleText: {
      type: String,
      default: "Loading...",
    },
    /**
     * Should the button be ready
     */
    ready: {
      type: Boolean,
      default: true,
    },
    /**
     * Button ready text
     */
    readyText: {
      type: String,
      default: "More results",
    },
    /**
     * \`true\` to render an arrow icon with the readyText. Defaults to \`false\`.
     */
    withDownIcon: {
      type: Boolean,
      default: false,
    },
    /**
     * show button with border
     */
    withBorder: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["click"],
  computed: {
    // TODO: Can be made into a composition function
    clientOnlyComponent() {
      return resolveClientOnlyComponent();
    },
    text() {
      if (this.idle) {
        return this.idleText;
      } else if (this.ready) {
        return this.readyText;
      }
      return "";
    },
  },
};
<\/script>

<template>
  <div v-if="idle || ready" class="load-more">
    <Component :is="clientOnlyComponent">
      <div :class="{ idle }">
        <Button
          v-if="ready || idle"
          compact
          :with-border="withBorder"
          :disabled="idle"
          @click="$emit('click')"
        >
          <slot v-if="ready" name="readyIcon" />
          {{ text }}
          <DownIcon v-if="withDownIcon && !idle" />
        </Button>
      </div>
    </Component>
  </div>
</template>

<style lang="postcss" scoped>
.load-more {
  min-height: 85px;
  padding-top: 30px;
  display: flex;
  justify-content: center;

  & .idle {
    cursor: progress;
  }

  & button:hover,
  & button:focus,
  & button:active {
    color: var(--knime-white);
    outline: none;
  }
}
</style>
`,E={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},L=e("circle",{cx:"16",cy:"16",r:"13"},null,-1),N=e("path",{d:"M22.8 16.6 16 23.4l-6.8-6.8m6.8 6.8v-15"},null,-1),V=[L,N];function j(n,o){return d(),s("svg",E,V)}const $={render:j};const z={components:{Button:I,DownIcon:$},props:{idle:{type:Boolean,default:!1},idleText:{type:String,default:"Loading..."},ready:{type:Boolean,default:!0},readyText:{type:String,default:"More results"},withDownIcon:{type:Boolean,default:!1},withBorder:{type:Boolean,default:!0}},emits:["click"],computed:{clientOnlyComponent(){return C()},text(){return this.idle?this.idleText:this.ready?this.readyText:""}}},F={key:0,class:"load-more"};function A(n,o,t,x,i,l){const p=u("DownIcon"),a=u("Button");return t.idle||t.ready?(d(),s("div",F,[(d(),y(D(l.clientOnlyComponent),null,{default:m(()=>[e("div",{class:k({idle:t.idle})},[t.ready||t.idle?(d(),y(a,{key:0,compact:"","with-border":t.withBorder,disabled:t.idle,onClick:o[0]||(o[0]=w=>n.$emit("click"))},{default:m(()=>[t.ready?b(n.$slots,"readyIcon",{key:0},void 0,!0):r("",!0),h(" "+c(l.text)+" ",1),t.withDownIcon&&!t.idle?(d(),y(p,{key:1})):r("",!0)]),_:3},8,["with-border","disabled"])):r("",!0)],2)]),_:3}))])):r("",!0)}const q=v(z,[["render",A],["__scopeId","data-v-e2fceafa"]]);const G=`<IdleReadyButton
  :idle="ready"
  :show="showMore"
  text="Show more"
  @click="onMore"
/>`,f=4,H=11,J={components:{CodeExample:g,IdleReadyButton:q},data(){return{codeExample:G,code:O,pageSize:f,offset:f,idle:!1}},computed:{demoItems(){const n=[];for(let o=0;o<this.offset;o++)n.push({name:`Item-${o+1}`});return n},showMore(){return this.offset<H}},methods:{onMore(){this.idle=!0,setTimeout(()=>{this.offset+=f,this.idle=!1},1e3)}}},K=n=>(R("data-v-75cd4021"),n=n(),M(),n),P=K(()=>e("section",null,[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,"Button with two states:"),e("ul",null,[e("li",null,"idle (e.g. while loading)"),e("li",null,"and ready")]),e("p",null," Ready and idle states are set with props, as well as the idle text and ready text. ")])])],-1)),Q={class:"demo"},U={class:"grid-container"},W={class:"grid-item-12"},X={class:"grid-container"},Y={class:"grid-item-12"};function Z(n,o,t,x,i,l){const p=u("IdleReadyButton",!0),a=u("CodeExample");return d(),s("div",null,[P,e("section",Q,[e("div",U,[e("div",W,[e("ul",null,[(d(!0),s(S,null,T(l.demoItems,(w,B)=>(d(),s("li",{key:B},c(w.name),1))),128))]),_(p,{ready:l.showMore,idle:i.idle,onClick:l.onMore},null,8,["ready","idle","onClick"])])])]),e("section",null,[e("div",X,[e("div",Y,[_(a,{summary:"Show usage example"},{default:m(()=>[h(c(i.codeExample),1)]),_:1}),_(a,{summary:"Show IdleReadyButton.vue source code"},{default:m(()=>[h(c(i.code),1)]),_:1})])])])])}const oe=v(J,[["render",Z],["__scopeId","data-v-75cd4021"]]);export{oe as default};
