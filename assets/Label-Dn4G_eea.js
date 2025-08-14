import{C as m}from"./CodeExample-nhhIQv7B.js";import{_ as f,I as b,r,c as h,o as _,b as e,e as t,d as l,w as o,t as c}from"./index-jB5fMxCO.js";import{L as g}from"./Label-CC1fgUJC.js";import"./v4-BKrj-4V8.js";const x="",I=`<!-- The labelForId syntax is used to associate the label with the form field -->
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
</Label>`,v={components:{InputField:b,Label:g,CodeExample:m},data(){return{codeExample:I}},computed:{code(){return x}}},L={class:"grid-container"},y={class:"grid-item-6"},F={class:"grid-item-6"},w={class:"grid-container"},C={class:"grid-item-6"},E={class:"grid-container"},T={class:"grid-item-12"};function B(D,d,N,S,p,u){const i=r("InputField"),s=r("Label",!0),n=r("CodeExample");return _(),h("div",null,[e("section",null,[d[0]||(d[0]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[t(" Labels for form fields. Beside their default size, they come with a larger one as well which can be enabled by setting the "),e("code",null,"large"),t(" prop or "),e("a",{href:"https://vuejs.org/v2/guide/components-edge-cases.html#Dependency-Injection"},"providing"),t("  "),e("code",null,"largeLabels: true"),t(". ")])])],-1)),e("div",L,[e("div",y,[l(s,{text:"Label for a field"},{default:o(({labelForId:a})=>[l(i,{id:a,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})]),e("div",F,[l(s,{text:"Large label for a field",large:""},{default:o(({labelForId:a})=>[l(i,{id:a,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])]),d[1]||(d[1]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The components the label is for can also be rendered without the label itself. This allows disabling label use more conveniently in more compact layouts. ")])],-1)),e("div",w,[e("div",C,[l(s,{active:!1,text:"Hidden label for a field"},{default:o(({labelForId:a})=>[l(i,{id:a,type:"text",placeholder:"I'm a placeholder"},null,8,["id"])]),_:1})])])]),e("section",null,[e("div",E,[e("div",T,[l(n,{summary:"Show usage example"},{default:o(()=>[t(c(p.codeExample),1)]),_:1}),l(n,{summary:"Show Label.vue source code"},{default:o(()=>[t(c(u.code),1)]),_:1})])])])])}const H=f(v,[["render",B],["__scopeId","data-v-2f8c617d"]]);export{H as default};
