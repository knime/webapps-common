import{C as Sn}from"./CodeExample-w0UGtbB6.js";import{aA as K,aB as G,ai as P,aC as H,aD as On,aE as W,aF as Mn,aG as k,aH as j,am as nn,aj as en,aI as $,ak as Vn,aJ as tn,aK as gn,aL as Cn,aM as $n,al as Dn,aN as Rn,aO as Fn,ah as Nn,aP as Un,o as L,c as B,b as _,q as Gn,G as F,E as rn,J as Kn,d as x,x as O,y as M,Z as T,w as E,s as V,F as Hn,$ as Xn,_ as vn,r as sn,t as N,e as on}from"./index-PFLgTSm3.js";import{M as Zn}from"./MultiselectListBox-IFpQIfoC.js";import{c as qn}from"./createMissingItem-gAI5zZ9a.js";import"./StyledListItem-oTeHxosE.js";var zn=/\s/;function Jn(n){for(var e=n.length;e--&&zn.test(n.charAt(e)););return e}var Yn=/^\s+/;function Qn(n){return n&&n.slice(0,Jn(n)+1).replace(Yn,"")}var an=NaN,Wn=/^[-+]0x[0-9a-f]+$/i,kn=/^0b[01]+$/i,jn=/^0o[0-7]+$/i,ne=parseInt;function ee(n){if(typeof n=="number")return n;if(K(n))return an;if(G(n)){var e=typeof n.valueOf=="function"?n.valueOf():n;n=G(e)?e+"":e}if(typeof n!="string")return n===0?n:+n;n=Qn(n);var t=kn.test(n);return t||jn.test(n)?ne(n.slice(2),t?2:8):Wn.test(n)?an:+n}var ln=1/0,te=17976931348623157e292;function re(n){if(!n)return n===0?n:0;if(n=ee(n),n===ln||n===-ln){var e=n<0?-1:1;return e*te}return n===n?n:0}function se(n){var e=re(n),t=e%1;return e===e?t?e-t:e:0}function ie(n,e,t,r){for(var i=n.length,s=t+(r?1:-1);r?s--:++s<i;)if(e(n[s],s,n))return s;return-1}function oe(n){return n!==n}function ae(n,e,t){for(var r=t-1,i=n.length;++r<i;)if(n[r]===e)return r;return-1}function le(n,e,t){return e===e?ae(n,e,t):ie(n,oe,t)}var ue=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,de=/^\w*$/;function X(n,e){if(P(n))return!1;var t=typeof n;return t=="number"||t=="symbol"||t=="boolean"||n==null||K(n)?!0:de.test(n)||!ue.test(n)||e!=null&&n in Object(e)}var ce="Expected a function";function Z(n,e){if(typeof n!="function"||e!=null&&typeof e!="function")throw new TypeError(ce);var t=function(){var r=arguments,i=e?e.apply(this,r):r[0],s=t.cache;if(s.has(i))return s.get(i);var o=n.apply(this,r);return t.cache=s.set(i,o)||s,o};return t.cache=new(Z.Cache||H),t}Z.Cache=H;var fe=500;function pe(n){var e=Z(n,function(r){return t.size===fe&&t.clear(),r}),t=e.cache;return e}var me=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,ge=/\\(\\)?/g,ve=pe(function(n){var e=[];return n.charCodeAt(0)===46&&e.push(""),n.replace(me,function(t,r,i,s){e.push(i?s.replace(ge,"$1"):r||t)}),e});function wn(n,e){return P(n)?n:X(n,e)?[n]:ve(On(n))}var we=1/0;function R(n){if(typeof n=="string"||K(n))return n;var e=n+"";return e=="0"&&1/n==-we?"-0":e}function _n(n,e){e=wn(e,n);for(var t=0,r=e.length;n!=null&&t<r;)n=n[R(e[t++])];return t&&t==r?n:void 0}function _e(n,e,t){var r=n==null?void 0:_n(n,e);return r===void 0?t:r}var he="__lodash_hash_undefined__";function xe(n){return this.__data__.set(n,he),this}function be(n){return this.__data__.has(n)}function D(n){var e=-1,t=n==null?0:n.length;for(this.__data__=new H;++e<t;)this.add(n[e])}D.prototype.add=D.prototype.push=xe;D.prototype.has=be;function ye(n,e){for(var t=-1,r=n==null?0:n.length;++t<r;)if(e(n[t],t,n))return!0;return!1}function Ae(n,e){return n.has(e)}var Ie=1,Te=2;function hn(n,e,t,r,i,s){var o=t&Ie,a=n.length,u=e.length;if(a!=u&&!(o&&u>a))return!1;var p=s.get(n),v=s.get(e);if(p&&v)return p==e&&v==n;var f=-1,d=!0,h=t&Te?new D:void 0;for(s.set(n,e),s.set(e,n);++f<a;){var g=n[f],w=e[f];if(r)var b=o?r(w,g,f,e,n,s):r(g,w,f,n,e,s);if(b!==void 0){if(b)continue;d=!1;break}if(h){if(!ye(e,function(l,c){if(!Ae(h,c)&&(g===l||i(g,l,t,r,s)))return h.push(c)})){d=!1;break}}else if(!(g===w||i(g,w,t,r,s))){d=!1;break}}return s.delete(n),s.delete(e),d}function Pe(n){var e=-1,t=Array(n.size);return n.forEach(function(r,i){t[++e]=[i,r]}),t}function Ee(n){var e=-1,t=Array(n.size);return n.forEach(function(r){t[++e]=r}),t}var Le=1,Be=2,Se="[object Boolean]",Oe="[object Date]",Me="[object Error]",Ve="[object Map]",Ce="[object Number]",$e="[object RegExp]",De="[object Set]",Re="[object String]",Fe="[object Symbol]",Ne="[object ArrayBuffer]",Ue="[object DataView]",un=W?W.prototype:void 0,U=un?un.valueOf:void 0;function Ge(n,e,t,r,i,s,o){switch(t){case Ue:if(n.byteLength!=e.byteLength||n.byteOffset!=e.byteOffset)return!1;n=n.buffer,e=e.buffer;case Ne:return!(n.byteLength!=e.byteLength||!s(new k(n),new k(e)));case Se:case Oe:case Ce:return Mn(+n,+e);case Me:return n.name==e.name&&n.message==e.message;case $e:case Re:return n==e+"";case Ve:var a=Pe;case De:var u=r&Le;if(a||(a=Ee),n.size!=e.size&&!u)return!1;var p=o.get(n);if(p)return p==e;r|=Be,o.set(n,e);var v=hn(a(n),a(e),r,i,s,o);return o.delete(n),v;case Fe:if(U)return U.call(n)==U.call(e)}return!1}var Ke=1,He=Object.prototype,Xe=He.hasOwnProperty;function Ze(n,e,t,r,i,s){var o=t&Ke,a=j(n),u=a.length,p=j(e),v=p.length;if(u!=v&&!o)return!1;for(var f=u;f--;){var d=a[f];if(!(o?d in e:Xe.call(e,d)))return!1}var h=s.get(n),g=s.get(e);if(h&&g)return h==e&&g==n;var w=!0;s.set(n,e),s.set(e,n);for(var b=o;++f<u;){d=a[f];var l=n[d],c=e[d];if(r)var m=o?r(c,l,d,e,n,s):r(l,c,d,n,e,s);if(!(m===void 0?l===c||i(l,c,t,r,s):m)){w=!1;break}b||(b=d=="constructor")}if(w&&!b){var y=n.constructor,A=e.constructor;y!=A&&"constructor"in n&&"constructor"in e&&!(typeof y=="function"&&y instanceof y&&typeof A=="function"&&A instanceof A)&&(w=!1)}return s.delete(n),s.delete(e),w}var qe=1,dn="[object Arguments]",cn="[object Array]",C="[object Object]",ze=Object.prototype,fn=ze.hasOwnProperty;function Je(n,e,t,r,i,s){var o=P(n),a=P(e),u=o?cn:nn(n),p=a?cn:nn(e);u=u==dn?C:u,p=p==dn?C:p;var v=u==C,f=p==C,d=u==p;if(d&&en(n)){if(!en(e))return!1;o=!0,v=!1}if(d&&!v)return s||(s=new $),o||Vn(n)?hn(n,e,t,r,i,s):Ge(n,e,u,t,r,i,s);if(!(t&qe)){var h=v&&fn.call(n,"__wrapped__"),g=f&&fn.call(e,"__wrapped__");if(h||g){var w=h?n.value():n,b=g?e.value():e;return s||(s=new $),i(w,b,t,r,s)}}return d?(s||(s=new $),Ze(n,e,t,r,i,s)):!1}function q(n,e,t,r,i){return n===e?!0:n==null||e==null||!tn(n)&&!tn(e)?n!==n&&e!==e:Je(n,e,t,r,q,i)}var Ye=1,Qe=2;function We(n,e,t,r){var i=t.length,s=i,o=!r;if(n==null)return!s;for(n=Object(n);i--;){var a=t[i];if(o&&a[2]?a[1]!==n[a[0]]:!(a[0]in n))return!1}for(;++i<s;){a=t[i];var u=a[0],p=n[u],v=a[1];if(o&&a[2]){if(p===void 0&&!(u in n))return!1}else{var f=new $;if(r)var d=r(p,v,u,n,e,f);if(!(d===void 0?q(v,p,Ye|Qe,r,f):d))return!1}}return!0}function xn(n){return n===n&&!G(n)}function ke(n){for(var e=gn(n),t=e.length;t--;){var r=e[t],i=n[r];e[t]=[r,i,xn(i)]}return e}function bn(n,e){return function(t){return t==null?!1:t[n]===e&&(e!==void 0||n in Object(t))}}function je(n){var e=ke(n);return e.length==1&&e[0][2]?bn(e[0][0],e[0][1]):function(t){return t===n||We(t,n,e)}}function nt(n,e){return n!=null&&e in Object(n)}function et(n,e,t){e=wn(e,n);for(var r=-1,i=e.length,s=!1;++r<i;){var o=R(e[r]);if(!(s=n!=null&&t(n,o)))break;n=n[o]}return s||++r!=i?s:(i=n==null?0:n.length,!!i&&Cn(i)&&$n(o,i)&&(P(n)||Dn(n)))}function tt(n,e){return n!=null&&et(n,e,nt)}var rt=1,st=2;function it(n,e){return X(n)&&xn(e)?bn(R(n),e):function(t){var r=_e(t,n);return r===void 0&&r===e?tt(t,n):q(e,r,rt|st)}}function ot(n){return function(e){return e==null?void 0:e[n]}}function at(n){return function(e){return _n(e,n)}}function lt(n){return X(n)?ot(R(n)):at(n)}function ut(n){return typeof n=="function"?n:n==null?Rn:typeof n=="object"?P(n)?it(n[0],n[1]):je(n):lt(n)}function dt(n,e,t,r){for(var i=-1,s=n==null?0:n.length;++i<s;){var o=n[i];e(r,o,t(o),n)}return r}function ct(n,e){return n&&Fn(n,e,gn)}function ft(n,e){return function(t,r){if(t==null)return t;if(!Nn(t))return n(t,r);for(var i=t.length,s=e?i:-1,o=Object(t);(e?s--:++s<i)&&r(o[s],s,o)!==!1;);return t}}var pt=ft(ct);function mt(n,e,t,r){return pt(n,function(i,s,o){e(r,i,t(i),o)}),r}function yn(n,e){return function(t,r){var i=P(t)?dt:mt,s=e?e():{};return i(t,n,ut(r),s)}}var gt=Math.max;function vt(n,e,t){var r=n==null?0:n.length;if(!r)return-1;var i=t==null?0:se(t);return i<0&&(i=gt(r+i,0)),le(n,e,i)}var wt=yn(function(n,e,t){Un(n,t,e)}),_t=yn(function(n,e,t){n[t?0:1].push(e)},function(){return[[],[]]});const ht={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},xt=_("path",{d:"m27 17.1-11 11-11-11m11 11V3.9"},null,-1),bt=[xt];function yt(n,e){return L(),B("svg",ht,[...bt])}const At={render:yt},It={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Tt=_("path",{d:"m5 14.9 11-11 11 11m-11-11v24.2"},null,-1),Pt=[Tt];function Et(n,e){return L(),B("svg",It,[...Pt])}const Lt={render:Et},Bt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000",viewBox:"0 0 32 32"},St=_("path",{d:"M23.4 13.4 16 20.8l-7.4-7.4m7.4 7.4V4.5m12.5 23h-25"},null,-1),Ot=[St];function Mt(n,e){return L(),B("svg",Bt,[...Ot])}const pn={render:Mt},Vt={class:"buttons"},Ct=Gn({__name:"SortList",props:{modelValue:{},id:{},ariaLabel:{},disabled:{type:Boolean},possibleValues:{}},emits:["update:modelValue"],setup(n,{emit:e}){const t=n,r=e,i=F(()=>wt(t.possibleValues,"id")),s=F(()=>t.modelValue.map(l=>i.value[l]??qn(l))),o=rn([]);Kn(()=>t.modelValue,l=>{const c=new Set(l);o.value=o.value.filter(m=>c.has(m))});const a=F(()=>o.value.length===0),u=(l,c,m)=>[l.slice(0,c),l.slice(c,m),l.slice(m)],p=l=>{let c=0;return m=>l(m,c++)},v=(l,c)=>_t(l,p((m,y)=>c(y))),f=rn(null),d=l=>({to:c}={})=>{const m=o.value.map(I=>vt(t.modelValue,I)).sort((I,S)=>I-S),y=(l==="up"?c:null)??Math.max(m[0]-1,0),A=(l==="down"?c:null)??m[m.length-1]+1,[An,In,Tn]=u(t.modelValue,y,A+1),Pn=new Set(m),[z,J]=v(In,I=>Pn.has(I+y)),[En,Ln]=l==="up"?[z,J]:[J,z],Bn=An.concat(En,Ln,Tn);r("update:modelValue",Bn),Xn(()=>{var I,S,Y,Q;l==="up"?((I=f.value)==null||I.scrollUpIntoView(y-1),(S=f.value)==null||S.setCurrentKeyNavIndex(y)):((Y=f.value)==null||Y.scrollDownIntoView(A+1),(Q=f.value)==null||Q.setCurrentKeyNavIndex(A))})},h=d("up"),g=d("down"),w=()=>h({to:0}),b=()=>g({to:t.modelValue.length});return(l,c)=>(L(),B(Hn,null,[x(Zn,{id:l.id,ref_key:"listBox",ref:f,modelValue:o.value,"onUpdate:modelValue":c[0]||(c[0]=m=>o.value=m),"possible-values":s.value,ariaLabel:`sortListBox_${l.ariaLabel}`,"with-is-empty-state":!0,"empty-state-label":"Empty",size:10,onKeydown:[O(M(T(g),["alt"]),["down"]),O(M(T(h),["alt"]),["up"]),O(M(w,["alt"]),["home"]),O(M(b,["alt"]),["end"])]},null,8,["id","modelValue","possible-values","ariaLabel","onKeydown"]),_("div",Vt,[x(V,{disabled:a.value,title:"Move to top",compact:"",onClick:w},{default:E(()=>[x(T(pn),{class:"rotated"})]),_:1},8,["disabled"]),x(V,{disabled:a.value,title:"Move to bottom",compact:"",onClick:b},{default:E(()=>[x(T(pn))]),_:1},8,["disabled"]),x(V,{disabled:a.value,title:"Move up",compact:"",onClick:T(h)},{default:E(()=>[x(T(Lt))]),_:1},8,["disabled","onClick"]),x(V,{disabled:a.value,title:"Move down",compact:"",onClick:T(g)},{default:E(()=>[x(T(At))]),_:1},8,["disabled","onClick"])])],64))}}),$t=vn(Ct,[["__scopeId","data-v-7c40b521"]]),Dt=`<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { partition, indexOf, keyBy } from "lodash-es";
import MultiselectListBox from "./MultiselectListBox.vue";
import ArrowDownIcon from "../../assets/img/icons/arrow-down.svg";
import ArrowUpIcon from "../../assets/img/icons/arrow-up.svg";
import ArrowDownloadIcon from "../../assets/img/icons/arrow-download.svg";
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
      ><ArrowDownloadIcon class="rotated"
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

  & .rotated {
    transform: rotate(180deg);
  }
}
</style>
`,Rt=`<SortList
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
/>`,mn=20,Ft={components:{SortList:$t,CodeExample:Sn},data(){return{codeExample:Rt,modelValue:["missing",...Array.from({length:mn},(n,e)=>`${e}`)]}},computed:{code(){return Dt},demoValues(){return Array.from({length:mn},(n,e)=>({id:`${e}`,text:`Element_${e}`}))}}},Nt=_("div",{class:"grid-container"},[_("div",{class:"grid-item-12"},[_("p",null,"A multiselect listbox with sorting capabilities.")])],-1),Ut={class:"grid-container"},Gt={class:"grid-item-6"},Kt={class:"grid-item-6"},Ht={class:"grid-container"},Xt={class:"grid-item-12"};function Zt(n,e,t,r,i,s){const o=sn("SortList",!0),a=sn("CodeExample");return L(),B("div",null,[_("section",null,[Nt,_("div",Ut,[_("div",Gt,[x(o,{modelValue:i.modelValue,"onUpdate:modelValue":e[0]||(e[0]=u=>i.modelValue=u),size:7,ariaLabel:"myAriaLabel","left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":s.demoValues},null,8,["modelValue","possible-values"])]),_("div",Kt,"modelValue: "+N(i.modelValue),1)])]),_("section",null,[_("div",Ht,[_("div",Xt,[x(a,{summary:"Show usage example"},{default:E(()=>[on(N(i.codeExample),1)]),_:1}),x(a,{summary:"Show SortList.vue source code"},{default:E(()=>[on(N(s.code),1)]),_:1})])])])])}const Wt=vn(Ft,[["render",Zt]]);export{Wt as default};
