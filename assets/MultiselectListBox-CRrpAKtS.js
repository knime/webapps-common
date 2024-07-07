import{C as b}from"./CodeExample-CdSGOWvu.js";import{_ as x,r as n,o as z,c as p,b as e,d as i,t as l,w as r,e as m,a as v}from"./index-D1NgaLlG.js";import{M as _}from"./MultiselectListBox-BwVfX_T3.js";import"./StyledListItem-C1N-BfDW.js";const B="",h=`<MultiselectListBox
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
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
/>`,f={components:{MultiselectListBox:_,CodeExample:b},data(){return{codeExample:h,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return B}}},g=v('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),S={class:"grid-container"},V={class:"grid-item-6"},y={class:"grid-item-6"},w=e("br",null,null,-1),C={class:"grid-container"},M={class:"grid-item-6"},L={class:"grid-item-6"},E=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null," The MulitselectListBox can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),k={class:"grid-container"},U={class:"grid-item-6"},D={class:"grid-item-6"},F=e("br",null,null,-1),N={class:"grid-container"},A={class:"grid-item-6"},I={class:"grid-item-6"},T={class:"grid-container"},q={class:"grid-item-12"};function H(j,o,G,J,t,u){const d=n("MultiselectListBox",!0),a=n("CodeExample");return z(),p("div",null,[e("section",null,[g,e("div",S,[e("div",V,[i(d,{modelValue:t.selected,"onUpdate:modelValue":o[0]||(o[0]=s=>t.selected=s),size:4,"aria-label":"Select stuff here!","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(s,c)=>({id:`baz${c}`,text:`Baz ${c}`}))]},null,8,["modelValue","possible-values"])]),e("div",y,"selected ids: "+l(t.selected),1)]),w,e("div",C,[e("div",M,[i(d,{modelValue:t.disabledSelected,"onUpdate:modelValue":o[1]||(o[1]=s=>t.disabledSelected=s),size:4,"aria-label":"Disabled...","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue"])]),e("div",L,"selected ids: "+l(t.disabledSelected),1)]),E,e("div",k,[e("div",U,[i(d,{modelValue:t.selected2,"onUpdate:modelValue":o[2]||(o[2]=s=>t.selected2=s),size:4,"aria-label":"Select stuff here!","with-bottom-value":"","bottom-value":{id:t.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),e("div",D,"selected ids: "+l(t.selected2),1)]),F,e("div",N,[e("div",A,[i(d,{modelValue:t.disabledSelected2,"onUpdate:modelValue":o[3]||(o[3]=s=>t.disabledSelected2=s),size:4,"aria-label":"Disabled...","with-bottom-value":"","bottom-value":{id:t.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])]),e("div",I,"selected ids: "+l(t.disabledSelected2),1)])]),e("section",null,[e("div",T,[e("div",q,[i(a,{summary:"Show usage example"},{default:r(()=>[m(l(t.codeExample),1)]),_:1}),i(a,{summary:"Show MultiselectListBox.vue source code"},{default:r(()=>[m(l(u.code),1)]),_:1})])])])])}const R=x(f,[["render",H]]);export{R as default};
