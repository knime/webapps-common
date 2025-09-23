import{C as b}from"./CodeExample-NCvYdFgG.js";import{h as B,T as f,C as y,_ as i,r,k as h,o as c,w as n,d as t,y as k,p as C,c as v,b as s,e as l,t as d}from"./index-DJjVodiF.js";import{P as x}from"./plus-small-ClHcAPlz.js";const $=B({name:"PlusButton",components:{Button:y,Tooltip:f,PlusIcon:x},inheritAttrs:!1,props:{title:{type:String,default:null}}});function g(a,p,m,_,u,P){const o=r("PlusIcon"),e=r("Button");return c(),h(C(a.title?"Tooltip":"div"),{text:a.title},{default:n(()=>[t(e,k({class:"plus-button"},a.$attrs),{default:n(()=>[t(o)]),_:1},16)]),_:1},8,["text"])}const w=i($,[["render",g],["__scopeId","data-v-de759f33"]]),E="",S="",I=`
  <PlusButton title="Plus button"/>

  <PlusButton
    title="Plus button on dark"
    on-dark
    with-border
  />

  <PlusButton
    title="Primary plus button"
    primary
  />

  <PlusButton
    title="Primary plus button on dark"
    primary
    on-dark
  />

  <PlusButton
    title="Disabled plus button"
    primary
    disabled
  />
`,D={components:{PlusButton:w,CodeExample:b},data(){return{PlusButtonCode:E,buttonCode:S,codeExample:I}}},T={class:"grid-container"},N={class:"grid-item-12"},V={class:"wrapper"},A={class:"background"},j={class:"background"};function q(a,p,m,_,u,P){const o=r("PlusButton",!0),e=r("CodeExample");return c(),v("section",null,[s("div",T,[s("div",N,[s("div",V,[t(o,{title:"Plus button"}),s("div",A,[t(o,{title:"Plus button on dark","on-dark":!0,"with-border":""})]),t(o,{title:"Primary plus button",primary:""}),s("div",j,[t(o,{title:"Primary plus button on dark",primary:"","on-dark":!0})]),t(o,{title:"Disabled plus button",primary:"",disabled:""})]),t(e,{summary:"Show usage example"},{default:n(()=>[l(d(u.codeExample),1)]),_:1}),t(e,{summary:"Show PlusButton.vue source code"},{default:n(()=>[l(d(u.PlusButtonCode),1)]),_:1}),t(e,{summary:"Show Button.vue source code"},{default:n(()=>[l(d(u.buttonCode),1)]),_:1})])])])}const H=i(D,[["render",q],["__scopeId","data-v-ad49fe4a"]]);export{H as default};
