import{C as I}from"./CodeExample-BTENbHyW.js";import{aw as M,B as x,E as c,_ as w,r as f,o as z,c as _,j as U,w as g,d as m,l as B,b as l,t as v,F as k,e as S,a as E}from"./index-Ba_qbvjF.js";import{M as F}from"./MultiselectListBox-BwEPvIgc.js";import{L as T}from"./Label-DDyD6kxX.js";import{c as O}from"./createMissingItem-PGCdVBns.js";import{u as N,a as P}from"./useSearch-4XCDL166.js";import"./StyledListItem-DypbjE4_.js";const V=5,q={components:{MultiselectListBox:F,Label:T,SearchInput:M},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(e){return e>=0}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>{}},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},unknownValuesText:{type:String,required:!1,default:"Unknown values"},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const a=x(e.modelValue),t=x(e.initialSearchTerm),d=x(e.initialCaseSensitiveSearch),s=c(()=>Object.assign({},...e.possibleValues.map((o,n)=>({[o.id]:{item:o,index:n}})))),u=c(()=>e.possibleValues.map(o=>{var n;return(n=s.value[o.id])==null?void 0:n.item})),r=c(()=>{var o;return a.value?(o=a.value)==null?void 0:o.filter(n=>!s.value[n]):[]}),h=c(()=>{var o;return(o=r.value)==null?void 0:o.map(n=>O(n))}),i=c(()=>a.value===null?[]:[...h.value,...u.value]),b=c(()=>e.showSearch?N(t,d,i):i.value),p=c(()=>b.value.length===0?[]:b.value.filter(o=>i.value.includes(o))),L=c(()=>e.showSearch&&t.value!==""),y=c(()=>p.value.filter(n=>n.text.toLowerCase().includes(t.value.toLowerCase()))),C=c(()=>{var o,n;return e.showSearch?L.value?P(y,u.value.length,a):`[ ${(n=a.value)==null?void 0:n.length} selected ]`:`[ ${(o=a.value)==null?void 0:o.length} selected ]`});return{concatenatedItems:p,visibleValues:i,selectedValues:a,searchTerm:t,matchingValidIds:u,caseSensitiveSearch:d,invalidValueIds:r,matchingInvalidValueIds:h,numLabelInfos:C,numMatchedSearchedItems:y,possibleValueMap:s}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>V?e:V}},watch:{possibleValues(e){if(this.filterChosenValuesOnPossibleValuesChange){const a=e.reduce((t,d)=>(t.push(...Object.values(d)),t),[]);this.selectedValues=(this.selectedValues??[]).filter(t=>a.includes(t))}},selectedValues(e,a){(a===null||(e==null?void 0:e.length)!==a.length||a.some((t,d)=>t!==e[d]))&&this.$emit("update:modelValue",this.selectedValues)}},methods:{hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},onChange(e){this.selectedValues=e,this.$emit("update:modelValue",e)},onSearchInput(e){this.searchTerm=e},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},A={class:"header"},D={class:"title"},j={key:0,class:"info"};function H(e,a,t,d,s,u){const r=f("SearchInput"),h=f("Label"),i=f("MultiselectListBox");return z(),_(k,null,[t.showSearch?(z(),U(h,{key:0,active:t.withSearchLabel,text:t.searchLabel,class:"search-wrapper"},{default:g(({labelForId:b})=>[m(r,{id:b,ref:"search",placeholder:t.searchPlaceholder,"model-value":d.searchTerm,label:t.searchLabel,"initial-case-sensitive-search":t.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:t.disabled,compact:t.compact,"onUpdate:modelValue":u.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=p=>d.caseSensitiveSearch=p)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):B("",!0),l("div",A,[l("div",D,[d.numLabelInfos?(z(),_("div",j,v(d.numLabelInfos),1)):B("",!0)])]),m(i,{id:t.id,ref:"form",ariaLabel:t.ariaLabel,"with-is-empty-state":t.showEmptyState,"empty-state-label":t.emptyStateLabel,"empty-state-component":t.emptyStateComponent,size:u.listSize,"possible-values":d.concatenatedItems,"model-value":t.modelValue,"is-valid":t.isValid,"with-bottom-value":t.withBottomValue,"bottom-value":t.bottomValue,disabled:t.disabled,"onUpdate:modelValue":u.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])],64)}const Z=w(q,[["render",H],["__scopeId","data-v-7301df6d"]]),G="",J=`<SearchableList
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
  :show-search = "true"
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

<SearchableList
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
  :show-search = "true"
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
  disabled
/>

<SearchableList
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
  :show-search = "true"
  with-bottom-value="true"
            :bottom-value="{
              id: bottomValueSymbol,
              text: 'Custom text',
            }"
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

<SearchableList
  v-model="selected"
  :size="4"
  :show-search = "true"
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
`,K={components:{SearchableList:Z,CodeExample:I},data(){return{codeExample:J,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return G}}},Q=E('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),R={class:"grid-container"},W={class:"grid-item-6"},X={class:"grid-item-6"},Y=l("br",null,null,-1),$=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),ee=l("br",null,null,-1),te={class:"grid-container"},ae={class:"grid-item-6"},le={class:"grid-item-6"},se=l("br",null,null,-1),ie={class:"grid-container"},oe={class:"grid-item-6"},de=l("br",null,null,-1),ne={class:"grid-container"},re={class:"grid-item-6"},ce=l("br",null,null,-1),ue={class:"grid-container"},me={class:"grid-item-6"},he={class:"grid-item-6"},be={class:"grid-container"},ve={class:"grid-item-12"};function fe(e,a,t,d,s,u){const r=f("SearchableList",!0),h=f("CodeExample");return z(),_("div",null,[l("section",null,[Q,l("div",R,[l("div",W,[m(r,{modelValue:s.selected,"onUpdate:modelValue":a[0]||(a[0]=i=>s.selected=i),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(i,b)=>({id:`baz${b}`,text:`Baz ${b}`}))]},null,8,["modelValue","possible-values"])]),l("div",X,"selected ids: "+v(s.selected),1)]),Y,$,ee,l("div",te,[l("div",ae,[m(r,{modelValue:s.selected2,"onUpdate:modelValue":a[1]||(a[1]=i=>s.selected2=i),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),l("div",le,"selected ids: "+v(s.selected2),1)]),se,S(" Disabled "),l("div",ie,[l("div",oe,[m(r,{modelValue:s.disabledSelected2,"onUpdate:modelValue":a[2]||(a[2]=i=>s.disabledSelected2=i),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),de,S(" Compact "),l("div",ne,[l("div",re,[m(r,{modelValue:s.disabledSelected2,"onUpdate:modelValue":a[3]||(a[3]=i=>s.disabledSelected2=i),size:4,"aria-label":"Compact...","with-bottom-value":"","show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],compact:""},null,8,["modelValue","bottom-value"])])]),ce,l("div",ue,[l("div",me,[m(r,{modelValue:s.withMissing,"onUpdate:modelValue":a[4]||(a[4]=i=>s.withMissing=i),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),l("div",he,"selected ids: "+v(s.withMissing),1)])]),l("section",null,[l("div",be,[l("div",ve,[m(h,{summary:"Show usage example"},{default:g(()=>[S(v(s.codeExample),1)]),_:1}),m(h,{summary:"Show SearchableList.vue source code"},{default:g(()=>[S(v(u.code),1)]),_:1})])])])])}const Be=w(K,[["render",fe]]);export{Be as default};
