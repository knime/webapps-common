import{_ as v,r as E,ab as V,P as f,o as a,c as d,b as c,e as T,t as p,u as D,l as k,d as I,n as h,F as C,g as S,W as K}from"./index-7d8da294.js";import{A}from"./arrow-dropdown-2c090c0e.js";const g=function(){return document.ontouchstart!==null?"click":"touchstart"},u="__vue_click_away__",_=function(e,t,i){w(e);let o=i.context,n=t.value,s=!1;setTimeout(function(){s=!0},0),e[u]=function(r){if((!e||!e.contains(r.target))&&n&&s&&typeof n=="function")return n.call(o,r)},document.addEventListener(g(),e[u],!1)},w=function(e){document.removeEventListener(g(),e[u],!1),delete e[u]},B=function(e,t,i){t.value!==t.oldValue&&_(e,t,i)},L={mounted:_,updated:B,unmounted:w},N={directives:{ClickAway:L}};let M=0;const y=40,x=38,O=36,P=35,H=27,m=13,U=1e3,Y={components:{DropdownIcon:A},mixins:[N],props:{id:{type:String,default(){return`Dropdown-${M++}`}},modelValue:{type:String,default:null},name:{type:String,default:null},placeholder:{type:String,default:null},ariaLabel:{type:String,required:!0},isValid:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}}},emits:["update:modelValue"],data(){return{isExpanded:!1,searchQuery:""}},computed:{selectedIndex(){return this.possibleValues.map(e=>e.id).indexOf(this.modelValue)},showPlaceholder(){return!this.modelValue},displayTextMap(){let e={};for(let t of this.possibleValues)e[t.id]=t.text;return e},displayText(){return this.showPlaceholder?this.placeholder:this.displayTextMap.hasOwnProperty(this.modelValue)?this.displayTextMap[this.modelValue]:`(MISSING) ${this.modelValue}`},isMissing(){return this.modelValue&&!this.displayTextMap.hasOwnProperty(this.modelValue)},hasRightIcon(){var e,t;return(t=(e=this.$slots)["icon-right"])==null?void 0:t.call(e).length}},created(){this.typingTimeout=null},methods:{isCurrentValue(e){return this.modelValue===e},setSelected(e){consola.trace("ListBox setSelected on",e),this.$emit("update:modelValue",e)},onOptionClick(e){this.setSelected(e),this.isExpanded=!1,this.$refs.button.focus()},scrollTo(e){let t=this.$refs.ul;if(t.scrollHeight>t.clientHeight){let i=this.$refs.options[e],o=t.clientHeight+t.scrollTop,n=i.offsetTop+i.offsetHeight;n>o?t.scrollTop=n-t.clientHeight:i.offsetTop<t.scrollTop&&(t.scrollTop=i.offsetTop)}},onArrowDown(){let e=this.selectedIndex+1;e>=this.possibleValues.length||(this.setSelected(this.possibleValues[e].id),this.scrollTo(e))},onArrowUp(){let e=this.selectedIndex-1;e<0||(this.setSelected(this.possibleValues[e].id),this.scrollTo(e))},onEndKey(){let e=this.possibleValues.length-1;this.setSelected(this.possibleValues[e].id),this.$refs.ul.scrollTop=this.$refs.ul.scrollHeight},onHomeKey(){let e=0;this.setSelected(this.possibleValues[e].id),this.$refs.ul.scrollTop=0},toggleExpanded(){this.disabled||(this.isExpanded=!this.isExpanded,this.isExpanded&&this.$nextTick(()=>this.$refs.ul.focus()))},handleKeyDownList(e){if(e.keyCode===y){this.onArrowDown(),e.preventDefault();return}if(e.keyCode===x){this.onArrowUp(),e.preventDefault();return}if(e.keyCode===P){this.onEndKey(),e.preventDefault();return}if(e.keyCode===O){this.onHomeKey(),e.preventDefault();return}if(e.keyCode===H){this.isExpanded=!1,this.$refs.ul.blur(),e.preventDefault();return}if(e.keyCode===m){this.isExpanded=!1,this.$refs.button.focus(),e.preventDefault();return}this.searchItem(e)},handleKeyDownButton(e){if(e.keyCode===m){this.toggleExpanded(),e.preventDefault();return}if(e.keyCode===y){this.onArrowDown(),e.preventDefault();return}if(e.keyCode===x){this.onArrowUp(),e.preventDefault();return}this.searchItem(e)},searchItem(e){clearTimeout(this.typingTimeout),this.typingTimeout=setTimeout(()=>{this.searchQuery=""},U),this.searchQuery+=e.key,consola.trace(`Searching for ${this.searchQuery}`);const t=this.possibleValues.find(i=>i.text.toLowerCase().startsWith(this.searchQuery.toLowerCase()));t&&this.setSelected(t.id)},hasSelection(){return this.selectedIndex>=0},getCurrentSelectedId(){try{return this.possibleValues[this.selectedIndex].id}catch{return""}},generateId(e,t){if(!t)return`${e}-${this.id}`;let i=String(t).replace(/[^\w]/gi,"");return`${e}-${this.id}-${i}`},clickAway(){this.isExpanded=!1}}},Q=["id"],R=["id","aria-label","aria-labelledby","aria-expanded"],W={key:0,class:"loading-icon"},F=["aria-activedescendant"],G=["id","title","aria-selected","onClick"],q=["id","name","value"];function z(e,t,i,o,n,s){const r=E("DropdownIcon"),b=V("click-away");return f((a(),d("div",{id:i.id,class:h(["dropdown",{collapsed:!n.isExpanded,invalid:!i.isValid,disabled:i.disabled}])},[c("div",{id:s.generateId("button"),ref:"button",role:"button",tabindex:"0","aria-haspopup":"listbox",class:h({placeholder:s.showPlaceholder,missing:s.isMissing}),"aria-label":i.ariaLabel,"aria-labelledby":s.generateId("button"),"aria-expanded":n.isExpanded,onClick:t[0]||(t[0]=(...l)=>s.toggleExpanded&&s.toggleExpanded(...l)),onKeydown:t[1]||(t[1]=(...l)=>s.handleKeyDownButton&&s.handleKeyDownButton(...l))},[T(p(s.displayText)+" ",1),s.hasRightIcon?(a(),d("div",W,[D(e.$slots,"icon-right")])):k("",!0),I(r,{class:"icon"})],42,R),f(c("ul",{ref:"ul",role:"listbox",tabindex:"-1","aria-activedescendant":n.isExpanded?s.generateId("option",s.getCurrentSelectedId()):!1,onKeydown:t[2]||(t[2]=(...l)=>s.handleKeyDownList&&s.handleKeyDownList(...l))},[(a(!0),d(C,null,S(i.possibleValues,l=>(a(),d("li",{id:s.generateId("option",l.id),key:`listbox-${l.id}`,ref_for:!0,ref:"options",role:"option",title:typeof l.title>"u"?l.text:l.title,class:h({focused:s.isCurrentValue(l.id),noselect:!0,empty:l.text.trim()===""}),"aria-selected":s.isCurrentValue(l.id),onClick:j=>s.onOptionClick(l.id)},p(l.text),11,G))),128))],40,F),[[K,n.isExpanded]]),c("input",{id:i.id,type:"hidden",name:i.name,value:i.modelValue},null,8,q)],10,Q)),[[b,s.clickAway]])}const Z=v(Y,[["render",z],["__scopeId","data-v-db8aa486"]]);export{Z as D,L as d};
