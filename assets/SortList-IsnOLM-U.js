import{C as Be}from"./CodeExample-Py2TKdaF.js";import{aE as K,aF as G,ag as E,aG as X,aH as Me,aI as W,aJ as Ce,aK as j,aL as ee,ak as ne,ah as te,aM as $,ai as Ve,aN as re,aO as we,aP as $e,aQ as De,aj as Fe,aR as Re,aS as Ne,af as Ue,aT as He,o as S,c as L,b as _,u as Ge,G as N,E as oe,J as Ke,d as y,m as B,q as M,Z as I,w as P,v as C,F as Xe,$ as Ze,_ as ve,r as ie,t as U,e as se}from"./index-RyhvXRhb.js";import{M as ke}from"./MultiselectListBox-_hUDBogr.js";import{c as qe}from"./createMissingItem-l6qmOyuX.js";import{i as ze}from"./navigator-JV0Vfp4s.js";import"./StyledListItem-DxUnxHh1.js";var Je=/\s/;function Ye(e){for(var n=e.length;n--&&Je.test(e.charAt(n)););return n}var Qe=/^\s+/;function We(e){return e&&e.slice(0,Ye(e)+1).replace(Qe,"")}var ae=NaN,je=/^[-+]0x[0-9a-f]+$/i,en=/^0b[01]+$/i,nn=/^0o[0-7]+$/i,tn=parseInt;function rn(e){if(typeof e=="number")return e;if(K(e))return ae;if(G(e)){var n=typeof e.valueOf=="function"?e.valueOf():e;e=G(n)?n+"":n}if(typeof e!="string")return e===0?e:+e;e=We(e);var t=en.test(e);return t||nn.test(e)?tn(e.slice(2),t?2:8):je.test(e)?ae:+e}var le=1/0,on=17976931348623157e292;function sn(e){if(!e)return e===0?e:0;if(e=rn(e),e===le||e===-le){var n=e<0?-1:1;return n*on}return e===e?e:0}function an(e){var n=sn(e),t=n%1;return n===n?t?n-t:n:0}function ln(e,n,t,r){for(var i=e.length,o=t+(r?1:-1);r?o--:++o<i;)if(n(e[o],o,e))return o;return-1}function un(e){return e!==e}function dn(e,n,t){for(var r=t-1,i=e.length;++r<i;)if(e[r]===n)return r;return-1}function cn(e,n,t){return n===n?dn(e,n,t):ln(e,un,t)}var fn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,pn=/^\w*$/;function Z(e,n){if(E(e))return!1;var t=typeof e;return t=="number"||t=="symbol"||t=="boolean"||e==null||K(e)?!0:pn.test(e)||!fn.test(e)||n!=null&&e in Object(n)}var mn="Expected a function";function k(e,n){if(typeof e!="function"||n!=null&&typeof n!="function")throw new TypeError(mn);var t=function(){var r=arguments,i=n?n.apply(this,r):r[0],o=t.cache;if(o.has(i))return o.get(i);var s=e.apply(this,r);return t.cache=o.set(i,s)||o,s};return t.cache=new(k.Cache||X),t}k.Cache=X;var gn=500;function wn(e){var n=k(e,function(r){return t.size===gn&&t.clear(),r}),t=n.cache;return n}var vn=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,_n=/\\(\\)?/g,hn=wn(function(e){var n=[];return e.charCodeAt(0)===46&&n.push(""),e.replace(vn,function(t,r,i,o){n.push(i?o.replace(_n,"$1"):r||t)}),n});function _e(e,n){return E(e)?e:Z(e,n)?[e]:hn(Me(e))}var xn=1/0;function F(e){if(typeof e=="string"||K(e))return e;var n=e+"";return n=="0"&&1/e==-xn?"-0":n}function he(e,n){n=_e(n,e);for(var t=0,r=n.length;e!=null&&t<r;)e=e[F(n[t++])];return t&&t==r?e:void 0}function yn(e,n,t){var r=e==null?void 0:he(e,n);return r===void 0?t:r}var An="__lodash_hash_undefined__";function bn(e){return this.__data__.set(e,An),this}function Tn(e){return this.__data__.has(e)}function D(e){var n=-1,t=e==null?0:e.length;for(this.__data__=new X;++n<t;)this.add(e[n])}D.prototype.add=D.prototype.push=bn;D.prototype.has=Tn;function In(e,n){for(var t=-1,r=e==null?0:e.length;++t<r;)if(n(e[t],t,e))return!0;return!1}function En(e,n){return e.has(n)}var Pn=1,Sn=2;function xe(e,n,t,r,i,o){var s=t&Pn,a=e.length,u=n.length;if(a!=u&&!(s&&u>a))return!1;var f=o.get(e),w=o.get(n);if(f&&w)return f==n&&w==e;var c=-1,d=!0,h=t&Sn?new D:void 0;for(o.set(e,n),o.set(n,e);++c<a;){var g=e[c],v=n[c];if(r)var A=s?r(v,g,c,n,e,o):r(g,v,c,e,n,o);if(A!==void 0){if(A)continue;d=!1;break}if(h){if(!In(n,function(x,l){if(!En(h,l)&&(g===x||i(g,x,t,r,o)))return h.push(l)})){d=!1;break}}else if(!(g===v||i(g,v,t,r,o))){d=!1;break}}return o.delete(e),o.delete(n),d}function Ln(e){var n=-1,t=Array(e.size);return e.forEach(function(r,i){t[++n]=[i,r]}),t}function On(e){var n=-1,t=Array(e.size);return e.forEach(function(r){t[++n]=r}),t}var Bn=1,Mn=2,Cn="[object Boolean]",Vn="[object Date]",$n="[object Error]",Dn="[object Map]",Fn="[object Number]",Rn="[object RegExp]",Nn="[object Set]",Un="[object String]",Hn="[object Symbol]",Gn="[object ArrayBuffer]",Kn="[object DataView]",ue=W?W.prototype:void 0,H=ue?ue.valueOf:void 0;function Xn(e,n,t,r,i,o,s){switch(t){case Kn:if(e.byteLength!=n.byteLength||e.byteOffset!=n.byteOffset)return!1;e=e.buffer,n=n.buffer;case Gn:return!(e.byteLength!=n.byteLength||!o(new j(e),new j(n)));case Cn:case Vn:case Fn:return Ce(+e,+n);case $n:return e.name==n.name&&e.message==n.message;case Rn:case Un:return e==n+"";case Dn:var a=Ln;case Nn:var u=r&Bn;if(a||(a=On),e.size!=n.size&&!u)return!1;var f=s.get(e);if(f)return f==n;r|=Mn,s.set(e,n);var w=xe(a(e),a(n),r,i,o,s);return s.delete(e),w;case Hn:if(H)return H.call(e)==H.call(n)}return!1}var Zn=1,kn=Object.prototype,qn=kn.hasOwnProperty;function zn(e,n,t,r,i,o){var s=t&Zn,a=ee(e),u=a.length,f=ee(n),w=f.length;if(u!=w&&!s)return!1;for(var c=u;c--;){var d=a[c];if(!(s?d in n:qn.call(n,d)))return!1}var h=o.get(e),g=o.get(n);if(h&&g)return h==n&&g==e;var v=!0;o.set(e,n),o.set(n,e);for(var A=s;++c<u;){d=a[c];var x=e[d],l=n[d];if(r)var p=s?r(l,x,d,n,e,o):r(x,l,d,e,n,o);if(!(p===void 0?x===l||i(x,l,t,r,o):p)){v=!1;break}A||(A=d=="constructor")}if(v&&!A){var m=e.constructor,b=n.constructor;m!=b&&"constructor"in e&&"constructor"in n&&!(typeof m=="function"&&m instanceof m&&typeof b=="function"&&b instanceof b)&&(v=!1)}return o.delete(e),o.delete(n),v}var Jn=1,de="[object Arguments]",ce="[object Array]",V="[object Object]",Yn=Object.prototype,fe=Yn.hasOwnProperty;function Qn(e,n,t,r,i,o){var s=E(e),a=E(n),u=s?ce:ne(e),f=a?ce:ne(n);u=u==de?V:u,f=f==de?V:f;var w=u==V,c=f==V,d=u==f;if(d&&te(e)){if(!te(n))return!1;s=!0,w=!1}if(d&&!w)return o||(o=new $),s||Ve(e)?xe(e,n,t,r,i,o):Xn(e,n,u,t,r,i,o);if(!(t&Jn)){var h=w&&fe.call(e,"__wrapped__"),g=c&&fe.call(n,"__wrapped__");if(h||g){var v=h?e.value():e,A=g?n.value():n;return o||(o=new $),i(v,A,t,r,o)}}return d?(o||(o=new $),zn(e,n,t,r,i,o)):!1}function q(e,n,t,r,i){return e===n?!0:e==null||n==null||!re(e)&&!re(n)?e!==e&&n!==n:Qn(e,n,t,r,q,i)}var Wn=1,jn=2;function et(e,n,t,r){var i=t.length,o=i,s=!r;if(e==null)return!o;for(e=Object(e);i--;){var a=t[i];if(s&&a[2]?a[1]!==e[a[0]]:!(a[0]in e))return!1}for(;++i<o;){a=t[i];var u=a[0],f=e[u],w=a[1];if(s&&a[2]){if(f===void 0&&!(u in e))return!1}else{var c=new $;if(r)var d=r(f,w,u,e,n,c);if(!(d===void 0?q(w,f,Wn|jn,r,c):d))return!1}}return!0}function ye(e){return e===e&&!G(e)}function nt(e){for(var n=we(e),t=n.length;t--;){var r=n[t],i=e[r];n[t]=[r,i,ye(i)]}return n}function Ae(e,n){return function(t){return t==null?!1:t[e]===n&&(n!==void 0||e in Object(t))}}function tt(e){var n=nt(e);return n.length==1&&n[0][2]?Ae(n[0][0],n[0][1]):function(t){return t===e||et(t,e,n)}}function rt(e,n){return e!=null&&n in Object(e)}function ot(e,n,t){n=_e(n,e);for(var r=-1,i=n.length,o=!1;++r<i;){var s=F(n[r]);if(!(o=e!=null&&t(e,s)))break;e=e[s]}return o||++r!=i?o:(i=e==null?0:e.length,!!i&&$e(i)&&De(s,i)&&(E(e)||Fe(e)))}function it(e,n){return e!=null&&ot(e,n,rt)}var st=1,at=2;function lt(e,n){return Z(e)&&ye(n)?Ae(F(e),n):function(t){var r=yn(t,e);return r===void 0&&r===n?it(t,e):q(n,r,st|at)}}function ut(e){return function(n){return n==null?void 0:n[e]}}function dt(e){return function(n){return he(n,e)}}function ct(e){return Z(e)?ut(F(e)):dt(e)}function ft(e){return typeof e=="function"?e:e==null?Re:typeof e=="object"?E(e)?lt(e[0],e[1]):tt(e):ct(e)}function pt(e,n,t,r){for(var i=-1,o=e==null?0:e.length;++i<o;){var s=e[i];n(r,s,t(s),e)}return r}function mt(e,n){return e&&Ne(e,n,we)}function gt(e,n){return function(t,r){if(t==null)return t;if(!Ue(t))return e(t,r);for(var i=t.length,o=n?i:-1,s=Object(t);(n?o--:++o<i)&&r(s[o],o,s)!==!1;);return t}}var wt=gt(mt);function vt(e,n,t,r){return wt(e,function(i,o,s){n(r,i,t(i),s)}),r}function be(e,n){return function(t,r){var i=E(t)?pt:vt,o=n?n():{};return i(t,e,ft(r),o)}}var _t=Math.max;function ht(e,n,t){var r=e==null?0:e.length;if(!r)return-1;var i=t==null?0:an(t);return i<0&&(i=_t(r+i,0)),cn(e,n,i)}var xt=be(function(e,n,t){He(e,t,n)}),yt=be(function(e,n,t){e[t?0:1].push(n)},function(){return[[],[]]});const At={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},bt=_("path",{d:"m27 17.1-11 11-11-11m11 11V3.9"},null,-1),Tt=[bt];function It(e,n){return S(),L("svg",At,[...Tt])}const Et={render:It},Pt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},St=_("path",{d:"m5 14.9 11-11 11 11m-11-11v24.2"},null,-1),Lt=[St];function Ot(e,n){return S(),L("svg",Pt,[...Lt])}const Bt={render:Ot},Mt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000",viewBox:"0 0 32 32"},Ct=_("path",{d:"M23.4 13.4 16 20.8l-7.4-7.4m7.4 7.4V4.5m12.5 23h-25"},null,-1),Vt=[Ct];function $t(e,n){return S(),L("svg",Mt,[...Vt])}const pe={render:$t},me={ArrowUp:"↑",ArrowDown:"↓",ArrowLeft:"←",ArrowRight:"→",Enter:"↵"," ":"Space",CtrlOrCmd:"Ctrl"},Dt={Shift:"⇧",Delete:"⌫",CtrlOrCmd:"⌘",Ctrl:"⌃",Alt:"⌥",Enter:"↩"},Ft=e=>{const n=o=>s=>o[s]??s,r=((...o)=>o.reduce((s,a)=>u=>a(s(u))))(n(Dt),n(me)),i=n(me);return ze()?r(e):i(e)},Rt=()=>" ",Nt=(e,n=Rt)=>e.map(Ft).join(n()),Ut={class:"buttons"},Ht=Ge({__name:"SortList",props:{modelValue:{},id:{},ariaLabel:{},disabled:{type:Boolean},possibleValues:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,r=n,i=N(()=>xt(t.possibleValues,"id")),o=N(()=>t.modelValue.map(l=>i.value[l]??qe(l))),s=oe([]);Ke(()=>t.modelValue,l=>{const p=new Set(l);s.value=s.value.filter(m=>p.has(m))});const a=N(()=>s.value.length===0),u=(l,p,m)=>[l.slice(0,p),l.slice(p,m),l.slice(m)],f=l=>{let p=0;return m=>l(m,p++)},w=(l,p)=>yt(l,f((m,b)=>p(b))),c=oe(null),d=l=>({to:p}={})=>{const m=s.value.map(T=>ht(t.modelValue,T)).sort((T,O)=>T-O),b=(l==="up"?p:null)??Math.max(m[0]-1,0),R=(l==="down"?p:null)??m[m.length-1]+1,[Te,Ie,Ee]=u(t.modelValue,b,R+1),Pe=new Set(m),[z,J]=w(Ie,T=>Pe.has(T+b)),[Se,Le]=l==="up"?[z,J]:[J,z],Oe=Te.concat(Se,Le,Ee);r("update:modelValue",Oe),Ze(()=>{var T,O,Y,Q;l==="up"?((T=c.value)==null||T.scrollUpIntoView(b-1),(O=c.value)==null||O.setCurrentKeyNavIndex(b)):((Y=c.value)==null||Y.scrollDownIntoView(R+1),(Q=c.value)==null||Q.setCurrentKeyNavIndex(R))})},h=d("up"),g=d("down"),v=()=>h({to:0}),A=()=>g({to:t.modelValue.length}),x=(l,p)=>`${l} (${Nt(p)})`;return(l,p)=>(S(),L(Xe,null,[y(ke,{id:l.id,ref_key:"listBox",ref:c,modelValue:s.value,"onUpdate:modelValue":p[0]||(p[0]=m=>s.value=m),"possible-values":o.value,ariaLabel:`sortListBox_${l.ariaLabel}`,"with-is-empty-state":!0,"empty-state-label":"Empty",size:10,onKeydown:[B(M(I(g),["alt"]),["down"]),B(M(I(h),["alt"]),["up"]),B(M(v,["alt"]),["home"]),B(M(A,["alt"]),["end"])]},null,8,["id","modelValue","possible-values","ariaLabel","onKeydown"]),_("div",Ut,[y(C,{disabled:a.value,title:x("Move to top",["Alt","Home"]),compact:"",onClick:v},{default:P(()=>[y(I(pe),{class:"rotated"})]),_:1},8,["disabled","title"]),y(C,{disabled:a.value,title:x("Move to bottom",["Alt","End"]),compact:"",onClick:A},{default:P(()=>[y(I(pe))]),_:1},8,["disabled","title"]),y(C,{disabled:a.value,title:x("Move up",["Alt","ArrowUp"]),compact:"",onClick:I(h)},{default:P(()=>[y(I(Bt))]),_:1},8,["disabled","title","onClick"]),y(C,{disabled:a.value,title:x("Move down",["Alt","ArrowDown"]),compact:"",onClick:I(g)},{default:P(()=>[y(I(Et))]),_:1},8,["disabled","title","onClick"])])],64))}}),Gt=ve(Ht,[["__scopeId","data-v-e3c7dfb4"]]),Kt=`<script setup lang="ts">
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
`,Xt=`<SortList
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
/>`,ge=20,Zt={components:{SortList:Gt,CodeExample:Be},data(){return{codeExample:Xt,modelValue:["missing",...Array.from({length:ge},(e,n)=>`${n}`)]}},computed:{code(){return Kt},demoValues(){return Array.from({length:ge},(e,n)=>({id:`${n}`,text:`Element_${n}`}))}}},kt=_("div",{class:"grid-container"},[_("div",{class:"grid-item-12"},[_("p",null,"A multiselect listbox with sorting capabilities.")])],-1),qt={class:"grid-container"},zt={class:"grid-item-6"},Jt={class:"grid-item-6"},Yt={class:"grid-container"},Qt={class:"grid-item-12"};function Wt(e,n,t,r,i,o){const s=ie("SortList",!0),a=ie("CodeExample");return S(),L("div",null,[_("section",null,[kt,_("div",qt,[_("div",zt,[y(s,{modelValue:i.modelValue,"onUpdate:modelValue":n[0]||(n[0]=u=>i.modelValue=u),size:7,ariaLabel:"myAriaLabel","left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),_("div",Jt,"modelValue: "+U(i.modelValue),1)])]),_("section",null,[_("div",Yt,[_("div",Qt,[y(a,{summary:"Show usage example"},{default:P(()=>[se(U(i.codeExample),1)]),_:1}),y(a,{summary:"Show SortList.vue source code"},{default:P(()=>[se(U(o.code),1)]),_:1})])])])])}const ir=ve(Zt,[["render",Wt]]);export{ir as default};
