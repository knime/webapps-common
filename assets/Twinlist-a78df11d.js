import{L as B}from"./Label-ab0c0b65.js";import{o as u,c,b as o,_ as x,a2 as A,r,j as R,w as C,d as h,l as v,t as f,n as d,p,f as M}from"./index-2e4a1f3e.js";import{M as D}from"./MultiselectListBox-088c5987.js";import{A as U}from"./arrow-next-a0c59307.js";const K={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},T=o("path",{d:"m14.8 5 11 11-11 11M6.2 5l11 11-11 11"},null,-1),z=[T];function O(e,t){return u(),c("svg",K,z)}const N={render:O},E={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},P=o("path",{d:"m21.5 27-11-11 11-11"},null,-1),q=[P];function j(e,t){return u(),c("svg",E,q)}const G={render:j},Y={xmlns:"http://www.w3.org/2000/svg",fill:"none",stroke:"#000","stroke-linejoin":"round",viewBox:"0 0 32 32"},Z=o("path",{d:"m17.2 27-11-11 11-11m8.6 22-11-11 11-11"},null,-1),F=[Z];function H(e,t){return u(),c("svg",Y,F)}const J={render:H},Q=[{id:"search",normalize(e,t,l){return t?e:e.toLowerCase()},test(e,t,l,s){const i=(l?e:e.toLowerCase()).includes(t);return s?!i:i}},{id:"wildcard",normalize(e,t,l){if(e.length>0)e=`^${e.replace(/[-[\]{}()+.,\\^$|#\s]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".?")}$`;else return{test:()=>!1};try{const s=t?"":"i";return new RegExp(e,s)}catch{return new RegExp("$^")}},test(e,t,l,s){const a=t.test(e);return s?!a:a}},{id:"regex",normalize(e,t,l){try{const s=t?"":"i";return new RegExp(`^${e}$`,s)}catch{return new RegExp("$^")}},test(e,t,l,s){const a=t.test(e);return s?!a:a}},{id:"type",normalize(e){return{test:t=>e.includes(t)}},test(e,t){return t.test(e)}}],b=Object.assign({},...Q.map(e=>({[e.id]:e})));const m=13,w=5,W={components:{ArrowNextDoubleIcon:N,ArrowNextIcon:U,ArrowPrevDoubleIcon:J,ArrowPrevIcon:G,MultiselectListBox:D,Label:B,SearchInput:A},props:{modelValue:{type:Array,default:()=>[]},initialCaseSensitiveSearch:{default:!1,type:Boolean},initialSearchTerm:{type:String,required:!1,default:""},initialIncludeUnknownValues:{type:Boolean,default:!1},showSearch:{default:!1,type:Boolean},showUnknownValues:{type:Boolean,default:!1},disabled:{default:!1,type:Boolean},showEmptyState:{default:!0,type:Boolean},leftLabel:{type:String,required:!0,default:"Possible values"},rightLabel:{type:String,required:!0,default:"Selected values"},withSearchLabel:{default:!1,type:Boolean},searchLabel:{type:String,required:!1,default:"Search values"},searchPlaceholder:{type:String,required:!1,default:"Search"},unknownValuesText:{type:String,required:!1,default:"Unknown values"},emptyStateLabel:{type:String,required:!1,default:"No entries in this list"},size:{type:Number,default:0,validator(e){return e>=0}},isValid:{default:!0,type:Boolean},possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(t=>t.hasOwnProperty("id")&&t.hasOwnProperty("text")):!1}}},emits:["update:modelValue","includeUnknownValuesInput"],data(){return{chosenValues:this.modelValue,invalidPossibleValueIds:new Set,rightSelected:[],leftSelected:[],searchTerm:this.initialSearchTerm,caseSensitiveSearch:this.initialCaseSensitiveSearch,includeUnknownValues:this.initialIncludeUnknownValues,unknownValuesId:Symbol("Unknown values")}},computed:{possibleValueMap(){return Object.assign({},...this.possibleValues.map(e=>({[e.id]:e})))},possibleValueIds(){return this.possibleValues.map(e=>e.id)},invalidValueIds(){return this.modelValue.filter(e=>!this.possibleValueMap[e])},visibleValueIds(){const e=this.invalidValueIds.filter(l=>this.itemMatchesSearch(this.generateInvalidItem(l)));return[...this.possibleValues.filter(l=>this.itemMatchesSearch(l)).map(l=>l.id),...e]},leftItems(){return this.possibleValues.filter(e=>this.visibleValueIds.includes(e.id)&&!this.chosenValues.includes(e.id))},rightItems(){return this.chosenValues.map(e=>this.possibleValueMap[e]||this.generateInvalidItem(e)).filter(e=>this.visibleValueIds.includes(e.id))},listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>w?e:w},showUnknownValuesLeft(){return this.showUnknownValues&&!this.includeUnknownValues},showUnknownValuesRight(){return this.showUnknownValues&&this.includeUnknownValues},moveAllRightButtonDisabled(){return this.leftItems.length===0&&!this.showUnknownValuesLeft},moveRightButtonDisabled(){return this.leftSelected.length===0},moveAllLeftButtonDisabled(){return this.rightItems.length===0&&!this.showUnknownValuesRight},moveLeftButtonDisabled(){return this.rightSelected.length===0},normalizedSearchTerm(){return this.showSearch?b.search.normalize(this.searchTerm,this.caseSensitiveSearch):""},numAllItems(){return this.invalidValueIds.length+this.possibleValues.length},numAllRightItems(){return this.chosenValues.length},numShownRightItems(){return this.rightItems.length},numAllLeftItems(){return this.possibleValues.length+this.invalidValueIds.length-this.numAllRightItems},numShownLeftItems(){return this.leftItems.length},hasActiveSearch(){return this.showSearch&&this.searchTerm!==""},leftInfo(){return this.getInfoText(this.numShownLeftItems,this.numAllLeftItems)},rightInfo(){return this.getInfoText(this.numShownRightItems,this.numAllRightItems)}},watch:{modelValue(e){this.chosenValues=e},possibleValues(e){let t=e.reduce((l,s)=>(l.push(...Object.values(s)),l),[]);this.chosenValues=this.chosenValues.filter(l=>t.includes(l))},chosenValues(e,t){(e.length!==t.length||t.some((l,s)=>l!==e[s]))&&this.$emit("update:modelValue",this.chosenValues)},includeUnknownValues(e){this.$emit("includeUnknownValuesInput",e)}},methods:{generateInvalidItem(e){return{id:e,text:`(MISSING) ${e}`,invalid:!0}},compareByOriginalSorting(e,t){return this.possibleValueIds.indexOf(e)-this.possibleValueIds.indexOf(t)},clearSelections(){this.$refs.right.clearSelection(),this.$refs.left.clearSelection()},moveRight(e){e=e||this.leftSelected,this.chosenValues=[...e.filter(t=>t!==this.unknownValuesId),...this.chosenValues].sort(this.compareByOriginalSorting),e.includes(this.unknownValuesId)&&(this.includeUnknownValues=!0),this.clearSelections()},moveLeft(e){e=e||this.rightSelected,e.filter(l=>this.invalidValueIds.includes(l)).forEach(l=>this.invalidPossibleValueIds.add(l)),this.chosenValues=this.chosenValues.filter(l=>!e.includes(l)).sort(this.compareByOriginalSorting),e.includes(this.unknownValuesId)&&(this.includeUnknownValues=!1),this.clearSelections()},onMoveRightButtonClick(){this.moveRight()},onMoveAllRightButtonClick(){this.moveRight(this.leftItems.filter(e=>!e.invalid).map(e=>e.id)),this.includeUnknownValues=!0},onMoveAllRightButtonKey(e){e.keyCode===m&&this.onMoveAllRightButtonClick()},onMoveRightButtonKey(e){e.keyCode===m&&this.moveRight()},onMoveLeftButtonClick(){this.moveLeft()},onMoveAllLeftButtonClick(){this.moveLeft(this.rightItems.map(e=>e.id)),this.includeUnknownValues=!1},onMoveLeftButtonKey(e){e.keyCode===m&&this.moveLeft()},onMoveAllLeftButtonKey(e){e.keyCode===m&&this.onMoveAllLeftButtonClick()},onLeftListBoxDoubleClick(e){this.moveRight([e])},onLeftListBoxShiftDoubleClick(e){this.moveRight(e)},onRightListBoxDoubleClick(e){this.moveLeft([e])},onRightListBoxShiftDoubleClick(e){this.moveLeft(e)},onLeftInput(e){e.length>0&&this.$refs.right.clearSelection(),this.leftSelected=e},onRightInput(e){e.length>0&&this.$refs.left.clearSelection(),this.rightSelected=e},onKeyRightArrow(){this.moveRight()},onKeyLeftArrow(){this.moveLeft()},onSearchInput(e){this.searchTerm=e},hasSelection(){return this.chosenValues.length>0},validate(){let e=!this.rightItems.some(t=>t.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}},itemMatchesSearch(e){return b.search.test(e.text,this.normalizedSearchTerm,this.caseSensitiveSearch,!1)},getInfoText(e,t){return this.hasActiveSearch?`${e} of ${t} entries`:null}}},X=e=>(p("data-v-8e056a98"),e=e(),M(),e),$={class:"twinlist"},ee={class:"header"},te={class:"title"},le=["title"],ie=["title"],se=X(()=>o("div",{class:"space"},null,-1)),ne={class:"title"},oe=["title"],ae=["title"],re={class:"buttons"};function he(e,t,l,s,a,i){const S=r("SearchInput"),I=r("Label"),g=r("MultiselectListBox"),V=r("ArrowNextIcon"),k=r("ArrowNextDoubleIcon"),y=r("ArrowPrevIcon"),L=r("ArrowPrevDoubleIcon");return u(),c("div",$,[l.showSearch?(u(),R(I,{key:0,active:l.withSearchLabel,text:l.searchLabel,class:"search-wrapper",compact:""},{default:C(({labelForId:n})=>[h(S,{id:n,ref:"search",placeholder:l.searchPlaceholder,"model-value":a.searchTerm,label:l.searchLabel,"initial-case-sensitive-search":l.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:l.disabled,"onUpdate:modelValue":i.onSearchInput,onToggleCaseSensitiveSearch:t[0]||(t[0]=_=>a.caseSensitiveSearch=_)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):v("",!0),o("div",ee,[o("div",te,[o("div",{class:"label",title:l.leftLabel},f(l.leftLabel),9,le),i.leftInfo?(u(),c("div",{key:0,title:i.leftInfo,class:"info"},f(i.leftInfo),9,ie)):v("",!0)]),se,o("div",ne,[o("div",{class:"label",title:l.rightLabel},f(l.rightLabel),9,oe),i.rightInfo?(u(),c("div",{key:0,title:i.rightInfo,class:"info"},f(i.rightInfo),9,ae)):v("",!0)])]),o("div",{class:d(["lists",{disabled:l.disabled}])},[h(g,{ref:"left","with-is-empty-state":l.showEmptyState,"empty-state-label":l.emptyStateLabel,size:i.listSize,class:"list-box","model-value":a.leftSelected,"with-bottom-value":i.showUnknownValuesLeft,"bottom-value":{id:a.unknownValuesId,text:l.unknownValuesText},"is-valid":l.isValid,"possible-values":i.leftItems,"aria-label":l.leftLabel,disabled:l.disabled,onDoubleClickOnItem:i.onLeftListBoxDoubleClick,onDoubleClickShift:i.onLeftListBoxShiftDoubleClick,onKeyArrowRight:i.onKeyRightArrow,"onUpdate:modelValue":i.onLeftInput},null,8,["with-is-empty-state","empty-state-label","size","model-value","with-bottom-value","bottom-value","is-valid","possible-values","aria-label","disabled","onDoubleClickOnItem","onDoubleClickShift","onKeyArrowRight","onUpdate:modelValue"]),o("div",re,[o("div",{ref:"moveRight",class:d({disabled:i.moveRightButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[1]||(t[1]=(...n)=>i.onMoveRightButtonClick&&i.onMoveRightButtonClick(...n)),onKeydown:t[2]||(t[2]=(...n)=>i.onMoveRightButtonKey&&i.onMoveRightButtonKey(...n))},[h(V,{class:"icon"})],34),o("div",{ref:"moveAllRight",class:d({disabled:i.moveAllRightButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[3]||(t[3]=(...n)=>i.onMoveAllRightButtonClick&&i.onMoveAllRightButtonClick(...n)),onKeydown:t[4]||(t[4]=(...n)=>i.onMoveAllRightButtonKey&&i.onMoveAllRightButtonKey(...n))},[h(k,{class:"icon"})],34),o("div",{ref:"moveLeft",class:d({disabled:i.moveLeftButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[5]||(t[5]=(...n)=>i.onMoveLeftButtonClick&&i.onMoveLeftButtonClick(...n)),onKeydown:t[6]||(t[6]=(...n)=>i.onMoveLeftButtonKey&&i.onMoveLeftButtonKey(...n))},[h(y,{class:"icon"})],34),o("div",{ref:"moveAllLeft",class:d({disabled:i.moveAllLeftButtonDisabled||l.disabled}),role:"button",tabindex:"0",onClick:t[7]||(t[7]=(...n)=>i.onMoveAllLeftButtonClick&&i.onMoveAllLeftButtonClick(...n)),onKeydown:t[8]||(t[8]=(...n)=>i.onMoveAllLeftButtonKey&&i.onMoveAllLeftButtonKey(...n))},[h(L,{class:"icon"})],34)]),h(g,{ref:"right",class:"list-box","model-value":a.rightSelected,"with-bottom-value":i.showUnknownValuesRight,"bottom-value":{id:a.unknownValuesId,text:l.unknownValuesText},"with-is-empty-state":l.showEmptyState,"empty-state-label":l.emptyStateLabel,"possible-values":i.rightItems,size:i.listSize,"aria-label":l.rightLabel,disabled:l.disabled,onDoubleClickOnItem:i.onRightListBoxDoubleClick,onDoubleClickShift:i.onRightListBoxShiftDoubleClick,onKeyArrowLeft:i.onKeyLeftArrow,"onUpdate:modelValue":i.onRightInput},null,8,["model-value","with-bottom-value","bottom-value","with-is-empty-state","empty-state-label","possible-values","size","aria-label","disabled","onDoubleClickOnItem","onDoubleClickShift","onKeyArrowLeft","onUpdate:modelValue"])],2)])}const me=x(W,[["render",he],["__scopeId","data-v-8e056a98"]]);export{me as T,b as f};
