import{C as _}from"./CodeExample-voz5mpKt.js";import{u as m,V as g,G as v,o as c,c as d,x,_ as f,b as e,d as n,w as s,e as l,Z as u,t as h,p as w,f as y}from"./index-0QpXqIR8.js";import{W as P,P as C}from"./knimeColors-ODfrymY5.js";const b={class:"pill"},$=m({__name:"Pill",props:{color:{default:"gray"}},setup(o){g(a=>({"78d07e2a":p.value}));const i=o,p=v(()=>({white:P,gray:C})[i.color]);return(a,F)=>(c(),d("div",b,[x(a.$slots,"default")]))}}),r=f($,[["__scopeId","data-v-a853fec1"]]),W={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},k=e("path",{d:"M3.064 18.429h4.421l4.03-12.12 6.816 19.382 4.71-13.458 1.74 6.196h4.155"},null,-1),S=[k];function I(o,i){return c(),d("svg",W,[...S])}const V={render:I},B=`<script setup lang="ts">
import { computed } from "vue";
// @ts-ignore
import * as $colors from "../colors/knimeColors.mjs";

type Color = "white" | "gray";

type Props = {
  color?: Color;
};

const props = withDefaults(defineProps<Props>(), {
  color: "gray",
});

const color = computed(() => {
  const mapper: Record<Color, string> = {
    white: $colors.White,
    gray: $colors.Porcelain,
  };

  return mapper[props.color];
});
<\/script>

<template>
  <div class="pill"><slot /></div>
</template>

<style lang="postcss" scoped>
@import url("../css/mixins.css");

.pill {
  --pill-height: 20px;

  border-radius: 9999px;
  height: var(--pill-height);
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  background: v-bind(color);
  width: max-content;
  font-size: 13px;
  font-weight: 500;

  & :slotted(svg) {
    margin-right: 4px;

    @mixin svg-icon-size 12;
  }
}
</style>
`,t=o=>(w("data-v-f7d5b34e"),o=o(),y(),o),D={class:"grid-container"},H={class:"grid-item-12"},j=t(()=>e("p",null,"A pill to indicate some special information",-1)),E={class:"examples"},N=t(()=>e("i",{class:"node"}," The dashed containers are just to make the pill visible ",-1)),T=t(()=>e("br",null,null,-1)),z={class:"default"},A=t(()=>e("span",null,"Default style:",-1)),R={class:"white"},G=t(()=>e("span",null,"With white color variant",-1)),L={class:"default"},M=t(()=>e("span",null,"The content can be whatever you need:",-1)),O=t(()=>e("b",null,[l("Hello "),e("i",null,"WORLD")],-1)),Z=`<Pill>Hello World</Pill>
`,q=m({__name:"Pill",setup(o){return(i,p)=>(c(),d("section",null,[e("div",D,[e("div",H,[j,e("div",E,[N,T,e("div",z,[A,n(r,null,{default:s(()=>[l("Hello World")]),_:1})]),e("div",R,[G,n(r,{color:"white"},{default:s(()=>[l("Hello White World")]),_:1})]),e("div",L,[M,n(r,null,{default:s(()=>[n(u(V)),O]),_:1})])]),n(_,{summary:"Show usage example"},{default:s(()=>[l(h(Z))]),_:1}),n(_,{summary:"Show Pill.vue source code"},{default:s(()=>[l(h(u(B)),1)]),_:1})])])]))}}),U=f(q,[["__scopeId","data-v-f7d5b34e"]]);export{U as default};
