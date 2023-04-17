import{C as y}from"./CodeExample-d968c2fe.js";import{_,o as g,c as x,b as e,e as a,t as i,u as f,I,d as t,w as n,r as o}from"./index-81632345.js";import{L as w}from"./Label-02df4ebc.js";import{I as L}from"./circle-info-a75073fe.js";const $={provide:{compactLabels:!0},props:{text:{default:"",type:String}}};function k(l,h,d,v,r,c){return g(),x("fieldset",null,[e("legend",null,[a(i(d.text)+" ",1),f(l.$slots,"icon")]),f(l.$slots,"default")])}const S=_($,[["render",k],["__scopeId","data-v-aa8b3ee1"]]),C=`<script>
/**
 * Fieldset for elements that contain more than one input field
 */
export default {
    provide: {
        compactLabels: true
    },
    props: {
        text: {
            default: '',
            type: String
        }
    }
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
</Fieldset>`,V={components:{InputField:I,InfoIcon:L,Label:w,Fieldset:S,CodeExample:y},data(){return{codeExample:E}},computed:{code(){return C}}},z=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("h2",null,"Fieldset"),e("p",null," Fieldset can be used to group multiple form fields. Labels inside Fieldsets automagically use their compact size. ")])],-1),B={class:"grid-container"},N={class:"grid-item-6"},P={class:"grid-container"},U={class:"grid-item-12"};function D(l,h,d,v,r,c){const b=o("InfoIcon"),p=o("InputField"),m=o("Label"),F=o("Fieldset",!0),u=o("CodeExample");return g(),x("div",null,[e("section",null,[z,e("div",B,[e("div",N,[t(F,{text:"Login"},{icon:n(()=>[t(b)]),default:n(()=>[t(m,{text:"User"},{default:n(({labelForId:s})=>[t(p,{id:s,type:"text"},null,8,["id"])]),_:1}),t(m,{text:"Password"},{default:n(({labelForId:s})=>[t(p,{id:s,type:"password","model-value":"secret-password"},null,8,["id"])]),_:1})]),_:1})])])]),e("section",null,[e("div",P,[e("div",U,[t(u,{summary:"Show usage example"},{default:n(()=>[a(i(r.codeExample),1)]),_:1}),t(u,{summary:"Show Fieldset.vue source code"},{default:n(()=>[a(i(c.code),1)]),_:1})])])])])}const q=_(V,[["render",D]]);export{q as default};
