import{af as Y,ag as G,ah as Q,ai as U,aj as F,ak as q,al as z,am as X,ab as J,ac as Z,Z as $,a0 as ee,an as te,ao as ne,E as b,J as S,u as re,a3 as oe,G as se,_ as ie,r as I,o as g,j as le,w as ae,b as v,n as E,e as L,t as C,c as y,x as B,l as de,d as ue,Q as ce,F as O,g as K,Y as fe,p as pe,f as he}from"./index-gPJumjSm.js";import{A as ge}from"./arrow-dropdown-CzLioXmG.js";var me="[object Map]",ye="[object Set]",we=Object.prototype,ve=we.hasOwnProperty;function xe(e){if(e==null)return!0;if(Y(e)&&(G(e)||typeof e=="string"||typeof e.splice=="function"||Q(e)||U(e)||F(e)))return!e.length;var t=q(e);if(t==me||t==ye)return!e.size;if(z(e))return!X(e).length;for(var n in e)if(ve.call(e,n))return!1;return!0}function _(e){return J()?(Z(e),!0):!1}function m(e){return typeof e=="function"?e():$(e)}const A=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const Ee=Object.prototype.toString,W=e=>Ee.call(e)==="[object Object]",w=()=>{},D=Oe();function Oe(){var e,t;return A&&((e=window==null?void 0:window.navigator)==null?void 0:e.userAgent)&&(/iP(ad|hone|od)/.test(window.navigator.userAgent)||((t=window==null?void 0:window.navigator)==null?void 0:t.maxTouchPoints)>2&&/iPad|Macintosh/.test(window==null?void 0:window.navigator.userAgent))}function ke(...e){if(e.length!==1)return ee(...e);const t=e[0];return typeof t=="function"?te(ne(()=>({get:t,set:w}))):b(t)}function x(e){var t;const n=m(e);return(t=n==null?void 0:n.$el)!=null?t:n}const H=A?window:void 0;function T(...e){let t,n,r,a;if(typeof e[0]=="string"||Array.isArray(e[0])?([n,r,a]=e,t=H):[t,n,r,a]=e,!t)return w;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const o=[],p=()=>{o.forEach(s=>s()),o.length=0},u=(s,c,i,d)=>(s.addEventListener(c,i,d),()=>s.removeEventListener(c,i,d)),l=S(()=>[x(t),m(a)],([s,c])=>{if(p(),!s)return;const i=W(c)?{...c}:c;o.push(...n.flatMap(d=>r.map(f=>u(s,d,f,i))))},{immediate:!0,flush:"post"}),h=()=>{l(),p()};return _(h),h}let N=!1;function be(e,t,n={}){const{window:r=H,ignore:a=[],capture:o=!0,detectIframe:p=!1}=n;if(!r)return w;D&&!N&&(N=!0,Array.from(r.document.body.children).forEach(i=>i.addEventListener("click",w)),r.document.documentElement.addEventListener("click",w));let u=!0;const l=i=>a.some(d=>{if(typeof d=="string")return Array.from(r.document.querySelectorAll(d)).some(f=>f===i.target||i.composedPath().includes(f));{const f=x(d);return f&&(i.target===f||i.composedPath().includes(f))}}),s=[T(r,"click",i=>{const d=x(e);if(!(!d||d===i.target||i.composedPath().includes(d))){if(i.detail===0&&(u=!l(i)),!u){u=!0;return}t(i)}},{passive:!0,capture:o}),T(r,"pointerdown",i=>{const d=x(e);u=!l(i)&&!!(d&&!i.composedPath().includes(d))},{passive:!0}),p&&T(r,"blur",i=>{setTimeout(()=>{var d;const f=x(e);((d=r.document.activeElement)==null?void 0:d.tagName)==="IFRAME"&&!(f!=null&&f.contains(r.document.activeElement))&&t(i)},0)})].filter(Boolean);return()=>s.forEach(i=>i())}const Se=re({name:"OnClickOutside",props:["as","options"],emits:["trigger"],setup(e,{slots:t,emit:n}){const r=b();return be(r,a=>{n("trigger",a)},e.options),()=>{if(t.default)return oe(e.as||"div",{ref:r},t.default())}}});function Te(e){var t;const n=m(e);return(t=n==null?void 0:n.$el)!=null?t:n}const Ve=A?window:void 0;function De(...e){let t,n,r,a;if(typeof e[0]=="string"||Array.isArray(e[0])?([n,r,a]=e,t=Ve):[t,n,r,a]=e,!t)return w;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const o=[],p=()=>{o.forEach(s=>s()),o.length=0},u=(s,c,i,d)=>(s.addEventListener(c,i,d),()=>s.removeEventListener(c,i,d)),l=S(()=>[Te(t),m(a)],([s,c])=>{if(p(),!s)return;const i=W(c)?{...c}:c;o.push(...n.flatMap(d=>r.map(f=>u(s,d,f,i))))},{immediate:!0,flush:"post"}),h=()=>{l(),p()};return _(h),h}function V(e){return typeof Window<"u"&&e instanceof Window?e.document.documentElement:typeof Document<"u"&&e instanceof Document?e.documentElement:e}function j(e){const t=window.getComputedStyle(e);if(t.overflowX==="scroll"||t.overflowY==="scroll"||t.overflowX==="auto"&&e.clientWidth<e.scrollWidth||t.overflowY==="auto"&&e.clientHeight<e.scrollHeight)return!0;{const n=e.parentNode;return!n||n.tagName==="BODY"?!1:j(n)}}function _e(e){const t=e||window.event,n=t.target;return j(n)?!1:t.touches.length>1?!0:(t.preventDefault&&t.preventDefault(),!1)}const k=new WeakMap;function Ae(e,t=!1){const n=b(t);let r=null,a;S(ke(e),u=>{const l=V(m(u));if(l){const h=l;k.get(h)||k.set(h,a),n.value&&(h.style.overflow="hidden")}},{immediate:!0});const o=()=>{const u=V(m(e));!u||n.value||(D&&(r=De(u,"touchmove",l=>{_e(l)},{passive:!1})),u.style.overflow="hidden",n.value=!0)},p=()=>{var u;const l=V(m(e));!l||!n.value||(D&&(r==null||r()),l.style.overflow=(u=k.get(l))!=null?u:"",k.delete(l),n.value=!1)};return _(p),se({get(){return n.value},set(u){u?o():p()}})}function Ie(){let e=!1;const t=b(!1);return(n,r)=>{if(t.value=r.value,e)return;e=!0;const a=Ae(n,r.value);S(t,o=>a.value=o)}}Ie();let Le=0;const P="ArrowDown",M="ArrowUp",Ce="Home",Be="End",Ke="Escape",R="Enter",Ne=1e3,Pe={components:{DropdownIcon:ge,OnClickOutside:Se},props:{id:{type:String,default(){return`Dropdown-${Le++}`}},modelValue:{type:String,default:null},name:{type:String,default:null},placeholder:{type:String,default:null},ariaLabel:{type:String,required:!0},isValid:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},direction:{default:"down",type:String},possibleValues:{type:Array,default:()=>[]},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],data(){return{typingTimeout:null,isExpanded:!1,searchQuery:""}},computed:{groupedValues(){const e={};for(const t of this.possibleValues){const n=t.group||"";e[n]||(e[n]={label:t.group,items:[]}),e[n].items.push(t)}return Object.values(e)},orderedGroupedValues(){const e=this.groupedValues.filter(n=>n.items[0].group),t=this.groupedValues.filter(n=>!n.items[0].group);return[...e,...t]},flatOrderedValues(){return this.orderedGroupedValues.flatMap(e=>e.items)},selectedIndex(){return this.flatOrderedValues.map(e=>e.id).indexOf(this.modelValue)},showPlaceholder(){return!this.modelValue},displayTextMap(){let e={};for(let t of this.flatOrderedValues)e[t.id]=t.text;return e},displayText(){return this.showPlaceholder?this.placeholder:this.displayTextMap.hasOwnProperty(this.modelValue)?this.displayTextMap[this.modelValue]:`(MISSING) ${this.modelValue}`},isMissing(){return this.modelValue&&!this.displayTextMap.hasOwnProperty(this.modelValue)},hasRightIcon(){var e,t;return(t=(e=this.$slots)["icon-right"])==null?void 0:t.call(e).length},hasOptionTemplate(){return this.flatOrderedValues.every(e=>e.slotData&&!xe(e.slotData))}},methods:{isCurrentValue(e){return this.modelValue===e},setSelected(e){consola.trace("ListBox setSelected on",e),this.$emit("update:modelValue",e)},getButtonRef(){return this.$refs.button},getOptionsRefs(){return this.$refs.options},getListBoxNodeRef(){return this.$refs.ul},onOptionClick(e){this.setSelected(e),this.isExpanded=!1,this.getButtonRef().focus()},scrollTo(e){let t=this.getListBoxNodeRef();if(t.scrollHeight>t.clientHeight){let n=this.getOptionsRefs()[e],r=t.clientHeight+t.scrollTop,a=n.offsetTop+n.offsetHeight;a>r?t.scrollTop=a-t.clientHeight:n.offsetTop<t.scrollTop&&(t.scrollTop=n.offsetTop)}},onArrowDown(){let e=this.selectedIndex+1;e>=this.flatOrderedValues.length||(this.setSelected(this.flatOrderedValues[e].id),this.scrollTo(e))},onArrowUp(){let e=this.selectedIndex-1;e<0||(this.setSelected(this.flatOrderedValues[e].id),this.scrollTo(e))},onEndKey(){let e=this.flatOrderedValues.length-1;this.setSelected(this.flatOrderedValues[e].id);const t=this.getListBoxNodeRef();t.scrollTop=t.scrollHeight},onHomeKey(){this.setSelected(this.flatOrderedValues[0].id),this.getListBoxNodeRef().scrollTop=0},toggleExpanded(){this.disabled||(this.isExpanded=!this.isExpanded,this.isExpanded&&this.$nextTick(()=>this.getListBoxNodeRef().focus()))},handleKeyDownList(e){if(e.key===P){this.onArrowDown(),e.preventDefault();return}if(e.key===M){this.onArrowUp(),e.preventDefault();return}if(e.key===Be){this.onEndKey(),e.preventDefault();return}if(e.key===Ce){this.onHomeKey(),e.preventDefault();return}if(e.key===Ke){this.isExpanded=!1,this.getButtonRef().focus(),e.preventDefault(),e.stopPropagation();return}if(e.key===R){this.isExpanded=!1,this.getButtonRef().focus(),e.preventDefault();return}this.searchItem(e)},handleKeyDownButton(e){if(e.key===R){this.toggleExpanded(),e.preventDefault();return}if(e.key===P){this.onArrowDown(),e.preventDefault();return}if(e.key===M){this.onArrowUp(),e.preventDefault();return}this.searchItem(e)},searchItem(e){this.typingTimeout!==null&&clearTimeout(this.typingTimeout),this.typingTimeout=setTimeout(()=>{this.searchQuery=""},Ne),this.searchQuery+=e.key,consola.trace(`Searching for ${this.searchQuery}`);const t=this.flatOrderedValues.find(n=>n.text.toLowerCase().startsWith(this.searchQuery.toLowerCase()));t&&this.setSelected(t.id)},hasSelection(){return this.selectedIndex>=0},getCurrentSelectedId(){try{return this.flatOrderedValues[this.selectedIndex].id}catch{return""}},generateId(e,t=null){if(!t)return`${e}-${this.id}`;let n=String(t).replace(/[^\w]/gi,"");return`${e}-${this.id}-${n}`},clickAway(){this.isExpanded=!1}}},Me=e=>(pe("data-v-7cf9ba35"),e=e(),he(),e),Re=["id"],We=["id","aria-label","aria-labelledby","aria-expanded"],He={key:0,class:"loading-icon"},je=["aria-activedescendant"],Ye=Me(()=>v("span",{class:"group-divider"},null,-1)),Ge=["id","title","aria-selected","onClick"],Qe=["id","name","value"];function Ue(e,t,n,r,a,o){const p=I("DropdownIcon"),u=I("OnClickOutside");return g(),le(u,{onTrigger:o.clickAway},{default:ae(()=>[v("div",{id:n.id,class:E(["dropdown",{collapsed:!a.isExpanded,invalid:!n.isValid,disabled:n.disabled,compact:n.compact}])},[v("div",{id:o.generateId("button"),ref:"button",role:"button",tabindex:"0","aria-haspopup":"listbox",class:E({placeholder:o.showPlaceholder,missing:o.isMissing}),"aria-label":n.ariaLabel,"aria-labelledby":o.generateId("button"),"aria-expanded":a.isExpanded,onClick:t[0]||(t[0]=(...l)=>o.toggleExpanded&&o.toggleExpanded(...l)),onKeydown:t[1]||(t[1]=(...l)=>o.handleKeyDownButton&&o.handleKeyDownButton(...l))},[L(C(o.displayText)+" ",1),o.hasRightIcon?(g(),y("div",He,[B(e.$slots,"icon-right")])):de("",!0),ue(p,{class:"icon"})],42,We),ce(v("ul",{ref:"ul",role:"listbox",tabindex:"-1","aria-activedescendant":a.isExpanded?o.generateId("option",o.getCurrentSelectedId()):void 0,class:E({"drops-upwards":n.direction==="up"}),onKeydown:t[2]||(t[2]=(...l)=>o.handleKeyDownList&&o.handleKeyDownList(...l))},[(g(!0),y(O,null,K(o.orderedGroupedValues,(l,h)=>(g(),y(O,{key:h},[Ye,(g(!0),y(O,null,K(l.items,s=>(g(),y("li",{id:o.generateId("option",s.id),key:`listbox-${s.id}`,ref_for:!0,ref:"options",role:"option",title:typeof s.title>"u"?s.text:s.title,class:E({focused:o.isCurrentValue(s.id),noselect:!0,empty:s.text.trim()==="","has-option-template":o.hasOptionTemplate}),"aria-selected":o.isCurrentValue(s.id),onClick:c=>o.onOptionClick(s.id)},[o.hasOptionTemplate?B(e.$slots,"option",{key:0,slotData:s.slotData}):(g(),y(O,{key:1},[L(C(s.text),1)],64))],10,Ge))),128))],64))),128))],42,je),[[fe,a.isExpanded]]),v("input",{id:n.id,type:"hidden",name:n.name,value:n.modelValue},null,8,Qe)],10,Re)]),_:3},8,["onTrigger"])}const ze=ie(Pe,[["render",Ue],["__scopeId","data-v-7cf9ba35"]]);export{ze as D,Se as O};
