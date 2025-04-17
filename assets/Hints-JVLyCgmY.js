import{C as oe}from"./CodeExample-De-ZhIBf.js";import{j as d,u as T,aU as le,U as M,Z as O,aV as x,aW as ae,aX as re,aY as ce,i as ue,aF as pe,o as de,c as fe,b as n,e as o,d as me,w as he,t as He,p as ve,f as ge,_ as Ce}from"./index-BT_OPtLP.js";const S=d(!1),p=d(!1),h=d(null),ye=({storageKey:s,uniqueUserId:u,getRemoteHintState:l,setRemoteHintState:a})=>{const c=`${s}.${T(u)}`,i=le(c,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),r=M(()=>i.value.skipAll),w=async t=>{try{await a(s,t)}catch{consola.error("Updating remote hint state failed")}},_=async()=>{try{const t=await l(s);i.value={skipAll:t.skipAll??i.value.skipAll,completedHints:[...i.value.completedHints,...t.completedHints??[]]}}catch(t){consola.error("Getting hints from remote failed",t)}};O(i,t=>{!p.value||S.value||w(t)},{deep:!0});const b=t=>{h.value=t},f=t=>i.value.completedHints.includes(t)||!1,m=t=>{p.value&&(f(t)||r.value||h.value===t&&(i.value.completedHints.unshift(t),h.value=null))},v=t=>{p.value&&(f(t)||i.value.completedHints.unshift(t))},A=()=>{i.value.skipAll=!0,h.value=null};return{initialize:async()=>{r.value||p.value||S.value||(S.value=!0,await _(),p.value=!0,S.value=!1)},isInitialized:x(p),completeHint:m,completeHintWithoutVisibility:v,isCompleted:f,isAllSkipped:r,setSkipAll:A,currentlyVisibleHint:h,setCurrentlyVisibleHint:b}},H=()=>{},N={},ke=({hints:s={},uniqueUserId:u="user",storageKey:l="onboarding.hints",skipHints:a=!1,getRemoteHintState:c=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)},r="default")=>{N[r]={hints:s,uniqueUserId:u,storageKey:l,skipHints:a,getRemoteHintState:c,setRemoteHintState:i}},Se=({hintSetupId:s="default"}={})=>{const{hints:u,uniqueUserId:l,storageKey:a,skipHints:c,getRemoteHintState:i,setRemoteHintState:r}=N[s];if(T(c))return{isCompleted:()=>!0,isAllSkipped:x(d(!0)),createHint:H,getCompleteHintComponentCallback:()=>H,completeHintWithoutComponent:()=>H};const{initialize:w,isInitialized:_,completeHint:b,completeHintWithoutVisibility:f,isCompleted:m,isAllSkipped:v,setSkipAll:A,currentlyVisibleHint:V,setCurrentlyVisibleHint:t}=ye({uniqueUserId:l,getRemoteHintState:i,setRemoteHintState:r,storageKey:a}),{createHintData:z}=ae();re(()=>{w()});const B=e=>u[e]||null,R=e=>{if(v.value||!_.value||m(e))return!1;if(V.value)return V.value===e;const g=B(e),{dependsOn:E=[]}=g;return!!E.every(C=>m(C))},U={},$=e=>()=>{(U[e]||H)()},j=[],L=[];ce(()=>{j.forEach(e=>e()),L.forEach(e=>e()),t(null)});const q=({hintId:e,referenceSelector:g,referenceElement:E,isVisibleCondition:P=d(!0)})=>{const C=B(e);if(!C)return;const{title:F,description:G,linkText:X=void 0,linkHref:Y=void 0,video:Z=[],image:J=void 0,referenceSelector:K=void 0,hideButtons:Q=!1,align:I="center",side:ee="bottom"}=C;let y=H;const D=()=>b(e),te=T(E)??g??K??`#${e}`,{showHint:ne,closeHint:k}=z(e,{element:te,title:F,description:G,linkText:X,linkHref:Y,video:Z,image:J,hideButtons:Q,onCompleteHint:()=>{y(),D(),k(e)},onSkipAllHints:()=>{A(),k(e)},align:I,side:ee});U[e]=()=>{y(),D(),k(e)};const ie=M(()=>R(e)&&P.value);y=O(ie,se=>{se&&(t(e),ne(e),L.unshift(()=>k(e)))},{immediate:!0}),j.unshift(y)};return{isCompleted:m,isAllSkipped:x(v),createHint:q,getCompleteHintComponentCallback:$,completeHintWithoutComponent:f}},W=s=>(ve("data-v-b5001ae3"),s=s(),ge(),s),we={class:"grid-container"},_e={class:"grid-item-12"},be=W(()=>n("code",null,"useHint",-1)),Ae=W(()=>n("ol",null,[n("li",null,[o(" Import and instantiate the "),n("code",null,"HintProvider"),o(" class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. ")]),n("li",null,[o(" Call "),n("code",null,"setupHints"),o(" and provide the hints as well as other configuration. ")]),n("li",null,[o(" Create hints with the "),n("code",null,"createHint"),o(" function that is returned by "),n("code",null,"useHint"),o(". ")])],-1)),Ve={class:"reference"},Ee=W(()=>n("span",{id:"also-nice"},"This is also content.",-1)),Te=`
<script setup lang="ts">
import { type HintConfiguration, useHint } from "@knime/components";

const hints: Record<string, HintConfiguration> = {
  showHintHere: {
    title: "Look at this thing",
    description: "Isn't it awesome?",
    dependsOn: [],
    side: "right",
  },
};

setupHints({ hints });
const { createHint } = useHint();

// this is just one way of providing the reference, the default is the id of the hint in this case showHintHere
const referenceElement = ref<HTMLElement>();

onMounted(() => {
  createHint({
    hintId: "showHintHere",
    referenceElement,
  });
});
<script>
<template>
  <HintProvider />
  <div ref="referenceElement">Text</div>
</template>

`,xe=ue({__name:"Hints",setup(s){ke({hints:{showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}}});const{createHint:l}=Se(),a=d();pe(()=>{l({hintId:"showHintHere",referenceElement:a}),l({hintId:"also-nice"})});const c=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,r)=>(de(),fe("section",null,[n("div",we,[n("div",_e,[n("p",null,[o(" The "),be,o(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just "),n("a",{href:"#",onClick:c},"reset localStorage"),o(" and switch tabs or reload. ")]),o(" To use hints in your project: "),Ae,n("p",Ve,[n("span",{ref_key:"referenceElement",ref:a},"This is some content we get a hint to.",512),Ee]),me(oe,{summary:"Show usage example"},{default:he(()=>[o(He(Te))]),_:1})])])]))}}),Be=Ce(xe,[["__scopeId","data-v-b5001ae3"]]);export{Be as default};
