import{A as P}from"./arrow-next-B9PEHETd.js";import{o as S,c as I,b as r,aw as N,W as T,R as p,X as d,_ as O,r as w,j as z,w as j,d as g,l as B,t as y,n as V,p as q,f as W}from"./index-CZEHAMBM.js";import{L as X}from"./Label-DaEXeNto.js";import{M as Y}from"./MultiselectListBox-3aXwKQB8.js";import{c as A}from"./createMissingItem-PGCdVBns.js";import{u as R,a as D}from"./useSearch-DQqjZycI.js";const Z={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},F=r("path",{d:"m14.8 5 11 11-11 11M6.2 5l11 11-11 11"},null,-1),G=[F];function H(e,t){return S(),I("svg",Z,[...G])}const J={render:H},Q={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},$=r("path",{d:"m21.5 27-11-11 11-11"},null,-1),ee=[$];function te(e,t){return S(),I("svg",Q,[...ee])}const le={render:te},ne={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},se=r("path",{d:"m17.2 27-11-11 11-11m8.6 22-11-11 11-11"},null,-1),ie=[se];function oe(e,t){return S(),I("svg",ne,[...ie])}const ae={render:oe},x="Enter",E=5,ue=e=>{const t=d(()=>e.value!==null&&"includeUnknownValues"in e.value?{withUnknownValues:e.value}:{standard:e.value}),l=d(()=>typeof t.value.standard<"u"?t.value.standard:t.value.withUnknownValues.includedValues),s=d(()=>{var i;return((i=t.value.withUnknownValues)==null?void 0:i.excludedValues)??null}),u=d(()=>{var i;return((i=t.value.withUnknownValues)==null?void 0:i.includeUnknownValues)??null}),n=d(()=>u.value===!1),c=d(()=>u.value===!0);return{includedValues:l,excludedValues:s,showUnknownExcludedValues:n,showUnknownIncludedValues:c,getEmitValue:(i,b=v=>v,m=v=>v)=>t.value.withUnknownValues?{includedValues:i,excludedValues:b(s.value),includeUnknownValues:m(t.value.withUnknownValues.includeUnknownValues)}:i}},de={name:"Twinlist",components:{ArrowNextDoubleIcon:J,ArrowNextIcon:P,ArrowPrevDoubleIcon:ae,ArrowPrevIcon:le,MultiselectListBox:Y,Label:X,SearchInput:N},props:{modelValue:{type:[Object,Array,null],default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},initialSearchTerm:{type:String,required:!1,default:""},showSearch:{default:!1,type:Boolean},disabled:{default:!1,type:Boolean},showEmptyState:{default:!0,type:Boolean},leftLabel:{type:String,required:!0,default:"Possible values"},rightLabel:{type:String,required:!0,default:"Selected values"},withSearchLabel:{default:!1,type:Boolean},searchLabel:{type:String,required:!1,default:"Search values"},searchPlaceholder:{type:String,required:!1,default:"Search"},unknownValuesText:{type:String,required:!1,default:"Unknown values"},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},size:{type:Number,default:0,validator(e){return e>=0}},isValid:{default:!0,type:Boolean},possibleValues:{type:Array,default:()=>[]},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const{includedValues:t,excludedValues:l,showUnknownExcludedValues:s,showUnknownIncludedValues:u,getEmitValue:n}=ue(T(e,"modelValue")),c=p(e.initialSearchTerm),h=p(e.initialCaseSensitiveSearch),i=d(()=>e.possibleValues.map(a=>a.id)),b=d(()=>new Set(i.value)),m=d(()=>t.value?u.value?t.value.filter(a=>b.value.has(a)):t.value:null),v=d(()=>Object.assign({},...e.possibleValues.map((a,f)=>({[a.id]:{item:a,index:f}})))),k=d(()=>m.value===null?[]:m.value.map(a=>{var f;return((f=v.value[a])==null?void 0:f.item)||A(a)})),o=d(()=>e.showSearch?R(c,h,k):k.value),L=d(()=>{if(!l.value){const a=new Set(t.value);return i.value.filter(f=>!a.has(f))}return s.value?l.value.filter(a=>b.value.has(a)):l.value}),_=d(()=>m.value===null?[]:L.value.map(a=>{var f;return((f=v.value[a])==null?void 0:f.item)||A(a)})),C=d(()=>e.showSearch?R(c,h,_):_.value),M=d(()=>e.showSearch&&c.value!==""),U=d(()=>e.showSearch&&M.value?D(C,L.value.length):null),K=d(()=>{var a;return e.showSearch&&M.value?D(o,(a=m.value)==null?void 0:a.length):null});return{includedValues:t,excludedValues:l,showUnknownExcludedValues:s,showUnknownIncludedValues:u,getEmitValue:n,searchTerm:c,filteredExcludedItems:C,filteredIncludedItems:o,knownExcludedValues:L,knownIncludedValues:m,possibleValueIds:i,possibleValueIdsSet:b,excludedLabels:U,includedLabels:K,caseSensitiveSearch:h,allIncludedItems:k,possibleValueMap:v}},data(){return{invalidPossibleValueIds:new Set,rightSelected:[],leftSelected:[],unknownValuesId:Symbol("Unknown values")}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>E?e:E},moveAllRightButtonDisabled(){return this.filteredExcludedItems.length===0&&!this.showUnknownExcludedValues},moveRightButtonDisabled(){return this.leftSelected.length===0},moveAllLeftButtonDisabled(){return this.filteredIncludedItems.length===0&&!this.showUnknownIncludedValues},moveLeftButtonDisabled(){return this.rightSelected.length===0}},watch:{possibleValues(e){if(this.filterChosenValuesOnPossibleValuesChange){let t=e.reduce((s,u)=>(s.push(...Object.values(u)),s),[]);const l=(this.includedValues??[]).filter(s=>t.includes(s));this.$emit("update:modelValue",this.getEmitValue(l))}}},methods:{getIndex(e){var t;return((t=this.possibleValueMap[e])==null?void 0:t.index)??-1},compareByOriginalSorting(e,t){return this.getIndex(e)-this.getIndex(t)},clearSelections(){this.$refs.right.clearSelection(),this.$refs.left.clearSelection()},moveItems(e,{toNewIncludedValues:t,toNewExcludedValues:l}){const s=e.filter(i=>i!==this.unknownValuesId),u=e.length>s.length,n={knownValues:s,movingUnknownValues:u};let c=null,h=null;this.includedValues!==null&&(c=t({previous:this.includedValues,movingParts:n})),this.excludedValues&&(h=l({previous:this.knownExcludedValues,movingParts:n})),this.clearSelections(),this.$emit("update:modelValue",this.getEmitValue(c,()=>h,i=>u?!i:i))},moveRight(e=null){this.moveItems(e??this.leftSelected,{toNewIncludedValues:this.addMovedItems.bind(this),toNewExcludedValues:this.filterMovedItems.bind(this)})},moveLeft(e=null){this.moveItems(e??this.rightSelected,{toNewIncludedValues:this.filterMovedItems.bind(this),toNewExcludedValues:this.addMovedItems.bind(this)})},filterMovedItems({previous:e,movingParts:{movingUnknownValues:t,knownValues:l}}){const s=new Set(l);return e.filter(u=>!s.has(u)&&(!t||this.possibleValueIdsSet.has(u)))},addMovedItems({previous:e,movingParts:{movingUnknownValues:t,knownValues:l}}){return[...t?e.filter(s=>this.possibleValueIdsSet.has(s)):e,...l.filter(s=>this.possibleValueIdsSet.has(s))].sort(this.compareByOriginalSorting)},onMoveRightButtonClick(){this.moveRight()},onMoveAllRightButtonClick(){const e=this.filteredExcludedItems.map(t=>t.id);this.moveRight(e.concat(this.showUnknownExcludedValues?[this.unknownValuesId]:[]))},onMoveAllRightButtonKey(e){e.key===x&&(this.onMoveAllRightButtonClick(),this.stopPropagation(e))},onMoveRightButtonKey(e){e.key===x&&(this.moveRight(),this.stopPropagation(e))},onMoveLeftButtonClick(){this.moveLeft()},onMoveAllLeftButtonClick(){const e=this.filteredIncludedItems.map(t=>t.id);this.moveLeft(e.concat(this.showUnknownIncludedValues?[this.unknownValuesId]:[]))},onMoveLeftButtonKey(e){e.key===x&&(this.moveLeft(),this.stopPropagation(e))},onMoveAllLeftButtonKey(e){e.key===x&&(this.onMoveAllLeftButtonClick(),this.stopPropagation(e))},stopPropagation(e){e.preventDefault(),e.stopPropagation()},onLeftListBoxDoubleClick(e){this.moveRight([e])},onLeftListBoxShiftDoubleClick(e){this.moveRight(e)},onRightListBoxDoubleClick(e){this.moveLeft([e])},onRightListBoxShiftDoubleClick(e){this.moveLeft(e)},onLeftInput(e){e.length>0&&this.$refs.right.clearSelection(),this.leftSelected=e},onRightInput(e){e.length>0&&this.$refs.left.clearSelection(),this.rightSelected=e},onSearchInput(e){this.searchTerm=e},hasSelection(){var e;return(((e=this.includedValues)==null?void 0:e.length)??0)>0},validate(){let e=!this.filteredIncludedItems.some(t=>t.invalid)&&(!this.excludedValues||!this.filteredExcludedItems.some(t=>t.invalid));return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},re=e=>(q("data-v-6ff0b982"),e=e(),W(),e),ce={class:"twinlist"},he={class:"header"},me={class:"title"},ve=["title"],fe=["title"],be=re(()=>r("div",{class:"space"},null,-1)),we={class:"title"},ge=["title"],Se=["title"],Ve={class:"buttons"};function Ie(e,t,l,s,u,n){const c=w("SearchInput"),h=w("Label"),i=w("MultiselectListBox"),b=w("ArrowNextIcon"),m=w("ArrowNextDoubleIcon"),v=w("ArrowPrevIcon"),k=w("ArrowPrevDoubleIcon");return S(),I("div",ce,[l.showSearch?(S(),z(h,{key:0,active:l.withSearchLabel,text:l.searchLabel,class:"search-wrapper"},{default:j(({labelForId:o})=>[g(c,{id:o,ref:"search",placeholder:l.searchPlaceholder,"model-value":s.searchTerm,label:l.searchLabel,"initial-case-sensitive-search":l.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:l.disabled,tooltips:{inverseSearch:"Move matching to other side"},compact:l.compact,"onUpdate:modelValue":n.onSearchInput,onToggleCaseSensitiveSearch:t[0]||(t[0]=L=>s.caseSensitiveSearch=L)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):B("",!0),r("div",he,[r("div",me,[r("div",{class:"label",title:l.leftLabel},y(l.leftLabel),9,ve),s.excludedLabels?(S(),I("div",{key:0,title:s.excludedLabels,class:"info"},y(s.excludedLabels),9,fe)):B("",!0)]),be,r("div",we,[r("div",{class:"label",title:l.rightLabel},y(l.rightLabel),9,ge),s.includedLabels?(S(),I("div",{key:0,title:s.includedLabels,class:"info"},y(s.includedLabels),9,Se)):B("",!0)])]),r("div",{class:V(["lists",{disabled:l.disabled}])},[g(i,{ref:"left","with-is-empty-state":l.showEmptyState,"empty-state-label":l.emptyStateLabel,"empty-state-component":l.emptyStateComponent,size:n.listSize,class:"list-box","model-value":u.leftSelected,"with-bottom-value":s.showUnknownExcludedValues,"bottom-value":{id:u.unknownValuesId,text:l.unknownValuesText},"is-valid":l.isValid,"possible-values":s.filteredExcludedItems,ariaLabel:l.leftLabel,disabled:l.disabled,onDoubleClickOnItem:n.onLeftListBoxDoubleClick,onDoubleClickShift:n.onLeftListBoxShiftDoubleClick,onKeyArrowRight:n.moveRight,"onUpdate:modelValue":n.onLeftInput},null,8,["with-is-empty-state","empty-state-label","empty-state-component","size","model-value","with-bottom-value","bottom-value","is-valid","possible-values","ariaLabel","disabled","onDoubleClickOnItem","onDoubleClickShift","onKeyArrowRight","onUpdate:modelValue"]),r("div",Ve,[r("div",{ref:"moveRight",class:V({disabled:n.moveRightButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[1]||(t[1]=(...o)=>n.onMoveRightButtonClick&&n.onMoveRightButtonClick(...o)),onKeydown:t[2]||(t[2]=(...o)=>n.onMoveRightButtonKey&&n.onMoveRightButtonKey(...o))},[g(b,{class:"icon"})],34),r("div",{ref:"moveAllRight",class:V({disabled:n.moveAllRightButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[3]||(t[3]=(...o)=>n.onMoveAllRightButtonClick&&n.onMoveAllRightButtonClick(...o)),onKeydown:t[4]||(t[4]=(...o)=>n.onMoveAllRightButtonKey&&n.onMoveAllRightButtonKey(...o))},[g(m,{class:"icon"})],34),r("div",{ref:"moveLeft",class:V({disabled:n.moveLeftButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[5]||(t[5]=(...o)=>n.onMoveLeftButtonClick&&n.onMoveLeftButtonClick(...o)),onKeydown:t[6]||(t[6]=(...o)=>n.onMoveLeftButtonKey&&n.onMoveLeftButtonKey(...o))},[g(v,{class:"icon"})],34),r("div",{ref:"moveAllLeft",class:V({disabled:n.moveAllLeftButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[7]||(t[7]=(...o)=>n.onMoveAllLeftButtonClick&&n.onMoveAllLeftButtonClick(...o)),onKeydown:t[8]||(t[8]=(...o)=>n.onMoveAllLeftButtonKey&&n.onMoveAllLeftButtonKey(...o))},[g(k,{class:"icon"})],34)]),g(i,{ref:"right",class:V(["list-box",{"with-empty-state-icon":l.emptyStateComponent}]),"model-value":u.rightSelected,"with-bottom-value":s.showUnknownIncludedValues,"bottom-value":{id:u.unknownValuesId,text:l.unknownValuesText},"with-is-empty-state":l.showEmptyState,"empty-state-label":l.emptyStateLabel,"empty-state-component":l.emptyStateComponent,"possible-values":s.filteredIncludedItems,size:n.listSize,ariaLabel:l.rightLabel,disabled:l.disabled,onDoubleClickOnItem:n.onRightListBoxDoubleClick,onDoubleClickShift:n.onRightListBoxShiftDoubleClick,onKeyArrowLeft:n.moveLeft,"onUpdate:modelValue":n.onRightInput},null,8,["class","model-value","with-bottom-value","bottom-value","with-is-empty-state","empty-state-label","empty-state-component","possible-values","size","ariaLabel","disabled","onDoubleClickOnItem","onDoubleClickShift","onKeyArrowLeft","onUpdate:modelValue"])],2)])}const Ce=O(de,[["render",Ie],["__scopeId","data-v-6ff0b982"]]);export{Ce as T,ue as u};
