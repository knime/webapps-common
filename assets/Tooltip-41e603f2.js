import{C as v}from"./CodeExample-7f44cb71.js";import{o as c,c as d,b as t,_ as x,T as f,d as e,w as n,e as i,t as l,r as s,p as w,f as g}from"./index-fc2ac7a6.js";const y={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},b=t("path",{d:"M16 28.302c0 1.824 6.163 2.317 6.163-1.134 0 0 5.818.345 3.846-4.931 0 0 4.832-3.424 1.035-7.122 0 0 2.367-2.061 1.035-5.457s-4.586-4.087-4.586-4.087S20.487-.543 16 3.895m0 24.407c0 1.824-6.163 2.317-6.163-1.134 0 0-5.818.345-3.846-4.931 0 0-4.832-3.424-1.035-7.122 0 0-2.367-2.061-1.035-5.457s4.586-4.087 4.586-4.087S11.513-.543 16 3.895m0 5.325h5.304m4.705 13.017V19.18h-5.67v-1.766M16 23.371h2.801M16 18.44h-4.454v2.21M16 12.277h-2.958V9.22h-1.52"},null,-1),M=t("path",{"stroke-linecap":"round","stroke-width":"1.6",d:"M21.1 23.4h0M20.4 15.1h0M9.5 15.1h0M9.2 9.2h0M23.6 9.2h0M11.6 23h0"},null,-1),k=t("path",{d:"M4.955 15.115h2.259M16 3.895v24.407"},null,-1),T=[b,M,k];function S(o,h){return c(),d("svg",y,T)}const I={render:S},$=`<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
<\/script>

<template>
  <div class="tooltip">
    <slot />
    <span v-if="text" class="text">{{ text }}</span>
  </div>
</template>

<style lang="postcss" scoped>
.tooltip {
  position: relative;
}

.text {
  --arrow-size: 12px;

  /* hide visually */
  height: 1px;
  width: 1px;
  visibility: hidden;
  overflow: hidden;

  /* positioning and styling */
  position: absolute;
  top: calc(var(--arrow-size) * -1);
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  opacity: 0;
  background-color: var(--theme-tooltip-background-color);
  white-space: nowrap;
  color: var(--theme-tooltip-foreground-color);
  padding: 6px 10px;
  box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);
  border-radius: 1px;
  font-size: 13px;
  pointer-events: none;

  /* arrow */
  &::after {
    width: var(--arrow-size);
    height: var(--arrow-size);
    content: "";
    position: absolute;
    z-index: -1;
    left: 50%;
    background-color: var(--theme-tooltip-background-color);
    bottom: 2px;
    transform: translate(-50%, 50%) rotate(135deg);
  }
}

@media (hover: hover) {
  .tooltip:hover > .text {
    /* show */
    height: auto;
    width: auto;
    visibility: visible;
    overflow: initial;

    /* other styles */
    opacity: 1;
    transition: opacity 250ms cubic-bezier(0.215, 0.61, 0.355, 1) 150ms;
  }

  .expanded:focus-within + .text {
    /* hide the tooltip when the container has the 'expanded' class, e.g. for popovers */
    transition: opacity 150ms ease;
    opacity: 0;
  }
}
</style>
`;const z=`
<Tooltip
  text="What you see here is a headline tooltip"
>
    <h3>A headline which magically has now a tooltip</h3>
</Tooltip>`,B={components:{Tooltip:f,CodeExample:v,BrainIcon:I},data(){return{codeExample:z}},computed:{code(){return $}}},p=o=>(w("data-v-60af229c"),o=o(),g(),o),C=p(()=>t("section",null,[t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," A simple tooltip only for devices with hover capabilities. For others it will be deactivated. "),t("p",null,[i(" Note: If the immediate child container of the tooltip has an "),t("code",{class:"language-js"},"expanded"),i(" class, the tooltip will be hidden. This is useful for example for popovers (See KNIME Hub project). ")])])])],-1)),E={class:"demo"},N={class:"grid-container"},V={class:"grid-item-6"},j=p(()=>t("h3",{class:"demo-line"}," A headline which magically has now a tooltip ",-1)),A={class:"grid-item-6"},W={class:"grid-container"},q={class:"grid-item-12"};function D(o,h,F,H,_,u){const a=s("Tooltip",!0),m=s("BrainIcon"),r=s("CodeExample");return c(),d("div",null,[C,t("section",E,[t("div",N,[t("div",V,[e(a,{text:"What you see here is a headline tooltip"},{default:n(()=>[j]),_:1})]),t("div",A,[e(a,{text:"Compact tooltip for a field"},{default:n(()=>[e(m)]),_:1})])])]),t("section",null,[t("div",W,[t("div",q,[e(r,{summary:"Show usage example"},{default:n(()=>[i(l(_.codeExample),1)]),_:1}),e(r,{summary:"Show Tooltip.vue source code"},{default:n(()=>[i(l(u.code),1)]),_:1})])])])])}const Y=x(B,[["render",D],["__scopeId","data-v-60af229c"]]);export{Y as default};
