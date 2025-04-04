import{C as L}from"./CollapsiblePanel-TMGgCZO2.js";import{P as M,a as k}from"./ProgressItem-V3ft8JPu.js";import{o as n,c as E,b as m,i as g,U as l,l as u,w as r,d as p,u as f,E as I,aE as $,m as C,Q as x,P,aP as R,aQ as A,Z as V,F as z,g as N,_ as F,j as y}from"./index-d57f9Tmz.js";import{D as b}from"./cloud-download-5-YFec-f.js";import{T as H}from"./trash-DL4WG6t5.js";import{L as S}from"./LoadingIcon-ZLL0xlmw.js";import"./arrow-dropdown-CZDTfbFV.js";import"./ExpandTransition-BJklBbkJ.js";import"./Pill-ypq-wUT0.js";import"./knimeColors-Bti-OEOH.js";import"./ProgressBar-RStlE2Oh.js";import"./svgWithTitle-XKo3OYnF.js";const B={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},O=m("path",{d:"m21 3 5.2 5.2H21z"},null,-1),Y=m("path",{d:"M26.2 29H5.8V3H21l5.2 5.2zM13.1 3.3v10.9M13.1 10.8H15M13.1 7.8H15M13.1 4.8H15M11.2 12.3h1.9M11.2 9.3h1.9M11.2 6.3h1.9"},null,-1),q=m("path",{d:"M11.2 14.2v2.3c0 .5.8 1 1.9 1s1.9-.4 1.9-1v-2.3z"},null,-1),G=m("path",{fill:"#000",stroke:"none",d:"M10.946 21v5.484H10V21zm3.295 0-2.222 2.64-1.266 1.341-.165-.937.904-1.115L13.089 21zm-1.017 5.484-1.804-2.599.652-.644 2.275 3.243zM19.225 21v5.484h-.946l-2.46-3.928v3.928h-.945V21h.946l2.467 3.936V21zM22.555 21.73l-1.639 4.754h-.99L21.99 21h.632zm1.37 4.754-1.642-4.753.16-.731h.405l2.072 5.484zm-.702-2.034.259.75h-2.123l.258-.75zM25.534 21h1.94q.625 0 1.066.188.44.189.674.558.237.365.238.904 0 .411-.151.723a1.5 1.5 0 0 1-.426.527q-.275.211-.655.328l-.287.14H26.19l-.007-.75h1.307q.339 0 .565-.12.226-.121.339-.328a.96.96 0 0 0 .117-.475q0-.286-.113-.497a.73.73 0 0 0-.34-.328 1.3 1.3 0 0 0-.583-.117h-.994v4.731h-.946zm3.13 5.484-1.288-2.463.99-.004 1.308 2.418v.05z"},null,-1),U=[O,Y,q,G];function j(c,i){return n(),E("svg",B,[...U])}const Q={render:j},T=g({__name:"DownloadProgressPanelItem",props:{item:{}},emits:["remove","cancel","download"],setup(c,{emit:i}){const e=c,a=i,d={IN_PROGRESS:["Zipping","info",S],READY:["Ready","success",x],CANCELLED:["Cancelled","error",P],FAILED:["Failed","error",P]},v=l(()=>{const[t,o,s]=d[e.item.status],_=(e.item.status==="FAILED"||e.item.status==="CANCELLED")&&e.item.failureDetails;return{text:t,variant:o,icon:s,..._&&{tooltip:e.item.failureDetails}}}),w=l(()=>e.item.status==="IN_PROGRESS"),h=l(()=>e.item.status==="READY"),D=l(()=>e.item.status==="CANCELLED"||e.item.status==="FAILED"||e.item.status==="READY");return(t,o)=>(n(),u(M,{id:t.item.downloadId,title:t.item.name,"status-pill":v.value},{prepend:r(()=>[p(f(Q))]),actions:r(()=>[w.value?(n(),u(I,{key:0,"data-test-id":"cancel-action",title:"Cancel download",onClick:o[0]||(o[0]=s=>a("cancel"))},{default:r(()=>[p(f($),{class:"action-icon"})]),_:1})):C("",!0),h.value?(n(),u(I,{key:1,"data-test-id":"download-action",title:"Download item again",onClick:o[1]||(o[1]=s=>a("download"))},{default:r(()=>[p(f(b),{class:"action-icon"})]),_:1})):C("",!0),D.value?(n(),u(I,{key:2,"data-test-id":"remove-action",title:"Remove item",onClick:o[2]||(o[2]=s=>a("remove"))},{default:r(()=>[p(f(H),{class:"action-icon"})]),_:1})):C("",!0)]),_:1},8,["id","title","status-pill"]))}}),Z={class:"download-panel-content"},K=g({__name:"DownloadProgressPanel",props:R({items:{}},{expanded:{type:Boolean,default:!0},expandedModifiers:{}}),emits:R(["remove","cancel","download","close"],["update:expanded"]),setup(c,{emit:i}){const e=c,a=i,d=A(c,"expanded"),v=l(()=>e.items.length),w=l(()=>e.items.filter(({status:t})=>t==="READY").length),h=l(()=>`Downloaded ${w.value} of ${v.value} file(s)`),D=l(()=>e.items.some(({status:t})=>t==="IN_PROGRESS"));return V(()=>{var t;return(t=e.items)==null?void 0:t.length},(t,o)=>{o>0&&!t&&a("close")}),(t,o)=>(n(),u(L,{modelValue:d.value,"onUpdate:modelValue":o[0]||(o[0]=s=>d.value=s),title:h.value,class:"download-panel",closeable:!D.value,onClose:o[1]||(o[1]=s=>a("close"))},{default:r(()=>[m("div",Z,[p(k,null,{default:r(()=>[(n(!0),E(z,null,N(t.items,s=>(n(),u(T,{key:s.downloadId,item:s,onRemove:_=>a("remove",s),onCancel:_=>a("cancel",s),onDownload:_=>a("download",s)},null,8,["item","onRemove","onCancel","onDownload"]))),128))]),_:1})])]),_:1},8,["modelValue","title","closeable"]))}}),W=F(K,[["__scopeId","data-v-4817af56"]]),J={class:"grid-container"},X={class:"grid-item-12"},ue=g({__name:"DownloadProgressPanel",setup(c){const i=y(!0),e=[{name:"Important workflows",downloadId:"some-id",status:"READY"},{name:"My folder",downloadId:"some-id",status:"IN_PROGRESS"},{name:"Cool stuff",downloadId:"some-id",status:"CANCELLED",failureDetails:"Download was cancelled by user"},{name:"Other stuff",downloadId:"some-id",status:"FAILED",failureDetails:"We found a bug in the computer room"}];return(a,d)=>(n(),E("section",null,[m("div",J,[m("div",X,[p(f(W),{modelValue:i.value,"onUpdate:modelValue":d[0]||(d[0]=v=>i.value=v),items:e},null,8,["modelValue"])])])]))}});export{ue as default};
