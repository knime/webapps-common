import{C as h}from"./CodeExample-DY7BV2Xj.js";import{_ as v,o as F,c as I,b as t,e as i,t as c,x,I as w,au as L,r as d,d as e,w as s}from"./index-xWOb8kNV.js";import{L as y}from"./Label-q2vvVff3.js";const $={provide:{largeLabels:!1},props:{text:{default:"",type:String}}};function C(n,g,r,b,p,u){return F(),I("fieldset",null,[t("legend",null,[i(c(r.text)+" ",1),x(n.$slots,"icon")]),x(n.$slots,"default")])}const E=v($,[["render",C],["__scopeId","data-v-1340a936"]]),S="",B=`<Fieldset text="Login">
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
</Fieldset>`,N={components:{InputField:w,InfoIcon:L,Label:y,Fieldset:E,CodeExample:h},data(){return{codeExample:B}},computed:{code(){return S}}},P=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Fieldset can be used to group multiple form fields. Labels inside Fieldsets automatically use their default size. ")])],-1),U={class:"grid-container"},V={class:"grid-item-6"},k={class:"grid-container"},z={class:"grid-item-6"},D={class:"grid-container"},T={class:"grid-item-12"};function j(n,g,r,b,p,u){const _=d("InfoIcon"),l=d("InputField"),a=d("Label"),m=d("Fieldset",!0),f=d("CodeExample");return F(),I("div",null,[t("section",null,[P,t("div",U,[t("div",V,[e(m,{text:"Login"},{icon:s(()=>[e(_)]),default:s(()=>[e(a,{text:"User"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"password","model-value":"secret-password"},null,8,["id"])]),_:1})]),_:1})])]),t("div",k,[t("div",z,[e(m,{text:"Login Compact"},{icon:s(()=>[e(_)]),default:s(()=>[e(a,{text:"User"},{default:s(({labelForId:o})=>[e(l,{id:o,compact:"",type:"text"},null,8,["id"])]),_:1}),e(a,{text:"Password"},{default:s(({labelForId:o})=>[e(l,{id:o,type:"password","model-value":"secret-password",compact:""},null,8,["id"])]),_:1})]),_:1})])])]),t("section",null,[t("div",D,[t("div",T,[e(f,{summary:"Show usage example"},{default:s(()=>[i(c(p.codeExample),1)]),_:1}),e(f,{summary:"Show Fieldset.vue source code"},{default:s(()=>[i(c(u.code),1)]),_:1})])])])])}const H=v(N,[["render",j]]);export{H as default};
