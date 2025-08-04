import{C as se}from"./CodeExample-CO0OY_WG.js";import{i as d,u as x,aW as oe,R as M,X as N,al as _,aX as ae,aY as le,aZ as re,h as ce,aE as ue,o as de,c as pe,b as l,e as y,a as me,d as fe,w as He,t as he,_ as ve}from"./index-CZy0S33y.js";const k=d(!1),u=d(!1),f=d(null),ge=({storageKey:s,uniqueUserId:c,getRemoteHintState:o,setRemoteHintState:a})=>{const r=`${s}.${x(c)}`,i=oe(r,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),n=M(()=>i.value.skipAll),w=async t=>{try{await a(s,t)}catch{consola.error("Updating remote hint state failed")}},S=async()=>{try{const t=await o(s);i.value={skipAll:t.skipAll??i.value.skipAll,completedHints:[...i.value.completedHints,...t.completedHints??[]]}}catch(t){consola.error("Getting hints from remote failed",t)}};N(i,t=>{!u.value||k.value||w(t)},{deep:!0});const A=t=>{f.value=t},p=t=>i.value.completedHints.includes(t)||!1,m=t=>{u.value&&(p(t)||n.value||f.value===t&&(i.value.completedHints.unshift(t),f.value=null))},h=t=>{u.value&&(p(t)||i.value.completedHints.unshift(t))},V=()=>{i.value.skipAll=!0,f.value=null};return{initialize:async()=>{n.value||u.value||k.value||(k.value=!0,await S(),u.value=!0,k.value=!1)},isInitialized:_(u),completeHint:m,completeHintWithoutVisibility:h,isCompleted:p,isAllSkipped:n,setSkipAll:V,currentlyVisibleHint:f,setCurrentlyVisibleHint:A}},H=()=>{},O={},Ce=({hints:s={},uniqueUserId:c="user",storageKey:o="onboarding.hints",skipHints:a=!1,getRemoteHintState:r=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)},n="default")=>{O[n]={hints:s,uniqueUserId:c,storageKey:o,skipHints:a,getRemoteHintState:r,setRemoteHintState:i}},be=({hintSetupId:s="default"}={})=>{const{hints:c,uniqueUserId:o,storageKey:a,skipHints:r,getRemoteHintState:i,setRemoteHintState:n}=O[s];if(x(r))return{isCompleted:()=>!0,isAllSkipped:_(d(!0)),createHint:H,getCompleteHintComponentCallback:()=>H,completeHintWithoutComponent:()=>H};const{initialize:w,isInitialized:S,completeHint:A,completeHintWithoutVisibility:p,isCompleted:m,isAllSkipped:h,setSkipAll:V,currentlyVisibleHint:E,setCurrentlyVisibleHint:t}=ge({uniqueUserId:o,getRemoteHintState:i,setRemoteHintState:n,storageKey:a}),{createHintData:W}=ae();le(()=>{w()});const z=e=>c[e]||null,R=e=>{if(h.value||!S.value||m(e))return!1;if(E.value)return E.value===e;const v=z(e),{dependsOn:T=[]}=v;return!!T.every(g=>m(g))},B={},U=e=>()=>{(B[e]||H)()},L=[],P=[];re(()=>{L.forEach(e=>e()),P.forEach(e=>e()),t(null)});const $=({hintId:e,referenceSelector:v,referenceElement:T,isVisibleCondition:j=d(!0)})=>{const g=z(e);if(!g)return;const{title:X,description:q,linkText:G=void 0,linkHref:Y=void 0,video:Z=[],image:F=void 0,referenceSelector:J=void 0,hideButtons:K=!1,align:Q="center",side:I="bottom"}=g;let C=H;const D=()=>A(e),ee=x(T)??v??J??`#${e}`,{showHint:te,closeHint:b}=W(e,{element:ee,title:X,description:q,linkText:G,linkHref:Y,video:Z,image:F,hideButtons:K,onCompleteHint:()=>{C(),D(),b(e)},onSkipAllHints:()=>{V(),b(e)},align:Q,side:I});B[e]=()=>{C(),D(),b(e)};const ne=M(()=>R(e)&&j.value);C=N(ne,ie=>{ie&&(t(e),te(e),P.unshift(()=>b(e)))},{immediate:!0}),L.unshift(C)};return{isCompleted:m,isAllSkipped:_(h),createHint:$,getCompleteHintComponentCallback:U,completeHintWithoutComponent:p}},ye={class:"grid-container"},ke={class:"grid-item-12"},we={class:"reference"},Se=`
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

`,Ae=ce({__name:"Hints",setup(s){Ce({hints:{showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}}});const{createHint:o}=be(),a=d();ue(()=>{o({hintId:"showHintHere",referenceElement:a}),o({hintId:"also-nice"})});const r=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,n)=>(de(),pe("section",null,[l("div",ye,[l("div",ke,[l("p",null,[n[0]||(n[0]=y(" The ")),n[1]||(n[1]=l("code",null,"useHint",-1)),n[2]||(n[2]=y(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just ")),l("a",{href:"#",onClick:r},"reset localStorage"),n[3]||(n[3]=y(" and switch tabs or reload. "))]),n[5]||(n[5]=me(" To use hints in your project: <ol data-v-b5001ae3><li data-v-b5001ae3> Import and instantiate the <code data-v-b5001ae3>HintProvider</code> class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. </li><li data-v-b5001ae3> Call <code data-v-b5001ae3>setupHints</code> and provide the hints as well as other configuration. </li><li data-v-b5001ae3> Create hints with the <code data-v-b5001ae3>createHint</code> function that is returned by <code data-v-b5001ae3>useHint</code>. </li></ol>",2)),l("p",we,[l("span",{ref_key:"referenceElement",ref:a},"This is some content we get a hint to.",512),n[4]||(n[4]=l("span",{id:"also-nice"},"This is also content.",-1))]),fe(se,{summary:"Show usage example"},{default:He(()=>[y(he(Se))]),_:1})])])]))}}),Te=ve(Ae,[["__scopeId","data-v-b5001ae3"]]);export{Te as default};
