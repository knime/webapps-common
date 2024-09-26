import{C as b}from"./CodeExample-DQPkqLA4.js";import{x as B,T as f,_ as i,r as a,o as c,j as y,w as n,d as t,A as h,k,c as v,b as s,e as l,t as d}from"./index-d1g5uQfM.js";import{B as x}from"./Button-Bec5Qs-T.js";import{P as C}from"./plus-small-CZLPakWa.js";const $=B({name:"PlusButton",components:{Button:x,Tooltip:f,PlusIcon:C},inheritAttrs:!1,props:{title:{type:String,default:null}}});function g(r,p,m,_,u,P){const o=a("PlusIcon"),e=a("Button");return c(),y(k(r.title?"Tooltip":"div"),{text:r.title},{default:n(()=>[t(e,h({class:"plus-button"},r.$attrs),{default:n(()=>[t(o)]),_:1},16)]),_:1},8,["text"])}const w=i($,[["render",g],["__scopeId","data-v-34df4dbd"]]),E="",S="",I=`
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
`,D={components:{PlusButton:w,CodeExample:b},data(){return{PlusButtonCode:E,buttonCode:S,codeExample:I}}},T={class:"grid-container"},N={class:"grid-item-12"},V={class:"wrapper"},A={class:"background"},j={class:"background"};function q(r,p,m,_,u,P){const o=a("PlusButton",!0),e=a("CodeExample");return c(),v("section",null,[s("div",T,[s("div",N,[s("div",V,[t(o,{title:"Plus button"}),s("div",A,[t(o,{title:"Plus button on dark","on-dark":!0,"with-border":""})]),t(o,{title:"Primary plus button",primary:""}),s("div",j,[t(o,{title:"Primary plus button on dark",primary:"","on-dark":!0})]),t(o,{title:"Disabled plus button",primary:"",disabled:""})]),t(e,{summary:"Show usage example"},{default:n(()=>[l(d(u.codeExample),1)]),_:1}),t(e,{summary:"Show PlusButton.vue source code"},{default:n(()=>[l(d(u.PlusButtonCode),1)]),_:1}),t(e,{summary:"Show Button.vue source code"},{default:n(()=>[l(d(u.buttonCode),1)]),_:1})])])])}const J=i(D,[["render",q],["__scopeId","data-v-2ea712d3"]]);export{J as default};
