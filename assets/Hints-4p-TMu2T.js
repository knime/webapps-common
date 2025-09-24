import{C as se}from"./CodeExample-La__JCd8.js";import{u as x,b5 as oe,K as M,Q as N,i as d,ah as _,b6 as le,b7 as ae,b8 as re,h as ce,aC as ue,c as de,o as pe,b as a,a as me,d as fe,e as y,w as He,t as he,_ as ve}from"./index-CdRYFHYy.js";const k=d(!1),u=d(!1),f=d(null),ge=({storageKey:s,uniqueUserId:c,getRemoteHintState:o,setRemoteHintState:l})=>{const r=`${s}.${x(c)}`,i=oe(r,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),n=M(()=>i.value.skipAll),w=async t=>{try{await l(s,t)}catch{consola.error("Updating remote hint state failed")}},S=async()=>{try{const t=await o(s);i.value={skipAll:t.skipAll??i.value.skipAll,completedHints:[...i.value.completedHints,...t.completedHints??[]]}}catch(t){consola.error("Getting hints from remote failed",t)}};N(i,t=>{!u.value||k.value||w(t)},{deep:!0});const A=t=>{f.value=t},p=t=>i.value.completedHints.includes(t)||!1,m=t=>{u.value&&(p(t)||n.value||f.value===t&&(i.value.completedHints.unshift(t),f.value=null))},h=t=>{u.value&&(p(t)||i.value.completedHints.unshift(t))},V=()=>{i.value.skipAll=!0,f.value=null};return{initialize:async()=>{n.value||u.value||k.value||(k.value=!0,await S(),u.value=!0,k.value=!1)},isInitialized:_(u),completeHint:m,completeHintWithoutVisibility:h,isCompleted:p,isAllSkipped:n,setSkipAll:V,currentlyVisibleHint:f,setCurrentlyVisibleHint:A}},H=()=>{},O={},be=({hints:s={},uniqueUserId:c="user",storageKey:o="onboarding.hints",skipHints:l=!1,getRemoteHintState:r=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)},n="default")=>{O[n]={hints:s,uniqueUserId:c,storageKey:o,skipHints:l,getRemoteHintState:r,setRemoteHintState:i}},Ce=({hintSetupId:s="default"}={})=>{const{hints:c,uniqueUserId:o,storageKey:l,skipHints:r,getRemoteHintState:i,setRemoteHintState:n}=O[s];if(x(r))return{isCompleted:()=>!0,isAllSkipped:_(d(!0)),createHint:H,getCompleteHintComponentCallback:()=>H,completeHintWithoutComponent:()=>H};const{initialize:w,isInitialized:S,completeHint:A,completeHintWithoutVisibility:p,isCompleted:m,isAllSkipped:h,setSkipAll:V,currentlyVisibleHint:E,setCurrentlyVisibleHint:t}=ge({uniqueUserId:o,getRemoteHintState:i,setRemoteHintState:n,storageKey:l}),{createHintData:z}=le();ae(()=>{w()});const W=e=>c[e]||null,U=e=>{if(h.value||!S.value||m(e))return!1;if(E.value)return E.value===e;const v=W(e),{dependsOn:T=[]}=v;return!!T.every(g=>m(g))},B={},R=e=>()=>{(B[e]||H)()},L=[],P=[];re(()=>{L.forEach(e=>e()),P.forEach(e=>e()),t(null)});const $=({hintId:e,referenceSelector:v,referenceElement:T,isVisibleCondition:j=d(!0)})=>{const g=W(e);if(!g)return;const{title:q,description:G,linkText:K=void 0,linkHref:Q=void 0,video:F=[],image:J=void 0,referenceSelector:X=void 0,hideButtons:Y=!1,align:Z="center",side:I="bottom"}=g;let b=H;const D=()=>A(e),ee=x(T)??v??X??`#${e}`,{showHint:te,closeHint:C}=z(e,{element:ee,title:q,description:G,linkText:K,linkHref:Q,video:F,image:J,hideButtons:Y,onCompleteHint:()=>{b(),D(),C(e)},onSkipAllHints:()=>{V(),C(e)},align:Z,side:I});B[e]=()=>{b(),D(),C(e)};const ne=M(()=>U(e)&&j.value);b=N(ne,ie=>{ie&&(t(e),te(e),P.unshift(()=>C(e)))},{immediate:!0}),L.unshift(b)};return{isCompleted:m,isAllSkipped:_(h),createHint:$,getCompleteHintComponentCallback:R,completeHintWithoutComponent:p}},ye={class:"grid-container"},ke={class:"grid-item-12"},we={class:"reference"},Se=`
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

`,Ae=ce({__name:"Hints",setup(s){be({hints:{showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}}});const{createHint:o}=Ce(),l=d();ue(()=>{o({hintId:"showHintHere",referenceElement:l}),o({hintId:"also-nice"})});const r=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,n)=>(pe(),de("section",null,[a("div",ye,[a("div",ke,[a("p",null,[n[0]||(n[0]=y(" The ",-1)),n[1]||(n[1]=a("code",null,"useHint",-1)),n[2]||(n[2]=y(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just ",-1)),a("a",{href:"#",onClick:r},"reset localStorage"),n[3]||(n[3]=y(" and switch tabs or reload. ",-1))]),n[5]||(n[5]=me(" To use hints in your project: <ol data-v-903eb8cc><li data-v-903eb8cc> Import and instantiate the <code data-v-903eb8cc>HintProvider</code> class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. </li><li data-v-903eb8cc> Call <code data-v-903eb8cc>setupHints</code> and provide the hints as well as other configuration. </li><li data-v-903eb8cc> Create hints with the <code data-v-903eb8cc>createHint</code> function that is returned by <code data-v-903eb8cc>useHint</code>. </li></ol>",2)),a("p",we,[a("span",{ref_key:"referenceElement",ref:l},"This is some content we get a hint to.",512),n[4]||(n[4]=a("span",{id:"also-nice"},"This is also content.",-1))]),fe(se,{summary:"Show usage example"},{default:He(()=>[y(he(Se))]),_:1})])])]))}}),Te=ve(Ae,[["__scopeId","data-v-903eb8cc"]]);export{Te as default};
