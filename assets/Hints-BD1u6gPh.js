import{C as se}from"./CodeExample-CdSUoY0s.js";import{j as f,u as x,aU as oe,U as D,Z as M,aV as W,aW as le,aX as ae,aY as re,i as ce,aF as ue,o as pe,c as de,b as n,e as o,d as fe,w as me,t as he,p as He,f as ve,_ as ge}from"./index-VrLgZFLX.js";const S=f(!1),d=f(!1),m=f(null),Ce=({storageKey:s,uniqueUserId:p,getRemoteHintState:l,setRemoteHintState:a})=>{const c=`${s}.${x(p)}`,i=oe(c,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),r=D(()=>i.value.skipAll),w=async t=>{try{await a(s,t)}catch{consola.error("Updating remote hint state failed")}},_=async()=>{try{const t=await l(s);i.value={skipAll:t.skipAll??i.value.skipAll,completedHints:[...i.value.completedHints,...t.completedHints??[]]}}catch(t){consola.error("Getting hints from remote failed",t)}};M(i,t=>{!d.value||S.value||w(t)},{deep:!0});const b=t=>{m.value=t},u=t=>i.value.completedHints.includes(t)||!1,H=t=>{d.value&&(u(t)||r.value||m.value===t&&(i.value.completedHints.unshift(t),m.value=null))},A=t=>{d.value&&(u(t)||i.value.completedHints.unshift(t))},v=()=>{i.value.skipAll=!0,m.value=null};return{initialize:async()=>{r.value||d.value||S.value||(S.value=!0,await _(),d.value=!0,S.value=!1)},isInitialized:W(d),completeHint:H,completeHintWithoutVisibility:A,isCompleted:u,isAllSkipped:r,setSkipAll:v,currentlyVisibleHint:m,setCurrentlyVisibleHint:b}},h=()=>{},O={},ye=({hints:s={},uniqueUserId:p="user",storageKey:l="onboarding.hints",skipHints:a=!1,getRemoteHintState:c=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)},r="default")=>{O[r]={hints:s,uniqueUserId:p,storageKey:l,skipHints:a,getRemoteHintState:c,setRemoteHintState:i}},ke=({hintSetupId:s="default"}={})=>{const{hints:p,uniqueUserId:l,storageKey:a,skipHints:c,getRemoteHintState:i,setRemoteHintState:r}=O[s];if(x(c))return{isCompleted:()=>!0,isAllSkipped:W(f(!0)),createHint:h,getCompleteHintComponentCallback:()=>h,completeHintWithoutComponent:()=>h};const{initialize:w,completeHint:_,completeHintWithoutVisibility:b,isCompleted:u,isAllSkipped:H,setSkipAll:A,currentlyVisibleHint:v,setCurrentlyVisibleHint:V}=Ce({uniqueUserId:l,getRemoteHintState:i,setRemoteHintState:r,storageKey:a}),{createHintData:t}=le();ae(()=>{w()});const E=e=>p[e]||null,N=e=>{if(H.value||u(e))return!1;if(v.value)return v.value===e;const g=E(e),{dependsOn:T=[]}=g;return!!T.every(C=>u(C))},B={},R=e=>()=>{(B[e]||h)()},U=[],j=[];re(()=>{U.forEach(e=>e()),j.forEach(e=>e()),V(null)});const $=({hintId:e,referenceSelector:g,referenceElement:T,isVisibleCondition:L=f(!0)})=>{const C=E(e);if(!C)return;const{title:q,description:F,linkText:G=void 0,linkHref:X=void 0,video:Y=[],image:Z=void 0,referenceSelector:J=void 0,hideButtons:K=!1,align:Q="center",side:I="bottom"}=C;let y=h;const P=()=>_(e),ee=x(T)??g??J??`#${e}`,{showHint:te,closeHint:k}=t(e,{element:ee,title:q,description:F,linkText:G,linkHref:X,video:Y,image:Z,hideButtons:K,onCompleteHint:()=>{y(),P(),k(e)},onSkipAllHints:()=>{A(),k(e)},align:Q,side:I});B[e]=()=>{y(),P(),k(e)};const ne=D(()=>N(e)&&L.value);y=M(ne,ie=>{ie&&(V(e),te(e),j.unshift(()=>k(e)))},{immediate:!0}),U.unshift(y)};return{isCompleted:u,isAllSkipped:W(H),createHint:$,getCompleteHintComponentCallback:R,completeHintWithoutComponent:b}},z=s=>(He("data-v-b5001ae3"),s=s(),ve(),s),Se={class:"grid-container"},we={class:"grid-item-12"},_e=z(()=>n("code",null,"useHint",-1)),be=z(()=>n("ol",null,[n("li",null,[o(" Import and instantiate the "),n("code",null,"HintProvider"),o(" class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. ")]),n("li",null,[o(" Call "),n("code",null,"setupHints"),o(" and provide the hints as well as other configuration. ")]),n("li",null,[o(" Create hints with the "),n("code",null,"createHint"),o(" function that is returned by "),n("code",null,"useHint"),o(". ")])],-1)),Ae={class:"reference"},Ve=z(()=>n("span",{id:"also-nice"},"This is also content.",-1)),Ee=`
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

`,Te=ce({__name:"Hints",setup(s){ye({hints:{showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}}});const{createHint:l}=ke(),a=f();ue(()=>{l({hintId:"showHintHere",referenceElement:a}),l({hintId:"also-nice"})});const c=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,r)=>(pe(),de("section",null,[n("div",Se,[n("div",we,[n("p",null,[o(" The "),_e,o(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just "),n("a",{href:"#",onClick:c},"reset localStorage"),o(" and switch tabs or reload. ")]),o(" To use hints in your project: "),be,n("p",Ae,[n("span",{ref_key:"referenceElement",ref:a},"This is some content we get a hint to.",512),Ve]),fe(se,{summary:"Show usage example"},{default:me(()=>[o(he(Ee))]),_:1})])])]))}}),ze=ge(Te,[["__scopeId","data-v-b5001ae3"]]);export{ze as default};
