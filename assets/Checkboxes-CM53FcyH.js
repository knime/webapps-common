import{C as u}from"./CodeExample-COIS0-Ma.js";import{_ as p,r,o as x,c as b,b as e,e as l,d,t as a,w as c}from"./index-C9F0Abs1.js";import{C as v}from"./Checkboxes-CuAcuO80.js";import"./Checkbox-DzLmmKf1.js";const f="",g=`<Checkboxes
  v-model="selected"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>`,_={components:{Checkboxes:v,CodeExample:u},data(){return{codeExample:g,selected:["bar","baz"],withMissing:["bar","missing"]}},computed:{code(){return f}}},h={class:"grid-container"},C={class:"grid-item-5"},V={class:"grid-item-5"},B={class:"grid-item-5"},z={class:"grid-item-2"},k={class:"grid-container"},w={class:"grid-item-12"};function E(S,o,F,y,s,m){const i=r("Checkboxes",!0),n=r("CodeExample");return x(),b("div",null,[e("section",null,[o[6]||(o[6]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[l(" A list of choices to choose of. It emits an "),e("code",null,"input"),l(" event when something is selected, and it has a "),e("code",null,"value"),l(". ")])])],-1)),e("div",h,[e("div",C,[o[3]||(o[3]=e("span",null,"Horizontal",-1)),d(i,{modelValue:s.selected,"onUpdate:modelValue":o[0]||(o[0]=t=>s.selected=t),placeholder:"Select stuff here!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",V,[o[4]||(o[4]=e("span",null,"Vertical",-1)),d(i,{modelValue:s.selected,"onUpdate:modelValue":o[1]||(o[1]=t=>s.selected=t),alignment:"vertical",placeholder:"Select stuff here vertical!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",B,[o[5]||(o[5]=e("span",null,"Disabled",-1)),d(i,{modelValue:s.selected,"onUpdate:modelValue":o[2]||(o[2]=t=>s.selected=t),disabled:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",z,"selected ids: "+a(s.selected),1)])]),e("section",null,[e("div",k,[e("div",w,[d(n,{summary:"Show usage example"},{default:c(()=>[l(a(s.codeExample),1)]),_:1}),d(n,{summary:"Show Checkboxes.vue source code"},{default:c(()=>[l(a(m.code),1)]),_:1})])])])])}const H=p(_,[["render",E]]);export{H as default};
