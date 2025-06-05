import{_ as v,o as I,c as b,b as t,e as c,t as r,E as F,I as w,M as L,r as d,d as e,w as s}from"./index-C4N8Hs82.js";import{C as y}from"./CodeExample-DJVnkR8W.js";import{L as h}from"./Label-CMaCCRKj.js";const $={name:"Fieldset",provide:{largeLabels:!1},props:{text:{default:"",type:String}}};function C(n,i,p,g,u,m){return I(),b("fieldset",null,[t("legend",null,[c(r(p.text)+" ",1),F(n.$slots,"icon")]),F(n.$slots,"default")])}const E=v($,[["render",C],["__scopeId","data-v-3dbdd09b"]]),S="",B=`<Fieldset text="Login">
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
</Fieldset>`,N={components:{InputField:w,InfoIcon:L,Label:h,Fieldset:E,CodeExample:y},data(){return{codeExample:B}},computed:{code(){return S}}},P={class:"grid-container"},U={class:"grid-item-6"},V={class:"grid-container"},k={class:"grid-item-6"},z={class:"grid-container"},D={class:"grid-item-12"};function M(n,i,p,g,u,m){const _=d("InfoIcon"),l=d("InputField"),a=d("Label"),f=d("Fieldset",!0),x=d("CodeExample");return I(),b("div",null,[t("section",null,[i[0]||(i[0]=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Fieldset can be used to group multiple form fields. Labels inside Fieldsets automatically use their default size. ")])],-1)),t("div",P,[t("div",U,[e(f,{text:"Login"},{icon:s(()=>[e(_)]),default:s(()=>[e(a,{text:"User"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"password","model-value":"secret-password"},null,8,["id"])]),_:1})]),_:1})])]),t("div",V,[t("div",k,[e(f,{text:"Login Compact"},{icon:s(()=>[e(_)]),default:s(()=>[e(a,{text:"User"},{default:s(({labelForId:o})=>[e(l,{id:o,compact:"",type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"password","model-value":"secret-password",compact:""},null,8,["id"])]),_:1})]),_:1})])])]),t("section",null,[t("div",z,[t("div",D,[e(x,{summary:"Show usage example"},{default:s(()=>[c(r(u.codeExample),1)]),_:1}),e(x,{summary:"Show Fieldset.vue source code"},{default:s(()=>[c(r(m.code),1)]),_:1})])])])])}const A=v(N,[["render",M]]);export{A as default};
