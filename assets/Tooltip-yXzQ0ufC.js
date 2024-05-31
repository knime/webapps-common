import{C as v}from"./CodeExample-9wTT2Cq1.js";import{o as c,c as d,a as x,_ as f,T as w,r as a,b as e,d as o,w as n,e as i,t as l,p as g,f as y}from"./index-1EVMs0HF.js";const b={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},k=x('<path d="M16 28.302c0 1.824 6.163 2.317 6.163-1.134 0 0 5.818.345 3.846-4.931 0 0 4.832-3.424 1.035-7.122 0 0 2.367-2.061 1.035-5.457s-4.586-4.087-4.586-4.087S20.487-.543 16 3.895m0 24.407c0 1.824-6.163 2.317-6.163-1.134 0 0-5.818.345-3.846-4.931 0 0-4.832-3.424-1.035-7.122 0 0-2.367-2.061-1.035-5.457s4.586-4.087 4.586-4.087S11.513-.543 16 3.895m0 5.325h5.304m4.705 13.017V19.18h-5.67v-1.766M16 23.371h2.801M16 18.44h-4.454v2.21M16 12.277h-2.958V9.22h-1.52"></path><line stroke-linecap="round" transform="matrix(1.6 0 0 1.6 21.1 23.4)"></line><line stroke-linecap="round" transform="matrix(1.6 0 0 1.6 20.4 15.1)"></line><line stroke-linecap="round" transform="matrix(1.6 0 0 1.6 9.5 15.1)"></line><line stroke-linecap="round" transform="matrix(1.6 0 0 1.6 9.2 9.2)"></line><line stroke-linecap="round" transform="matrix(1.6 0 0 1.6 23.6 9.2)"></line><line stroke-linecap="round" transform="matrix(1.6 0 0 1.6 11.6 23)"></line><path d="M4.955 15.115h2.259M16 3.895v24.407"></path>',8),S=[k];function T(t,h){return c(),d("svg",b,[...S])}const I={render:T},z=`<script>
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
  box-shadow: var(--shadow-elevation-2);
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
`,B=`
<Tooltip
  text="What you see here is a headline tooltip"
>
    <h3>A headline which magically has now a tooltip</h3>
</Tooltip>`,C={components:{Tooltip:w,CodeExample:v,BrainIcon:I},data(){return{codeExample:B}},computed:{code(){return z}}},p=t=>(g("data-v-60af229c"),t=t(),y(),t),E=p(()=>e("section",null,[e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," A simple tooltip only for devices with hover capabilities. For others it will be deactivated. "),e("p",null,[i(" Note: If the immediate child container of the tooltip has an "),e("code",{class:"language-js"},"expanded"),i(" class, the tooltip will be hidden. This is useful for example for popovers (See KNIME Hub project). ")])])])],-1)),M={class:"demo"},N={class:"grid-container"},V={class:"grid-item-6"},$=p(()=>e("h3",{class:"demo-line"}," A headline which magically has now a tooltip ",-1)),j={class:"grid-item-6"},A={class:"grid-container"},W={class:"grid-item-12"};function q(t,h,D,F,m,u){const s=a("Tooltip",!0),_=a("BrainIcon"),r=a("CodeExample");return c(),d("div",null,[E,e("section",M,[e("div",N,[e("div",V,[o(s,{text:"What you see here is a headline tooltip"},{default:n(()=>[$]),_:1})]),e("div",j,[o(s,{text:"Compact tooltip for a field"},{default:n(()=>[o(_)]),_:1})])])]),e("section",null,[e("div",A,[e("div",W,[o(r,{summary:"Show usage example"},{default:n(()=>[i(l(m.codeExample),1)]),_:1}),o(r,{summary:"Show Tooltip.vue source code"},{default:n(()=>[i(l(u.code),1)]),_:1})])])])])}const X=f(C,[["render",q],["__scopeId","data-v-60af229c"]]);export{X as default};
