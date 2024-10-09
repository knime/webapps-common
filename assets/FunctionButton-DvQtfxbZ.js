import{C as B}from"./CodeExample-CMCcCmo3.js";import{M as F}from"./menu-options-DXsCzlRC.js";import{o as v,c as f,b as e,_ as I,A as x,L as w,r as a,d as t,w as o,e as l,t as d,p as b,f as g}from"./index-B9mTIsoU.js";const S={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},C=e("path",{d:"M9.3 26V4.7m-6.8 6.8 6.8-6.8 6.7 6.8M22.7 6v21.3m6.8-6.8-6.8 6.8-6.7-6.8"},null,-1),k=[C];function M(i,s){return v(),f("svg",S,[...k])}const y={render:M},O="",E="",L=`
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
`,A={components:{FunctionButton:x,MenuOptionsIcon:F,LensIcon:w,SorterIcon:y,CodeExample:B},data(){return{functionButtonCode:O,baseButtonCode:E,codeExample:L,active1:!1,active2:!1,active3:!1,subMenuItems:[{href:"https://apple.com",text:"Apples"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges"},{to:"/testing-nuxt-link",text:"Ananas"}]}}},u=i=>(b("data-v-3a00e3d4"),i=i(),g(),i),V={class:"grid-container"},D={class:"grid-item-12"},N=u(()=>e("p",null," The function button is a button with an optional active state, e.g. when a dropdown menu is expanded and can also be disabled. ",-1)),T=u(()=>e("p",null," Its primary use is together with the SubMenu component where it is included, but can also be used standalone. Works with an icon & text combination or a single icon. ",-1)),j={class:"align-horizontal"},z=u(()=>e("span",null,"Function",-1)),W=u(()=>e("span",null,"Function",-1)),q=u(()=>e("span",null,"Disabled Function",-1));function G(i,s,H,J,n,K){const h=a("LensIcon"),c=a("FunctionButton",!0),r=a("MenuOptionsIcon"),_=a("SorterIcon"),p=a("CodeExample");return v(),f("section",null,[e("div",V,[e("div",D,[N,T,e("div",j,[t(c,{active:n.active1,onClick:s[0]||(s[0]=m=>n.active1=!n.active1)},{default:o(()=>[t(h),z]),_:1},8,["active"]),t(c,{active:n.active2,onClick:s[1]||(s[1]=m=>n.active2=!n.active2)},{default:o(()=>[t(r)]),_:1},8,["active"]),t(c,{active:n.active3,onClick:s[2]||(s[2]=m=>n.active3=!n.active3)},{default:o(()=>[W,t(_)]),_:1},8,["active"]),t(c,{primary:""},{default:o(()=>[t(r)]),_:1}),t(c,{primary:"",compact:""},{default:o(()=>[t(r)]),_:1}),t(c,{disabled:""},{default:o(()=>[q,t(_)]),_:1})]),t(p,{summary:"Show usage example"},{default:o(()=>[l(d(n.codeExample),1)]),_:1}),t(p,{summary:"Show FunctionButton.vue source code"},{default:o(()=>[l(d(n.functionButtonCode),1)]),_:1}),t(p,{summary:"Show BaseButton.vue source code"},{default:o(()=>[l(d(n.baseButtonCode),1)]),_:1})])])])}const U=I(A,[["render",G],["__scopeId","data-v-3a00e3d4"]]);export{U as default};
