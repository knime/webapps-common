import{C as u}from"./CodeExample-6zkGYkV6.js";import{_ as p,r as n,o as _,c as x,b as e,d as l,t as a,w as r,e as d}from"./index-B4Oa1tfA.js";import{C as h}from"./Checkboxes-C2_ueuU7.js";import"./Checkbox-Cid7peM5.js";const b="",v=`<Checkboxes
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
/>`,f={components:{Checkboxes:h,CodeExample:u},data(){return{codeExample:v,selected:["bar","baz"],withMissing:["bar","missing"]}},computed:{code(){return b}}},g=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[d(" A list of choices to choose of. It emits an "),e("code",null,"input"),d(" event when something is selected, and it has a "),e("code",null,"value"),d(". ")])])],-1),C={class:"grid-container"},V={class:"grid-item-5"},B=e("span",null,"Horizontal",-1),z={class:"grid-item-5"},k=e("span",null,"Vertical",-1),w={class:"grid-item-5"},E=e("span",null,"Disabled",-1),S={class:"grid-item-2"},F={class:"grid-container"},y={class:"grid-item-12"};function N(U,s,D,A,o,m){const i=n("Checkboxes",!0),c=n("CodeExample");return _(),x("div",null,[e("section",null,[g,e("div",C,[e("div",V,[B,l(i,{modelValue:o.selected,"onUpdate:modelValue":s[0]||(s[0]=t=>o.selected=t),placeholder:"Select stuff here!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",z,[k,l(i,{modelValue:o.selected,"onUpdate:modelValue":s[1]||(s[1]=t=>o.selected=t),alignment:"vertical",placeholder:"Select stuff here vertical!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",w,[E,l(i,{modelValue:o.selected,"onUpdate:modelValue":s[2]||(s[2]=t=>o.selected=t),disabled:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),e("div",S,"selected ids: "+a(o.selected),1)])]),e("section",null,[e("div",F,[e("div",y,[l(c,{summary:"Show usage example"},{default:r(()=>[d(a(o.codeExample),1)]),_:1}),l(c,{summary:"Show Checkboxes.vue source code"},{default:r(()=>[d(a(m.code),1)]),_:1})])])])])}const j=p(f,[["render",N]]);export{j as default};
