import{C as u}from"./CodeExample-Dv8cI43n.js";import{_ as b,x as v,r as h,o as g,c as p,b as e,d as t,t as o,w as m,e as c}from"./index-CmROaP7o.js";import{T as f}from"./Twinlist-CS1wN308.js";import{L as _}from"./LoadingIcon-BitBCqP6.js";import"./arrow-next-BDaDhK7E.js";import"./useSearch-cLI05DIs.js";import"./Label-C2PHWX4g.js";import"./MultiselectListBox-CKGo0VvX.js";import"./StyledListItem-D1m2RWS2.js";import"./createMissingItem-PGCdVBns.js";import"./useLabelInfo-DRQrccTn.js";import"./svgWithTitle-CSHuWrf8.js";const w="",z=`<Twinlist
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
/>`,V={components:{Twinlist:f,CodeExample:u},data(){return{codeExample:z,selected:[],includeUnknownValues:!1,withMissing:["foo","I am missing","bar"],withUnknownValues:{includedValues:["foo","I am missing","bar"],excludedValues:["baz","I am missing on the left","baz2","baz3","baz4","baz5","baz6","baz7","baz8","baz9","baz10","baz11"],includeUnknownValues:!0},selectedUnknown:[],selectedSearchLabel:[],selected2:[],loadingIconRef:v(_)}},computed:{code(){return w},demoValues(){return[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"},{id:"baz7",text:"Baz 7"},{id:"baz8",text:"Baz 8"},{id:"baz9",text:"Baz 9"},{id:"baz10",text:"Baz 10"},{id:"baz11",text:"Baz 11"}]}},methods:{updateExcludedMissing(n){this.excludedMissing=n}}},x=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[c(" Two list boxes for selecting multiple items. It acts as a form element, so it emits an "),e("code",null,"input"),c(" event when selection changes, and it has a "),e("code",null,"value"),c(". For keyboard navigation inside of the lists see "),e("code",null,"MultiselectListBox"),c(". With "),e("code",null,"DoubleClick"),c(" the items can also be moved between the lists. ")])])],-1),T={class:"grid-container"},S={class:"grid-item-6"},B={class:"grid-item-6"},k=e("br",null,null,-1),U={class:"grid-container"},L={class:"grid-item-6"},C={class:"grid-item-6"},y=e("br",null,null,-1),M=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null," The Twinlist with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),E={class:"grid-container"},I={class:"grid-item-6"},P={class:"grid-item-6"},F=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with missing selected items.")])],-1),R={class:"grid-container"},N={class:"grid-item-6"},D={class:"grid-item-6"},W=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with unknown items.")])],-1),j={class:"grid-container"},q={class:"grid-item-6"},A={class:"grid-item-6"},G=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist can show a customizable search label.")])],-1),H={class:"grid-container"},J={class:"grid-item-6"},K={class:"grid-item-6"},O=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The content visible in empty boxes is customizable.")])],-1),Q={class:"grid-container"},X={class:"grid-item-6"},Y={class:"grid-item-6"},Z=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"Compact mode")])],-1),$={class:"grid-container"},ee={class:"grid-item-6"},se={class:"grid-item-6"},le=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"Resizable Twinlist")])],-1),ie={class:"grid-container"},te={class:"grid-item-6"},oe={class:"grid-item-6"},ae={class:"grid-container"},de={class:"grid-item-12"};function ce(n,l,ne,re,s,a){const d=h("Twinlist",!0),r=h("CodeExample");return g(),p("div",null,[e("section",null,[x,e("div",T,[e("div",S,[t(d,{modelValue:s.selected,"onUpdate:modelValue":l[0]||(l[0]=i=>s.selected=i),size:7,"left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":a.demoValues},null,8,["modelValue","possible-values"])]),e("div",B,"selected ids: "+o(s.selected),1)]),k,e("div",U,[e("div",L,[t(d,{modelValue:s.selected,"onUpdate:modelValue":l[1]||(l[1]=i=>s.selected=i),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":a.demoValues,disabled:""},null,8,["modelValue","possible-values"])]),e("div",C,"selected ids: "+o(s.selected),1)]),y,M,e("div",E,[e("div",I,[t(d,{modelValue:s.selected,"onUpdate:modelValue":l[2]||(l[2]=i=>s.selected=i),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","initial-search-term":"bar","possible-values":a.demoValues},null,8,["modelValue","possible-values"])]),e("div",P,"selected ids: "+o(s.selected),1)]),F,e("div",R,[e("div",N,[t(d,{modelValue:s.withMissing,"onUpdate:modelValue":l[3]||(l[3]=i=>s.withMissing=i),"show-unknown-values":!0,size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":a.demoValues},null,8,["modelValue","possible-values"])]),e("div",D,o(s.withMissing),1)]),W,e("div",j,[e("div",q,[t(d,{modelValue:s.withUnknownValues,"onUpdate:modelValue":l[4]||(l[4]=i=>s.withUnknownValues=i),size:7,"show-search":"","show-unknown-values":!0,"unknown-values-text":"My unknowns","left-label":"Select from the visible items","right-label":"The selected stuff","search-placeholder":"Placeholder","possible-values":a.demoValues},null,8,["modelValue","possible-values"])]),e("div",A,"selected ids: "+o(s.withUnknownValues),1)]),G,e("div",H,[e("div",J,[t(d,{modelValue:s.selectedSearchLabel,"onUpdate:modelValue":l[5]||(l[5]=i=>s.selectedSearchLabel=i),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":a.demoValues},null,8,["modelValue","possible-values"])]),e("div",K,"selected ids: "+o(s.selectedSearchLabel),1)]),O,e("div",Q,[e("div",X,[t(d,{modelValue:s.selected2,"onUpdate:modelValue":l[6]||(l[6]=i=>s.selected2=i),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":a.demoValues,"empty-state-component":s.loadingIconRef},null,8,["modelValue","possible-values","empty-state-component"])]),e("div",Y,"selected ids: "+o(s.selectedSearchLabel),1)]),Z,e("div",$,[e("div",ee,[t(d,{modelValue:s.selected2,"onUpdate:modelValue":l[7]||(l[7]=i=>s.selected2=i),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":a.demoValues,compact:""},null,8,["modelValue","possible-values"])]),e("div",se,"selected ids: "+o(s.selectedSearchLabel),1)]),le,e("div",ie,[e("div",te,[t(d,{modelValue:s.selected2,"onUpdate:modelValue":l[8]||(l[8]=i=>s.selected2=i),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":a.demoValues,compact:"","show-resize-handle":""},null,8,["modelValue","possible-values"])]),e("div",oe,"selected ids: "+o(s.selected2),1)])]),e("section",null,[e("div",ae,[e("div",de,[t(r,{summary:"Show usage example"},{default:m(()=>[c(o(s.codeExample),1)]),_:1}),t(r,{summary:"Show Twinlist.vue source code"},{default:m(()=>[c(o(a.code),1)]),_:1})])])])])}const xe=b(V,[["render",ce]]);export{xe as default};
