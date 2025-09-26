import{C}from"./CodeExample-BgUZfbtM.js";import{b9 as M,i as V,K as r,R as B,_,r as v,c as p,o as S,k,l as w,b as a,d as u,w as g,t as h,a as U,e as f}from"./index-D6dhsvHD.js";import{u as T}from"./useSearch-CwYxN68y.js";import{L as E}from"./Label-BDXevONR.js";import{M as F}from"./MultiselectListBox-CejqtCnU.js";import{c as N}from"./createMissingItem-PGCdVBns.js";import{u as O}from"./useLabelInfo-BsDHKObL.js";import"./v4-BKrj-4V8.js";import"./StyledListItem-BqheW6YH.js";const L=5,A={name:"SearchableList",components:{MultiselectListBox:F,Label:E,SearchInput:M},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(t){return t.hasOwnProperty("id")&&t.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,default:"Possible values"},size:{type:Number,default:0,validator(t){return t>=0}},alignment:{type:String,default:"horizontal",validator(t){return["horizontal","vertical"].includes(t)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>[]},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},unknownValuesText:{type:String,required:!1,default:"Unknown values"},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(t){const e=V(t.initialSearchTerm),l=V(t.initialCaseSensitiveSearch),d=r(()=>Object.assign({},...t.possibleValues.map((o,x)=>({[o.id]:{item:o,index:x}})))),i=r(()=>t.possibleValues.map(o=>d.value[o.id]?.item)),c=r(()=>t.modelValue?t.modelValue?.filter(o=>!d.value[o]):[]),n=r(()=>c.value?.map(o=>N(o))),m=r(()=>t.modelValue===null?[]:[...n.value,...i.value]),s=T(e,l,m,B(t,"showSearch")),b=r(()=>s.value.length===0?[]:s.value.filter(o=>m.value.includes(o))),z=r(()=>t.showSearch&&e.value!==""),y=r(()=>b.value.filter(x=>x.text.toLowerCase().includes(e.value.toLowerCase()))),I=r(()=>t.showSearch?z.value?O(y,i.value.length,B(t.modelValue??[])):`[ ${t.modelValue?.length} selected ]`:`[ ${t.modelValue?.length} selected ]`);return{concatenatedItems:b,visibleValues:m,searchTerm:e,matchingValidIds:i,caseSensitiveSearch:l,invalidValueIds:c,matchingInvalidValueIds:n,numLabelInfos:I,numMatchedSearchedItems:y,possibleValueMap:d}},computed:{listSize(){const t=this.size===0?this.possibleValues.length:this.size;return t>L?t:L}},methods:{hasSelection(){return(this.modelValue?.length??0)>0},onChange(t){this.$emit("update:modelValue",t)},onSearchInput(t){this.searchTerm=t},validate(){const t=!this.concatenatedItems.some(e=>e.invalid);return{isValid:t,errorMessage:t?null:"One or more of the selected items is invalid."}}}},D={class:"header"},P={class:"title"},q={key:0,class:"info"};function j(t,e,l,d,i,c){const n=v("SearchInput"),m=v("Label"),s=v("MultiselectListBox");return S(),p("div",null,[l.showSearch?(S(),k(m,{key:0,active:l.withSearchLabel,text:l.searchLabel,class:"search-wrapper"},{default:g(({labelForId:b})=>[u(n,{id:b,ref:"search",placeholder:l.searchPlaceholder,"model-value":d.searchTerm,label:l.searchLabel,"initial-case-sensitive-search":l.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:l.disabled,compact:l.compact,"onUpdate:modelValue":c.onSearchInput,onToggleCaseSensitiveSearch:e[0]||(e[0]=z=>d.caseSensitiveSearch=z)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):w("",!0),a("div",D,[a("div",P,[d.numLabelInfos?(S(),p("div",q,h(d.numLabelInfos),1)):w("",!0)])]),u(s,{id:l.id,ref:"form",ariaLabel:l.ariaLabel,"with-is-empty-state":l.showEmptyState,"empty-state-label":l.emptyStateLabel,"empty-state-component":l.emptyStateComponent,size:c.listSize,"possible-values":d.concatenatedItems,"model-value":l.modelValue,"is-valid":l.isValid,"with-bottom-value":l.withBottomValue,"bottom-value":l.bottomValue,disabled:l.disabled,"onUpdate:modelValue":c.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])])}const R=_(A,[["render",j],["__scopeId","data-v-64245cff"]]),H="",K=`<SearchableList
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
`,Z={components:{SearchableList:R,CodeExample:C},data(){return{codeExample:K,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return H}}},G={class:"grid-container"},J={class:"grid-item-6"},Q={class:"grid-item-6"},W={class:"grid-container"},X={class:"grid-item-6"},Y={class:"grid-item-6"},$={class:"grid-container"},ee={class:"grid-item-6"},te={class:"grid-container"},ae={class:"grid-item-6"},le={class:"grid-container"},ie={class:"grid-item-6"},se={class:"grid-item-6"},oe={class:"grid-container"},de={class:"grid-item-12"};function ne(t,e,l,d,i,c){const n=v("SearchableList",!0),m=v("CodeExample");return S(),p("div",null,[a("section",null,[e[5]||(e[5]=U('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1)),a("div",G,[a("div",J,[u(n,{modelValue:i.selected,"onUpdate:modelValue":e[0]||(e[0]=s=>i.selected=s),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(s,b)=>({id:`baz${b}`,text:`Baz ${b}`}))]},null,8,["modelValue","possible-values"])]),a("div",Q,"selected ids: "+h(i.selected),1)]),e[6]||(e[6]=a("br",null,null,-1)),e[7]||(e[7]=a("div",{class:"grid-container"},[a("div",{class:"grid-item-12"},[a("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1)),e[8]||(e[8]=a("br",null,null,-1)),a("div",W,[a("div",X,[u(n,{modelValue:i.selected2,"onUpdate:modelValue":e[1]||(e[1]=s=>i.selected2=s),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:i.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),a("div",Y,"selected ids: "+h(i.selected2),1)]),e[9]||(e[9]=a("br",null,null,-1)),e[10]||(e[10]=f(" Disabled ",-1)),a("div",$,[a("div",ee,[u(n,{modelValue:i.disabledSelected2,"onUpdate:modelValue":e[2]||(e[2]=s=>i.disabledSelected2=s),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:i.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),e[11]||(e[11]=a("br",null,null,-1)),e[12]||(e[12]=f(" Compact ",-1)),a("div",te,[a("div",ae,[u(n,{modelValue:i.disabledSelected2,"onUpdate:modelValue":e[3]||(e[3]=s=>i.disabledSelected2=s),size:4,"aria-label":"Compact...","with-bottom-value":"","show-search":!0,"bottom-value":{id:i.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],compact:""},null,8,["modelValue","bottom-value"])])]),e[13]||(e[13]=a("br",null,null,-1)),a("div",le,[a("div",ie,[u(n,{modelValue:i.withMissing,"onUpdate:modelValue":e[4]||(e[4]=s=>i.withMissing=s),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),a("div",se,"selected ids: "+h(i.withMissing),1)])]),a("section",null,[a("div",oe,[a("div",de,[u(m,{summary:"Show usage example"},{default:g(()=>[f(h(i.codeExample),1)]),_:1}),u(m,{summary:"Show SearchableList.vue source code"},{default:g(()=>[f(h(c.code),1)]),_:1})])])])])}const ze=_(Z,[["render",ne]]);export{ze as default};
