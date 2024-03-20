import{C as Ln}from"./CodeExample-kpHnBKWW.js";import{aA as K,aB as G,ai as P,aC as H,aD as Sn,aE as W,aF as On,aG as k,aH as j,am as nn,aj as en,aI as $,ak as Mn,aJ as tn,aK as mn,aL as Vn,aM as Cn,al as $n,aN as Dn,aO as Rn,ah as Fn,aP as Nn,o as B,c as L,b as w,q as Un,G as F,E as rn,J as Gn,d as x,x as O,y as M,Z as T,w as E,s as V,F as Kn,$ as Hn,_ as gn,r as sn,t as N,e as on}from"./index-PwVCY_2T.js";import{M as Xn}from"./MultiselectListBox-zdlbwpdc.js";import{c as Zn}from"./createMissingItem-gAI5zZ9a.js";import"./StyledListItem-7X7kHGEE.js";var qn=/\s/;function zn(n){for(var e=n.length;e--&&qn.test(n.charAt(e)););return e}var Jn=/^\s+/;function Yn(n){return n&&n.slice(0,zn(n)+1).replace(Jn,"")}var an=NaN,Qn=/^[-+]0x[0-9a-f]+$/i,Wn=/^0b[01]+$/i,kn=/^0o[0-7]+$/i,jn=parseInt;function ne(n){if(typeof n=="number")return n;if(K(n))return an;if(G(n)){var e=typeof n.valueOf=="function"?n.valueOf():n;n=G(e)?e+"":e}if(typeof n!="string")return n===0?n:+n;n=Yn(n);var t=Wn.test(n);return t||kn.test(n)?jn(n.slice(2),t?2:8):Qn.test(n)?an:+n}var ln=1/0,ee=17976931348623157e292;function te(n){if(!n)return n===0?n:0;if(n=ne(n),n===ln||n===-ln){var e=n<0?-1:1;return e*ee}return n===n?n:0}function re(n){var e=te(n),t=e%1;return e===e?t?e-t:e:0}function se(n,e,t,r){for(var i=n.length,s=t+(r?1:-1);r?s--:++s<i;)if(e(n[s],s,n))return s;return-1}function ie(n){return n!==n}function oe(n,e,t){for(var r=t-1,i=n.length;++r<i;)if(n[r]===e)return r;return-1}function ae(n,e,t){return e===e?oe(n,e,t):se(n,ie,t)}var le=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,ue=/^\w*$/;function X(n,e){if(P(n))return!1;var t=typeof n;return t=="number"||t=="symbol"||t=="boolean"||n==null||K(n)?!0:ue.test(n)||!le.test(n)||e!=null&&n in Object(e)}var de="Expected a function";function Z(n,e){if(typeof n!="function"||e!=null&&typeof e!="function")throw new TypeError(de);var t=function(){var r=arguments,i=e?e.apply(this,r):r[0],s=t.cache;if(s.has(i))return s.get(i);var o=n.apply(this,r);return t.cache=s.set(i,o)||s,o};return t.cache=new(Z.Cache||H),t}Z.Cache=H;var ce=500;function fe(n){var e=Z(n,function(r){return t.size===ce&&t.clear(),r}),t=e.cache;return e}var pe=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,me=/\\(\\)?/g,ge=fe(function(n){var e=[];return n.charCodeAt(0)===46&&e.push(""),n.replace(pe,function(t,r,i,s){e.push(i?s.replace(me,"$1"):r||t)}),e});function vn(n,e){return P(n)?n:X(n,e)?[n]:ge(Sn(n))}var ve=1/0;function R(n){if(typeof n=="string"||K(n))return n;var e=n+"";return e=="0"&&1/n==-ve?"-0":e}function wn(n,e){e=vn(e,n);for(var t=0,r=e.length;n!=null&&t<r;)n=n[R(e[t++])];return t&&t==r?n:void 0}function we(n,e,t){var r=n==null?void 0:wn(n,e);return r===void 0?t:r}var _e="__lodash_hash_undefined__";function he(n){return this.__data__.set(n,_e),this}function xe(n){return this.__data__.has(n)}function D(n){var e=-1,t=n==null?0:n.length;for(this.__data__=new H;++e<t;)this.add(n[e])}D.prototype.add=D.prototype.push=he;D.prototype.has=xe;function be(n,e){for(var t=-1,r=n==null?0:n.length;++t<r;)if(e(n[t],t,n))return!0;return!1}function ye(n,e){return n.has(e)}var Ae=1,Ie=2;function _n(n,e,t,r,i,s){var o=t&Ae,a=n.length,u=e.length;if(a!=u&&!(o&&u>a))return!1;var p=s.get(n),v=s.get(e);if(p&&v)return p==e&&v==n;var f=-1,d=!0,h=t&Ie?new D:void 0;for(s.set(n,e),s.set(e,n);++f<a;){var g=n[f],_=e[f];if(r)var b=o?r(_,g,f,e,n,s):r(g,_,f,n,e,s);if(b!==void 0){if(b)continue;d=!1;break}if(h){if(!be(e,function(l,c){if(!ye(h,c)&&(g===l||i(g,l,t,r,s)))return h.push(c)})){d=!1;break}}else if(!(g===_||i(g,_,t,r,s))){d=!1;break}}return s.delete(n),s.delete(e),d}function Te(n){var e=-1,t=Array(n.size);return n.forEach(function(r,i){t[++e]=[i,r]}),t}function Pe(n){var e=-1,t=Array(n.size);return n.forEach(function(r){t[++e]=r}),t}var Ee=1,Be=2,Le="[object Boolean]",Se="[object Date]",Oe="[object Error]",Me="[object Map]",Ve="[object Number]",Ce="[object RegExp]",$e="[object Set]",De="[object String]",Re="[object Symbol]",Fe="[object ArrayBuffer]",Ne="[object DataView]",un=W?W.prototype:void 0,U=un?un.valueOf:void 0;function Ue(n,e,t,r,i,s,o){switch(t){case Ne:if(n.byteLength!=e.byteLength||n.byteOffset!=e.byteOffset)return!1;n=n.buffer,e=e.buffer;case Fe:return!(n.byteLength!=e.byteLength||!s(new k(n),new k(e)));case Le:case Se:case Ve:return On(+n,+e);case Oe:return n.name==e.name&&n.message==e.message;case Ce:case De:return n==e+"";case Me:var a=Te;case $e:var u=r&Ee;if(a||(a=Pe),n.size!=e.size&&!u)return!1;var p=o.get(n);if(p)return p==e;r|=Be,o.set(n,e);var v=_n(a(n),a(e),r,i,s,o);return o.delete(n),v;case Re:if(U)return U.call(n)==U.call(e)}return!1}var Ge=1,Ke=Object.prototype,He=Ke.hasOwnProperty;function Xe(n,e,t,r,i,s){var o=t&Ge,a=j(n),u=a.length,p=j(e),v=p.length;if(u!=v&&!o)return!1;for(var f=u;f--;){var d=a[f];if(!(o?d in e:He.call(e,d)))return!1}var h=s.get(n),g=s.get(e);if(h&&g)return h==e&&g==n;var _=!0;s.set(n,e),s.set(e,n);for(var b=o;++f<u;){d=a[f];var l=n[d],c=e[d];if(r)var m=o?r(c,l,d,e,n,s):r(l,c,d,n,e,s);if(!(m===void 0?l===c||i(l,c,t,r,s):m)){_=!1;break}b||(b=d=="constructor")}if(_&&!b){var y=n.constructor,A=e.constructor;y!=A&&"constructor"in n&&"constructor"in e&&!(typeof y=="function"&&y instanceof y&&typeof A=="function"&&A instanceof A)&&(_=!1)}return s.delete(n),s.delete(e),_}var Ze=1,dn="[object Arguments]",cn="[object Array]",C="[object Object]",qe=Object.prototype,fn=qe.hasOwnProperty;function ze(n,e,t,r,i,s){var o=P(n),a=P(e),u=o?cn:nn(n),p=a?cn:nn(e);u=u==dn?C:u,p=p==dn?C:p;var v=u==C,f=p==C,d=u==p;if(d&&en(n)){if(!en(e))return!1;o=!0,v=!1}if(d&&!v)return s||(s=new $),o||Mn(n)?_n(n,e,t,r,i,s):Ue(n,e,u,t,r,i,s);if(!(t&Ze)){var h=v&&fn.call(n,"__wrapped__"),g=f&&fn.call(e,"__wrapped__");if(h||g){var _=h?n.value():n,b=g?e.value():e;return s||(s=new $),i(_,b,t,r,s)}}return d?(s||(s=new $),Xe(n,e,t,r,i,s)):!1}function q(n,e,t,r,i){return n===e?!0:n==null||e==null||!tn(n)&&!tn(e)?n!==n&&e!==e:ze(n,e,t,r,q,i)}var Je=1,Ye=2;function Qe(n,e,t,r){var i=t.length,s=i,o=!r;if(n==null)return!s;for(n=Object(n);i--;){var a=t[i];if(o&&a[2]?a[1]!==n[a[0]]:!(a[0]in n))return!1}for(;++i<s;){a=t[i];var u=a[0],p=n[u],v=a[1];if(o&&a[2]){if(p===void 0&&!(u in n))return!1}else{var f=new $;if(r)var d=r(p,v,u,n,e,f);if(!(d===void 0?q(v,p,Je|Ye,r,f):d))return!1}}return!0}function hn(n){return n===n&&!G(n)}function We(n){for(var e=mn(n),t=e.length;t--;){var r=e[t],i=n[r];e[t]=[r,i,hn(i)]}return e}function xn(n,e){return function(t){return t==null?!1:t[n]===e&&(e!==void 0||n in Object(t))}}function ke(n){var e=We(n);return e.length==1&&e[0][2]?xn(e[0][0],e[0][1]):function(t){return t===n||Qe(t,n,e)}}function je(n,e){return n!=null&&e in Object(n)}function nt(n,e,t){e=vn(e,n);for(var r=-1,i=e.length,s=!1;++r<i;){var o=R(e[r]);if(!(s=n!=null&&t(n,o)))break;n=n[o]}return s||++r!=i?s:(i=n==null?0:n.length,!!i&&Vn(i)&&Cn(o,i)&&(P(n)||$n(n)))}function et(n,e){return n!=null&&nt(n,e,je)}var tt=1,rt=2;function st(n,e){return X(n)&&hn(e)?xn(R(n),e):function(t){var r=we(t,n);return r===void 0&&r===e?et(t,n):q(e,r,tt|rt)}}function it(n){return function(e){return e==null?void 0:e[n]}}function ot(n){return function(e){return wn(e,n)}}function at(n){return X(n)?it(R(n)):ot(n)}function lt(n){return typeof n=="function"?n:n==null?Dn:typeof n=="object"?P(n)?st(n[0],n[1]):ke(n):at(n)}function ut(n,e,t,r){for(var i=-1,s=n==null?0:n.length;++i<s;){var o=n[i];e(r,o,t(o),n)}return r}function dt(n,e){return n&&Rn(n,e,mn)}function ct(n,e){return function(t,r){if(t==null)return t;if(!Fn(t))return n(t,r);for(var i=t.length,s=e?i:-1,o=Object(t);(e?s--:++s<i)&&r(o[s],s,o)!==!1;);return t}}var ft=ct(dt);function pt(n,e,t,r){return ft(n,function(i,s,o){e(r,i,t(i),o)}),r}function bn(n,e){return function(t,r){var i=P(t)?ut:pt,s=e?e():{};return i(t,n,lt(r),s)}}var mt=Math.max;function gt(n,e,t){var r=n==null?0:n.length;if(!r)return-1;var i=t==null?0:re(t);return i<0&&(i=mt(r+i,0)),ae(n,e,i)}var vt=bn(function(n,e,t){Nn(n,t,e)}),wt=bn(function(n,e,t){n[t?0:1].push(e)},function(){return[[],[]]});const _t={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},ht=w("path",{d:"m27 17.1-11 11-11-11m11 11V3.9"},null,-1),xt=[ht];function bt(n,e){return B(),L("svg",_t,[...xt])}const yt={render:bt},At={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},It=w("path",{d:"m5 14.9 11-11 11 11m-11-11v24.2"},null,-1),Tt=[It];function Pt(n,e){return B(),L("svg",At,[...Tt])}const Et={render:Pt},Bt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000",viewBox:"0 0 32 32"},Lt=w("path",{d:"M23.4 13.4 16 20.8l-7.4-7.4m7.4 7.4V4.5m12.5 23h-25"},null,-1),St=[Lt];function Ot(n,e){return B(),L("svg",Bt,[...St])}const Mt={render:Ot},Vt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Ct=w("path",{d:"m8.6 11.888 7.413-7.414 7.413 7.414m-7.413-7.414v16.361M28.5 27.526h-25"},null,-1),$t=[Ct];function Dt(n,e){return B(),L("svg",Vt,[...$t])}const Rt={render:Dt},Ft={class:"buttons"},Nt=Un({__name:"SortList",props:{modelValue:{},id:{},ariaLabel:{},disabled:{type:Boolean},possibleValues:{}},emits:["update:modelValue"],setup(n,{emit:e}){const t=n,r=e,i=F(()=>vt(t.possibleValues,"id")),s=F(()=>t.modelValue.map(l=>i.value[l]??Zn(l))),o=rn([]);Gn(()=>t.modelValue,l=>{const c=new Set(l);o.value=o.value.filter(m=>c.has(m))});const a=F(()=>o.value.length===0),u=(l,c,m)=>[l.slice(0,c),l.slice(c,m),l.slice(m)],p=l=>{let c=0;return m=>l(m,c++)},v=(l,c)=>wt(l,p((m,y)=>c(y))),f=rn(null),d=l=>({to:c}={})=>{const m=o.value.map(I=>gt(t.modelValue,I)).sort((I,S)=>I-S),y=(l==="up"?c:null)??Math.max(m[0]-1,0),A=(l==="down"?c:null)??m[m.length-1]+1,[yn,An,In]=u(t.modelValue,y,A+1),Tn=new Set(m),[z,J]=v(An,I=>Tn.has(I+y)),[Pn,En]=l==="up"?[z,J]:[J,z],Bn=yn.concat(Pn,En,In);r("update:modelValue",Bn),Hn(()=>{var I,S,Y,Q;l==="up"?((I=f.value)==null||I.scrollUpIntoView(y-1),(S=f.value)==null||S.setCurrentKeyNavIndex(y)):((Y=f.value)==null||Y.scrollDownIntoView(A+1),(Q=f.value)==null||Q.setCurrentKeyNavIndex(A))})},h=d("up"),g=d("down"),_=()=>h({to:0}),b=()=>g({to:t.modelValue.length});return(l,c)=>(B(),L(Kn,null,[x(Xn,{id:l.id,ref_key:"listBox",ref:f,modelValue:o.value,"onUpdate:modelValue":c[0]||(c[0]=m=>o.value=m),"possible-values":s.value,ariaLabel:`sortListBox_${l.ariaLabel}`,"with-is-empty-state":!0,"empty-state-label":"Empty",size:10,onKeydown:[O(M(T(g),["alt"]),["down"]),O(M(T(h),["alt"]),["up"]),O(M(_,["alt"]),["home"]),O(M(b,["alt"]),["end"])]},null,8,["id","modelValue","possible-values","ariaLabel","onKeydown"]),w("div",Ft,[x(V,{disabled:a.value,title:"Move to top",compact:"",onClick:_},{default:E(()=>[x(T(Rt))]),_:1},8,["disabled"]),x(V,{disabled:a.value,title:"Move to bottom",compact:"",onClick:b},{default:E(()=>[x(T(Mt))]),_:1},8,["disabled"]),x(V,{disabled:a.value,title:"Move up",compact:"",onClick:T(h)},{default:E(()=>[x(T(Et))]),_:1},8,["disabled","onClick"]),x(V,{disabled:a.value,title:"Move down",compact:"",onClick:T(g)},{default:E(()=>[x(T(yt))]),_:1},8,["disabled","onClick"])])],64))}}),Ut=gn(Nt,[["__scopeId","data-v-98bb2fe5"]]),Gt=`<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { partition, indexOf, keyBy } from "lodash-es";
import MultiselectListBox from "./MultiselectListBox.vue";
import ArrowDownIcon from "../../assets/img/icons/arrow-down.svg";
import ArrowUpIcon from "../../assets/img/icons/arrow-up.svg";
import ArrowDownloadIcon from "../../assets/img/icons/arrow-download.svg";
import ArrowUploadIcon from "../../assets/img/icons/arrows-upload.svg";
import FunctionButton from "../FunctionButton.vue";
import createMissingItem from "./possibleValues/createMissingItem";
import type { PossibleValue } from "./possibleValues/PossibleValue";

export interface Props {
  modelValue: string[];
  id?: string;
  ariaLabel: string;
  disabled?: boolean;
  possibleValues: (PossibleValue & { id: string })[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [string[]];
}>();

const possibleValuesMap = computed(() => keyBy(props.possibleValues, "id"));

const possibleValues = computed(() =>
  props.modelValue.map(
    (id) => possibleValuesMap.value[id] ?? createMissingItem(id),
  ),
);

const selected = ref<string[]>([]);
watch(
  () => props.modelValue,
  (newValues) => {
    const newValuesSet = new Set(newValues);
    selected.value = selected.value.filter((item) => newValuesSet.has(item));
  },
);

const noneSelected = computed(() => selected.value.length === 0);

const sliceInThreePieces = <T,>(
  array: T[],
  firstCut: number,
  secondCut: number,
): [T[], T[], T[]] => [
  array.slice(0, firstCut),
  array.slice(firstCut, secondCut),
  array.slice(secondCut),
];

const withIndex = <T, V>(fn: (item: T, index: number) => V) => {
  let index = 0;
  return (item: T) => fn(item, index++);
};

const partitionByIndices = <T,>(
  array: T[],
  indexPredicate: (index: number) => boolean,
) =>
  partition(
    array,
    withIndex((_item, i) => indexPredicate(i)),
  );

const listBox = ref<null | typeof MultiselectListBox>(null);

const move =
  (upOrDown: "up" | "down") =>
  ({ to }: { to?: number } = {}) => {
    const positions = selected.value
      .map((item) => indexOf(props.modelValue, item))
      .sort((a, b) => a - b);
    const minPos =
      (upOrDown === "up" ? to : null) ?? Math.max(positions[0] - 1, 0); // one up
    const maxPos =
      (upOrDown === "down" ? to : null) ?? positions[positions.length - 1] + 1; // one down
    const [untouchedStart, toBeReordered, untouchedEnd] = sliceInThreePieces(
      props.modelValue,
      minPos,
      maxPos + 1,
    );
    const positionsSet = new Set(positions);
    const [included, excluded] = partitionByIndices(toBeReordered, (i) =>
      positionsSet.has(i + minPos),
    );
    const [first, second] =
      upOrDown === "up" ? [included, excluded] : [excluded, included];
    const newOrder = untouchedStart.concat(first, second, untouchedEnd);
    emit("update:modelValue", newOrder);
    nextTick(() => {
      if (upOrDown === "up") {
        listBox.value?.scrollUpIntoView(minPos - 1);
        listBox.value?.setCurrentKeyNavIndex(minPos);
      } else {
        listBox.value?.scrollDownIntoView(maxPos + 1);
        listBox.value?.setCurrentKeyNavIndex(maxPos);
      }
    });
  };

const moveUp = move("up");
const moveDown = move("down");
const moveToStart = () => moveUp({ to: 0 });
const moveToEnd = () => moveDown({ to: props.modelValue.length });
<\/script>

<template>
  <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
  <MultiselectListBox
    :id="id"
    ref="listBox"
    v-model="selected"
    :possible-values="possibleValues"
    :ariaLabel="\`sortListBox_\${ariaLabel}\`"
    :with-is-empty-state="true"
    :empty-state-label="'Empty'"
    :size="10"
    @keydown.alt.down="moveDown"
    @keydown.alt.up="moveUp"
    @keydown.alt.home="moveToStart"
    @keydown.alt.end="moveToEnd"
  />
  <div class="buttons">
    <FunctionButton
      :disabled="noneSelected"
      title="Move to top"
      compact
      @click="moveToStart"
      ><ArrowUploadIcon
    /></FunctionButton>
    <FunctionButton
      :disabled="noneSelected"
      title="Move to bottom"
      compact
      @click="moveToEnd"
      ><ArrowDownloadIcon
    /></FunctionButton>
    <FunctionButton
      :disabled="noneSelected"
      title="Move up"
      compact
      @click="moveUp"
      ><ArrowUpIcon
    /></FunctionButton>
    <FunctionButton
      :disabled="noneSelected"
      title="Move down"
      compact
      @click="moveDown"
      ><ArrowDownIcon
    /></FunctionButton>
  </div>
</template>

<style scoped lang="postcss">
.buttons {
  display: flex;
  flex-direction: row;
  gap: 4px;
  justify-content: flex-end;
  padding: 10px;
}
</style>
`,Kt=`<SortList
  v-model="selected"
  :ariaLabel="myAriaLabel"
  :model-value="['foo', 'baz', 'bar', 'missing']"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>
/>`,pn=20,Ht={components:{SortList:Ut,CodeExample:Ln},data(){return{codeExample:Kt,modelValue:["missing",...Array.from({length:pn},(n,e)=>`${e}`)]}},computed:{code(){return Gt},demoValues(){return Array.from({length:pn},(n,e)=>({id:`${e}`,text:`Element_${e}`}))}}},Xt=w("div",{class:"grid-container"},[w("div",{class:"grid-item-12"},[w("p",null,"A multiselect listbox with sorting capabilities.")])],-1),Zt={class:"grid-container"},qt={class:"grid-item-6"},zt={class:"grid-item-6"},Jt={class:"grid-container"},Yt={class:"grid-item-12"};function Qt(n,e,t,r,i,s){const o=sn("SortList",!0),a=sn("CodeExample");return B(),L("div",null,[w("section",null,[Xt,w("div",Zt,[w("div",qt,[x(o,{modelValue:i.modelValue,"onUpdate:modelValue":e[0]||(e[0]=u=>i.modelValue=u),size:7,ariaLabel:"myAriaLabel","left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":s.demoValues},null,8,["modelValue","possible-values"])]),w("div",zt,"modelValue: "+N(i.modelValue),1)])]),w("section",null,[w("div",Jt,[w("div",Yt,[x(a,{summary:"Show usage example"},{default:E(()=>[on(N(i.codeExample),1)]),_:1}),x(a,{summary:"Show SortList.vue source code"},{default:E(()=>[on(N(s.code),1)]),_:1})])])])])}const tr=gn(Ht,[["render",Qt]]);export{tr as default};
