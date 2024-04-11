import{C as Be}from"./CodeExample-UODj4Lan.js";import{aA as K,aB as G,ai as E,aC as X,aD as Oe,aE as W,aF as Me,aG as j,aH as ee,am as ne,aj as te,aI as $,ak as Ve,aJ as re,aK as ge,aL as Ce,aM as $e,al as De,aN as Fe,aO as Re,ah as Ne,aP as Ue,o as S,c as L,b as _,q as He,G as N,E as oe,J as Ge,d as y,x as O,y as M,Z as I,w as P,s as V,F as Ke,$ as Xe,_ as we,r as se,t as U,e as ie}from"./index-wuLaGC0K.js";import{M as Ze}from"./MultiselectListBox-ajKmW2oR.js";import{c as qe}from"./createMissingItem-gAI5zZ9a.js";import"./StyledListItem-IetBLmCZ.js";var ze=/\s/;function Je(e){for(var n=e.length;n--&&ze.test(e.charAt(n)););return n}var Ye=/^\s+/;function ke(e){return e&&e.slice(0,Je(e)+1).replace(Ye,"")}var ae=NaN,Qe=/^[-+]0x[0-9a-f]+$/i,We=/^0b[01]+$/i,je=/^0o[0-7]+$/i,en=parseInt;function nn(e){if(typeof e=="number")return e;if(K(e))return ae;if(G(e)){var n=typeof e.valueOf=="function"?e.valueOf():e;e=G(n)?n+"":n}if(typeof e!="string")return e===0?e:+e;e=ke(e);var t=We.test(e);return t||je.test(e)?en(e.slice(2),t?2:8):Qe.test(e)?ae:+e}var le=1/0,tn=17976931348623157e292;function rn(e){if(!e)return e===0?e:0;if(e=nn(e),e===le||e===-le){var n=e<0?-1:1;return n*tn}return e===e?e:0}function on(e){var n=rn(e),t=n%1;return n===n?t?n-t:n:0}function sn(e,n,t,r){for(var s=e.length,o=t+(r?1:-1);r?o--:++o<s;)if(n(e[o],o,e))return o;return-1}function an(e){return e!==e}function ln(e,n,t){for(var r=t-1,s=e.length;++r<s;)if(e[r]===n)return r;return-1}function un(e,n,t){return n===n?ln(e,n,t):sn(e,an,t)}var dn=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,cn=/^\w*$/;function Z(e,n){if(E(e))return!1;var t=typeof e;return t=="number"||t=="symbol"||t=="boolean"||e==null||K(e)?!0:cn.test(e)||!dn.test(e)||n!=null&&e in Object(n)}var fn="Expected a function";function q(e,n){if(typeof e!="function"||n!=null&&typeof n!="function")throw new TypeError(fn);var t=function(){var r=arguments,s=n?n.apply(this,r):r[0],o=t.cache;if(o.has(s))return o.get(s);var i=e.apply(this,r);return t.cache=o.set(s,i)||o,i};return t.cache=new(q.Cache||X),t}q.Cache=X;var pn=500;function mn(e){var n=q(e,function(r){return t.size===pn&&t.clear(),r}),t=n.cache;return n}var gn=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,wn=/\\(\\)?/g,vn=mn(function(e){var n=[];return e.charCodeAt(0)===46&&n.push(""),e.replace(gn,function(t,r,s,o){n.push(s?o.replace(wn,"$1"):r||t)}),n});function ve(e,n){return E(e)?e:Z(e,n)?[e]:vn(Oe(e))}var _n=1/0;function F(e){if(typeof e=="string"||K(e))return e;var n=e+"";return n=="0"&&1/e==-_n?"-0":n}function _e(e,n){n=ve(n,e);for(var t=0,r=n.length;e!=null&&t<r;)e=e[F(n[t++])];return t&&t==r?e:void 0}function hn(e,n,t){var r=e==null?void 0:_e(e,n);return r===void 0?t:r}var xn="__lodash_hash_undefined__";function yn(e){return this.__data__.set(e,xn),this}function An(e){return this.__data__.has(e)}function D(e){var n=-1,t=e==null?0:e.length;for(this.__data__=new X;++n<t;)this.add(e[n])}D.prototype.add=D.prototype.push=yn;D.prototype.has=An;function bn(e,n){for(var t=-1,r=e==null?0:e.length;++t<r;)if(n(e[t],t,e))return!0;return!1}function Tn(e,n){return e.has(n)}var In=1,En=2;function he(e,n,t,r,s,o){var i=t&In,a=e.length,u=n.length;if(a!=u&&!(i&&u>a))return!1;var f=o.get(e),w=o.get(n);if(f&&w)return f==n&&w==e;var c=-1,d=!0,h=t&En?new D:void 0;for(o.set(e,n),o.set(n,e);++c<a;){var g=e[c],v=n[c];if(r)var A=i?r(v,g,c,n,e,o):r(g,v,c,e,n,o);if(A!==void 0){if(A)continue;d=!1;break}if(h){if(!bn(n,function(x,l){if(!Tn(h,l)&&(g===x||s(g,x,t,r,o)))return h.push(l)})){d=!1;break}}else if(!(g===v||s(g,v,t,r,o))){d=!1;break}}return o.delete(e),o.delete(n),d}function Pn(e){var n=-1,t=Array(e.size);return e.forEach(function(r,s){t[++n]=[s,r]}),t}function Sn(e){var n=-1,t=Array(e.size);return e.forEach(function(r){t[++n]=r}),t}var Ln=1,Bn=2,On="[object Boolean]",Mn="[object Date]",Vn="[object Error]",Cn="[object Map]",$n="[object Number]",Dn="[object RegExp]",Fn="[object Set]",Rn="[object String]",Nn="[object Symbol]",Un="[object ArrayBuffer]",Hn="[object DataView]",ue=W?W.prototype:void 0,H=ue?ue.valueOf:void 0;function Gn(e,n,t,r,s,o,i){switch(t){case Hn:if(e.byteLength!=n.byteLength||e.byteOffset!=n.byteOffset)return!1;e=e.buffer,n=n.buffer;case Un:return!(e.byteLength!=n.byteLength||!o(new j(e),new j(n)));case On:case Mn:case $n:return Me(+e,+n);case Vn:return e.name==n.name&&e.message==n.message;case Dn:case Rn:return e==n+"";case Cn:var a=Pn;case Fn:var u=r&Ln;if(a||(a=Sn),e.size!=n.size&&!u)return!1;var f=i.get(e);if(f)return f==n;r|=Bn,i.set(e,n);var w=he(a(e),a(n),r,s,o,i);return i.delete(e),w;case Nn:if(H)return H.call(e)==H.call(n)}return!1}var Kn=1,Xn=Object.prototype,Zn=Xn.hasOwnProperty;function qn(e,n,t,r,s,o){var i=t&Kn,a=ee(e),u=a.length,f=ee(n),w=f.length;if(u!=w&&!i)return!1;for(var c=u;c--;){var d=a[c];if(!(i?d in n:Zn.call(n,d)))return!1}var h=o.get(e),g=o.get(n);if(h&&g)return h==n&&g==e;var v=!0;o.set(e,n),o.set(n,e);for(var A=i;++c<u;){d=a[c];var x=e[d],l=n[d];if(r)var p=i?r(l,x,d,n,e,o):r(x,l,d,e,n,o);if(!(p===void 0?x===l||s(x,l,t,r,o):p)){v=!1;break}A||(A=d=="constructor")}if(v&&!A){var m=e.constructor,b=n.constructor;m!=b&&"constructor"in e&&"constructor"in n&&!(typeof m=="function"&&m instanceof m&&typeof b=="function"&&b instanceof b)&&(v=!1)}return o.delete(e),o.delete(n),v}var zn=1,de="[object Arguments]",ce="[object Array]",C="[object Object]",Jn=Object.prototype,fe=Jn.hasOwnProperty;function Yn(e,n,t,r,s,o){var i=E(e),a=E(n),u=i?ce:ne(e),f=a?ce:ne(n);u=u==de?C:u,f=f==de?C:f;var w=u==C,c=f==C,d=u==f;if(d&&te(e)){if(!te(n))return!1;i=!0,w=!1}if(d&&!w)return o||(o=new $),i||Ve(e)?he(e,n,t,r,s,o):Gn(e,n,u,t,r,s,o);if(!(t&zn)){var h=w&&fe.call(e,"__wrapped__"),g=c&&fe.call(n,"__wrapped__");if(h||g){var v=h?e.value():e,A=g?n.value():n;return o||(o=new $),s(v,A,t,r,o)}}return d?(o||(o=new $),qn(e,n,t,r,s,o)):!1}function z(e,n,t,r,s){return e===n?!0:e==null||n==null||!re(e)&&!re(n)?e!==e&&n!==n:Yn(e,n,t,r,z,s)}var kn=1,Qn=2;function Wn(e,n,t,r){var s=t.length,o=s,i=!r;if(e==null)return!o;for(e=Object(e);s--;){var a=t[s];if(i&&a[2]?a[1]!==e[a[0]]:!(a[0]in e))return!1}for(;++s<o;){a=t[s];var u=a[0],f=e[u],w=a[1];if(i&&a[2]){if(f===void 0&&!(u in e))return!1}else{var c=new $;if(r)var d=r(f,w,u,e,n,c);if(!(d===void 0?z(w,f,kn|Qn,r,c):d))return!1}}return!0}function xe(e){return e===e&&!G(e)}function jn(e){for(var n=ge(e),t=n.length;t--;){var r=n[t],s=e[r];n[t]=[r,s,xe(s)]}return n}function ye(e,n){return function(t){return t==null?!1:t[e]===n&&(n!==void 0||e in Object(t))}}function et(e){var n=jn(e);return n.length==1&&n[0][2]?ye(n[0][0],n[0][1]):function(t){return t===e||Wn(t,e,n)}}function nt(e,n){return e!=null&&n in Object(e)}function tt(e,n,t){n=ve(n,e);for(var r=-1,s=n.length,o=!1;++r<s;){var i=F(n[r]);if(!(o=e!=null&&t(e,i)))break;e=e[i]}return o||++r!=s?o:(s=e==null?0:e.length,!!s&&Ce(s)&&$e(i,s)&&(E(e)||De(e)))}function rt(e,n){return e!=null&&tt(e,n,nt)}var ot=1,st=2;function it(e,n){return Z(e)&&xe(n)?ye(F(e),n):function(t){var r=hn(t,e);return r===void 0&&r===n?rt(t,e):z(n,r,ot|st)}}function at(e){return function(n){return n==null?void 0:n[e]}}function lt(e){return function(n){return _e(n,e)}}function ut(e){return Z(e)?at(F(e)):lt(e)}function dt(e){return typeof e=="function"?e:e==null?Fe:typeof e=="object"?E(e)?it(e[0],e[1]):et(e):ut(e)}function ct(e,n,t,r){for(var s=-1,o=e==null?0:e.length;++s<o;){var i=e[s];n(r,i,t(i),e)}return r}function ft(e,n){return e&&Re(e,n,ge)}function pt(e,n){return function(t,r){if(t==null)return t;if(!Ne(t))return e(t,r);for(var s=t.length,o=n?s:-1,i=Object(t);(n?o--:++o<s)&&r(i[o],o,i)!==!1;);return t}}var mt=pt(ft);function gt(e,n,t,r){return mt(e,function(s,o,i){n(r,s,t(s),i)}),r}function Ae(e,n){return function(t,r){var s=E(t)?ct:gt,o=n?n():{};return s(t,e,dt(r),o)}}var wt=Math.max;function vt(e,n,t){var r=e==null?0:e.length;if(!r)return-1;var s=t==null?0:on(t);return s<0&&(s=wt(r+s,0)),un(e,n,s)}var _t=Ae(function(e,n,t){Ue(e,t,n)}),ht=Ae(function(e,n,t){e[t?0:1].push(n)},function(){return[[],[]]});const xt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},yt=_("path",{d:"m27 17.1-11 11-11-11m11 11V3.9"},null,-1),At=[yt];function bt(e,n){return S(),L("svg",xt,[...At])}const Tt={render:bt},It={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Et=_("path",{d:"m5 14.9 11-11 11 11m-11-11v24.2"},null,-1),Pt=[Et];function St(e,n){return S(),L("svg",It,[...Pt])}const Lt={render:St},Bt={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000",viewBox:"0 0 32 32"},Ot=_("path",{d:"M23.4 13.4 16 20.8l-7.4-7.4m7.4 7.4V4.5m12.5 23h-25"},null,-1),Mt=[Ot];function Vt(e,n){return S(),L("svg",Bt,[...Mt])}const pe={render:Vt},Ct=()=>{var e,n;return(n=(e=navigator==null?void 0:navigator.userAgent)==null?void 0:e.toLowerCase())==null?void 0:n.includes("mac")},$t=e=>{const n={ArrowUp:"↑",ArrowDown:"↓",ArrowLeft:"←",ArrowRight:"→",Enter:"↵"},t={Shift:"⇧",Delete:"⌫",Ctrl:"⌘",Alt:"⌥",Enter:"↩"},r=o=>i=>o[i]??i,s=o=>o;return e.map(o=>Ct()?r(t)(o):s(o)).map(r(n))},Dt=()=>" ",Ft=(e,n=Dt)=>$t(e).join(n()),Rt={class:"buttons"},Nt=He({__name:"SortList",props:{modelValue:{},id:{},ariaLabel:{},disabled:{type:Boolean},possibleValues:{}},emits:["update:modelValue"],setup(e,{emit:n}){const t=e,r=n,s=N(()=>_t(t.possibleValues,"id")),o=N(()=>t.modelValue.map(l=>s.value[l]??qe(l))),i=oe([]);Ge(()=>t.modelValue,l=>{const p=new Set(l);i.value=i.value.filter(m=>p.has(m))});const a=N(()=>i.value.length===0),u=(l,p,m)=>[l.slice(0,p),l.slice(p,m),l.slice(m)],f=l=>{let p=0;return m=>l(m,p++)},w=(l,p)=>ht(l,f((m,b)=>p(b))),c=oe(null),d=l=>({to:p}={})=>{const m=i.value.map(T=>vt(t.modelValue,T)).sort((T,B)=>T-B),b=(l==="up"?p:null)??Math.max(m[0]-1,0),R=(l==="down"?p:null)??m[m.length-1]+1,[be,Te,Ie]=u(t.modelValue,b,R+1),Ee=new Set(m),[J,Y]=w(Te,T=>Ee.has(T+b)),[Pe,Se]=l==="up"?[J,Y]:[Y,J],Le=be.concat(Pe,Se,Ie);r("update:modelValue",Le),Xe(()=>{var T,B,k,Q;l==="up"?((T=c.value)==null||T.scrollUpIntoView(b-1),(B=c.value)==null||B.setCurrentKeyNavIndex(b)):((k=c.value)==null||k.scrollDownIntoView(R+1),(Q=c.value)==null||Q.setCurrentKeyNavIndex(R))})},h=d("up"),g=d("down"),v=()=>h({to:0}),A=()=>g({to:t.modelValue.length}),x=(l,p)=>`${l} (${Ft(p)})`;return(l,p)=>(S(),L(Ke,null,[y(Ze,{id:l.id,ref_key:"listBox",ref:c,modelValue:i.value,"onUpdate:modelValue":p[0]||(p[0]=m=>i.value=m),"possible-values":o.value,ariaLabel:`sortListBox_${l.ariaLabel}`,"with-is-empty-state":!0,"empty-state-label":"Empty",size:10,onKeydown:[O(M(I(g),["alt"]),["down"]),O(M(I(h),["alt"]),["up"]),O(M(v,["alt"]),["home"]),O(M(A,["alt"]),["end"])]},null,8,["id","modelValue","possible-values","ariaLabel","onKeydown"]),_("div",Rt,[y(V,{disabled:a.value,title:x("Move to top",["Alt","Home"]),compact:"",onClick:v},{default:P(()=>[y(I(pe),{class:"rotated"})]),_:1},8,["disabled","title"]),y(V,{disabled:a.value,title:x("Move to bottom",["Alt","End"]),compact:"",onClick:A},{default:P(()=>[y(I(pe))]),_:1},8,["disabled","title"]),y(V,{disabled:a.value,title:x("Move up",["Alt","ArrowUp"]),compact:"",onClick:I(h)},{default:P(()=>[y(I(Lt))]),_:1},8,["disabled","title","onClick"]),y(V,{disabled:a.value,title:x("Move down",["Alt","ArrowDown"]),compact:"",onClick:I(g)},{default:P(()=>[y(I(Tt))]),_:1},8,["disabled","title","onClick"])])],64))}}),Ut=we(Nt,[["__scopeId","data-v-80e5900e"]]),Ht=`<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";
import { partition, indexOf, keyBy } from "lodash-es";
import MultiselectListBox from "./MultiselectListBox.vue";
import ArrowDownIcon from "../../assets/img/icons/arrow-down.svg";
import ArrowUpIcon from "../../assets/img/icons/arrow-up.svg";
import ArrowDownloadIcon from "../../assets/img/icons/arrow-download.svg";
import FunctionButton from "../FunctionButton.vue";
import createMissingItem from "./possibleValues/createMissingItem";
import type { PossibleValue } from "./possibleValues/PossibleValue";
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
/>`,me=20,Kt={components:{SortList:Ut,CodeExample:Be},data(){return{codeExample:Gt,modelValue:["missing",...Array.from({length:me},(e,n)=>`${n}`)]}},computed:{code(){return Ht},demoValues(){return Array.from({length:me},(e,n)=>({id:`${n}`,text:`Element_${n}`}))}}},Xt=_("div",{class:"grid-container"},[_("div",{class:"grid-item-12"},[_("p",null,"A multiselect listbox with sorting capabilities.")])],-1),Zt={class:"grid-container"},qt={class:"grid-item-6"},zt={class:"grid-item-6"},Jt={class:"grid-container"},Yt={class:"grid-item-12"};function kt(e,n,t,r,s,o){const i=se("SortList",!0),a=se("CodeExample");return S(),L("div",null,[_("section",null,[Xt,_("div",Zt,[_("div",qt,[y(i,{modelValue:s.modelValue,"onUpdate:modelValue":n[0]||(n[0]=u=>s.modelValue=u),size:7,ariaLabel:"myAriaLabel","left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),_("div",zt,"modelValue: "+U(s.modelValue),1)])]),_("section",null,[_("div",Jt,[_("div",Yt,[y(a,{summary:"Show usage example"},{default:P(()=>[ie(U(s.codeExample),1)]),_:1}),y(a,{summary:"Show SortList.vue source code"},{default:P(()=>[ie(U(o.code),1)]),_:1})])])])])}const tr=we(Kt,[["render",kt]]);export{tr as default};
