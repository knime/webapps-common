import{C as ie}from"./CodeExample-D-AiiLXl.js";import{j as h,u as x,aP as se,U as D,V as I,aC as W,aQ as oe,aR as le,aS as ae,i as re,$ as ce,o as ue,c as pe,b as n,e as o,d as de,w as he,t as me,p as fe,f as He,_ as ve}from"./index-CBP2Mi8i.js";const S=h(!1),d=h(!1),m=h(null),ge=({storageKey:s,uniqueUserId:p,getRemoteHintState:l,setRemoteHintState:a})=>{const c=`${s}.${x(p)}`,i=se(c,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),r=D(()=>i.value.skipAll),w=async e=>{try{await a(s,e)}catch{consola.error("Updating remote hint state failed")}},_=async()=>{try{const e=await l(s);i.value={skipAll:e.skipAll??i.value.skipAll,completedHints:[...i.value.completedHints,...e.completedHints??[]]}}catch(e){consola.error("Getting hints from remote failed",e)}};I(i,e=>{!d.value||S.value||w(e)},{deep:!0});const b=e=>{m.value=e},u=e=>i.value.completedHints.includes(e)||!1,H=e=>{d.value&&(u(e)||r.value||m.value===e&&(i.value.completedHints.unshift(e),m.value=null))},A=e=>{d.value&&(u(e)||i.value.completedHints.unshift(e))},v=()=>{i.value.skipAll=!0,m.value=null};return{initialize:async()=>{r.value||d.value||S.value||(S.value=!0,await _(),d.value=!0,S.value=!1)},isInitialized:W(d),completeHint:H,completeHintWithoutVisibility:A,isCompleted:u,isAllSkipped:r,setSkipAll:v,currentlyVisibleHint:m,setCurrentlyVisibleHint:b}},f=()=>{},M={},Ce=({hints:s={},uniqueUserId:p="user",storageKey:l="onboarding.hints",skipHints:a=!1,getRemoteHintState:c=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)},r="default")=>{M[r]={hints:s,uniqueUserId:p,storageKey:l,skipHints:a,getRemoteHintState:c,setRemoteHintState:i}},ye=({hintSetupId:s="default"}={})=>{const{hints:p,uniqueUserId:l,storageKey:a,skipHints:c,getRemoteHintState:i,setRemoteHintState:r}=M[s];if(x(c))return{isCompleted:()=>!0,isAllSkipped:W(h(!0)),createHint:f,getCompleteHintComponentCallback:()=>f,completeHintWithoutComponent:()=>f};const{initialize:w,completeHint:_,completeHintWithoutVisibility:b,isCompleted:u,isAllSkipped:H,setSkipAll:A,currentlyVisibleHint:v,setCurrentlyVisibleHint:V}=ge({uniqueUserId:l,getRemoteHintState:i,setRemoteHintState:r,storageKey:a}),{createHintData:e}=oe();le(()=>{w()});const E=t=>p[t]||null,O=t=>{if(H.value||u(t))return!1;if(v.value)return v.value===t;const g=E(t),{dependsOn:T=[]}=g;return!!T.every(C=>u(C))},B={},R=t=>()=>{(B[t]||f)()},P=[],j=[];ae(()=>{P.forEach(t=>t()),j.forEach(t=>t()),V(null)});const $=({hintId:t,referenceSelector:g,referenceElement:T,isVisibleCondition:L=h(!0)})=>{const C=E(t);if(!C)return;const{title:N,description:q,linkText:G=void 0,linkHref:Q=void 0,video:F=[],referenceSelector:J=void 0,hideButtons:K=!1,align:X="center",side:Y="bottom"}=C;let y=f;const U=()=>_(t),Z=x(T)??g??J??`#${t}`,{showHint:ee,closeHint:k}=e({element:Z,title:N,description:q,linkText:G,linkHref:Q,video:F,hideButtons:K,onCompleteHint:()=>{y(),U(),k()},onSkipAllHints:()=>{A(),k()},align:X,side:Y});B[t]=()=>{y(),U(),k()};const te=D(()=>O(t)&&L.value);y=I(te,ne=>{ne&&(V(t),ee(),j.unshift(k))},{immediate:!0}),P.unshift(y)};return{isCompleted:u,isAllSkipped:W(H),createHint:$,getCompleteHintComponentCallback:R,completeHintWithoutComponent:b}},z=s=>(fe("data-v-b5001ae3"),s=s(),He(),s),ke={class:"grid-container"},Se={class:"grid-item-12"},we=z(()=>n("code",null,"useHint",-1)),_e=z(()=>n("ol",null,[n("li",null,[o(" Import and instantiate the "),n("code",null,"HintProvider"),o(" class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. ")]),n("li",null,[o(" Call "),n("code",null,"setupHints"),o(" and provide the hints as well as other configuration. ")]),n("li",null,[o(" Create hints with the "),n("code",null,"createHint"),o(" function that is returned by "),n("code",null,"useHint"),o(". ")])],-1)),be={class:"reference"},Ae=z(()=>n("span",{id:"also-nice"},"This is also content.",-1)),Ve=`
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

`,Ee=re({__name:"Hints",setup(s){Ce({hints:{showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}}});const{createHint:l}=ye(),a=h();ce(()=>{l({hintId:"showHintHere",referenceElement:a}),l({hintId:"also-nice"})});const c=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,r)=>(ue(),pe("section",null,[n("div",ke,[n("div",Se,[n("p",null,[o(" The "),we,o(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just "),n("a",{href:"#",onClick:c},"reset localStorage"),o(" and switch tabs or reload. ")]),o(" To use hints in your project: "),_e,n("p",be,[n("span",{ref_key:"referenceElement",ref:a},"This is some content we get a hint to.",512),Ae]),de(ie,{summary:"Show usage example"},{default:he(()=>[o(me(Ve))]),_:1})])])]))}}),We=ve(Ee,[["__scopeId","data-v-b5001ae3"]]);export{We as default};
