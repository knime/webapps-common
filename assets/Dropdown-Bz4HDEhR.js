import{ad as Y,ae as G,af as U,ag as Q,ah as F,ai as q,aj as z,ak as X,a9 as Z,aa as J,Z as $,a0 as ee,al as te,am as ne,B as k,H as S,u as re,a3 as oe,E as se,_ as ie,r as A,o as g,j as le,w as ae,b as v,n as E,e as L,t as B,c as m,x as C,l as de,d as ue,P as ce,F as O,g as P,Y as fe,p as pe,f as he}from"./index-CJFsxXuZ.js";import{D as ge}from"./arrow-dropdown-CTHkNYY9.js";var ye="[object Map]",me="[object Set]",we=Object.prototype,ve=we.hasOwnProperty;function xe(e){if(e==null)return!0;if(Y(e)&&(G(e)||typeof e=="string"||typeof e.splice=="function"||U(e)||Q(e)||F(e)))return!e.length;var t=q(e);if(t==ye||t==me)return!e.size;if(z(e))return!X(e).length;for(var n in e)if(ve.call(e,n))return!1;return!0}function _(e){return Z()?(J(e),!0):!1}function y(e){return typeof e=="function"?e():$(e)}const I=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const Ee=Object.prototype.toString,W=e=>Ee.call(e)==="[object Object]",w=()=>{},V=Oe();function Oe(){var e,t;return I&&((e=window==null?void 0:window.navigator)==null?void 0:e.userAgent)&&(/iP(?:ad|hone|od)/.test(window.navigator.userAgent)||((t=window==null?void 0:window.navigator)==null?void 0:t.maxTouchPoints)>2&&/iPad|Macintosh/.test(window==null?void 0:window.navigator.userAgent))}function ke(...e){if(e.length!==1)return ee(...e);const t=e[0];return typeof t=="function"?te(ne(()=>({get:t,set:w}))):k(t)}function x(e){var t;const n=y(e);return(t=n==null?void 0:n.$el)!=null?t:n}const H=I?window:void 0;function T(...e){let t,n,r,l;if(typeof e[0]=="string"||Array.isArray(e[0])?([n,r,l]=e,t=H):[t,n,r,l]=e,!t)return w;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const o=[],h=()=>{o.forEach(s=>s()),o.length=0},d=(s,f,i,a)=>(s.addEventListener(f,i,a),()=>s.removeEventListener(f,i,a)),u=S(()=>[x(t),y(l)],([s,f])=>{if(h(),!s)return;const i=W(f)?{...f}:f;o.push(...n.flatMap(a=>r.map(p=>d(s,a,p,i))))},{immediate:!0,flush:"post"}),c=()=>{u(),h()};return _(c),c}let K=!1;function Se(e,t,n={}){const{window:r=H,ignore:l=[],capture:o=!0,detectIframe:h=!1}=n;if(!r)return w;V&&!K&&(K=!0,Array.from(r.document.body.children).forEach(i=>i.addEventListener("click",w)),r.document.documentElement.addEventListener("click",w));let d=!0;const u=i=>l.some(a=>{if(typeof a=="string")return Array.from(r.document.querySelectorAll(a)).some(p=>p===i.target||i.composedPath().includes(p));{const p=x(a);return p&&(i.target===p||i.composedPath().includes(p))}}),s=[T(r,"click",i=>{const a=x(e);if(!(!a||a===i.target||i.composedPath().includes(a))){if(i.detail===0&&(d=!u(i)),!d){d=!0;return}t(i)}},{passive:!0,capture:o}),T(r,"pointerdown",i=>{const a=x(e);d=!u(i)&&!!(a&&!i.composedPath().includes(a))},{passive:!0}),h&&T(r,"blur",i=>{setTimeout(()=>{var a;const p=x(e);((a=r.document.activeElement)==null?void 0:a.tagName)==="IFRAME"&&!(p!=null&&p.contains(r.document.activeElement))&&t(i)},0)})].filter(Boolean);return()=>s.forEach(i=>i())}const Te=re({name:"OnClickOutside",props:["as","options"],emits:["trigger"],setup(e,{slots:t,emit:n}){const r=k();return Se(r,l=>{n("trigger",l)},e.options),()=>{if(t.default)return oe(e.as||"div",{ref:r},t.default())}}});function be(e){var t;const n=y(e);return(t=n==null?void 0:n.$el)!=null?t:n}const De=I?window:void 0;function Ve(...e){let t,n,r,l;if(typeof e[0]=="string"||Array.isArray(e[0])?([n,r,l]=e,t=De):[t,n,r,l]=e,!t)return w;Array.isArray(n)||(n=[n]),Array.isArray(r)||(r=[r]);const o=[],h=()=>{o.forEach(s=>s()),o.length=0},d=(s,f,i,a)=>(s.addEventListener(f,i,a),()=>s.removeEventListener(f,i,a)),u=S(()=>[be(t),y(l)],([s,f])=>{if(h(),!s)return;const i=W(f)?{...f}:f;o.push(...n.flatMap(a=>r.map(p=>d(s,a,p,i))))},{immediate:!0,flush:"post"}),c=()=>{u(),h()};return _(c),c}function b(e){return typeof Window<"u"&&e instanceof Window?e.document.documentElement:typeof Document<"u"&&e instanceof Document?e.documentElement:e}function j(e){const t=window.getComputedStyle(e);if(t.overflowX==="scroll"||t.overflowY==="scroll"||t.overflowX==="auto"&&e.clientWidth<e.scrollWidth||t.overflowY==="auto"&&e.clientHeight<e.scrollHeight)return!0;{const n=e.parentNode;return!n||n.tagName==="BODY"?!1:j(n)}}function _e(e){const t=e||window.event,n=t.target;return j(n)?!1:t.touches.length>1?!0:(t.preventDefault&&t.preventDefault(),!1)}const D=new WeakMap;function Ie(e,t=!1){const n=k(t);let r=null,l="";S(ke(e),d=>{const u=b(y(d));if(u){const c=u;if(D.get(c)||D.set(c,c.style.overflow),c.style.overflow!=="hidden"&&(l=c.style.overflow),c.style.overflow==="hidden")return n.value=!0;if(n.value)return c.style.overflow="hidden"}},{immediate:!0});const o=()=>{const d=b(y(e));!d||n.value||(V&&(r=Ve(d,"touchmove",u=>{_e(u)},{passive:!1})),d.style.overflow="hidden",n.value=!0)},h=()=>{const d=b(y(e));!d||!n.value||(V&&(r==null||r()),d.style.overflow=l,D.delete(d),n.value=!1)};return _(h),se({get(){return n.value},set(d){d?o():h()}})}function Ae(){let e=!1;const t=k(!1);return(n,r)=>{if(t.value=r.value,e)return;e=!0;const l=Ie(n,r.value);S(t,o=>l.value=o)}}Ae();let Le=0;const N="ArrowDown",M="ArrowUp",Be="Home",Ce="End",Pe="Escape",R="Enter",Ke=1e3,Ne={components:{DropdownIcon:ge,OnClickOutside:Te},props:{id:{type:String,default(){return`Dropdown-${Le++}`}},modelValue:{type:String,default:null},name:{type:String,default:null},placeholder:{type:String,default:null},ariaLabel:{type:String,required:!0},isValid:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},direction:{default:"down",type:String},possibleValues:{type:Array,default:()=>[]},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],data(){return{typingTimeout:null,isExpanded:!1,searchQuery:""}},computed:{groupedValues(){const e={};for(const t of this.possibleValues){const n=t.group||"";e[n]||(e[n]={label:t.group,items:[]}),e[n].items.push(t)}return Object.values(e)},orderedGroupedValues(){const e=this.groupedValues.filter(n=>n.items[0].group),t=this.groupedValues.filter(n=>!n.items[0].group);return[...e,...t]},flatOrderedValues(){return this.orderedGroupedValues.flatMap(e=>e.items)},selectedIndex(){return this.flatOrderedValues.map(e=>e.id).indexOf(this.modelValue)},showPlaceholder(){return!this.modelValue},displayTextMap(){let e={};for(let t of this.flatOrderedValues)e[t.id]=t.text;return e},displayText(){return this.showPlaceholder?this.placeholder:this.displayTextMap.hasOwnProperty(this.modelValue)?this.displayTextMap[this.modelValue]:`(MISSING) ${this.modelValue}`},isMissing(){return this.modelValue&&!this.displayTextMap.hasOwnProperty(this.modelValue)},hasRightIcon(){var e,t;return(t=(e=this.$slots)["icon-right"])==null?void 0:t.call(e).length},hasOptionTemplate(){return this.flatOrderedValues.every(e=>e.slotData&&!xe(e.slotData))}},methods:{isCurrentValue(e){return this.modelValue===e},setSelected(e){consola.trace("ListBox setSelected on",e),this.$emit("update:modelValue",e)},getButtonRef(){return this.$refs.button},getOptionsRefs(){return this.$refs.options},getListBoxNodeRef(){return this.$refs.ul},onOptionClick(e){this.setSelected(e),this.isExpanded=!1,this.getButtonRef().focus()},scrollTo(e){let t=this.getListBoxNodeRef();if(t.scrollHeight>t.clientHeight){let n=this.getOptionsRefs()[e],r=t.clientHeight+t.scrollTop,l=n.offsetTop+n.offsetHeight;l>r?t.scrollTop=l-t.clientHeight:n.offsetTop<t.scrollTop&&(t.scrollTop=n.offsetTop)}},onArrowDown(){let e=this.selectedIndex+1;e>=this.flatOrderedValues.length||(this.setSelected(this.flatOrderedValues[e].id),this.scrollTo(e))},onArrowUp(){let e=this.selectedIndex-1;e<0||(this.setSelected(this.flatOrderedValues[e].id),this.scrollTo(e))},onEndKey(){let e=this.flatOrderedValues.length-1;this.setSelected(this.flatOrderedValues[e].id);const t=this.getListBoxNodeRef();t.scrollTop=t.scrollHeight},onHomeKey(){this.setSelected(this.flatOrderedValues[0].id),this.getListBoxNodeRef().scrollTop=0},toggleExpanded(){this.disabled||(this.isExpanded=!this.isExpanded,this.isExpanded&&this.$nextTick(()=>this.getListBoxNodeRef().focus()))},handleKeyDownList(e){if(e.key===N){this.onArrowDown(),e.preventDefault();return}if(e.key===M){this.onArrowUp(),e.preventDefault();return}if(e.key===Ce){this.onEndKey(),e.preventDefault();return}if(e.key===Be){this.onHomeKey(),e.preventDefault();return}if(e.key===Pe){this.isExpanded=!1,this.getButtonRef().focus(),e.preventDefault(),e.stopPropagation();return}if(e.key===R){this.isExpanded=!1,this.getButtonRef().focus(),e.preventDefault();return}this.searchItem(e)},handleKeyDownButton(e){if(e.key===R){this.toggleExpanded(),e.preventDefault();return}if(e.key===N){this.onArrowDown(),e.preventDefault();return}if(e.key===M){this.onArrowUp(),e.preventDefault();return}this.searchItem(e)},searchItem(e){this.typingTimeout!==null&&clearTimeout(this.typingTimeout),this.typingTimeout=setTimeout(()=>{this.searchQuery=""},Ke),this.searchQuery+=e.key,consola.trace(`Searching for ${this.searchQuery}`);const t=this.flatOrderedValues.find(n=>n.text.toLowerCase().startsWith(this.searchQuery.toLowerCase()));t&&this.setSelected(t.id)},hasSelection(){return this.selectedIndex>=0},getCurrentSelectedId(){try{return this.flatOrderedValues[this.selectedIndex].id}catch{return""}},generateId(e,t=null){if(!t)return`${e}-${this.id}`;let n=String(t).replace(/[^\w]/gi,"");return`${e}-${this.id}-${n}`},clickAway(){this.isExpanded=!1}}},Me=e=>(pe("data-v-f98a9de3"),e=e(),he(),e),Re=["id"],We=["id","aria-label","aria-labelledby","aria-expanded"],He={key:0,class:"loading-icon"},je=["aria-activedescendant"],Ye=Me(()=>v("span",{class:"group-divider"},null,-1)),Ge=["id","title","aria-selected","onClick"],Ue=["id","name","value"];function Qe(e,t,n,r,l,o){const h=A("DropdownIcon"),d=A("OnClickOutside");return g(),le(d,{onTrigger:o.clickAway},{default:ae(()=>[v("div",{id:n.id,class:E(["dropdown",{collapsed:!l.isExpanded,invalid:!n.isValid,disabled:n.disabled,compact:n.compact}])},[v("div",{id:o.generateId("button"),ref:"button",role:"button",tabindex:"0","aria-haspopup":"listbox",class:E({placeholder:o.showPlaceholder,missing:o.isMissing}),"aria-label":n.ariaLabel,"aria-labelledby":o.generateId("button"),"aria-expanded":l.isExpanded,onClick:t[0]||(t[0]=(...u)=>o.toggleExpanded&&o.toggleExpanded(...u)),onKeydown:t[1]||(t[1]=(...u)=>o.handleKeyDownButton&&o.handleKeyDownButton(...u))},[L(B(o.displayText)+" ",1),o.hasRightIcon?(g(),m("div",He,[C(e.$slots,"icon-right")])):de("",!0),ue(h,{class:"icon"})],42,We),ce(v("ul",{ref:"ul",role:"listbox",tabindex:"-1","aria-activedescendant":l.isExpanded?o.generateId("option",o.getCurrentSelectedId()):void 0,class:E({"drops-upwards":n.direction==="up"}),onKeydown:t[2]||(t[2]=(...u)=>o.handleKeyDownList&&o.handleKeyDownList(...u))},[(g(!0),m(O,null,P(o.orderedGroupedValues,(u,c)=>(g(),m(O,{key:c},[Ye,(g(!0),m(O,null,P(u.items,s=>(g(),m("li",{id:o.generateId("option",s.id),key:`listbox-${s.id}`,ref_for:!0,ref:"options",role:"option",title:typeof s.title>"u"?s.text:s.title,class:E({focused:o.isCurrentValue(s.id),noselect:!0,empty:s.text.trim()==="","has-option-template":o.hasOptionTemplate}),"aria-selected":o.isCurrentValue(s.id),onClick:f=>o.onOptionClick(s.id)},[o.hasOptionTemplate?C(e.$slots,"option",{key:0,slotData:s.slotData}):(g(),m(O,{key:1},[L(B(s.text),1)],64))],10,Ge))),128))],64))),128))],42,je),[[fe,l.isExpanded]]),v("input",{id:n.id,type:"hidden",name:n.name,value:n.modelValue},null,8,Ue)],10,Re)]),_:3},8,["onTrigger"])}const ze=ie(Ne,[["render",Qe],["__scopeId","data-v-f98a9de3"]]);export{ze as D,Te as O};
