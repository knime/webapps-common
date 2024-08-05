import{C as b}from"./CodeExample-BTENbHyW.js";import{u as B,T as f,_ as c,r as u,o as d,j as y,w as n,d as t,y as h,k,c as v,b as s,e as l,t as i}from"./index-Ba_qbvjF.js";import{B as C}from"./Button-BTrx-3wD.js";import{P as x}from"./plus-small-CHhvrJ_W.js";const $=B({components:{Button:C,Tooltip:f,PlusIcon:x},inheritAttrs:!1,props:{title:{type:String,default:null}}});function g(a,p,m,_,r,P){const o=u("PlusIcon"),e=u("Button");return d(),y(k(a.title?"Tooltip":"div"),{text:a.title},{default:n(()=>[t(e,h({class:"plus-button"},a.$attrs),{default:n(()=>[t(o)]),_:1},16)]),_:1},8,["text"])}const w=c($,[["render",g],["__scopeId","data-v-9519a4ca"]]),E="",S="",I=`
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
`,D={components:{PlusButton:w,CodeExample:b},data(){return{PlusButtonCode:E,buttonCode:S,codeExample:I}}},T={class:"grid-container"},N={class:"grid-item-12"},V={class:"wrapper"},j={class:"background"},A={class:"background"};function q(a,p,m,_,r,P){const o=u("PlusButton",!0),e=u("CodeExample");return d(),v("section",null,[s("div",T,[s("div",N,[s("div",V,[t(o,{title:"Plus button"}),s("div",j,[t(o,{title:"Plus button on dark","on-dark":!0,"with-border":""})]),t(o,{title:"Primary plus button",primary:""}),s("div",A,[t(o,{title:"Primary plus button on dark",primary:"","on-dark":!0})]),t(o,{title:"Disabled plus button",primary:"",disabled:""})]),t(e,{summary:"Show usage example"},{default:n(()=>[l(i(r.codeExample),1)]),_:1}),t(e,{summary:"Show PlusButton.vue source code"},{default:n(()=>[l(i(r.PlusButtonCode),1)]),_:1}),t(e,{summary:"Show Button.vue source code"},{default:n(()=>[l(i(r.buttonCode),1)]),_:1})])])])}const J=c(D,[["render",q],["__scopeId","data-v-2ea712d3"]]);export{J as default};
