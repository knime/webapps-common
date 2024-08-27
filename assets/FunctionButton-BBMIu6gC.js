import{C as B}from"./CodeExample-CVf1718X.js";import{M as F}from"./menu-options-Ck5AYEv3.js";import{o as m,c as h,b as o,_ as I,v as x,L as w,r as a,d as t,w as e,e as l,t as p,p as b,f as g}from"./index-CJ4Ux8Wm.js";const S={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},C=o("path",{d:"M9.3 26V4.7m-6.8 6.8 6.8-6.8 6.7 6.8M22.7 6v21.3m6.8-6.8-6.8 6.8-6.7-6.8"},null,-1),k=[C];function M(c,s){return m(),h("svg",S,[...k])}const y={render:M},O="",E="",L=`
  <FunctionButton :active="active1">
    <LensIcon />
    <span>Function</span>
  </FunctionButton>

  <FunctionButton :active="active2">
    <MenuOptionsIcon />
  </FunctionButton>

  <FunctionButton :active="active3">
    <span>Sorter</span>
    <SorterIcon />
  </FunctionButton>

  <FunctionButton primary>
    <MenuOptionsIcon />
  </FunctionButton>

  <FunctionButton disabled>
    <span>Disabled Function</span>
    <SorterIcon />
  </FunctionButton>
`,V={components:{FunctionButton:x,MenuOptionsIcon:F,LensIcon:w,SorterIcon:y,CodeExample:B},data(){return{functionButtonCode:O,baseButtonCode:E,codeExample:L,active1:!1,active2:!1,active3:!1,subMenuItems:[{href:"https://apple.com",text:"Apples"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges"},{to:"/testing-nuxt-link",text:"Ananas"}]}}},u=c=>(b("data-v-a36588e4"),c=c(),g(),c),A={class:"grid-container"},D={class:"grid-item-12"},N=u(()=>o("p",null," The function button is a button with an optional active state, e.g. when a dropdown menu is expanded and can also be disabled. ",-1)),T=u(()=>o("p",null," Its primary use is together with the SubMenu component where it is included, but can also be used standalone. Works with an icon & text combination or a single icon. ",-1)),j={class:"align-horizontal"},z=u(()=>o("span",null,"Function",-1)),W=u(()=>o("span",null,"Function",-1)),q=u(()=>o("span",null,"Disabled Function",-1));function G(c,s,H,J,n,K){const f=a("LensIcon"),i=a("FunctionButton",!0),d=a("MenuOptionsIcon"),_=a("SorterIcon"),r=a("CodeExample");return m(),h("section",null,[o("div",A,[o("div",D,[N,T,o("div",j,[t(i,{active:n.active1,onClick:s[0]||(s[0]=v=>n.active1=!n.active1)},{default:e(()=>[t(f),z]),_:1},8,["active"]),t(i,{active:n.active2,onClick:s[1]||(s[1]=v=>n.active2=!n.active2)},{default:e(()=>[t(d)]),_:1},8,["active"]),t(i,{active:n.active3,onClick:s[2]||(s[2]=v=>n.active3=!n.active3)},{default:e(()=>[W,t(_)]),_:1},8,["active"]),t(i,{primary:""},{default:e(()=>[t(d)]),_:1}),t(i,{disabled:""},{default:e(()=>[q,t(_)]),_:1})]),t(r,{summary:"Show usage example"},{default:e(()=>[l(p(n.codeExample),1)]),_:1}),t(r,{summary:"Show FunctionButton.vue source code"},{default:e(()=>[l(p(n.functionButtonCode),1)]),_:1}),t(r,{summary:"Show BaseButton.vue source code"},{default:e(()=>[l(p(n.baseButtonCode),1)]),_:1})])])])}const U=I(V,[["render",G],["__scopeId","data-v-a36588e4"]]);export{U as default};
