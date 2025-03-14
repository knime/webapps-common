import{C as m}from"./CodeExample-D5JV_nn3.js";import{_ as f,I as _,r as c,o as b,c as g,b as e,d as l,w as o,e as t,t as n,p as I,f as x}from"./index-f-h5UuUy.js";import{L as v}from"./Label-DKyu-lTK.js";const L="",y=`<!-- The labelForId syntax is used to associate the label with the form field -->
<Label
  #default="{ labelForId }"
  text="Label for a field"
>
    <!-- The id attribute will be replaced with a generated unique ID -->
    <InputField
      :id="labelForId"
      type="text"
      placeholder="I'm a placeholder"
    />
</Label>
<Label
  #default="{ labelForId }"
  text="Large label for a field"
  large
>
  <InputField
    :id="labelForId"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>
<Label
  :active="false"
  #default="{ labelForId }"
  text="Hidden label for a field"
>
  <InputField
    :id="labelForId"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>`,w={components:{InputField:_,Label:v,CodeExample:m},data(){return{codeExample:y}},computed:{code(){return L}}},p=d=>(I("data-v-2f8c617d"),d=d(),x(),d),F=p(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[t(" Labels for form fields. Beside their default size, they come with a larger one as well which can be enabled by setting the "),e("code",null,"large"),t(" prop or "),e("a",{href:"https://vuejs.org/v2/guide/components-edge-cases.html#Dependency-Injection"},"providing"),t("  "),e("code",null,"largeLabels: true"),t(". ")])])],-1)),C={class:"grid-container"},E={class:"grid-item-6"},S={class:"grid-item-6"},T=p(()=>e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The components the label is for can also be rendered without the label itself. This allows disabling label use more conveniently in more compact layouts. ")])],-1)),B={class:"grid-container"},D={class:"grid-item-6"},N={class:"grid-container"},V={class:"grid-item-12"};function $(d,j,k,H,u,h){const s=c("InputField"),i=c("Label",!0),r=c("CodeExample");return b(),g("div",null,[e("section",null,[F,e("div",C,[e("div",E,[l(i,{text:"Label for a field"},{default:o(({labelForId:a})=>[l(s,{id:a,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})]),e("div",S,[l(i,{text:"Large label for a field",large:""},{default:o(({labelForId:a})=>[l(s,{id:a,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])]),T,e("div",B,[e("div",D,[l(i,{active:!1,text:"Hidden label for a field"},{default:o(({labelForId:a})=>[l(s,{id:a,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])])]),e("section",null,[e("div",N,[e("div",V,[l(r,{summary:"Show usage example"},{default:o(()=>[t(n(u.codeExample),1)]),_:1}),l(r,{summary:"Show Label.vue source code"},{default:o(()=>[t(n(h.code),1)]),_:1})])])])])}const G=f(w,[["render",$],["__scopeId","data-v-2f8c617d"]]);export{G as default};
