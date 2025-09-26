import{C as m}from"./CodeExample-BgUZfbtM.js";import{V as c}from"./ValueSwitch-C-LfE_ko.js";import{h as p,_ as v,r as n,c as V,o as C,b as t,e as l,d as o,t as a,w as r}from"./index-D6dhsvHD.js";import"./BaseRadioButtons-BIEWt9_F.js";import"./v4-BKrj-4V8.js";const b="",S=`<ValueSwitch
  v-model="selected"
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  compact
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  disabled
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD', disabled: true },
    { id: 'cad', text: 'CAD' }
  ]"
/>
`,w=p({components:{ValueSwitch:c,CodeExample:m},data(){return{codeExample:S,selectedCurrency:"eur",currencies:[{id:"eur",text:"EUR"},{id:"usd",text:"USD"},{id:"cad",text:"CAD"}]}},computed:{code(){return b},withDisabledItem(){return this.currencies.map(s=>s.id==="usd"?{...s,disabled:!0}:s)}}}),g={class:"grid-container"},h={class:"grid-item-4"},U={class:"grid-item-4"},f={class:"grid-item-4"},D={class:"grid-container"},y={class:"grid-item-4"},x={class:"grid-item-4"},E={class:"grid-container"},A={class:"grid-item-12"};function R(s,e,$,N,B,I){const i=n("ValueSwitch",!0),u=n("CodeExample");return C(),V("div",null,[t("section",null,[e[9]||(e[9]=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null,[l(" A list of choices the user must choose one of. It emits an "),t("code",null,"input"),l(" event when something is selected, and it has a "),t("code",null,"value"),l(". ")])])],-1)),t("div",g,[t("div",h,[e[4]||(e[4]=l(" Normal mode ",-1)),o(i,{modelValue:s.selectedCurrency,"onUpdate:modelValue":e[0]||(e[0]=d=>s.selectedCurrency=d),"possible-values":s.currencies},null,8,["modelValue","possible-values"])]),t("div",U,[e[5]||(e[5]=l(" Compact mode ",-1)),o(i,{modelValue:s.selectedCurrency,"onUpdate:modelValue":e[1]||(e[1]=d=>s.selectedCurrency=d),compact:"","possible-values":s.currencies},null,8,["modelValue","possible-values"])]),t("div",f,"selected id: "+a(s.selectedCurrency),1)]),t("div",D,[t("div",y,[e[6]||(e[6]=l(" Completely disabled ",-1)),o(i,{modelValue:s.selectedCurrency,"onUpdate:modelValue":e[2]||(e[2]=d=>s.selectedCurrency=d),disabled:"","possible-values":s.currencies},null,8,["modelValue","possible-values"])]),t("div",x,[e[7]||(e[7]=l(" With single disabled option ",-1)),o(i,{modelValue:s.selectedCurrency,"onUpdate:modelValue":e[3]||(e[3]=d=>s.selectedCurrency=d),"possible-values":s.withDisabledItem},null,8,["modelValue","possible-values"])]),e[8]||(e[8]=t("div",{class:"grid-item-4"},null,-1))])]),t("section",null,[t("div",E,[t("div",A,[o(u,{summary:"Show usage example"},{default:r(()=>[l(a(s.codeExample),1)]),_:1}),o(u,{summary:"Show ValueSwitch.vue source code"},{default:r(()=>[l(a(s.code),1)]),_:1})])])])])}const z=v(w,[["render",R]]);export{z as default};
