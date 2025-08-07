import{o as m,c as v,b as i,_,B as F,L as x,r as u,d as t,w as e,e as r,t as l}from"./index-BVMwdkus.js";import{M as w}from"./menu-options-C_L3WU7M.js";import{C as I}from"./CodeExample-Bs47VSD6.js";const b={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"};function g(f,n){return m(),v("svg",b,n[0]||(n[0]=[i("path",{d:"M9.3 26V4.7m-6.8 6.8 6.8-6.8 6.7 6.8M22.7 6v21.3m6.8-6.8-6.8 6.8-6.7-6.8"},null,-1)]))}const C={render:g},k="",M="",S=`
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
`,y={components:{FunctionButton:F,MenuOptionsIcon:w,LensIcon:x,SorterIcon:C,CodeExample:I},data(){return{functionButtonCode:k,baseButtonCode:M,codeExample:S,active1:!1,active2:!1,active3:!1,subMenuItems:[{href:"https://apple.com",text:"Apples"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges"},{to:"/testing-nuxt-link",text:"Ananas"}]}}},h={class:"grid-container"},O={class:"grid-item-12"},E={class:"align-horizontal"};function L(f,n,V,A,o,D){const B=u("LensIcon"),s=u("FunctionButton",!0),c=u("MenuOptionsIcon"),p=u("SorterIcon"),a=u("CodeExample");return m(),v("section",null,[i("div",h,[i("div",O,[n[6]||(n[6]=i("p",null," The function button is a button with an optional active state, e.g. when a dropdown menu is expanded and can also be disabled. ",-1)),n[7]||(n[7]=i("p",null," Its primary use is together with the SubMenu component where it is included, but can also be used standalone. Works with an icon & text combination or a single icon. ",-1)),i("div",E,[t(s,{active:o.active1,onClick:n[0]||(n[0]=d=>o.active1=!o.active1)},{default:e(()=>[t(B),n[3]||(n[3]=i("span",null,"Function",-1))]),_:1},8,["active"]),t(s,{active:o.active2,onClick:n[1]||(n[1]=d=>o.active2=!o.active2)},{default:e(()=>[t(c)]),_:1},8,["active"]),t(s,{active:o.active3,onClick:n[2]||(n[2]=d=>o.active3=!o.active3)},{default:e(()=>[n[4]||(n[4]=i("span",null,"Function",-1)),t(p)]),_:1},8,["active"]),t(s,{primary:""},{default:e(()=>[t(c)]),_:1}),t(s,{primary:"",compact:""},{default:e(()=>[t(c)]),_:1}),t(s,{disabled:""},{default:e(()=>[n[5]||(n[5]=i("span",null,"Disabled Function",-1)),t(p)]),_:1})]),t(a,{summary:"Show usage example"},{default:e(()=>[r(l(o.codeExample),1)]),_:1}),t(a,{summary:"Show FunctionButton.vue source code"},{default:e(()=>[r(l(o.functionButtonCode),1)]),_:1}),t(a,{summary:"Show BaseButton.vue source code"},{default:e(()=>[r(l(o.baseButtonCode),1)]),_:1})])])])}const z=_(y,[["render",L],["__scopeId","data-v-4a42e218"]]);export{z as default};
