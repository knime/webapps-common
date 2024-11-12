import{C as ee}from"./CodeExample-Cw6u9Hw2.js";import{j as p,u as x,aP as te,U as M,V as O,aC as W,aQ as ne,aR as ie,aS as oe,i as se,$ as le,o as ae,c as re,b as n,e as s,d as ce,w as ue,t as pe,p as de,f as me,_ as he}from"./index-DPXeB2W_.js";const w=p(!1),u=p(!1),f=p(null),fe=({storageKey:o,uniqueUserId:d,getRemoteHintState:l,setRemoteHintState:a})=>{const m=`${o}.${x(d)}`,i=te(m,{completedHints:[],skipAll:!1},{deep:!0,listenToStorageChanges:!0}),r=M(()=>i.value.skipAll),_=async e=>{try{await a(o,e)}catch{consola.error("Updating remote hint state failed")}},b=async()=>{try{const e=await l(o);i.value={skipAll:i.value.skipAll||e.skipAll,completedHints:[...i.value.completedHints,...e.completedHints??[]]}}catch(e){consola.error("Getting hints from remote failed",e)}};O(i,e=>{!u.value||w.value||_(e)},{deep:!0});const h=e=>{f.value=e},c=e=>i.value.completedHints.includes(e)||!1,A=e=>{u.value&&(c(e)||r.value||f.value===e&&(i.value.completedHints.unshift(e),f.value=null))},v=e=>{u.value&&(c(e)||i.value.completedHints.unshift(e))},C=()=>{i.value.skipAll=!0,f.value=null};return{initialize:async()=>{r.value||u.value||w.value||(w.value=!0,await b(),u.value=!0,w.value=!1)},isInitialized:W(u),completeHint:A,completeHintWithoutVisibility:v,isCompleted:c,isAllSkipped:r,setSkipAll:C,currentlyVisibleHint:f,setCurrentlyVisibleHint:h}},H=()=>{},{createHint:He}=ne(),ve=({hints:o,uniqueUserId:d="user",storageKey:l="onboarding.hints",skipHints:a=!1,getRemoteHintState:m=()=>Promise.resolve({}),setRemoteHintState:i=()=>Promise.resolve(!1)})=>{if(x(a)){const t=p(!0);return{isCompleted:()=>!0,isAllSkipped:W(t),createHintComponent:H,getCompleteHintComponentCallback:()=>H,completeHintWithoutComponent:()=>H}}const{initialize:r,completeHint:_,completeHintWithoutVisibility:b,isCompleted:h,isAllSkipped:c,setSkipAll:A,currentlyVisibleHint:v,setCurrentlyVisibleHint:C}=fe({uniqueUserId:d,getRemoteHintState:m,setRemoteHintState:i,storageKey:l});ie(()=>{r()});const V=t=>o[t]||null,e=t=>{if(c.value||h(t))return!1;if(v.value)return v.value===t;const g=V(t),{dependsOn:T=[]}=g;return!!T.every(y=>h(y))},E={},U=t=>()=>{(E[t]||H)()},B=[],P=[];oe(()=>{B.forEach(t=>t()),P.forEach(t=>t()),C(null)});const $=({hintId:t,referenceSelector:g,referenceElement:T,isVisibleCondition:j=p(!0)})=>{const y=V(t);if(!y)return;const{title:D,description:I,linkText:N=void 0,linkHref:R=void 0,video:G=[],referenceSelector:Q=void 0,hideButtons:q=!1,align:F="center",side:J="bottom"}=y;let k=H;const L=()=>_(t),X=x(T)??g??Q??`#${t}`,{showHint:Y,closeHint:S}=He({element:X,title:D,description:I,linkText:N,linkHref:R,video:G,hideButtons:q,onCompleteHint:()=>{k(),L(),S()},onSkipAllHints:()=>{A(),S()},align:F,side:J});E[t]=()=>{k(),L(),S()};const Z=M(()=>e(t)&&j.value);k=O(Z,K=>{K&&(C(t),Y(),P.unshift(S))},{immediate:!0}),B.unshift(k)};return{isCompleted:h,isAllSkipped:W(c),createHintComponent:$,getCompleteHintComponentCallback:U,completeHintWithoutComponent:b}},z=o=>(de("data-v-fcd07e3e"),o=o(),me(),o),Ce={class:"grid-container"},ge={class:"grid-item-12"},ye=z(()=>n("code",null,"useHint",-1)),ke=z(()=>n("ol",null,[n("li",null,[s(" Import and instantiate the "),n("code",null,"HintProvider"),s(" class in the setup section of the root component of your project (e.g. App.vue). The class instance will display the toasts. ")]),n("li",null,[s(" Create hints with the "),n("code",null,"createHintComponent"),s(" function that is returned by "),n("code",null,"useHint"),s(". ")])],-1)),Se={class:"reference"},we=z(()=>n("span",{id:"also-nice"},"This is also content.",-1)),_e=`
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

const { createHintComponent } = useHint({
  hints,
});

// this is just one way of providing the reference, the default is the id of the hint in this case showHintHere
const referenceElement = ref<HTMLElement>();

onMounted(() => {
  createHintComponent({
    hintId: "showHintHere",
    referenceElement,
  });
});
<script>
<template>
  <HintProvider />
  <div ref="referenceElement">Text</div>
</template>

`,be=se({__name:"Hints",setup(o){const d={showHintHere:{title:"Look at this thing",description:"Isn't it awesome?",dependsOn:[],side:"right"},"also-nice":{title:"Seems to be also nice",description:"Well well what do we have here?",dependsOn:["showHintHere"]}},{createHintComponent:l}=ve({hints:d}),a=p();le(()=>{l({hintId:"showHintHere",referenceElement:a}),l({hintId:"also-nice"})});const m=()=>{window.localStorage.removeItem("onboarding.hints.user")};return(i,r)=>(ae(),re("section",null,[n("div",Ce,[n("div",ge,[n("p",null,[s(" The "),ye,s(" composable helps you easily display product hints. The completed hints are saved in local storage and that state can be synced with a remote backend optionally. Hints are closed on click outside of the hint. If you don't see the hint just "),n("a",{href:"#",onClick:m},"reset localStorage"),s(" and switch tabs or reload. ")]),s(" To use hints in your project: "),ke,n("p",Se,[n("span",{ref_key:"referenceElement",ref:a},"This is some content we get a hint to.",512),we]),ce(ee,{summary:"Show usage example"},{default:ue(()=>[s(pe(_e))]),_:1})])])]))}}),Ee=he(be,[["__scopeId","data-v-fcd07e3e"]]);export{Ee as default};
