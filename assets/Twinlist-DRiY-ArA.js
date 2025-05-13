import{C as h}from"./CodeExample-DZclaiiM.js";import{_ as b,s as v,r as m,o as g,c as p,b as e,e as n,d as t,t as o,w as u}from"./index-D0ikwWgO.js";import{T as f}from"./Twinlist-nakqZQ9I.js";import{L as w}from"./LoadingIcon-4vWC9tww.js";import"./arrow-next-CG-FdZ-_.js";import"./useSearch-BElzNsek.js";import"./Label-CRzAQ1CZ.js";import"./MultiselectListBox-jskMXQO1.js";import"./StyledListItem-A-GermCr.js";import"./createMissingItem-PGCdVBns.js";import"./useLabelInfo-CQvswSgc.js";import"./svgWithTitle-QQNgEg7Z.js";const z="",V=`<Twinlist
  v-model="selected"
  left-label="Select stuff here"
  right-label="The selected stuff"
  initial-search-term=""
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
/>
<Twinlist
  v-model="selected"
  show-search
  left-label="Select stuff here"
  right-label="The selected stuff"
  search-label="Search items"
  search-placeholder="Placeholder"
  initial-search-term="bar"
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
/>
<Twinlist
  v-model="selectedSearchLabel"
  show-search
  left-label="Select from the visible items"
  right-label="The selected stuff"
  search-label="Search items"
  search-placeholder="Placeholder"
  :with-search-label="true"
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
/>`,x={components:{Twinlist:f,CodeExample:h},data(){return{codeExample:V,selected:[],includeUnknownValues:!1,withMissing:["foo","I am missing","bar"],withUnknownValues:{includedValues:["foo","I am missing","bar"],excludedValues:["baz","I am missing on the left","baz2","baz3","baz4","baz5","baz6","baz7","baz8","baz9","baz10","baz11"],includeUnknownValues:!0},selectedUnknown:[],selectedSearchLabel:[],selected2:[],loadingIconRef:v(w)}},computed:{code(){return z},demoValues(){return[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"},{id:"baz7",text:"Baz 7"},{id:"baz8",text:"Baz 8"},{id:"baz9",text:"Baz 9"},{id:"baz10",text:"Baz 10"},{id:"baz11",text:"Baz 11"}]}},methods:{updateExcludedMissing(r){this.excludedMissing=r}}},_={class:"grid-container"},T={class:"grid-item-6"},S={class:"grid-item-6"},B={class:"grid-container"},k={class:"grid-item-6"},U={class:"grid-item-6"},L={class:"grid-container"},C={class:"grid-item-6"},y={class:"grid-item-6"},M={class:"grid-container"},E={class:"grid-item-6"},I={class:"grid-item-6"},P={class:"grid-container"},F={class:"grid-item-6"},R={class:"grid-item-6"},N={class:"grid-container"},D={class:"grid-item-6"},W={class:"grid-item-6"},j={class:"grid-container"},q={class:"grid-item-6"},A={class:"grid-item-6"},G={class:"grid-container"},H={class:"grid-item-6"},J={class:"grid-item-6"},K={class:"grid-container"},O={class:"grid-item-6"},Q={class:"grid-item-6"},X={class:"grid-container"},Y={class:"grid-item-12"};function Z(r,s,$,ee,l,d){const a=m("Twinlist",!0),c=m("CodeExample");return g(),p("div",null,[e("section",null,[s[9]||(s[9]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[n(" Two list boxes for selecting multiple items. It acts as a form element, so it emits an "),e("code",null,"input"),n(" event when selection changes, and it has a "),e("code",null,"value"),n(". For keyboard navigation inside of the lists see "),e("code",null,"MultiselectListBox"),n(". With "),e("code",null,"DoubleClick"),n(" the items can also be moved between the lists. ")])])],-1)),e("div",_,[e("div",T,[t(a,{modelValue:l.selected,"onUpdate:modelValue":s[0]||(s[0]=i=>l.selected=i),size:7,"left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":d.demoValues},null,8,["modelValue","possible-values"])]),e("div",S,"selected ids: "+o(l.selected),1)]),s[10]||(s[10]=e("br",null,null,-1)),e("div",B,[e("div",k,[t(a,{modelValue:l.selected,"onUpdate:modelValue":s[1]||(s[1]=i=>l.selected=i),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":d.demoValues,disabled:""},null,8,["modelValue","possible-values"])]),e("div",U,"selected ids: "+o(l.selected),1)]),s[11]||(s[11]=e("br",null,null,-1)),s[12]||(s[12]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null," The Twinlist with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1)),e("div",L,[e("div",C,[t(a,{modelValue:l.selected,"onUpdate:modelValue":s[2]||(s[2]=i=>l.selected=i),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","initial-search-term":"bar","possible-values":d.demoValues},null,8,["modelValue","possible-values"])]),e("div",y,"selected ids: "+o(l.selected),1)]),s[13]||(s[13]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with missing selected items.")])],-1)),e("div",M,[e("div",E,[t(a,{modelValue:l.withMissing,"onUpdate:modelValue":s[3]||(s[3]=i=>l.withMissing=i),"show-unknown-values":!0,size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":d.demoValues},null,8,["modelValue","possible-values"])]),e("div",I,o(l.withMissing),1)]),s[14]||(s[14]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with unknown items.")])],-1)),e("div",P,[e("div",F,[t(a,{modelValue:l.withUnknownValues,"onUpdate:modelValue":s[4]||(s[4]=i=>l.withUnknownValues=i),size:7,"show-search":"","show-unknown-values":!0,"unknown-values-text":"My unknowns","left-label":"Select from the visible items","right-label":"The selected stuff","search-placeholder":"Placeholder","possible-values":d.demoValues},null,8,["modelValue","possible-values"])]),e("div",R,"selected ids: "+o(l.withUnknownValues),1)]),s[15]||(s[15]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist can show a customizable search label.")])],-1)),e("div",N,[e("div",D,[t(a,{modelValue:l.selectedSearchLabel,"onUpdate:modelValue":s[5]||(s[5]=i=>l.selectedSearchLabel=i),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":d.demoValues},null,8,["modelValue","possible-values"])]),e("div",W,"selected ids: "+o(l.selectedSearchLabel),1)]),s[16]||(s[16]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The content visible in empty boxes is customizable.")])],-1)),e("div",j,[e("div",q,[t(a,{modelValue:l.selected2,"onUpdate:modelValue":s[6]||(s[6]=i=>l.selected2=i),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":d.demoValues,"empty-state-component":l.loadingIconRef},null,8,["modelValue","possible-values","empty-state-component"])]),e("div",A,"selected ids: "+o(l.selectedSearchLabel),1)]),s[17]||(s[17]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"Compact mode")])],-1)),e("div",G,[e("div",H,[t(a,{modelValue:l.selected2,"onUpdate:modelValue":s[7]||(s[7]=i=>l.selected2=i),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":d.demoValues,compact:""},null,8,["modelValue","possible-values"])]),e("div",J,"selected ids: "+o(l.selectedSearchLabel),1)]),s[18]||(s[18]=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"Resizable Twinlist")])],-1)),e("div",K,[e("div",O,[t(a,{modelValue:l.selected2,"onUpdate:modelValue":s[8]||(s[8]=i=>l.selected2=i),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":d.demoValues,compact:"","show-resize-handle":""},null,8,["modelValue","possible-values"])]),e("div",Q,"selected ids: "+o(l.selected2),1)])]),e("section",null,[e("div",X,[e("div",Y,[t(c,{summary:"Show usage example"},{default:u(()=>[n(o(l.codeExample),1)]),_:1}),t(c,{summary:"Show Twinlist.vue source code"},{default:u(()=>[n(o(d.code),1)]),_:1})])])])])}const he=b(x,[["render",Z]]);export{he as default};
