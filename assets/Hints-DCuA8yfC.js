import{C as ie}from"./CodeExample-CTsqdZdU.js";import{j as m,u as x,aQ as se,U,Z as M,aA as W,aR as oe,aS as le,aT as ae,i as re,aD as ce,o as ue,c as pe,b as n,e as o,d as de,w as me,t as he,p as fe,f as He,_ as ve}from"./index-DJ-H-3jW.js";const S=m(!1),d=m(!1),h=m(null),ge=({storageKey:s,uniqueUserId:p,getRemoteHintState:l,setRemoteHintState:a})=>{const c=`${s}.${x(p)}`,i=se(c,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),r=U(()=>i.value.skipAll),w=async t=>{try{await a(s,t)}catch{consola.error("Updating remote hint state failed")}},_=async()=>{try{const t=await l(s);i.value={skipAll:t.skipAll??i.value.skipAll,completedHints:[...i.value.completedHints,...t.completedHints??[]]}}catch(t){consola.error("Getting hints from remote failed",t)}};M(i,t=>{!d.value||S.value||w(t)},{deep:!0});const b=t=>{h.value=t},u=t=>i.value.completedHints.includes(t)||!1,H=t=>{d.value&&(u(t)||r.value||h.value===t&&(i.value.completedHints.unshift(t),h.value=null))},A=t=>{d.value&&(u(t)||i.value.completedHints.unshift(t))},v=()=>{i.value.skipAll=!0,h.value=null};return{initialize:async()=>{r.value||d.value||S.value||(S.value=!0,await _(),d.value=!0,S.value=!1)},isInitialized:W(d),completeHint:H,completeHintWithoutVisibility:A,isCompleted:u,isAllSkipped:r,setSkipAll:v,currentlyVisibleHint:h,setCurrentlyVisibleHint:b}},f=()=>{},O={},Ce=({hints:s={},uniqueUserId:p="user",storageKey:l="onboarding.hints",skipHints:a=!1,getRemoteHintState:c=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)},r="default")=>{O[r]={hints:s,uniqueUserId:p,storageKey:l,skipHints:a,getRemoteHintState:c,setRemoteHintState:i}},ye=({hintSetupId:s="default"}={})=>{const{hints:p,uniqueUserId:l,storageKey:a,skipHints:c,getRemoteHintState:i,setRemoteHintState:r}=O[s];if(x(c))return{isCompleted:()=>!0,isAllSkipped:W(m(!0)),createHint:f,getCompleteHintComponentCallback:()=>f,completeHintWithoutComponent:()=>f};const{initialize:w,completeHint:_,completeHintWithoutVisibility:b,isCompleted:u,isAllSkipped:H,setSkipAll:A,currentlyVisibleHint:v,setCurrentlyVisibleHint:T}=ge({uniqueUserId:l,getRemoteHintState:i,setRemoteHintState:r,storageKey:a}),{createHintData:t}=oe();le(()=>{w()});const V=e=>p[e]||null,R=e=>{if(H.value||u(e))return!1;if(v.value)return v.value===e;const g=V(e),{dependsOn:E=[]}=g;return!!E.every(C=>u(C))},B={},N=e=>()=>{(B[e]||f)()},j=[],D=[];ae(()=>{j.forEach(e=>e()),D.forEach(e=>e()),T(null)});const $=({hintId:e,referenceSelector:g,referenceElement:E,isVisibleCondition:L=m(!0)})=>{const C=V(e);if(!C)return;const{title:q,description:G,linkText:Q=void 0,linkHref:Z=void 0,video:F=[],referenceSelector:J=void 0,hideButtons:K=!1,align:X="center",side:Y="bottom"}=C;let y=f;const P=()=>_(e),I=x(E)??g??J??`#${e}`,{showHint:ee,closeHint:k}=t(e,{element:I,title:q,description:G,linkText:Q,linkHref:Z,video:F,hideButtons:K,onCompleteHint:()=>{y(),P(),k(e)},onSkipAllHints:()=>{A(),k(e)},align:X,side:Y});B[e]=()=>{y(),P(),k(e)};const te=U(()=>R(e)&&L.value);y=M(te,ne=>{ne&&(T(e),ee(e),D.unshift(()=>k(e)))},{immediate:!0}),j.unshift(y)};return{isCompleted:u,isAllSkipped:W(H),createHint:$,getCompleteHintComponentCallback:N,completeHintWithoutComponent:b}},z=s=>(fe("data-v-b5001ae3"),s=s(),He(),s),ke={class:"grid-container"},Se={class:"grid-item-12"},we=z(()=>n("code",null,"useHint",-1)),_e=z(()=>n("ol",null,[n("li",null,[o(" Import and instantiate the "),n("code",null,"HintProvider"),o(" class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. ")]),n("li",null,[o(" Call "),n("code",null,"setupHints"),o(" and provide the hints as well as other configuration. ")]),n("li",null,[o(" Create hints with the "),n("code",null,"createHint"),o(" function that is returned by "),n("code",null,"useHint"),o(". ")])],-1)),be={class:"reference"},Ae=z(()=>n("span",{id:"also-nice"},"This is also content.",-1)),Te=`
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

`,Ve=re({__name:"Hints",setup(s){Ce({hints:{showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}}});const{createHint:l}=ye(),a=m();ce(()=>{l({hintId:"showHintHere",referenceElement:a}),l({hintId:"also-nice"})});const c=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,r)=>(ue(),pe("section",null,[n("div",ke,[n("div",Se,[n("p",null,[o(" The "),we,o(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just "),n("a",{href:"#",onClick:c},"reset localStorage"),o(" and switch tabs or reload. ")]),o(" To use hints in your project: "),_e,n("p",be,[n("span",{ref_key:"referenceElement",ref:a},"This is some content we get a hint to.",512),Ae]),de(ie,{summary:"Show usage example"},{default:me(()=>[o(he(Te))]),_:1})])])]))}}),We=ve(Ve,[["__scopeId","data-v-b5001ae3"]]);export{We as default};
