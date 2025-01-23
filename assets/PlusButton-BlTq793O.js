import{C as b}from"./CodeExample-CTsqdZdU.js";import{i as B,G as f,T as y,_ as c,r,o as d,l as h,w as n,d as t,B as k,s as v,c as C,b as s,e as l,t as i}from"./index-DJ-H-3jW.js";import{P as x}from"./plus-small-DI3TzBE0.js";const $=B({name:"PlusButton",components:{Button:f,Tooltip:y,PlusIcon:x},inheritAttrs:!1,props:{title:{type:String,default:null}}});function g(a,p,m,_,u,P){const o=r("PlusIcon"),e=r("Button");return d(),h(v(a.title?"Tooltip":"div"),{text:a.title},{default:n(()=>[t(e,k({class:"plus-button"},a.$attrs),{default:n(()=>[t(o)]),_:1},16)]),_:1},8,["text"])}const w=c($,[["render",g],["__scopeId","data-v-23fb968f"]]),E="",S="",I=`
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
`,D={components:{PlusButton:w,CodeExample:b},data(){return{PlusButtonCode:E,buttonCode:S,codeExample:I}}},T={class:"grid-container"},N={class:"grid-item-12"},V={class:"wrapper"},A={class:"background"},G={class:"background"};function j(a,p,m,_,u,P){const o=r("PlusButton",!0),e=r("CodeExample");return d(),C("section",null,[s("div",T,[s("div",N,[s("div",V,[t(o,{title:"Plus button"}),s("div",A,[t(o,{title:"Plus button on dark","on-dark":!0,"with-border":""})]),t(o,{title:"Primary plus button",primary:""}),s("div",G,[t(o,{title:"Primary plus button on dark",primary:"","on-dark":!0})]),t(o,{title:"Disabled plus button",primary:"",disabled:""})]),t(e,{summary:"Show usage example"},{default:n(()=>[l(i(u.codeExample),1)]),_:1}),t(e,{summary:"Show PlusButton.vue source code"},{default:n(()=>[l(i(u.PlusButtonCode),1)]),_:1}),t(e,{summary:"Show Button.vue source code"},{default:n(()=>[l(i(u.buttonCode),1)]),_:1})])])])}const H=c(D,[["render",j],["__scopeId","data-v-eab16ac8"]]);export{H as default};
