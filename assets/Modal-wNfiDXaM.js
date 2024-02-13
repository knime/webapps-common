import{q as ke,E as Te,G as Ce,H as Fe,J as Se,K as Ee,M as xe,N as Ne,_ as Y,r as E,o as N,j as q,w as y,b as m,y as te,d as C,O as ne,c as L,u as A,l as $,P as Be,s as Oe,t as R,n as Ie,e as w,p as Ae,f as De}from"./index-zjF-KOXv.js";import{P as Pe}from"./circle-play-wrSQ1zR-.js";import{B as Me}from"./Button-TRakBoXj.js";import{C as _e}from"./CodeExample-82r4HAvM.js";/*!
* tabbable 6.1.1
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var ue=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"],K=ue.join(","),de=typeof Element>"u",B=de?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,j=!de&&Element.prototype.getRootNode?function(a){var e;return a==null||(e=a.getRootNode)===null||e===void 0?void 0:e.call(a)}:function(a){return a==null?void 0:a.ownerDocument},G=function a(e,t){var n;t===void 0&&(t=!0);var i=e==null||(n=e.getAttribute)===null||n===void 0?void 0:n.call(e,"inert"),s=i===""||i==="true",o=s||t&&e&&a(e.parentNode);return o},Re=function(e){var t,n=e==null||(t=e.getAttribute)===null||t===void 0?void 0:t.call(e,"contenteditable");return n===""||n==="true"},fe=function(e,t,n){if(G(e))return[];var i=Array.prototype.slice.apply(e.querySelectorAll(K));return t&&B.call(e,K)&&i.unshift(e),i=i.filter(n),i},ve=function a(e,t,n){for(var i=[],s=Array.from(e);s.length;){var o=s.shift();if(!G(o,!1))if(o.tagName==="SLOT"){var c=o.assignedElements(),d=c.length?c:o.children,f=a(d,!0,n);n.flatten?i.push.apply(i,f):i.push({scopeParent:o,candidates:f})}else{var g=B.call(o,K);g&&n.filter(o)&&(t||!e.includes(o))&&i.push(o);var k=o.shadowRoot||typeof n.getShadowRoot=="function"&&n.getShadowRoot(o),x=!G(k,!1)&&(!n.shadowRootFilter||n.shadowRootFilter(o));if(k&&x){var F=a(k===!0?o.children:k.children,!0,n);n.flatten?i.push.apply(i,F):i.push({scopeParent:o,candidates:F})}else s.unshift.apply(s,o.children)}}return i},pe=function(e,t){return e.tabIndex<0&&(t||/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||Re(e))&&isNaN(parseInt(e.getAttribute("tabindex"),10))?0:e.tabIndex},Le=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},me=function(e){return e.tagName==="INPUT"},$e=function(e){return me(e)&&e.type==="hidden"},Ke=function(e){var t=e.tagName==="DETAILS"&&Array.prototype.slice.apply(e.children).some(function(n){return n.tagName==="SUMMARY"});return t},je=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]},Ge=function(e){if(!e.name)return!0;var t=e.form||j(e),n=function(c){return t.querySelectorAll('input[type="radio"][name="'+c+'"]')},i;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")i=n(window.CSS.escape(e.name));else try{i=n(e.name)}catch(o){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",o.message),!1}var s=je(i,e.form);return!s||s===e},Ue=function(e){return me(e)&&e.type==="radio"},ze=function(e){return Ue(e)&&!Ge(e)},Ve=function(e){var t,n=e&&j(e),i=(t=n)===null||t===void 0?void 0:t.host,s=!1;if(n&&n!==e){var o,c,d;for(s=!!((o=i)!==null&&o!==void 0&&(c=o.ownerDocument)!==null&&c!==void 0&&c.contains(i)||e!=null&&(d=e.ownerDocument)!==null&&d!==void 0&&d.contains(e));!s&&i;){var f,g,k;n=j(i),i=(f=n)===null||f===void 0?void 0:f.host,s=!!((g=i)!==null&&g!==void 0&&(k=g.ownerDocument)!==null&&k!==void 0&&k.contains(i))}}return s},ae=function(e){var t=e.getBoundingClientRect(),n=t.width,i=t.height;return n===0&&i===0},qe=function(e,t){var n=t.displayCheck,i=t.getShadowRoot;if(getComputedStyle(e).visibility==="hidden")return!0;var s=B.call(e,"details>summary:first-of-type"),o=s?e.parentElement:e;if(B.call(o,"details:not([open]) *"))return!0;if(!n||n==="full"||n==="legacy-full"){if(typeof i=="function"){for(var c=e;e;){var d=e.parentElement,f=j(e);if(d&&!d.shadowRoot&&i(d)===!0)return ae(e);e.assignedSlot?e=e.assignedSlot:!d&&f!==e.ownerDocument?e=f.host:e=d}e=c}if(Ve(e))return!e.getClientRects().length;if(n!=="legacy-full")return!0}else if(n==="non-zero-area")return ae(e);return!1},We=function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if(t.tagName==="FIELDSET"&&t.disabled){for(var n=0;n<t.children.length;n++){var i=t.children.item(n);if(i.tagName==="LEGEND")return B.call(t,"fieldset[disabled] *")?!0:!i.contains(e)}return!0}t=t.parentElement}return!1},U=function(e,t){return!(t.disabled||G(t)||$e(t)||qe(t,e)||Ke(t)||We(t))},W=function(e,t){return!(ze(t)||pe(t)<0||!U(e,t))},Ye=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return!!(isNaN(t)||t>=0)},Ze=function a(e){var t=[],n=[];return e.forEach(function(i,s){var o=!!i.scopeParent,c=o?i.scopeParent:i,d=pe(c,o),f=o?a(i.candidates):c;d===0?o?t.push.apply(t,f):t.push(c):n.push({documentOrder:s,tabIndex:d,item:i,isScope:o,content:f})}),n.sort(Le).reduce(function(i,s){return s.isScope?i.push.apply(i,s.content):i.push(s.content),i},[]).concat(t)},He=function(e,t){t=t||{};var n;return t.getShadowRoot?n=ve([e],t.includeContainer,{filter:W.bind(null,t),flatten:!1,getShadowRoot:t.getShadowRoot,shadowRootFilter:Ye}):n=fe(e,t.includeContainer,W.bind(null,t)),Ze(n)},Je=function(e,t){t=t||{};var n;return t.getShadowRoot?n=ve([e],t.includeContainer,{filter:U.bind(null,t),flatten:!0,getShadowRoot:t.getShadowRoot}):n=fe(e,t.includeContainer,U.bind(null,t)),n},M=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return B.call(e,K)===!1?!1:W(t,e)},Xe=ue.concat("iframe").join(","),oe=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return B.call(e,Xe)===!1?!1:U(t,e)};/*!
* focus-trap 7.3.1
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/function ie(a,e){var t=Object.keys(a);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(a);e&&(n=n.filter(function(i){return Object.getOwnPropertyDescriptor(a,i).enumerable})),t.push.apply(t,n)}return t}function re(a){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?ie(Object(t),!0).forEach(function(n){Qe(a,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(t)):ie(Object(t)).forEach(function(n){Object.defineProperty(a,n,Object.getOwnPropertyDescriptor(t,n))})}return a}function Qe(a,e,t){return e=tt(e),e in a?Object.defineProperty(a,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):a[e]=t,a}function et(a,e){if(typeof a!="object"||a===null)return a;var t=a[Symbol.toPrimitive];if(t!==void 0){var n=t.call(a,e||"default");if(typeof n!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(a)}function tt(a){var e=et(a,"string");return typeof e=="symbol"?e:String(e)}var se={activateTrap:function(e,t){if(e.length>0){var n=e[e.length-1];n!==t&&n.pause()}var i=e.indexOf(t);i===-1||e.splice(i,1),e.push(t)},deactivateTrap:function(e,t){var n=e.indexOf(t);n!==-1&&e.splice(n,1),e.length>0&&e[e.length-1].unpause()}},nt=function(e){return e.tagName&&e.tagName.toLowerCase()==="input"&&typeof e.select=="function"},at=function(e){return e.key==="Escape"||e.key==="Esc"||e.keyCode===27},D=function(e){return e.key==="Tab"||e.keyCode===9},ot=function(e){return D(e)&&!e.shiftKey},it=function(e){return D(e)&&e.shiftKey},le=function(e){return setTimeout(e,0)},ce=function(e,t){var n=-1;return e.every(function(i,s){return t(i)?(n=s,!1):!0}),n},I=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),i=1;i<t;i++)n[i-1]=arguments[i];return typeof e=="function"?e.apply(void 0,n):e},_=function(e){return e.target.shadowRoot&&typeof e.composedPath=="function"?e.composedPath()[0]:e.target},rt=[],st=function(e,t){var n=(t==null?void 0:t.document)||document,i=(t==null?void 0:t.trapStack)||rt,s=re({returnFocusOnDeactivate:!0,escapeDeactivates:!0,delayInitialFocus:!0,isKeyForward:ot,isKeyBackward:it},t),o={containers:[],containerGroups:[],tabbableGroups:[],nodeFocusedBeforeActivation:null,mostRecentlyFocusedNode:null,active:!1,paused:!1,delayInitialFocusTimer:void 0},c,d=function(r,l,u){return r&&r[l]!==void 0?r[l]:s[u||l]},f=function(r){return o.containerGroups.findIndex(function(l){var u=l.container,v=l.tabbableNodes;return u.contains(r)||v.find(function(p){return p===r})})},g=function(r){var l=s[r];if(typeof l=="function"){for(var u=arguments.length,v=new Array(u>1?u-1:0),p=1;p<u;p++)v[p-1]=arguments[p];l=l.apply(void 0,v)}if(l===!0&&(l=void 0),!l){if(l===void 0||l===!1)return l;throw new Error("`".concat(r,"` was specified but was not a node, or did not return a node"))}var b=l;if(typeof l=="string"&&(b=n.querySelector(l),!b))throw new Error("`".concat(r,"` as selector refers to no known node"));return b},k=function(){var r=g("initialFocus");if(r===!1)return!1;if(r===void 0)if(f(n.activeElement)>=0)r=n.activeElement;else{var l=o.tabbableGroups[0],u=l&&l.firstTabbableNode;r=u||g("fallbackFocus")}if(!r)throw new Error("Your focus-trap needs to have at least one focusable element");return r},x=function(){if(o.containerGroups=o.containers.map(function(r){var l=He(r,s.tabbableOptions),u=Je(r,s.tabbableOptions);return{container:r,tabbableNodes:l,focusableNodes:u,firstTabbableNode:l.length>0?l[0]:null,lastTabbableNode:l.length>0?l[l.length-1]:null,nextTabbableNode:function(p){var b=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0,T=u.findIndex(function(S){return S===p});if(!(T<0))return b?u.slice(T+1).find(function(S){return M(S,s.tabbableOptions)}):u.slice(0,T).reverse().find(function(S){return M(S,s.tabbableOptions)})}}}),o.tabbableGroups=o.containerGroups.filter(function(r){return r.tabbableNodes.length>0}),o.tabbableGroups.length<=0&&!g("fallbackFocus"))throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times")},F=function h(r){if(r!==!1&&r!==n.activeElement){if(!r||!r.focus){h(k());return}r.focus({preventScroll:!!s.preventScroll}),o.mostRecentlyFocusedNode=r,nt(r)&&r.select()}},Z=function(r){var l=g("setReturnFocus",r);return l||(l===!1?!1:r)},P=function(r){var l=_(r);if(!(f(l)>=0)){if(I(s.clickOutsideDeactivates,r)){c.deactivate({returnFocus:s.returnFocusOnDeactivate});return}I(s.allowOutsideClick,r)||r.preventDefault()}},H=function(r){var l=_(r),u=f(l)>=0;u||l instanceof Document?u&&(o.mostRecentlyFocusedNode=l):(r.stopImmediatePropagation(),F(o.mostRecentlyFocusedNode||k()))},be=function(r){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,u=_(r);x();var v=null;if(o.tabbableGroups.length>0){var p=f(u),b=p>=0?o.containerGroups[p]:void 0;if(p<0)l?v=o.tabbableGroups[o.tabbableGroups.length-1].lastTabbableNode:v=o.tabbableGroups[0].firstTabbableNode;else if(l){var T=ce(o.tabbableGroups,function(z){var V=z.firstTabbableNode;return u===V});if(T<0&&(b.container===u||oe(u,s.tabbableOptions)&&!M(u,s.tabbableOptions)&&!b.nextTabbableNode(u,!1))&&(T=p),T>=0){var S=T===0?o.tabbableGroups.length-1:T-1,ge=o.tabbableGroups[S];v=ge.lastTabbableNode}else D(r)||(v=b.nextTabbableNode(u,!1))}else{var O=ce(o.tabbableGroups,function(z){var V=z.lastTabbableNode;return u===V});if(O<0&&(b.container===u||oe(u,s.tabbableOptions)&&!M(u,s.tabbableOptions)&&!b.nextTabbableNode(u))&&(O=p),O>=0){var ye=O===o.tabbableGroups.length-1?0:O+1,we=o.tabbableGroups[ye];v=we.firstTabbableNode}else D(r)||(v=b.nextTabbableNode(u))}}else v=g("fallbackFocus");v&&(D(r)&&r.preventDefault(),F(v))},J=function(r){if(at(r)&&I(s.escapeDeactivates,r)!==!1){r.preventDefault(),c.deactivate();return}(s.isKeyForward(r)||s.isKeyBackward(r))&&be(r,s.isKeyBackward(r))},X=function(r){var l=_(r);f(l)>=0||I(s.clickOutsideDeactivates,r)||I(s.allowOutsideClick,r)||(r.preventDefault(),r.stopImmediatePropagation())},Q=function(){if(o.active)return se.activateTrap(i,c),o.delayInitialFocusTimer=s.delayInitialFocus?le(function(){F(k())}):F(k()),n.addEventListener("focusin",H,!0),n.addEventListener("mousedown",P,{capture:!0,passive:!1}),n.addEventListener("touchstart",P,{capture:!0,passive:!1}),n.addEventListener("click",X,{capture:!0,passive:!1}),n.addEventListener("keydown",J,{capture:!0,passive:!1}),c},ee=function(){if(o.active)return n.removeEventListener("focusin",H,!0),n.removeEventListener("mousedown",P,!0),n.removeEventListener("touchstart",P,!0),n.removeEventListener("click",X,!0),n.removeEventListener("keydown",J,!0),c};return c={get active(){return o.active},get paused(){return o.paused},activate:function(r){if(o.active)return this;var l=d(r,"onActivate"),u=d(r,"onPostActivate"),v=d(r,"checkCanFocusTrap");v||x(),o.active=!0,o.paused=!1,o.nodeFocusedBeforeActivation=n.activeElement,l&&l();var p=function(){v&&x(),Q(),u&&u()};return v?(v(o.containers.concat()).then(p,p),this):(p(),this)},deactivate:function(r){if(!o.active)return this;var l=re({onDeactivate:s.onDeactivate,onPostDeactivate:s.onPostDeactivate,checkCanReturnFocus:s.checkCanReturnFocus},r);clearTimeout(o.delayInitialFocusTimer),o.delayInitialFocusTimer=void 0,ee(),o.active=!1,o.paused=!1,se.deactivateTrap(i,c);var u=d(l,"onDeactivate"),v=d(l,"onPostDeactivate"),p=d(l,"checkCanReturnFocus"),b=d(l,"returnFocus","returnFocusOnDeactivate");u&&u();var T=function(){le(function(){b&&F(Z(o.nodeFocusedBeforeActivation)),v&&v()})};return b&&p?(p(Z(o.nodeFocusedBeforeActivation)).then(T,T),this):(T(),this)},pause:function(){return o.paused||!o.active?this:(o.paused=!0,ee(),this)},unpause:function(){return!o.paused||!o.active?this:(o.paused=!1,x(),Q(),this)},updateContainerElements:function(r){var l=[].concat(r).filter(Boolean);return o.containers=l.map(function(u){return typeof u=="string"?n.querySelector(u):u}),o.active&&x(),this}},c.updateContainerElements(e),c};/*!
  * focus-trap-vue v4.0.1
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */const lt={escapeDeactivates:{type:Boolean,default:!0},returnFocusOnDeactivate:{type:Boolean,default:!0},allowOutsideClick:{type:[Boolean,Function],default:!0},clickOutsideDeactivates:[Boolean,Function],initialFocus:[String,Function,Boolean],fallbackFocus:[String,Function],checkCanFocusTrap:Function,checkCanReturnFocus:Function,delayInitialFocus:{type:Boolean,default:!0},document:Object,preventScroll:Boolean,setReturnFocus:[Object,String,Boolean,Function],tabbableOptions:Object},ct=ke({props:Object.assign({active:{type:Boolean,default:!0}},lt),emits:["update:active","activate","postActivate","deactivate","postDeactivate"],render(){return this.renderImpl()},setup(a,{slots:e,emit:t}){let n;const i=Te(null),s=Ce(()=>{const c=i.value;return c&&(c instanceof HTMLElement?c:c.$el)});function o(){return n||(n=st(s.value,{escapeDeactivates:a.escapeDeactivates,allowOutsideClick:a.allowOutsideClick,returnFocusOnDeactivate:a.returnFocusOnDeactivate,clickOutsideDeactivates:a.clickOutsideDeactivates,onActivate:()=>{t("update:active",!0),t("activate")},onDeactivate:()=>{t("update:active",!1),t("deactivate")},onPostActivate:()=>t("postActivate"),onPostDeactivate:()=>t("postDeactivate"),initialFocus:a.initialFocus,fallbackFocus:a.fallbackFocus,tabbableOptions:a.tabbableOptions,delayInitialFocus:a.delayInitialFocus}))}return Fe(()=>{Se(()=>a.active,c=>{c&&s.value?o().activate():n&&(n.deactivate(),(!s.value||s.value.nodeType===Node.COMMENT_NODE)&&(n=null))},{immediate:!0,flush:"post"})}),Ee(()=>{n&&n.deactivate(),n=null}),{activate(){o().activate()},deactivate(){n&&n.deactivate()},renderImpl(){if(!e.default)return null;const c=e.default().filter(f=>f.type!==xe);return!c||!c.length||c.length>1?(console.error("[focus-trap-vue]: FocusTrap requires exactly one child."),c):Ne(c[0],{ref:i})}}}}),ut={components:{FocusTrap:ct},props:{active:{type:Boolean,default:!1}},emits:["cancel"],data(){return{showContent:!1}},watch:{active(a){a===!0?window.addEventListener("keyup",this.onGlobalKeyUp):window.removeEventListener("keyup",this.onGlobalKeyUp)}},beforeUnmount(){window.removeEventListener("keyup",this.onGlobalKeyUp)},methods:{onGlobalKeyUp(a){a.key==="Escape"&&(consola.trace("ESC key press, closing modal"),this.cancel())},onOverlayClick(){this.cancel()},cancel(){this.$emit("cancel")}}},dt={key:0,class:"wrapper"},ft={class:"inner"};function vt(a,e,t,n,i,s){const o=E("FocusTrap");return N(),q(ne,{name:"fade",onAfterEnter:e[2]||(e[2]=c=>i.showContent=!0),onLeave:e[3]||(e[3]=c=>i.showContent=!1)},{default:y(()=>[t.active?(N(),q(o,{key:0,active:t.active&&i.showContent,"initial-focus":()=>a.$refs.dialog,"allow-outside-click":"",class:"container"},{default:y(()=>[m("div",{ref:"dialog",tabindex:"-1",onClick:e[1]||(e[1]=te(()=>{},["stop"]))},[m("div",{class:"overlay",onClick:e[0]||(e[0]=te((...c)=>s.onOverlayClick&&s.onOverlayClick(...c),["stop"]))}),C(ne,{name:"slide"},{default:y(()=>[i.showContent?(N(),L("div",dt,[m("div",ft,[A(a.$slots,"default",{},void 0,!0)])])):$("",!0)]),_:3})],512)]),_:3},8,["active","initial-focus"])):$("",!0)]),_:3})}const pt=Y(ut,[["render",vt],["__scopeId","data-v-542fa137"]]),mt={components:{BaseModal:pt,CloseIcon:Be,FunctionButton:Oe},props:{title:{default:null,type:String},styleType:{type:String,default:"info",validator(a="info"){return["info","warn"].includes(a)}}},emits:["cancel"],methods:{onCloserClick(){this.$emit("cancel")}}},ht={class:"header"},bt={class:"header-icon"},gt={key:0,class:"notice"},yt={key:1,class:"confirmation"},wt={class:"controls"};function kt(a,e,t,n,i,s){const o=E("CloseIcon"),c=E("FunctionButton"),d=E("BaseModal");return N(),q(d,{class:Ie(["modal",t.styleType]),onCancel:e[0]||(e[0]=f=>a.$emit("cancel",f))},{default:y(()=>[m("div",ht,[m("span",bt,[A(a.$slots,"icon",{},void 0,!0)]),m("h2",null,R(t.title),1),C(c,{class:"closer",onClick:s.onCloserClick},{default:y(()=>[C(o)]),_:1},8,["onClick"])]),a.$slots.notice?(N(),L("div",gt,[A(a.$slots,"notice",{},void 0,!0)])):$("",!0),a.$slots.confirmation?(N(),L("div",yt,[A(a.$slots,"confirmation",{},void 0,!0)])):$("",!0),m("div",wt,[A(a.$slots,"controls",{},void 0,!0)])]),_:3},8,["class"])}const Tt=Y(mt,[["render",kt],["__scopeId","data-v-9fc08cf0"]]),Ct=`<script>
import BaseModal from "./BaseModal.vue";
import FunctionButton from "./FunctionButton.vue";
import CloseIcon from "../assets/img/icons/close.svg";

/**
 * See demo for documentation
 */
export default {
  components: {
    BaseModal,
    CloseIcon,
    FunctionButton,
  },
  props: {
    /**
     * @see {@link BaseModal.vue}
     */

    title: {
      default: null,
      type: String,
    },
    /**
     * One of 'info', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling,
     */
    styleType: {
      type: String,
      default: "info",
      validator(type = "info") {
        return ["info", "warn"].includes(type);
      },
    },
  },
  emits: ["cancel"],
  methods: {
    onCloserClick() {
      this.$emit("cancel");
    },
  },
};
<\/script>

<template>
  <BaseModal :class="['modal', styleType]" @cancel="$emit('cancel', $event)">
    <div class="header">
      <span class="header-icon">
        <slot name="icon" />
      </span>
      <h2>{{ title }}</h2>
      <FunctionButton class="closer" @click="onCloserClick">
        <CloseIcon />
      </FunctionButton>
    </div>
    <div v-if="$slots.notice" class="notice">
      <slot name="notice" />
    </div>
    <div v-if="$slots.confirmation" class="confirmation">
      <slot name="confirmation" />
    </div>
    <div class="controls">
      <slot name="controls" />
    </div>
  </BaseModal>
</template>

<style lang="postcss" scoped>
.modal {
  --modal-padding: 20px;

  color: var(--theme-text-link-foreground-color);

  & :deep(strong) {
    font-weight: 500;
  }

  & :deep(a) {
    color: var(--theme-text-link-foreground-color);
    background-color: var(--theme-text-link-background-color);

    @supports (mask: url("") no-repeat 50% 50%) {
      &[href^="http"]::after {
        content: "";
        mask: url("../assets/img/icons/link-external.svg?data") no-repeat 50%
          50%;
        mask-size: cover;
        background-color: var(--knime-masala); /* defines icon color */
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-left: 4px;
        vertical-align: -2px;
      }
    }

    &:hover {
      outline: none;
      color: var(--theme-text-link-foreground-color-hover);
      background-color: var(--theme-text-link-background-color-hover);
      text-decoration: none;

      &::after {
        background-color: var(
          --theme-text-link-foreground-color-hover
        ); /* defines icon color */
      }
    }
  }

  & :deep(p) {
    margin: 0;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }

  & .closer {
    margin-left: auto;
    margin-right: -6px;

    & :deep(svg) {
      stroke: var(--knime-white);
    }
  }

  & .header {
    display: flex;
    color: var(--knime-white);
    max-width: 100%;
    padding: 0 var(--modal-padding);
    align-items: center;

    & h2 {
      margin: 0;
      font-size: 19px;
      line-height: 50px;
    }

    & .header-icon {
      line-height: 0;
      margin-right: 10px;

      & :deep(svg) {
        width: 22px;
        height: 22px;
        stroke-width: 2.2px;
        stroke: var(--knime-white);
      }
    }
  }

  & .notice {
    padding: var(--modal-padding);
    font-weight: 300;

    & :deep(p) {
      font-size: 16px;
      line-height: 25px;
    }

    & :deep(ul) {
      padding: 0 0 0 30px;
      margin: 0;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    & :deep(li) {
      font-size: 16px;
      line-height: 25px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  &.info {
    & .header {
      background-color: var(--knime-masala);
    }

    & .notice {
      background-color: var(--knime-porcelain);
    }
  }

  &.warn {
    & .header {
      background-color: var(--theme-color-error);
    }

    & .notice {
      background-color: var(--theme-color-error-semi);
    }
  }

  & .confirmation {
    padding: var(--modal-padding) var(--modal-padding) 0;

    & :deep(p) {
      font-size: 13px;
      line-height: 18px;
    }
  }

  & .controls {
    padding: var(--modal-padding);
    display: flex;
    justify-content: space-between;
  }
}
</style>
`,Ft=`<script>
import { FocusTrap } from "focus-trap-vue";

/**
 * A reusable component which has an overlay and a slot for content. It contains the styles and animations needed for
 * a smooth, full-size modal capable of replacing \`window.alert\` or displaying messaging within a container element.
 *
 * This component blocks pointer-events with the overlay but emits an event when there is a click away from the modal
 * content; allowing the parent component to minimize or remove the modal as needed.
 *
 * Note that the widget width can be set vial the \`--modal-width\` CSS property, which defaults to \`550px\`.
 */
export default {
  components: {
    FocusTrap,
  },
  props: {
    /**
     * Opens and closes the alert from the parent.
     */
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["cancel"],
  data() {
    return {
      /**
       * 'showContent' is used to animate the modal content separately
       */
      showContent: false,
    };
  },
  watch: {
    // Set and remove global event handlers on modal activation.
    // Only manual activation is supported.
    active(newVal) {
      if (newVal === true) {
        window.addEventListener("keyup", this.onGlobalKeyUp);
      } else {
        window.removeEventListener("keyup", this.onGlobalKeyUp);
      }
    },
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.onGlobalKeyUp);
  },
  methods: {
    onGlobalKeyUp(e) {
      if (e.key === "Escape") {
        consola.trace("ESC key press, closing modal");
        this.cancel();
      }
    },
    /**
     * Detects any clicks on the overlay or the escape key, allowing the modal to be dismissed
     * without having to click a specific button or control.
     *
     * @param {Object} e - the browser mouse event.
     * @returns {undefined}
     */
    onOverlayClick() {
      this.cancel();
    },
    /**
     * @emits {cancel} - can be used by parent to close the modal.
     * @returns {undefined}
     */
    cancel() {
      this.$emit("cancel");
    },
  },
};
<\/script>

<template>
  <Transition
    name="fade"
    @after-enter="showContent = true"
    @leave="showContent = false"
  >
    <FocusTrap
      v-if="active"
      :active="active && showContent"
      :initial-focus="() => $refs.dialog"
      allow-outside-click
      class="container"
    >
      <div ref="dialog" tabindex="-1" @click.stop>
        <div class="overlay" @click.stop="onOverlayClick" />
        <Transition name="slide">
          <div v-if="showContent" class="wrapper">
            <div class="inner">
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </FocusTrap>
  </Transition>
</template>

<style lang="postcss" scoped>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(25%);
  opacity: 0;
}

.slide-enter-active,
.fade-enter-active {
  transition: all 0.1s ease-out;
}

.fade-leave-active,
.slide-leave-active {
  transition: all 0.1s ease-in;
}

.container {
  z-index: var(--z-index-common-modal, 100);
  min-height: 50px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--knime-black-semi);
}

.wrapper {
  /* Wrapper is used to center the modal and enable independent transitions from the overlay */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  font-size: 16px;
}

.inner {
  pointer-events: all;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: min(95%, var(--modal-width, 550px));
  background-color: var(--knime-white);
}
</style>
`,St=`<script>
import Modal from '~/webapps-common/ui/components/Modal.vue';
import PlayIcon from '~/webapps-common/ui/assets/img/icons/circle-play.svg';
import Button from '~/webapps-common/ui/components/Button.vue';

export default {
    components: {
        Modal,
        PlayIcon,
        Button
    },
    data() {
        return {
            modalActive: false
        };
    }
};
<\/script>

<template>
  <div>
    <Button
      @click="modalActive = true"
      primary
    >
      Trigger modal
    </Button>
    <Modal
      :active="modalActive"
      title="Modal title"
      class="modal"
      style-type="info"
      @cancel="modalActive = false"
    >
      <template v-slot:icon><PlayIcon /></template>
      <template v-slot:notice>This is the notice slot.</template>
      <template v-slot:confirmation>And this is content in the confirmation slot.</template>
      <template v-slot:controls>
        <Button @click="modalActive = false">Accept and close</Button>
      </template>
    </Modal>
  </div>
</template>

<style lang="postcss" scoped>
.modal {
  --modal-width: 500px; /* optional, only needed in case you want to adjust the width. Default: 550px */
}
</style>
`,Et={components:{Modal:Tt,PlayIcon:Pe,Button:Me,CodeExample:_e},data(){return{codeExample:St,code:Ct,baseModalCode:Ft,modalActive:!1,modalStyleType:"info"}}},he=a=>(Ae("data-v-184b6769"),a=a(),De(),a),xt={class:"grid-container"},Nt={class:"grid-item-12"},Bt=he(()=>m("p",null,[w(" Offers multiple optional slots for content to show inside a "),m("a",{href:"https://en.wikipedia.org/wiki/Modal_window"},"modal dialog"),w(". Multiple styles are supported by the "),m("code",null,"styleType"),w(" prop. See source code for possible values. The modal emits a "),m("code",null,"cancel"),w(" event which is triggered by clicking the overlay, the ESC key or the close button. Also on tab, the focus is trapped inside the modal. ")],-1)),Ot=he(()=>m("p",null,[w(" For the rare cases where more design freedom is needed, please use the "),m("code",null,"BaseModal"),w(" component which comes without a header and styled slots. But please be aware of "),m("a",{href:"https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html"},"W3C best practices for modal dialogs"),w(". ")],-1)),It={class:"grid-container"},At={class:"grid-item-12"};function Dt(a,e,t,n,i,s){const o=E("Button"),c=E("PlayIcon"),d=E("Modal",!0),f=E("CodeExample");return N(),L("div",null,[m("section",null,[m("div",xt,[m("div",Nt,[Bt,Ot,C(o,{primary:"",onClick:e[0]||(e[0]=g=>i.modalActive=!0)},{default:y(()=>[w(" Trigger modal ")]),_:1}),C(d,{active:i.modalActive,title:"Modal title",class:"modal","style-type":i.modalStyleType,onCancel:e[2]||(e[2]=g=>i.modalActive=!1)},{icon:y(()=>[C(c)]),notice:y(()=>[w("This is the notice slot.")]),confirmation:y(()=>[w("And this is content in the confirmation slot.")]),controls:y(()=>[C(o,{primary:"",onClick:e[1]||(e[1]=g=>i.modalActive=!1)},{default:y(()=>[w(" Accept and close ")]),_:1})]),_:1},8,["active","style-type"])])])]),m("section",null,[m("div",It,[m("div",At,[C(f,{summary:"Show usage example"},{default:y(()=>[w(R(i.codeExample),1)]),_:1}),C(f,{summary:"Show Modal.vue source code"},{default:y(()=>[w(R(i.code),1)]),_:1}),C(f,{summary:"Show BaseModal.vue source code"},{default:y(()=>[w(R(i.baseModalCode),1)]),_:1})])])])])}const Lt=Y(Et,[["render",Dt],["__scopeId","data-v-184b6769"]]);export{Lt as default};
