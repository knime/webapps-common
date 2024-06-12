import{C as Be}from"./CodeExample-XDwb2PXy.js";import{aA as K,aB as G,ag as E,aC as X,aD as Oe,aE as W,aF as Me,aG as j,aH as ee,ak as ne,ah as te,aI as $,ai as Ce,aJ as re,aK as ge,aL as Ve,aM as $e,aj as De,aN as Fe,aO as Re,af as Ne,aP as Ue,o as S,c as L,b as _,u as He,G as N,E as oe,J as Ge,d as y,m as O,q as M,Z as I,w as P,v as C,F as Ke,$ as Xe,_ as we,r as ie,t as U,e as se}from"./index-qJgeNmJq.js";import{M as Ze}from"./MultiselectListBox-yHNCXuwr.js";import{c as qe}from"./createMissingItem-l6qmOyuX.js";import{i as ze}from"./navigator-JV0Vfp4s.js";import"./StyledListItem-NUrNCDzW.js";var Je=/\s/;function Ye(e){for(var n=e.length;n--&&Je.test(e.charAt(n)););return n}var ke=/^\s+/;function Qe(e){return e&&e.slice(0,Ye(e)+1).replace(ke,"")}var ae=NaN,We=/^[-+]0x[0-9a-f]+$/i,je=/^0b[01]+$/i,en=/^0o[0-7]+$/i,nn=parseInt;function tn(e){if(typeof e=="number")return e;if(K(e))return ae;if(G(e)){var n=typeof e.valueOf=="function"?e.valueOf():e;e=G(n)?n+"":n}if(typeof e!="string")return e===0?e:+e;e=Qe(e);var t=je.test(e);return t||en.test(e)?nn(e.slice(2),t?2:8):We.test(e)?ae:+e}var le=1/0,rn=17976931348623157e292;function on(e){if(!e)return e===0?e:0;if(e=tn(e),e===le||e===-le){var n=e<0?-1:1;return n*rn}return e===e?e:0}function sn(e){var n=on(e),t=n%1;return n===n?t?n-t:n:0}function an(e,n,t,r){for(var i=e.length,o=t+(r?1:-1);r?o--:++o<i;)if(n(e[o],o,e))return o;return-1}function ln(e){return e!==e}function un(e,n,t){for(var r=t-1,i=e.length;++r<i;)if(e[r]===n)return r;return-1}function dn(e,n,t){return n===n?un(e,n,t):an(e,ln,t)}var cn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,fn=/^\w*$/;function Z(e,n){if(E(e))return!1;var t=typeof e;return t=="number"||t=="symbol"||t=="boolean"||e==null||K(e)?!0:fn.test(e)||!cn.test(e)||n!=null&&e in Object(n)}var pn="Expected a function";function q(e,n){if(typeof e!="function"||n!=null&&typeof n!="function")throw new TypeError(pn);var t=function(){var r=arguments,i=n?n.apply(this,r):r[0],o=t.cache;if(o.has(i))return o.get(i);var s=e.apply(this,r);return t.cache=o.set(i,s)||o,s};return t.cache=new(q.Cache||X),t}q.Cache=X;var mn=500;function gn(e){var n=q(e,function(r){return t.size===mn&&t.clear(),r}),t=n.cache;return n}var wn=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,vn=/\\(\\)?/g,_n=gn(function(e){var n=[];return e.charCodeAt(0)===46&&n.push(""),e.replace(wn,function(t,r,i,o){n.push(i?o.replace(vn,"$1"):r||t)}),n});function ve(e,n){return E(e)?e:Z(e,n)?[e]:_n(Oe(e))}var hn=1/0;function F(e){if(typeof e=="string"||K(e))return e;var n=e+"";return n=="0"&&1/e==-hn?"-0":n}function _e(e,n){n=ve(n,e);for(var t=0,r=n.length;e!=null&&t<r;)e=e[F(n[t++])];return t&&t==r?e:void 0}function xn(e,n,t){var r=e==null?void 0:_e(e,n);return r===void 0?t:r}var yn="__lodash_hash_undefined__";function An(e){return this.__data__.set(e,yn),this}function bn(e){return this.__data__.has(e)}function D(e){var n=-1,t=e==null?0:e.length;for(this.__data__=new X;++n<t;)this.add(e[n])}D.prototype.add=D.prototype.push=An;D.prototype.has=bn;function Tn(e,n){for(var t=-1,r=e==null?0:e.length;++t<r;)if(n(e[t],t,e))return!0;return!1}function In(e,n){return e.has(n)}var En=1,Pn=2;function he(e,n,t,r,i,o){var s=t&En,a=e.length,u=n.length;if(a!=u&&!(s&&u>a))return!1;var f=o.get(e),w=o.get(n);if(f&&w)return f==n&&w==e;var c=-1,d=!0,h=t&Pn?new D:void 0;for(o.set(e,n),o.set(n,e);++c<a;){var g=e[c],v=n[c];if(r)var A=s?r(v,g,c,n,e,o):r(g,v,c,e,n,o);if(A!==void 0){if(A)continue;d=!1;break}if(h){if(!Tn(n,function(x,l){if(!In(h,l)&&(g===x||i(g,x,t,r,o)))return h.push(l)})){d=!1;break}}else if(!(g===v||i(g,v,t,r,o))){d=!1;break}}return o.delete(e),o.delete(n),d}function Sn(e){var n=-1,t=Array(e.size);return e.forEach(function(r,i){t[++n]=[i,r]}),t}function Ln(e){var n=-1,t=Array(e.size);return e.forEach(function(r){t[++n]=r}),t}var Bn=1,On=2,Mn="[object Boolean]",Cn="[object Date]",Vn="[object Error]",$n="[object Map]",Dn="[object Number]",Fn="[object RegExp]",Rn="[object Set]",Nn="[object String]",Un="[object Symbol]",Hn="[object ArrayBuffer]",Gn="[object DataView]",ue=W?W.prototype:void 0,H=ue?ue.valueOf:void 0;function Kn(e,n,t,r,i,o,s){switch(t){case Gn:if(e.byteLength!=n.byteLength||e.byteOffset!=n.byteOffset)return!1;e=e.buffer,n=n.buffer;case Hn:return!(e.byteLength!=n.byteLength||!o(new j(e),new j(n)));case Mn:case Cn:case Dn:return Me(+e,+n);case Vn:return e.name==n.name&&e.message==n.message;case Fn:case Nn:return e==n+"";case $n:var a=Sn;case Rn:var u=r&Bn;if(a||(a=Ln),e.size!=n.size&&!u)return!1;var f=s.get(e);if(f)return f==n;r|=On,s.set(e,n);var w=he(a(e),a(n),r,i,o,s);return s.delete(e),w;case Un:if(H)return H.call(e)==H.call(n)}return!1}var Xn=1,Zn=Object.prototype,qn=Zn.hasOwnProperty;function zn(e,n,t,r,i,o){var s=t&Xn,a=ee(e),u=a.length,f=ee(n),w=f.length;if(u!=w&&!s)return!1;for(var c=u;c--;){var d=a[c];if(!(s?d in n:qn.call(n,d)))return!1}var h=o.get(e),g=o.get(n);if(h&&g)return h==n&&g==e;var v=!0;o.set(e,n),o.set(n,e);for(var A=s;++c<u;){d=a[c];var x=e[d],l=n[d];if(r)var p=s?r(l,x,d,n,e,o):r(x,l,d,e,n,o);if(!(p===void 0?x===l||i(x,l,t,r,o):p)){v=!1;break}A||(A=d=="constructor")}if(v&&!A){var m=e.constructor,b=n.constructor;m!=b&&"constructor"in e&&"constructor"in n&&!(typeof m=="function"&&m instanceof m&&typeof b=="function"&&b instanceof b)&&(v=!1)}return o.delete(e),o.delete(n),v}var Jn=1,de="[object Arguments]",ce="[object Array]",V="[object Object]",Yn=Object.prototype,fe=Yn.hasOwnProperty;function kn(e,n,t,r,i,o){var s=E(e),a=E(n),u=s?ce:ne(e),f=a?ce:ne(n);u=u==de?V:u,f=f==de?V:f;var w=u==V,c=f==V,d=u==f;if(d&&te(e)){if(!te(n))return!1;s=!0,w=!1}if(d&&!w)return o||(o=new $),s||Ce(e)?he(e,n,t,r,i,o):Kn(e,n,u,t,r,i,o);if(!(t&Jn)){var h=w&&fe.call(e,"__wrapped__"),g=c&&fe.call(n,"__wrapped__");if(h||g){var v=h?e.value():e,A=g?n.value():n;return o||(o=new $),i(v,A,t,r,o)}}return d?(o||(o=new $),zn(e,n,t,r,i,o)):!1}function z(e,n,t,r,i){return e===n?!0:e==null||n==null||!re(e)&&!re(n)?e!==e&&n!==n:kn(e,n,t,r,z,i)}var Qn=1,Wn=2;function jn(e,n,t,r){var i=t.length,o=i,s=!r;if(e==null)return!o;for(e=Object(e);i--;){var a=t[i];if(s&&a[2]?a[1]!==e[a[0]]:!(a[0]in e))return!1}for(;++i<o;){a=t[i];var u=a[0],f=e[u],w=a[1];if(s&&a[2]){if(f===void 0&&!(u in e))return!1}else{var c=new $;if(r)var d=r(f,w,u,e,n,c);if(!(d===void 0?z(w,f,Qn|Wn,r,c):d))return!1}}return!0}function xe(e){return e===e&&!G(e)}function et(e){for(var n=ge(e),t=n.length;t--;){var r=n[t],i=e[r];n[t]=[r,i,xe(i)]}return n}function ye(e,n){return function(t){return t==null?!1:t[e]===n&&(n!==void 0||e in Object(t))}}function nt(e){var n=et(e);return n.length==1&&n[0][2]?ye(n[0][0],n[0][1]):function(t){return t===e||jn(t,e,n)}}function tt(e,n){return e!=null&&n in Object(e)}function rt(e,n,t){n=ve(n,e);for(var r=-1,i=n.length,o=!1;++r<i;){var s=F(n[r]);if(!(o=e!=null&&t(e,s)))break;e=e[s]}return o||++r!=i?o:(i=e==null?0:e.length,!!i&&Ve(i)&&$e(s,i)&&(E(e)||De(e)))}function ot(e,n){return e!=null&&rt(e,n,tt)}var it=1,st=2;function at(e,n){return Z(e)&&xe(n)?ye(F(e),n):function(t){var r=xn(t,e);return r===void 0&&r===n?ot(t,e):z(n,r,it|st)}}function lt(e){return function(n){return n==null?void 0:n[e]}}function ut(e){return function(n){return _e(n,e)}}function dt(e){return Z(e)?lt(F(e)):ut(e)}function ct(e){return typeof e=="function"?e:e==null?Fe:typeof e=="object"?E(e)?at(e[0],e[1]):nt(e):dt(e)}function ft(e,n,t,r){for(var i=-1,o=e==null?0:e.length;++i<o;){var s=e[i];n(r,s,t(s),e)}return r}function pt(e,n){return e&&Re(e,n,ge)}function mt(e,n){return function(t,r){if(t==null)return t;if(!Ne(t))return e(t,r);for(var i=t.length,o=n?i:-1,s=Object(t);(n?o--:++o<i)&&r(s[o],o,s)!==!1;);return t}}var gt=mt(pt);function wt(e,n,t,r){return gt(e,function(i,o,s){n(r,i,t(i),s)}),r}function Ae(e,n){return function(t,r){var i=E(t)?ft:wt,o=n?n():{};return i(t,e,ct(r),o)}}var vt=Math.max;function _t(e,n,t){var r=e==null?0:e.length;if(!r)return-1;var i=t==null?0:sn(t);return i<0&&(i=vt(r+i,0)),dn(e,n,i)}var ht=Ae(function(e,n,t){Ue(e,t,n)}),xt=Ae(function(e,n,t){e[t?0:1].push(n)},function(){return[[],[]]});const yt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},At=_("path",{d:"m27 17.1-11 11-11-11m11 11V3.9"},null,-1),bt=[At];function Tt(e,n){return S(),L("svg",yt,[...bt])}const It={render:Tt},Et={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Pt=_("path",{d:"m5 14.9 11-11 11 11m-11-11v24.2"},null,-1),St=[Pt];function Lt(e,n){return S(),L("svg",Et,[...St])}const Bt={render:Lt},Ot={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000",viewBox:"0 0 32 32"},Mt=_("path",{d:"M23.4 13.4 16 20.8l-7.4-7.4m7.4 7.4V4.5m12.5 23h-25"},null,-1),Ct=[Mt];function Vt(e,n){return S(),L("svg",Ot,[...Ct])}const pe={render:Vt},$t=e=>{const n={ArrowUp:"↑",ArrowDown:"↓",ArrowLeft:"←",ArrowRight:"→",Enter:"↵"},t={Shift:"⇧",Delete:"⌫",Ctrl:"⌘",Alt:"⌥",Enter:"↩"},r=o=>s=>o[s]??s,i=o=>o;return e.map(o=>ze()?r(t)(o):i(o)).map(r(n))},Dt=()=>" ",Ft=(e,n=Dt)=>$t(e).join(n()),Rt={class:"buttons"},Nt=He({__name:"SortList",props:{modelValue:{},id:{},ariaLabel:{},disabled:{type:Boolean},possibleValues:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,r=n,i=N(()=>ht(t.possibleValues,"id")),o=N(()=>t.modelValue.map(l=>i.value[l]??qe(l))),s=oe([]);Ge(()=>t.modelValue,l=>{const p=new Set(l);s.value=s.value.filter(m=>p.has(m))});const a=N(()=>s.value.length===0),u=(l,p,m)=>[l.slice(0,p),l.slice(p,m),l.slice(m)],f=l=>{let p=0;return m=>l(m,p++)},w=(l,p)=>xt(l,f((m,b)=>p(b))),c=oe(null),d=l=>({to:p}={})=>{const m=s.value.map(T=>_t(t.modelValue,T)).sort((T,B)=>T-B),b=(l==="up"?p:null)??Math.max(m[0]-1,0),R=(l==="down"?p:null)??m[m.length-1]+1,[be,Te,Ie]=u(t.modelValue,b,R+1),Ee=new Set(m),[J,Y]=w(Te,T=>Ee.has(T+b)),[Pe,Se]=l==="up"?[J,Y]:[Y,J],Le=be.concat(Pe,Se,Ie);r("update:modelValue",Le),Xe(()=>{var T,B,k,Q;l==="up"?((T=c.value)==null||T.scrollUpIntoView(b-1),(B=c.value)==null||B.setCurrentKeyNavIndex(b)):((k=c.value)==null||k.scrollDownIntoView(R+1),(Q=c.value)==null||Q.setCurrentKeyNavIndex(R))})},h=d("up"),g=d("down"),v=()=>h({to:0}),A=()=>g({to:t.modelValue.length}),x=(l,p)=>`${l} (${Ft(p)})`;return(l,p)=>(S(),L(Ke,null,[y(Ze,{id:l.id,ref_key:"listBox",ref:c,modelValue:s.value,"onUpdate:modelValue":p[0]||(p[0]=m=>s.value=m),"possible-values":o.value,ariaLabel:`sortListBox_${l.ariaLabel}`,"with-is-empty-state":!0,"empty-state-label":"Empty",size:10,onKeydown:[O(M(I(g),["alt"]),["down"]),O(M(I(h),["alt"]),["up"]),O(M(v,["alt"]),["home"]),O(M(A,["alt"]),["end"])]},null,8,["id","modelValue","possible-values","ariaLabel","onKeydown"]),_("div",Rt,[y(C,{disabled:a.value,title:x("Move to top",["Alt","Home"]),compact:"",onClick:v},{default:P(()=>[y(I(pe),{class:"rotated"})]),_:1},8,["disabled","title"]),y(C,{disabled:a.value,title:x("Move to bottom",["Alt","End"]),compact:"",onClick:A},{default:P(()=>[y(I(pe))]),_:1},8,["disabled","title"]),y(C,{disabled:a.value,title:x("Move up",["Alt","ArrowUp"]),compact:"",onClick:I(h)},{default:P(()=>[y(I(Bt))]),_:1},8,["disabled","title","onClick"]),y(C,{disabled:a.value,title:x("Move down",["Alt","ArrowDown"]),compact:"",onClick:I(g)},{default:P(()=>[y(I(It))]),_:1},8,["disabled","title","onClick"])])],64))}}),Ut=we(Nt,[["__scopeId","data-v-e3c7dfb4"]]),Ht=`<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { partition, indexOf, keyBy } from "lodash-es";
import MultiselectListBox from "./MultiselectListBox.vue";
import ArrowDownIcon from "../../assets/img/icons/arrow-down.svg";
import ArrowUpIcon from "../../assets/img/icons/arrow-up.svg";
import ArrowDownloadIcon from "../../assets/img/icons/arrow-download.svg";
import FunctionButton from "../FunctionButton.vue";
import { createMissingItem, type PossibleValue } from "./possibleValues";
import { formatHotkeys } from "../../../util/formatHotkeys";
import type { Hotkey } from "../../../util/formatHotkeys";

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

const getFormattedTooltip = (text: string, hotkey: Array<Hotkey>) => {
  return \`\${text} (\${formatHotkeys(hotkey)})\`;
};
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
      :title="getFormattedTooltip('Move to top', ['Alt', 'Home'])"
      compact
      @click="moveToStart"
      ><ArrowDownloadIcon class="rotated"
    /></FunctionButton>
    <FunctionButton
      :disabled="noneSelected"
      :title="getFormattedTooltip('Move to bottom', ['Alt', 'End'])"
      compact
      @click="moveToEnd"
      ><ArrowDownloadIcon
    /></FunctionButton>
    <FunctionButton
      :disabled="noneSelected"
      :title="getFormattedTooltip('Move up', ['Alt', 'ArrowUp'])"
      compact
      @click="moveUp"
      ><ArrowUpIcon
    /></FunctionButton>
    <FunctionButton
      :disabled="noneSelected"
      :title="getFormattedTooltip('Move down', ['Alt', 'ArrowDown'])"
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
`,Gt=`<SortList
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
/>`,me=20,Kt={components:{SortList:Ut,CodeExample:Be},data(){return{codeExample:Gt,modelValue:["missing",...Array.from({length:me},(e,n)=>`${n}`)]}},computed:{code(){return Ht},demoValues(){return Array.from({length:me},(e,n)=>({id:`${n}`,text:`Element_${n}`}))}}},Xt=_("div",{class:"grid-container"},[_("div",{class:"grid-item-12"},[_("p",null,"A multiselect listbox with sorting capabilities.")])],-1),Zt={class:"grid-container"},qt={class:"grid-item-6"},zt={class:"grid-item-6"},Jt={class:"grid-container"},Yt={class:"grid-item-12"};function kt(e,n,t,r,i,o){const s=ie("SortList",!0),a=ie("CodeExample");return S(),L("div",null,[_("section",null,[Xt,_("div",Zt,[_("div",qt,[y(s,{modelValue:i.modelValue,"onUpdate:modelValue":n[0]||(n[0]=u=>i.modelValue=u),size:7,ariaLabel:"myAriaLabel","left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),_("div",zt,"modelValue: "+U(i.modelValue),1)])]),_("section",null,[_("div",Jt,[_("div",Yt,[y(a,{summary:"Show usage example"},{default:P(()=>[se(U(i.codeExample),1)]),_:1}),y(a,{summary:"Show SortList.vue source code"},{default:P(()=>[se(U(o.code),1)]),_:1})])])])])}const rr=we(Kt,[["render",kt]]);export{rr as default};
