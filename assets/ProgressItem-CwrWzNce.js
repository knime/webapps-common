import{_ as d,o as a,c as o,H as l,i as p,b as t,t as i,m as n,l as c,w as _,s as m,e as u,n as g,d as v,h}from"./index-7ysoRW6Q.js";import{P as f}from"./activity-DFWcTy3o.js";import{P}from"./ProgressBar-Cpv1U2Ba.js";const y={},I={class:"progress-list"};function k(r,s){return a(),o("div",I,[l(r.$slots,"default",{},void 0,!0)])}const F=d(y,[["render",k],["__scopeId","data-v-c70c97aa"]]),$={class:"item-info"},b={class:"prepend"},B={class:"item-name"},C=["title"],E={key:0,class:"subtitle"},N={class:"item-action"},V={key:0,class:"progress"},w=60,D=p({__name:"ProgressItem",props:{id:{},title:{},subtitle:{},progress:{},statusPill:{}},setup(r){const s=r;return(e,H)=>(a(),o("div",{class:"progress-wrapper",style:h({height:`${w}px`})},[t("div",{class:g(["progress-item",{padded:!e.progress}])},[t("div",$,[t("div",b,[l(e.$slots,"prepend")]),t("div",B,[t("div",{class:"title",title:s.title},i(s.title),9,C),e.subtitle?(a(),o("span",E,i(e.subtitle),1)):n("",!0)])]),t("div",N,[s.statusPill?(a(),c(f,{key:0,variant:s.statusPill.variant},{default:_(()=>[(a(),c(m(s.statusPill.icon))),u(" "+i(s.statusPill.text),1)]),_:1},8,["variant"])):n("",!0),l(e.$slots,"actions")])],2),e.progress?(a(),o("div",V,[v(P,{percentage:e.progress,compact:!0},null,8,["percentage"])])):n("",!0)],4))}}),G=d(D,[["__scopeId","data-v-8230e252"]]);export{G as P,F as a};
