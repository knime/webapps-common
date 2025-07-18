import{C as m}from"./CodeExample-BaY81WdC.js";import{_ as r,r as d,o as p,c as u,b as e,d as t,w as a,e as n,t as c}from"./index-cg89Jb5o.js";import{S as x}from"./StyledListItem-dCBPGFYy.js";const _="",S=`<ul>
  <StyledListItem
    text="Normal"
  />
  <StyledListItem
    text="Selected"
    selected
  />
  <StyledListItem
    text="Special"
    special
  />
  <StyledListItem
    text="Invalid"
    invalid
  />
  <StyledListItem
    text="Disabled"
    disabled
  />
  <StyledListItem
    text="With line height"
    :line-height="40"
  />
</ul>
`,h={components:{StyledListItem:x,CodeExample:m},data(){return{code:_,codeExample:S}}},y={class:"grid-container"},I={class:"grid-item-12"},v={class:"grid-container"},L={class:"grid-item-12"};function f(g,l,b,C,i,E){const s=d("StyledListItem",!0),o=d("CodeExample");return p(),u("section",null,[e("section",null,[e("div",y,[e("div",I,[l[0]||(l[0]=e("p",null,"A li element with several styles",-1)),e("ul",null,[t(s,{text:"Normal"}),t(s,{text:"Selected",selected:""}),t(s,{text:"Special",special:""}),t(s,{text:"Invalid",invalid:""}),t(s,{text:"Disabled",disabled:""}),t(s,{text:"With line height","line-height":40})])])])]),e("section",null,[e("div",v,[e("div",L,[t(o,{summary:"Show usage example"},{default:a(()=>[n(c(i.codeExample),1)]),_:1}),t(o,{summary:"Show SubMenu.vue source code"},{default:a(()=>[n(c(i.code),1)]),_:1})])])])])}const D=r(h,[["render",f],["__scopeId","data-v-cbc292a4"]]);export{D as default};
