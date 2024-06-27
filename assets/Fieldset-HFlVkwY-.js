import{C as y}from"./CodeExample-N4vHHWw0.js";import{_ as x,o as h,c as v,b as t,e as d,t as r,x as g,I as F,ar as I,r as l,d as e,w as n}from"./index-3DrG_06-.js";import{L}from"./Label-XwegSZ-S.js";const $={provide:{largeLabels:!1},props:{text:{default:"",type:String}}};function k(i,b,c,w,p,m){return h(),v("fieldset",null,[t("legend",null,[d(r(c.text)+" ",1),g(i.$slots,"icon")]),g(i.$slots,"default")])}const S=x($,[["render",k],["__scopeId","data-v-41ab202d"]]),C=`<script>
/**
 * Fieldset for elements that contain more than one input field
 */
export default {
  provide: {
    largeLabels: false,
  },

  props: {
    text: {
      default: "",
      type: String,
    },
  },
};
<\/script>

<template>
  <fieldset>
    <legend>
      {{ text }}
      <slot name="icon" />
    </legend>
    <slot />
  </fieldset>
</template>

<style lang="postcss" scoped>
fieldset {
  /* reset default styles */
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  min-inline-size: unset;

  & > legend {
    font-weight: 700;
    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    font-size: 16px;
    line-height: 20px;
    cursor: default;
    margin-bottom: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;

    & :slotted(svg) {
      margin-right: 0;
      height: 14px;
      width: 14px;
      stroke-width: calc(32px / 14);
      stroke: var(--knime-masala);
      cursor: pointer;
      display: block;
      float: right;
      margin-top: 3px;
      margin-left: 4px;
    }
  }

  /* Second level fieldset legends look smaller (e.g. for Radiobuttons inside of ValueFilterSelectionWidget) */
  & > fieldset > legend {
    font-weight: 500;
    font-family: var(--theme-text-medium-font-family);
    color: var(--theme-text-medium-color);
    font-size: 13px;
    line-height: 18px;
    margin-bottom: 3px;
  }

  & :deep(.label-wrapper),
  & > fieldset {
    margin-top: 10px;
  }

  /* avoid duplicated margins */
  & :deep(legend + .label-wrapper) {
    margin-top: 0;
  }
}
</style>
`,E=`<Fieldset text="Login">
  <template v-slot:icon><InfoIcon /></template>
  <Label
    v-slot="{ labelForId }"
    text="User"
  >
    <InputField
      :id="labelForId"
      type="text"
    />
  </Label>
  <Label
    v-slot="{ labelForId }"
    text="Password"
  >
    <InputField
      :id="labelForId"
      type="password"
      model-value="secret-password"
    />
  </Label>
</Fieldset>`,z={components:{InputField:F,InfoIcon:I,Label:L,Fieldset:S,CodeExample:y},data(){return{codeExample:E}},computed:{code(){return C}}},V=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Fieldset can be used to group multiple form fields. Labels inside Fieldsets automatically use their default size. ")])],-1),B={class:"grid-container"},N={class:"grid-item-6"},P={class:"grid-container"},U={class:"grid-item-6"},D={class:"grid-container"},R={class:"grid-item-12"};function T(i,b,c,w,p,m){const u=l("InfoIcon"),s=l("InputField"),a=l("Label"),f=l("Fieldset",!0),_=l("CodeExample");return h(),v("div",null,[t("section",null,[V,t("div",B,[t("div",N,[e(f,{text:"Login"},{icon:n(()=>[e(u)]),default:n(()=>[e(a,{text:"User"},{default:n(({labelForId:o})=>[e(s,{id:o,type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:n(({labelForId:o})=>[e(s,{id:o,type:"password","model-value":"secret-password"},null,8,["id"])]),_:1})]),_:1})])]),t("div",P,[t("div",U,[e(f,{text:"Login Compact"},{icon:n(()=>[e(u)]),default:n(()=>[e(a,{text:"User"},{default:n(({labelForId:o})=>[e(s,{id:o,compact:"",type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:n(({labelForId:o})=>[e(s,{id:o,type:"password","model-value":"secret-password",compact:""},null,8,["id"])]),_:1})]),_:1})])])]),t("section",null,[t("div",D,[t("div",R,[e(_,{summary:"Show usage example"},{default:n(()=>[d(r(p.codeExample),1)]),_:1}),e(_,{summary:"Show Fieldset.vue source code"},{default:n(()=>[d(r(m.code),1)]),_:1})])])])])}const A=x(z,[["render",T]]);export{A as default};
