import{u as Y,E as Ce,G as Te,H as Fe,J as Ee,K as Se,M as Ne,N as De,_ as H,r as F,o as N,j as q,w as y,b as h,q as ne,d as T,O as ae,c as O,x as I,l as P,P as Be,v as xe,t as _,n as Ae,e as w,p as Ie,f as Oe}from"./index-wzKqlXwA.js";import{P as Pe}from"./circle-play-Kqp3Lge5.js";import{B as Me}from"./Button-0H2uIK4z.js";import{C as Re}from"./CodeExample-B9xwyoRn.js";import{C as $e}from"./Checkbox-8_ScHXlA.js";/*!
* tabbable 6.1.1
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/var de=["input:not([inert])","select:not([inert])","textarea:not([inert])","a[href]:not([inert])","button:not([inert])","[tabindex]:not(slot):not([inert])","audio[controls]:not([inert])","video[controls]:not([inert])",'[contenteditable]:not([contenteditable="false"]):not([inert])',"details>summary:first-of-type:not([inert])","details:not([inert])"],K=de.join(","),fe=typeof Element>"u",B=fe?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,j=!fe&&Element.prototype.getRootNode?function(n){var e;return n==null||(e=n.getRootNode)===null||e===void 0?void 0:e.call(n)}:function(n){return n==null?void 0:n.ownerDocument},V=function n(e,t){var a;t===void 0&&(t=!0);var o=e==null||(a=e.getAttribute)===null||a===void 0?void 0:a.call(e,"inert"),s=o===""||o==="true",i=s||t&&e&&n(e.parentNode);return i},Le=function(e){var t,a=e==null||(t=e.getAttribute)===null||t===void 0?void 0:t.call(e,"contenteditable");return a===""||a==="true"},ve=function(e,t,a){if(V(e))return[];var o=Array.prototype.slice.apply(e.querySelectorAll(K));return t&&B.call(e,K)&&o.unshift(e),o=o.filter(a),o},pe=function n(e,t,a){for(var o=[],s=Array.from(e);s.length;){var i=s.shift();if(!V(i,!1))if(i.tagName==="SLOT"){var c=i.assignedElements(),d=c.length?c:i.children,f=n(d,!0,a);a.flatten?o.push.apply(o,f):o.push({scopeParent:i,candidates:f})}else{var k=B.call(i,K);k&&a.filter(i)&&(t||!e.includes(i))&&o.push(i);var m=i.shadowRoot||typeof a.getShadowRoot=="function"&&a.getShadowRoot(i),D=!V(m,!1)&&(!a.shadowRootFilter||a.shadowRootFilter(i));if(m&&D){var E=n(m===!0?i.children:m.children,!0,a);a.flatten?o.push.apply(o,E):o.push({scopeParent:i,candidates:E})}else s.unshift.apply(s,i.children)}}return o},me=function(e,t){return e.tabIndex<0&&(t||/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||Le(e))&&isNaN(parseInt(e.getAttribute("tabindex"),10))?0:e.tabIndex},_e=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},he=function(e){return e.tagName==="INPUT"},Ke=function(e){return he(e)&&e.type==="hidden"},je=function(e){var t=e.tagName==="DETAILS"&&Array.prototype.slice.apply(e.children).some(function(a){return a.tagName==="SUMMARY"});return t},Ve=function(e,t){for(var a=0;a<e.length;a++)if(e[a].checked&&e[a].form===t)return e[a]},Ue=function(e){if(!e.name)return!0;var t=e.form||j(e),a=function(c){return t.querySelectorAll('input[type="radio"][name="'+c+'"]')},o;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")o=a(window.CSS.escape(e.name));else try{o=a(e.name)}catch(i){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",i.message),!1}var s=Ve(o,e.form);return!s||s===e},Ge=function(e){return he(e)&&e.type==="radio"},ze=function(e){return Ge(e)&&!Ue(e)},qe=function(e){var t,a=e&&j(e),o=(t=a)===null||t===void 0?void 0:t.host,s=!1;if(a&&a!==e){var i,c,d;for(s=!!((i=o)!==null&&i!==void 0&&(c=i.ownerDocument)!==null&&c!==void 0&&c.contains(o)||e!=null&&(d=e.ownerDocument)!==null&&d!==void 0&&d.contains(e));!s&&o;){var f,k,m;a=j(o),o=(f=a)===null||f===void 0?void 0:f.host,s=!!((k=o)!==null&&k!==void 0&&(m=k.ownerDocument)!==null&&m!==void 0&&m.contains(o))}}return s},ie=function(e){var t=e.getBoundingClientRect(),a=t.width,o=t.height;return a===0&&o===0},We=function(e,t){var a=t.displayCheck,o=t.getShadowRoot;if(getComputedStyle(e).visibility==="hidden")return!0;var s=B.call(e,"details>summary:first-of-type"),i=s?e.parentElement:e;if(B.call(i,"details:not([open]) *"))return!0;if(!a||a==="full"||a==="legacy-full"){if(typeof o=="function"){for(var c=e;e;){var d=e.parentElement,f=j(e);if(d&&!d.shadowRoot&&o(d)===!0)return ie(e);e.assignedSlot?e=e.assignedSlot:!d&&f!==e.ownerDocument?e=f.host:e=d}e=c}if(qe(e))return!e.getClientRects().length;if(a!=="legacy-full")return!0}else if(a==="non-zero-area")return ie(e);return!1},Ye=function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if(t.tagName==="FIELDSET"&&t.disabled){for(var a=0;a<t.children.length;a++){var o=t.children.item(a);if(o.tagName==="LEGEND")return B.call(t,"fieldset[disabled] *")?!0:!o.contains(e)}return!0}t=t.parentElement}return!1},U=function(e,t){return!(t.disabled||V(t)||Ke(t)||We(t,e)||je(t)||Ye(t))},W=function(e,t){return!(ze(t)||me(t)<0||!U(e,t))},He=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return!!(isNaN(t)||t>=0)},Ze=function n(e){var t=[],a=[];return e.forEach(function(o,s){var i=!!o.scopeParent,c=i?o.scopeParent:o,d=me(c,i),f=i?n(o.candidates):c;d===0?i?t.push.apply(t,f):t.push(c):a.push({documentOrder:s,tabIndex:d,item:o,isScope:i,content:f})}),a.sort(_e).reduce(function(o,s){return s.isScope?o.push.apply(o,s.content):o.push(s.content),o},[]).concat(t)},Je=function(e,t){t=t||{};var a;return t.getShadowRoot?a=pe([e],t.includeContainer,{filter:W.bind(null,t),flatten:!1,getShadowRoot:t.getShadowRoot,shadowRootFilter:He}):a=ve(e,t.includeContainer,W.bind(null,t)),Ze(a)},Xe=function(e,t){t=t||{};var a;return t.getShadowRoot?a=pe([e],t.includeContainer,{filter:U.bind(null,t),flatten:!0,getShadowRoot:t.getShadowRoot}):a=ve(e,t.includeContainer,U.bind(null,t)),a},$=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return B.call(e,K)===!1?!1:W(t,e)},Qe=de.concat("iframe").join(","),oe=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return B.call(e,Qe)===!1?!1:U(t,e)};/*!
* focus-trap 7.3.1
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/function re(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(n);e&&(a=a.filter(function(o){return Object.getOwnPropertyDescriptor(n,o).enumerable})),t.push.apply(t,a)}return t}function se(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?re(Object(t),!0).forEach(function(a){et(n,a,t[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):re(Object(t)).forEach(function(a){Object.defineProperty(n,a,Object.getOwnPropertyDescriptor(t,a))})}return n}function et(n,e,t){return e=nt(e),e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function tt(n,e){if(typeof n!="object"||n===null)return n;var t=n[Symbol.toPrimitive];if(t!==void 0){var a=t.call(n,e||"default");if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(n)}function nt(n){var e=tt(n,"string");return typeof e=="symbol"?e:String(e)}var le={activateTrap:function(e,t){if(e.length>0){var a=e[e.length-1];a!==t&&a.pause()}var o=e.indexOf(t);o===-1||e.splice(o,1),e.push(t)},deactivateTrap:function(e,t){var a=e.indexOf(t);a!==-1&&e.splice(a,1),e.length>0&&e[e.length-1].unpause()}},at=function(e){return e.tagName&&e.tagName.toLowerCase()==="input"&&typeof e.select=="function"},it=function(e){return e.key==="Escape"||e.key==="Esc"||e.keyCode===27},M=function(e){return e.key==="Tab"||e.keyCode===9},ot=function(e){return M(e)&&!e.shiftKey},rt=function(e){return M(e)&&e.shiftKey},ce=function(e){return setTimeout(e,0)},ue=function(e,t){var a=-1;return e.every(function(o,s){return t(o)?(a=s,!1):!0}),a},A=function(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),o=1;o<t;o++)a[o-1]=arguments[o];return typeof e=="function"?e.apply(void 0,a):e},L=function(e){return e.target.shadowRoot&&typeof e.composedPath=="function"?e.composedPath()[0]:e.target},st=[],lt=function(e,t){var a=(t==null?void 0:t.document)||document,o=(t==null?void 0:t.trapStack)||st,s=se({returnFocusOnDeactivate:!0,escapeDeactivates:!0,delayInitialFocus:!0,isKeyForward:ot,isKeyBackward:rt},t),i={containers:[],containerGroups:[],tabbableGroups:[],nodeFocusedBeforeActivation:null,mostRecentlyFocusedNode:null,active:!1,paused:!1,delayInitialFocusTimer:void 0},c,d=function(r,l,u){return r&&r[l]!==void 0?r[l]:s[u||l]},f=function(r){return i.containerGroups.findIndex(function(l){var u=l.container,v=l.tabbableNodes;return u.contains(r)||v.find(function(p){return p===r})})},k=function(r){var l=s[r];if(typeof l=="function"){for(var u=arguments.length,v=new Array(u>1?u-1:0),p=1;p<u;p++)v[p-1]=arguments[p];l=l.apply(void 0,v)}if(l===!0&&(l=void 0),!l){if(l===void 0||l===!1)return l;throw new Error("`".concat(r,"` was specified but was not a node, or did not return a node"))}var g=l;if(typeof l=="string"&&(g=a.querySelector(l),!g))throw new Error("`".concat(r,"` as selector refers to no known node"));return g},m=function(){var r=k("initialFocus");if(r===!1)return!1;if(r===void 0)if(f(a.activeElement)>=0)r=a.activeElement;else{var l=i.tabbableGroups[0],u=l&&l.firstTabbableNode;r=u||k("fallbackFocus")}if(!r)throw new Error("Your focus-trap needs to have at least one focusable element");return r},D=function(){if(i.containerGroups=i.containers.map(function(r){var l=Je(r,s.tabbableOptions),u=Xe(r,s.tabbableOptions);return{container:r,tabbableNodes:l,focusableNodes:u,firstTabbableNode:l.length>0?l[0]:null,lastTabbableNode:l.length>0?l[l.length-1]:null,nextTabbableNode:function(p){var g=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0,C=u.findIndex(function(S){return S===p});if(!(C<0))return g?u.slice(C+1).find(function(S){return $(S,s.tabbableOptions)}):u.slice(0,C).reverse().find(function(S){return $(S,s.tabbableOptions)})}}}),i.tabbableGroups=i.containerGroups.filter(function(r){return r.tabbableNodes.length>0}),i.tabbableGroups.length<=0&&!k("fallbackFocus"))throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times")},E=function b(r){if(r!==!1&&r!==a.activeElement){if(!r||!r.focus){b(m());return}r.focus({preventScroll:!!s.preventScroll}),i.mostRecentlyFocusedNode=r,at(r)&&r.select()}},Z=function(r){var l=k("setReturnFocus",r);return l||(l===!1?!1:r)},R=function(r){var l=L(r);if(!(f(l)>=0)){if(A(s.clickOutsideDeactivates,r)){c.deactivate({returnFocus:s.returnFocusOnDeactivate});return}A(s.allowOutsideClick,r)||r.preventDefault()}},J=function(r){var l=L(r),u=f(l)>=0;u||l instanceof Document?u&&(i.mostRecentlyFocusedNode=l):(r.stopImmediatePropagation(),E(i.mostRecentlyFocusedNode||m()))},ge=function(r){var l=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1,u=L(r);D();var v=null;if(i.tabbableGroups.length>0){var p=f(u),g=p>=0?i.containerGroups[p]:void 0;if(p<0)l?v=i.tabbableGroups[i.tabbableGroups.length-1].lastTabbableNode:v=i.tabbableGroups[0].firstTabbableNode;else if(l){var C=ue(i.tabbableGroups,function(G){var z=G.firstTabbableNode;return u===z});if(C<0&&(g.container===u||oe(u,s.tabbableOptions)&&!$(u,s.tabbableOptions)&&!g.nextTabbableNode(u,!1))&&(C=p),C>=0){var S=C===0?i.tabbableGroups.length-1:C-1,ye=i.tabbableGroups[S];v=ye.lastTabbableNode}else M(r)||(v=g.nextTabbableNode(u,!1))}else{var x=ue(i.tabbableGroups,function(G){var z=G.lastTabbableNode;return u===z});if(x<0&&(g.container===u||oe(u,s.tabbableOptions)&&!$(u,s.tabbableOptions)&&!g.nextTabbableNode(u))&&(x=p),x>=0){var we=x===i.tabbableGroups.length-1?0:x+1,ke=i.tabbableGroups[we];v=ke.firstTabbableNode}else M(r)||(v=g.nextTabbableNode(u))}}else v=k("fallbackFocus");v&&(M(r)&&r.preventDefault(),E(v))},X=function(r){if(it(r)&&A(s.escapeDeactivates,r)!==!1){r.preventDefault(),c.deactivate();return}(s.isKeyForward(r)||s.isKeyBackward(r))&&ge(r,s.isKeyBackward(r))},Q=function(r){var l=L(r);f(l)>=0||A(s.clickOutsideDeactivates,r)||A(s.allowOutsideClick,r)||(r.preventDefault(),r.stopImmediatePropagation())},ee=function(){if(i.active)return le.activateTrap(o,c),i.delayInitialFocusTimer=s.delayInitialFocus?ce(function(){E(m())}):E(m()),a.addEventListener("focusin",J,!0),a.addEventListener("mousedown",R,{capture:!0,passive:!1}),a.addEventListener("touchstart",R,{capture:!0,passive:!1}),a.addEventListener("click",Q,{capture:!0,passive:!1}),a.addEventListener("keydown",X,{capture:!0,passive:!1}),c},te=function(){if(i.active)return a.removeEventListener("focusin",J,!0),a.removeEventListener("mousedown",R,!0),a.removeEventListener("touchstart",R,!0),a.removeEventListener("click",Q,!0),a.removeEventListener("keydown",X,!0),c};return c={get active(){return i.active},get paused(){return i.paused},activate:function(r){if(i.active)return this;var l=d(r,"onActivate"),u=d(r,"onPostActivate"),v=d(r,"checkCanFocusTrap");v||D(),i.active=!0,i.paused=!1,i.nodeFocusedBeforeActivation=a.activeElement,l&&l();var p=function(){v&&D(),ee(),u&&u()};return v?(v(i.containers.concat()).then(p,p),this):(p(),this)},deactivate:function(r){if(!i.active)return this;var l=se({onDeactivate:s.onDeactivate,onPostDeactivate:s.onPostDeactivate,checkCanReturnFocus:s.checkCanReturnFocus},r);clearTimeout(i.delayInitialFocusTimer),i.delayInitialFocusTimer=void 0,te(),i.active=!1,i.paused=!1,le.deactivateTrap(o,c);var u=d(l,"onDeactivate"),v=d(l,"onPostDeactivate"),p=d(l,"checkCanReturnFocus"),g=d(l,"returnFocus","returnFocusOnDeactivate");u&&u();var C=function(){ce(function(){g&&E(Z(i.nodeFocusedBeforeActivation)),v&&v()})};return g&&p?(p(Z(i.nodeFocusedBeforeActivation)).then(C,C),this):(C(),this)},pause:function(){return i.paused||!i.active?this:(i.paused=!0,te(),this)},unpause:function(){return!i.paused||!i.active?this:(i.paused=!1,D(),ee(),this)},updateContainerElements:function(r){var l=[].concat(r).filter(Boolean);return i.containers=l.map(function(u){return typeof u=="string"?a.querySelector(u):u}),i.active&&D(),this}},c.updateContainerElements(e),c};/*!
  * focus-trap-vue v4.0.1
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */const ct={escapeDeactivates:{type:Boolean,default:!0},returnFocusOnDeactivate:{type:Boolean,default:!0},allowOutsideClick:{type:[Boolean,Function],default:!0},clickOutsideDeactivates:[Boolean,Function],initialFocus:[String,Function,Boolean],fallbackFocus:[String,Function],checkCanFocusTrap:Function,checkCanReturnFocus:Function,delayInitialFocus:{type:Boolean,default:!0},document:Object,preventScroll:Boolean,setReturnFocus:[Object,String,Boolean,Function],tabbableOptions:Object},ut=Y({props:Object.assign({active:{type:Boolean,default:!0}},ct),emits:["update:active","activate","postActivate","deactivate","postDeactivate"],render(){return this.renderImpl()},setup(n,{slots:e,emit:t}){let a;const o=Ce(null),s=Te(()=>{const c=o.value;return c&&(c instanceof HTMLElement?c:c.$el)});function i(){return a||(a=lt(s.value,{escapeDeactivates:n.escapeDeactivates,allowOutsideClick:n.allowOutsideClick,returnFocusOnDeactivate:n.returnFocusOnDeactivate,clickOutsideDeactivates:n.clickOutsideDeactivates,onActivate:()=>{t("update:active",!0),t("activate")},onDeactivate:()=>{t("update:active",!1),t("deactivate")},onPostActivate:()=>t("postActivate"),onPostDeactivate:()=>t("postDeactivate"),initialFocus:n.initialFocus,fallbackFocus:n.fallbackFocus,tabbableOptions:n.tabbableOptions,delayInitialFocus:n.delayInitialFocus}))}return Fe(()=>{Ee(()=>n.active,c=>{c&&s.value?i().activate():a&&(a.deactivate(),(!s.value||s.value.nodeType===Node.COMMENT_NODE)&&(a=null))},{immediate:!0,flush:"post"})}),Se(()=>{a&&a.deactivate(),a=null}),{activate(){i().activate()},deactivate(){a&&a.deactivate()},renderImpl(){if(!e.default)return null;const c=e.default().filter(f=>f.type!==Ne);return!c||!c.length||c.length>1?(console.error("[focus-trap-vue]: FocusTrap requires exactly one child."),c):De(c[0],{ref:o})}}}}),dt=Y({components:{FocusTrap:ut},props:{active:{type:Boolean,default:!1},implicitDismiss:{type:Boolean,default:!0},animate:{type:Boolean,default:!0}},emits:["cancel"],data(){return{showContent:!1}},watch:{active(n){n===!0?window.addEventListener("keyup",this.onGlobalKeyUp):window.removeEventListener("keyup",this.onGlobalKeyUp)}},beforeUnmount(){window.removeEventListener("keyup",this.onGlobalKeyUp)},methods:{onGlobalKeyUp(n){n.key==="Escape"&&this.implicitDismiss&&(consola.trace("ESC key press, closing modal"),this.cancel())},onOverlayClick(){this.implicitDismiss&&this.cancel()},cancel(){this.$emit("cancel")}}}),ft={key:0,class:"wrapper"},vt={class:"inner"};function pt(n,e,t,a,o,s){const i=F("FocusTrap");return N(),q(ae,{name:"fade",css:n.animate,onAfterEnter:e[2]||(e[2]=c=>n.showContent=!0),onLeave:e[3]||(e[3]=c=>n.showContent=!1)},{default:y(()=>[n.active?(N(),q(i,{key:0,active:n.active&&n.showContent,"initial-focus":()=>n.$refs.dialog,"allow-outside-click":"",class:"container"},{default:y(()=>[h("div",{ref:"dialog",tabindex:"-1",onClick:e[1]||(e[1]=ne(()=>{},["stop"]))},[h("div",{class:"overlay",onClick:e[0]||(e[0]=ne((...c)=>n.onOverlayClick&&n.onOverlayClick(...c),["stop"]))}),T(ae,{name:"slide",css:n.animate},{default:y(()=>[n.showContent?(N(),O("div",ft,[h("div",vt,[I(n.$slots,"default",{},void 0,!0)])])):P("",!0)]),_:3},8,["css"])],512)]),_:3},8,["active","initial-focus"])):P("",!0)]),_:3},8,["css"])}const mt=H(dt,[["render",pt],["__scopeId","data-v-babd10e2"]]),ht=Y({components:{BaseModal:mt,CloseIcon:Be,FunctionButton:xe},props:{title:{default:null,type:String},styleType:{type:String,default:"info",validator(n="info"){return["info","warn"].includes(n)}},implicitDismiss:{type:Boolean,default:!0},animate:{type:Boolean,default:!0}},emits:["cancel"],methods:{onCloserClick(){this.$emit("cancel")}}}),bt={class:"header"},gt={key:0,class:"header-icon"},yt={key:0,class:"notice"},wt={key:1,class:"confirmation"},kt={class:"controls"};function Ct(n,e,t,a,o,s){const i=F("CloseIcon"),c=F("FunctionButton"),d=F("BaseModal");return N(),q(d,{"implicit-dismiss":n.implicitDismiss,class:Ae(["modal",n.styleType]),animate:n.animate,onCancel:e[0]||(e[0]=f=>n.$emit("cancel",f))},{default:y(()=>[h("div",bt,[n.$slots.icon?(N(),O("span",gt,[I(n.$slots,"icon",{},void 0,!0)])):P("",!0),h("h2",null,_(n.title),1),T(c,{class:"closer",onClick:n.onCloserClick},{default:y(()=>[T(i)]),_:1},8,["onClick"])]),n.$slots.notice?(N(),O("div",yt,[I(n.$slots,"notice",{},void 0,!0)])):P("",!0),n.$slots.confirmation?(N(),O("div",wt,[I(n.$slots,"confirmation",{},void 0,!0)])):P("",!0),h("div",kt,[I(n.$slots,"controls",{},void 0,!0)])]),_:3},8,["implicit-dismiss","class","animate"])}const Tt=H(ht,[["render",Ct],["__scopeId","data-v-1d9b03a4"]]),Ft=`<script lang="ts">
import { defineComponent, type PropType } from "vue";
import BaseModal from "./BaseModal.vue";
import FunctionButton from "./FunctionButton.vue";
import CloseIcon from "../assets/img/icons/close.svg";

/**
 * See demo for documentation
 */
export default defineComponent({
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
      type: String as PropType<"info" | "warn">,
      default: "info",
      validator(type: "info" | "warn" = "info") {
        return ["info", "warn"].includes(type);
      },
    },
    implicitDismiss: {
      type: Boolean,
      default: true,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["cancel"],
  methods: {
    onCloserClick() {
      this.$emit("cancel");
    },
  },
});
<\/script>

<template>
  <BaseModal
    :implicit-dismiss="implicitDismiss"
    :class="['modal', styleType]"
    :animate="animate"
    @cancel="$emit('cancel', $event)"
  >
    <div class="header">
      <span v-if="$slots.icon" class="header-icon">
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
`,Et=`<script lang="ts">
import { defineComponent } from "vue";
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
export default defineComponent({
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
    implicitDismiss: {
      type: Boolean,
      default: true,
    },
    animate: {
      type: Boolean,
      default: true,
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
    onGlobalKeyUp(event: KeyboardEvent) {
      if (event.key === "Escape" && this.implicitDismiss) {
        consola.trace("ESC key press, closing modal");
        this.cancel();
      }
    },
    /**
     * Detects any clicks on the overlay or the escape key, allowing the modal to be dismissed
     * without having to click a specific button or control.
     *
     */
    onOverlayClick() {
      if (this.implicitDismiss) {
        this.cancel();
      }
    },
    /**
     * can be used by parent to close the modal.
     */
    cancel() {
      this.$emit("cancel");
    },
  },
});
<\/script>

<template>
  <Transition
    name="fade"
    :css="animate"
    @after-enter="showContent = true"
    @leave="showContent = false"
  >
    <FocusTrap
      v-if="active"
      :active="active && showContent"
      :initial-focus="() => $refs.dialog as HTMLElement"
      allow-outside-click
      class="container"
    >
      <div ref="dialog" tabindex="-1" @click.stop>
        <div class="overlay" @click.stop="onOverlayClick" />
        <Transition name="slide" :css="animate">
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
  top: var(--modal-top, 40%);
  transform: translate(-50%, -50%);
  width: min(95%, var(--modal-width, 550px));
  height: var(--modal-height, auto);
  background-color: var(--modal-background, var(--knime-white));
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
`,Nt={components:{Modal:Tt,PlayIcon:Pe,Button:Me,CodeExample:Re,Checkbox:$e},data(){return{codeExample:St,code:Ft,baseModalCode:Et,modalActive:!1,modalStyleType:"info",animate:!0,implicitDismiss:!0}}},be=n=>(Ie("data-v-ea53743a"),n=n(),Oe(),n),Dt={class:"grid-container"},Bt={class:"grid-item-12"},xt=be(()=>h("p",null,[w(" Offers multiple optional slots for content to show inside a "),h("a",{href:"https://en.wikipedia.org/wiki/Modal_window"},"modal dialog"),w(". Multiple styles are supported by the "),h("code",null,"styleType"),w(" prop. See source code for possible values. The modal emits a "),h("code",null,"cancel"),w(" event which is triggered by clicking the overlay, the ESC key or the close button. Also on tab, the focus is trapped inside the modal. ")],-1)),At=be(()=>h("p",null,[w(" For the rare cases where more design freedom is needed, please use the "),h("code",null,"BaseModal"),w(" component which comes without a header and styled slots. But please be aware of "),h("a",{href:"https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html"},"W3C best practices for modal dialogs"),w(". ")],-1)),It={class:"options"},Ot={class:"grid-container"},Pt={class:"grid-item-12"};function Mt(n,e,t,a,o,s){const i=F("Button"),c=F("Checkbox"),d=F("PlayIcon"),f=F("Modal",!0),k=F("CodeExample");return N(),O("div",null,[h("section",null,[h("div",Dt,[h("div",Bt,[xt,At,h("div",It,[T(i,{primary:"",onClick:e[0]||(e[0]=m=>o.modalActive=!0)},{default:y(()=>[w(" Trigger modal ")]),_:1}),T(c,{modelValue:o.animate,"onUpdate:modelValue":e[1]||(e[1]=m=>o.animate=m)},{default:y(()=>[w(" Animate on enter ")]),_:1},8,["modelValue"]),T(c,{modelValue:o.implicitDismiss,"onUpdate:modelValue":e[2]||(e[2]=m=>o.implicitDismiss=m)},{default:y(()=>[w(' Autodismiss via "Esc" or clicking on backdrop ')]),_:1},8,["modelValue"])]),T(f,{active:o.modalActive,title:"Modal title",class:"modal","style-type":o.modalStyleType,animate:o.animate,"implicit-dismiss":o.implicitDismiss,onCancel:e[4]||(e[4]=m=>o.modalActive=!1)},{icon:y(()=>[T(d)]),notice:y(()=>[w("This is the notice slot.")]),confirmation:y(()=>[w("And this is content in the confirmation slot.")]),controls:y(()=>[T(i,{primary:"",onClick:e[3]||(e[3]=m=>o.modalActive=!1)},{default:y(()=>[w(" Accept and close ")]),_:1})]),_:1},8,["active","style-type","animate","implicit-dismiss"])])])]),h("section",null,[h("div",Ot,[h("div",Pt,[T(k,{summary:"Show usage example"},{default:y(()=>[w(_(o.codeExample),1)]),_:1}),T(k,{summary:"Show Modal.vue source code"},{default:y(()=>[w(_(o.code),1)]),_:1}),T(k,{summary:"Show BaseModal.vue source code"},{default:y(()=>[w(_(o.baseModalCode),1)]),_:1})])])])])}const jt=H(Nt,[["render",Mt],["__scopeId","data-v-ea53743a"]]);export{jt as default};
