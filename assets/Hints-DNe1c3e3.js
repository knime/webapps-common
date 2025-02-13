import{C as ie}from"./CodeExample-BSO2ClGj.js";import{j as f,u as x,aP as se,U as D,Z as M,az as z,aQ as oe,aR as le,aS as ae,i as re,aC as ce,o as ue,c as pe,b as n,e as o,d as de,w as fe,t as me,p as he,f as He,_ as ve}from"./index-BQ16rUV-.js";const S=f(!1),d=f(!1),m=f(null),ge=({storageKey:s,uniqueUserId:p,getRemoteHintState:l,setRemoteHintState:a})=>{const c=`${s}.${x(p)}`,i=se(c,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),r=D(()=>i.value.skipAll),w=async t=>{try{await a(s,t)}catch{consola.error("Updating remote hint state failed")}},_=async()=>{try{const t=await l(s);i.value={skipAll:t.skipAll??i.value.skipAll,completedHints:[...i.value.completedHints,...t.completedHints??[]]}}catch(t){consola.error("Getting hints from remote failed",t)}};M(i,t=>{!d.value||S.value||w(t)},{deep:!0});const b=t=>{m.value=t},u=t=>i.value.completedHints.includes(t)||!1,H=t=>{d.value&&(u(t)||r.value||m.value===t&&(i.value.completedHints.unshift(t),m.value=null))},A=t=>{d.value&&(u(t)||i.value.completedHints.unshift(t))},v=()=>{i.value.skipAll=!0,m.value=null};return{initialize:async()=>{r.value||d.value||S.value||(S.value=!0,await _(),d.value=!0,S.value=!1)},isInitialized:z(d),completeHint:H,completeHintWithoutVisibility:A,isCompleted:u,isAllSkipped:r,setSkipAll:v,currentlyVisibleHint:m,setCurrentlyVisibleHint:b}},h=()=>{},O={},Ce=({hints:s={},uniqueUserId:p="user",storageKey:l="onboarding.hints",skipHints:a=!1,getRemoteHintState:c=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)},r="default")=>{O[r]={hints:s,uniqueUserId:p,storageKey:l,skipHints:a,getRemoteHintState:c,setRemoteHintState:i}},ye=({hintSetupId:s="default"}={})=>{const{hints:p,uniqueUserId:l,storageKey:a,skipHints:c,getRemoteHintState:i,setRemoteHintState:r}=O[s];if(x(c))return{isCompleted:()=>!0,isAllSkipped:z(f(!0)),createHint:h,getCompleteHintComponentCallback:()=>h,completeHintWithoutComponent:()=>h};const{initialize:w,completeHint:_,completeHintWithoutVisibility:b,isCompleted:u,isAllSkipped:H,setSkipAll:A,currentlyVisibleHint:v,setCurrentlyVisibleHint:V}=ge({uniqueUserId:l,getRemoteHintState:i,setRemoteHintState:r,storageKey:a}),{createHintData:t}=oe();le(()=>{w()});const E=e=>p[e]||null,R=e=>{if(H.value||u(e))return!1;if(v.value)return v.value===e;const g=E(e),{dependsOn:T=[]}=g;return!!T.every(C=>u(C))},B={},N=e=>()=>{(B[e]||h)()},P=[],j=[];ae(()=>{P.forEach(e=>e()),j.forEach(e=>e()),V(null)});const $=({hintId:e,referenceSelector:g,referenceElement:T,isVisibleCondition:L=f(!0)})=>{const C=E(e);if(!C)return;const{title:q,description:G,linkText:Q=void 0,linkHref:Z=void 0,video:F=[],referenceSelector:J=void 0,hideButtons:K=!1,align:X="center",side:Y="bottom"}=C;let y=h;const U=()=>_(e),I=x(T)??g??J??`#${e}`,{showHint:ee,closeHint:k}=t(e,{element:I,title:q,description:G,linkText:Q,linkHref:Z,video:F,hideButtons:K,onCompleteHint:()=>{y(),U(),k(e)},onSkipAllHints:()=>{A(),k(e)},align:X,side:Y});B[e]=()=>{y(),U(),k(e)};const te=D(()=>R(e)&&L.value);y=M(te,ne=>{ne&&(V(e),ee(e),j.unshift(()=>k(e)))},{immediate:!0}),P.unshift(y)};return{isCompleted:u,isAllSkipped:z(H),createHint:$,getCompleteHintComponentCallback:N,completeHintWithoutComponent:b}},W=s=>(he("data-v-b5001ae3"),s=s(),He(),s),ke={class:"grid-container"},Se={class:"grid-item-12"},we=W(()=>n("code",null,"useHint",-1)),_e=W(()=>n("ol",null,[n("li",null,[o(" Import and instantiate the "),n("code",null,"HintProvider"),o(" class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. ")]),n("li",null,[o(" Call "),n("code",null,"setupHints"),o(" and provide the hints as well as other configuration. ")]),n("li",null,[o(" Create hints with the "),n("code",null,"createHint"),o(" function that is returned by "),n("code",null,"useHint"),o(". ")])],-1)),be={class:"reference"},Ae=W(()=>n("span",{id:"also-nice"},"This is also content.",-1)),Ve=`
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

`,Ee=re({__name:"Hints",setup(s){Ce({hints:{showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}}});const{createHint:l}=ye(),a=f();ce(()=>{l({hintId:"showHintHere",referenceElement:a}),l({hintId:"also-nice"})});const c=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,r)=>(ue(),pe("section",null,[n("div",ke,[n("div",Se,[n("p",null,[o(" The "),we,o(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just "),n("a",{href:"#",onClick:c},"reset localStorage"),o(" and switch tabs or reload. ")]),o(" To use hints in your project: "),_e,n("p",be,[n("span",{ref_key:"referenceElement",ref:a},"This is some content we get a hint to.",512),Ae]),de(ie,{summary:"Show usage example"},{default:fe(()=>[o(me(Ve))]),_:1})])])]))}}),ze=ve(Ee,[["__scopeId","data-v-b5001ae3"]]);export{ze as default};
