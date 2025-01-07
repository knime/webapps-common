import{bc as x,$ as S,Z as y,_ as p,r as I,o as h,c as u,b as m,B as C,v as a,k as d,a4 as v,a5 as w,F as V,g as k,l as g,s as D,t as H,m as b,d as B,n as K,h as N}from"./index-DlYP37kD.js";import{S as A}from"./StyledListItem-C5lA9HzP.js";const L=(e,t)=>{let i,r=0;return(...l)=>{const[s,o]=l;clearTimeout(i);const n=Date.now();n-r>t?(r=n,e(s,o)):i=setTimeout(()=>{r=n,e(s,o)},t)}};let T=0;const O=250,z={name:"MultiselectListBox",components:{StyledListItem:A},props:{id:{type:String,default(){return`MultiselectListBox-${T++}`}},modelValue:{type:Array,default:()=>[]},disabled:{default:!1,type:Boolean},withIsEmptyState:{default:!1,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},multiselectByClick:{type:Boolean,default:!1},withBottomValue:{type:Boolean,default:!1},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},size:{type:Number,default:0,validator(e){return e>=0}},minSize:{type:Number,default:1},isValid:{default:!0,type:Boolean},ariaLabel:{type:String,required:!0},possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}}},emits:["update:modelValue","doubleClickOnItem","doubleClickShift","keyArrowLeft","keyArrowRight"],setup(e){const{containerProps:i,wrapperProps:r,list:l,scrollTo:s}=x(S(e,"possibleValues"),{itemHeight:22});return y(()=>e.possibleValues,()=>{var n;if(!i.ref.value)return;const o=((n=i.ref.value)==null?void 0:n.scrollTop)??0;s(Math.max(Math.min(Math.floor(o/22),e.possibleValues.length-1),0))}),{optionLineHeight:22,containerProps:i,wrapperProps:r,list:l}},data(){return{selectedValues:this.modelValue,currentKeyNavIndex:0,shiftStartIndex:-1,draggingStartIndex:-1,draggingInverseMode:!1,resizeHeight:0}},computed:{cssStyleSize(){if(this.resizeHeight!==0)return{height:`${this.resizeHeight}px`};const e=`${this.computeBoxHeight(this.size)}px`;return this.size>0?{height:e}:{}},minResizeHeight(){return this.computeBoxHeight(this.minSize)},possibleValuesWithBottom(){return[...this.possibleValues,...this.withBottomValue?[this.bottomValue]:[]]},bottomIndex(){return this.possibleValues.length},showEmptyState(){return this.withIsEmptyState&&this.possibleValues.length===0}},watch:{modelValue:{handler(e){this.selectedValues=[...e]},deep:!0}},mounted(){var t,i;window.addEventListener("mouseup",this.onStopDrag);const e=(i=this.modelValue)==null?void 0:i[((t=this.modelValue)==null?void 0:t.length)-1];this.currentKeyNavIndex=this.possibleValues.map(r=>r.id).indexOf(e)},beforeUnmount(){window.removeEventListener("mouseup",this.onStopDrag)},created(){this.createDebouncedHandleCtrlClick()},methods:{createDebouncedHandleCtrlClick(){this.debouncedHandleCtrlClick=L((e,t)=>{this.handleCtrlClick(e,t)},O)},debouncedHandleCtrlClick(e,t){this.debouncedHandleCtrlClick||this.createDebouncedHandleCtrlClick(),this.debouncedHandleCtrlClick(e,t)},isCurrentValue(e){var t;return(t=this.selectedValues)==null?void 0:t.includes(e)},handleCtrlClick(e,t){this.currentKeyNavIndex=t,this.toggleSelection(e)},handleShiftClick(e,t){this.setSelected(this.getPossibleValuesInSection(this.currentKeyNavIndex,t))},getPossibleValuesInSection(e,t){const i=e>t?t:e,r=e>t?e:t;return this.possibleValuesWithBottom.slice(i,r+1).map(l=>l.id)},onStartDrag(e,t=!1){if(this.disabled||e.shiftKey)return;(e.ctrlKey||e.metaKey)&&(this.draggingInverseMode=!0);const i=e.target,r=t?this.bottomIndex:i.getAttribute("data-option-index");r&&(this.draggingStartIndex=Number(r))},onDrag(e){if(this.draggingStartIndex!==-1){const i=e.target.getAttribute("data-option-index");if(!i)return;const r=Number(i);let l=this.getPossibleValuesInSection(this.draggingStartIndex,r);this.draggingInverseMode&&(l=this.selectedValues.filter(s=>!l.includes(s))),this.setSelected(l)}},onBottomStartDrag(e){this.focus(),this.onStartDrag(e)},onBottomDrag(e){this.focus(),this.onDrag(e)},onStopDrag(){this.draggingStartIndex=-1,this.draggingInverseMode=!1},handleClick(e,t,i){if(!this.disabled){if(e.preventDefault(),e.metaKey){this.debouncedHandleCtrlClick(t,i);return}if(e.ctrlKey){this.handleCtrlClick(t,i);return}if(e.shiftKey){this.handleShiftClick(t,i);return}this.multiselectByClick||(this.selectedValues=[]),this.currentKeyNavIndex=i,this.toggleSelection(t)}},handleDblClick(e,t){this.disabled||this.$emit("doubleClickOnItem",e,t)},handleBottomClick(e){this.handleClick(e,this.bottomValue.id,this.bottomIndex),this.focus()},handleBottomDblClick(){this.handleDblClick(this.bottomValue.id,this.bottomIndex)},handleShiftDblClick(){this.disabled||this.$emit("doubleClickShift",this.selectedValues)},addToSelection(e){let t=!1;const i=this.selectedValues;return i!=null&&i.includes(e)||(i==null||i.push(e),t=!0),this.setSelected(i),t},removeFromSelection(e){let t=!1;const i=this.selectedValues;return i!=null&&i.includes(e)&&(i.splice(i.indexOf(e),1),t=!0),this.setSelected(i),t},toggleSelection(e){var t;(t=this.selectedValues)!=null&&t.includes(e)?this.removeFromSelection(e):this.addToSelection(e)},setSelectedNoShiftReset(e){consola.trace("MultiselectListBox setSelected on",e),this.selectedValues=e,this.$emit("update:modelValue",e)},setSelected(e){this.shiftStartIndex=-1,this.setSelectedNoShiftReset(e)},setSelectedToIndex(e){const t=this.possibleValuesWithBottom[e];t&&t.id&&this.setSelected([t.id])},scrollToCurrent(){this.currentKeyNavIndex!==this.bottomIndex&&this.scrollIntoView(this.currentKeyNavIndex)},scrollIntoView(e,t="auto"){if(!this.containerProps.ref.value)return;const i=this.containerProps.ref.value;if(i.scrollHeight>i.clientHeight){const r=i.clientHeight+i.scrollTop,l=e*this.optionLineHeight,s=l+this.optionLineHeight,o=l<i.scrollTop;if(!(s>r||o))return;t==="up"||t==="auto"&&o?i.scrollTop=l:i.scrollTop=s-i.clientHeight}},scrollUpIntoView(e){this.scrollIntoView(e,"up")},scrollDownIntoView(e){this.scrollIntoView(e,"down")},setCurrentKeyNavIndex(e){this.currentKeyNavIndex=e},isOutOfRange(e){return e<0?!0:this.withBottomValue?e>this.bottomIndex:e>=this.bottomIndex},onArrowDown(){if(this.disabled)return;const e=this.currentKeyNavIndex+1;this.isOutOfRange(e)||(this.setSelectedToIndex(e),this.currentKeyNavIndex=e,this.scrollToCurrent())},onArrowUp(){if(this.disabled)return;const e=this.currentKeyNavIndex-1;this.isOutOfRange(e)||(this.setSelectedToIndex(e),this.currentKeyNavIndex=e,this.scrollToCurrent())},onArrowDownShift(){if(this.disabled)return;this.shiftStartIndex===-1&&(this.shiftStartIndex=this.currentKeyNavIndex);const e=this.currentKeyNavIndex+1;this.isOutOfRange(e)||(this.setSelectedNoShiftReset(this.getPossibleValuesInSection(this.shiftStartIndex,e)),this.currentKeyNavIndex=e,this.scrollToCurrent())},onArrowUpShift(){if(this.disabled)return;this.shiftStartIndex===-1&&(this.shiftStartIndex=this.currentKeyNavIndex);const e=this.currentKeyNavIndex-1;this.isOutOfRange(e)||(this.setSelectedNoShiftReset(this.getPossibleValuesInSection(this.shiftStartIndex,e)),this.currentKeyNavIndex=e,this.scrollToCurrent())},onEndKey(){const e=this.possibleValues.length-1;this.setSelectedToIndex(e),this.currentKeyNavIndex=e,this.containerProps.ref.value&&(this.containerProps.ref.value.scrollTop=this.containerProps.ref.value.scrollHeight)},onHomeKey(){this.setSelectedToIndex(0),this.currentKeyNavIndex=0,this.containerProps.ref.value&&(this.containerProps.ref.value.scrollTop=0)},onArrowLeft(){this.disabled||this.$emit("keyArrowLeft",this.selectedValues)},onArrowRight(){this.disabled||this.$emit("keyArrowRight",this.selectedValues)},onCtrlA(){this.disabled||this.setSelected(this.possibleValuesWithBottom.map(e=>e.id))},hasSelection(){return this.selectedValues.length>0},getCurrentKeyNavItem(){try{return this.possibleValues[this.currentKeyNavIndex]}catch{return{id:"",text:""}}},generateOptionId(e){if(!e)return"";const t=typeof e.id=="symbol"?e.id.description:e.id,i=t&&t.replace(/[^\w]/gi,"");return`option-${this.id}-${i}`},focus(){var e;this.disabled||(e=this.containerProps.ref.value)==null||e.focus()},clearSelection(){this.disabled||this.setSelected([])},computeBoxHeight(e){return e*this.optionLineHeight},initResizeHeight(){this.resizeHeight=this.computeBoxHeight(this.size||this.possibleValues.length)},onResizeMove(e){this.resizeHeight+=e,this.resizeHeight=Math.max(this.minResizeHeight,this.resizeHeight)},onResizeEnd(){const e=this.resizeHeight/this.optionLineHeight;this.resizeHeight=this.computeBoxHeight(Math.round(e))}}},M={class:"box"},P=["id","aria-label","aria-activedescendant"],E={key:0,class:"empty-state"},R={key:1},U={key:1,role:"bottom-box"};function F(e,t,i,r,l,s){const o=I("StyledListItem");return h(),u("div",{class:K(["multiselect-list-box",{invalid:!i.isValid,disabled:i.disabled}]),style:N(s.cssStyleSize)},[m("div",M,[m("ul",C(r.containerProps,{id:i.id,role:"listbox",tabindex:"0",class:{disabled:i.disabled,"empty-box":s.showEmptyState},"aria-label":i.ariaLabel,"aria-activedescendant":s.generateOptionId(s.getCurrentKeyNavItem()),onKeydown:[t[1]||(t[1]=a(d((...n)=>s.onCtrlA&&s.onCtrlA(...n),["ctrl","prevent","exact"]),["a"])),t[2]||(t[2]=a(d((...n)=>s.onArrowUp&&s.onArrowUp(...n),["prevent","exact"]),["up"])),t[3]||(t[3]=a(d((...n)=>s.onArrowDown&&s.onArrowDown(...n),["prevent","exact"]),["down"])),t[4]||(t[4]=a(d((...n)=>s.onArrowUpShift&&s.onArrowUpShift(...n),["shift","prevent","exact"]),["up"])),t[5]||(t[5]=a(d((...n)=>s.onArrowDownShift&&s.onArrowDownShift(...n),["shift","prevent","exact"]),["down"])),t[6]||(t[6]=a(d((...n)=>s.onArrowLeft&&s.onArrowLeft(...n),["prevent","exact"]),["left"])),t[7]||(t[7]=a(d((...n)=>s.onArrowRight&&s.onArrowRight(...n),["prevent","exact"]),["right"])),t[8]||(t[8]=a(d((...n)=>s.onHomeKey&&s.onHomeKey(...n),["prevent","exact"]),["home"])),t[9]||(t[9]=a(d((...n)=>s.onEndKey&&s.onEndKey(...n),["prevent","exact"]),["end"]))],onMousedown:t[10]||(t[10]=(...n)=>s.onStartDrag&&s.onStartDrag(...n)),onMousemove:t[11]||(t[11]=(...n)=>s.onDrag&&s.onDrag(...n))}),[m("div",v(w(r.wrapperProps)),[(h(!0),u(V,null,k(r.list,({data:n,index:c})=>(h(),g(o,{id:s.generateOptionId(n),key:`listbox-${n.id}`,text:n.text,"data-option-index":c,"line-height":r.optionLineHeight,selected:s.isCurrentValue(n.id),invalid:n.invalid,special:n.special,disabled:i.disabled,onClick:f=>s.handleClick(f,n.id,c),onDblclickShift:t[0]||(t[0]=f=>s.handleShiftDblClick()),onDblclickExact:f=>s.handleDblClick(n.id,c)},null,8,["id","text","data-option-index","line-height","selected","invalid","special","disabled","onClick","onDblclickExact"]))),128))],16)],16,P),s.showEmptyState?(h(),u("div",E,[i.emptyStateComponent?(h(),g(D(i.emptyStateComponent),{key:0})):(h(),u("span",R,H(i.emptyStateLabel),1))])):b("",!0),i.withBottomValue?(h(),u("div",U,[B(o,{id:s.generateOptionId(i.bottomValue),special:"",text:i.bottomValue.text,"data-option-index":s.bottomIndex,selected:s.isCurrentValue(i.bottomValue.id),disabled:i.disabled,onClick:s.handleBottomClick,onDblclickShift:t[12]||(t[12]=n=>s.handleShiftDblClick()),onDblclickExact:s.handleBottomDblClick,onMousedown:s.onBottomStartDrag,onMousemove:s.onBottomDrag},null,8,["id","text","data-option-index","selected","disabled","onClick","onDblclickExact","onMousedown","onMousemove"])])):b("",!0)])],6)}const q=p(z,[["render",F],["__scopeId","data-v-7e0e1947"]]);export{q as M};
