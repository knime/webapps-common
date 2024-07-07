import{u as r,_ as m,r as n,o as p,c as v,b as s,e as t,d as o,t as a,w as c}from"./index-D1NgaLlG.js";import{V as h}from"./ValueSwitch-DSjkxduY.js";import{C as V}from"./CodeExample-CdSGOWvu.js";import"./BaseRadioButtons-NeQ8pASN.js";const C="",b=`<ValueSwitch
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
`,S=r({components:{ValueSwitch:h,CodeExample:V},data(){return{codeExample:b,selectedCurrency:"eur",currencies:[{id:"eur",text:"EUR"},{id:"usd",text:"USD"},{id:"cad",text:"CAD"}]}},computed:{code(){return C},withDisabledItem(){return this.currencies.map(e=>e.id==="usd"?{...e,disabled:!0}:e)}}}),w=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null,[t(" A list of choices the user must choose one of. It emits an "),s("code",null,"input"),t(" event when something is selected, and it has a "),s("code",null,"value"),t(". ")])])],-1),g={class:"grid-container"},U={class:"grid-item-4"},_={class:"grid-item-4"},f={class:"grid-item-4"},D={class:"grid-container"},y={class:"grid-item-4"},x={class:"grid-item-4"},E=s("div",{class:"grid-item-4"},null,-1),A={class:"grid-container"},R={class:"grid-item-12"};function $(e,d,N,B,I,k){const i=n("ValueSwitch",!0),u=n("CodeExample");return p(),v("div",null,[s("section",null,[w,s("div",g,[s("div",U,[t(" Normal mode "),o(i,{modelValue:e.selectedCurrency,"onUpdate:modelValue":d[0]||(d[0]=l=>e.selectedCurrency=l),"possible-values":e.currencies},null,8,["modelValue","possible-values"])]),s("div",_,[t(" Compact mode "),o(i,{modelValue:e.selectedCurrency,"onUpdate:modelValue":d[1]||(d[1]=l=>e.selectedCurrency=l),compact:"","possible-values":e.currencies},null,8,["modelValue","possible-values"])]),s("div",f,"selected id: "+a(e.selectedCurrency),1)]),s("div",D,[s("div",y,[t(" Completely disabled "),o(i,{modelValue:e.selectedCurrency,"onUpdate:modelValue":d[2]||(d[2]=l=>e.selectedCurrency=l),disabled:"","possible-values":e.currencies},null,8,["modelValue","possible-values"])]),s("div",x,[t(" With single disabled option "),o(i,{modelValue:e.selectedCurrency,"onUpdate:modelValue":d[3]||(d[3]=l=>e.selectedCurrency=l),"possible-values":e.withDisabledItem},null,8,["modelValue","possible-values"])]),E])]),s("section",null,[s("div",A,[s("div",R,[o(u,{summary:"Show usage example"},{default:c(()=>[t(a(e.codeExample),1)]),_:1}),o(u,{summary:"Show ValueSwitch.vue source code"},{default:c(()=>[t(a(e.code),1)]),_:1})])])])])}const z=m(S,[["render",$]]);export{z as default};
