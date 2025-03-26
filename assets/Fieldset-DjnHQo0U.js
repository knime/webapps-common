import{_ as F,o as v,c as I,b as t,e as i,t as c,H as x,I as h,O as w,r as d,d as e,w as s}from"./index-D_gtUabb.js";import{C as L}from"./CodeExample-DlfaWUBv.js";import{L as y}from"./Label-BMRHj7v4.js";const $={name:"Fieldset",provide:{largeLabels:!1},props:{text:{default:"",type:String}}};function C(n,b,r,g,p,u){return v(),I("fieldset",null,[t("legend",null,[i(c(r.text)+" ",1),x(n.$slots,"icon")]),x(n.$slots,"default")])}const E=F($,[["render",C],["__scopeId","data-v-3dbdd09b"]]),S="",B=`<Fieldset text="Login">
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
</Fieldset>`,N={components:{InputField:h,InfoIcon:w,Label:y,Fieldset:E,CodeExample:L},data(){return{codeExample:B}},computed:{code(){return S}}},P=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Fieldset can be used to group multiple form fields. Labels inside Fieldsets automatically use their default size. ")])],-1),U={class:"grid-container"},V={class:"grid-item-6"},k={class:"grid-container"},z={class:"grid-item-6"},D={class:"grid-container"},H={class:"grid-item-12"};function O(n,b,r,g,p,u){const _=d("InfoIcon"),l=d("InputField"),a=d("Label"),m=d("Fieldset",!0),f=d("CodeExample");return v(),I("div",null,[t("section",null,[P,t("div",U,[t("div",V,[e(m,{text:"Login"},{icon:s(()=>[e(_)]),default:s(()=>[e(a,{text:"User"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"password","model-value":"secret-password"},null,8,["id"])]),_:1})]),_:1})])]),t("div",k,[t("div",z,[e(m,{text:"Login Compact"},{icon:s(()=>[e(_)]),default:s(()=>[e(a,{text:"User"},{default:s(({labelForId:o})=>[e(l,{id:o,compact:"",type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"password","model-value":"secret-password",compact:""},null,8,["id"])]),_:1})]),_:1})])])]),t("section",null,[t("div",D,[t("div",H,[e(f,{summary:"Show usage example"},{default:s(()=>[i(c(p.codeExample),1)]),_:1}),e(f,{summary:"Show Fieldset.vue source code"},{default:s(()=>[i(c(u.code),1)]),_:1})])])])])}const A=F(N,[["render",O]]);export{A as default};
