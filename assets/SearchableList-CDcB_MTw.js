import{C}from"./CodeExample-DJVnkR8W.js";import{a$ as M,i as V,R as u,Y as B,_,r as f,o as z,c as p,k,w as g,d as c,l as w,b as a,t as v,a as U,e as S}from"./index-C4N8Hs82.js";import{u as T}from"./useSearch-C84NPgxk.js";import{L as E}from"./Label-CMaCCRKj.js";import{M as F}from"./MultiselectListBox-COZ7nxCO.js";import{c as N}from"./createMissingItem-PGCdVBns.js";import{u as O}from"./useLabelInfo-CJFT0eED.js";import"./StyledListItem-D7R4KazA.js";const L=5,A={name:"SearchableList",components:{MultiselectListBox:F,Label:E,SearchInput:M},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(t){return t.hasOwnProperty("id")&&t.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(t){return t>=0}},alignment:{type:String,default:"horizontal",validator(t){return["horizontal","vertical"].includes(t)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>[]},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},unknownValuesText:{type:String,required:!1,default:"Unknown values"},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(t){const e=V(t.initialSearchTerm),l=V(t.initialCaseSensitiveSearch),n=u(()=>Object.assign({},...t.possibleValues.map((s,d)=>({[s.id]:{item:s,index:d}})))),i=u(()=>t.possibleValues.map(s=>{var d;return(d=n.value[s.id])==null?void 0:d.item})),m=u(()=>{var s;return t.modelValue?(s=t.modelValue)==null?void 0:s.filter(d=>!n.value[d]):[]}),r=u(()=>{var s;return(s=m.value)==null?void 0:s.map(d=>N(d))}),b=u(()=>t.modelValue===null?[]:[...r.value,...i.value]),o=T(e,l,b,B(t,"showSearch")),h=u(()=>o.value.length===0?[]:o.value.filter(s=>b.value.includes(s))),x=u(()=>t.showSearch&&e.value!==""),y=u(()=>h.value.filter(d=>d.text.toLowerCase().includes(e.value.toLowerCase()))),I=u(()=>{var s,d;return t.showSearch?x.value?O(y,i.value.length,B(t.modelValue??[])):`[ ${(d=t.modelValue)==null?void 0:d.length} selected ]`:`[ ${(s=t.modelValue)==null?void 0:s.length} selected ]`});return{concatenatedItems:h,visibleValues:b,searchTerm:e,matchingValidIds:i,caseSensitiveSearch:l,invalidValueIds:m,matchingInvalidValueIds:r,numLabelInfos:I,numMatchedSearchedItems:y,possibleValueMap:n}},computed:{listSize(){const t=this.size===0?this.possibleValues.length:this.size;return t>L?t:L}},methods:{hasSelection(){var t;return(((t=this.modelValue)==null?void 0:t.length)??0)>0},onChange(t){this.$emit("update:modelValue",t)},onSearchInput(t){this.searchTerm=t},validate(){const t=!this.concatenatedItems.some(e=>e.invalid);return{isValid:t,errorMessage:t?null:"One or more of the selected items is invalid."}}}},D={class:"header"},P={class:"title"},q={key:0,class:"info"};function j(t,e,l,n,i,m){const r=f("SearchInput"),b=f("Label"),o=f("MultiselectListBox");return z(),p("div",null,[l.showSearch?(z(),k(b,{key:0,active:l.withSearchLabel,text:l.searchLabel,class:"search-wrapper"},{default:g(({labelForId:h})=>[c(r,{id:h,ref:"search",placeholder:l.searchPlaceholder,"model-value":n.searchTerm,label:l.searchLabel,"initial-case-sensitive-search":l.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:l.disabled,compact:l.compact,"onUpdate:modelValue":m.onSearchInput,onToggleCaseSensitiveSearch:e[0]||(e[0]=x=>n.caseSensitiveSearch=x)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):w("",!0),a("div",D,[a("div",P,[n.numLabelInfos?(z(),p("div",q,v(n.numLabelInfos),1)):w("",!0)])]),c(o,{id:l.id,ref:"form",ariaLabel:l.ariaLabel,"with-is-empty-state":l.showEmptyState,"empty-state-label":l.emptyStateLabel,"empty-state-component":l.emptyStateComponent,size:m.listSize,"possible-values":n.concatenatedItems,"model-value":l.modelValue,"is-valid":l.isValid,"with-bottom-value":l.withBottomValue,"bottom-value":l.bottomValue,disabled:l.disabled,"onUpdate:modelValue":m.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])])}const R=_(A,[["render",j],["__scopeId","data-v-e5097508"]]),H="",Y=`<SearchableList
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
`,Z={components:{SearchableList:R,CodeExample:C},data(){return{codeExample:Y,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return H}}},G={class:"grid-container"},J={class:"grid-item-6"},K={class:"grid-item-6"},Q={class:"grid-container"},W={class:"grid-item-6"},X={class:"grid-item-6"},$={class:"grid-container"},ee={class:"grid-item-6"},te={class:"grid-container"},ae={class:"grid-item-6"},le={class:"grid-container"},ie={class:"grid-item-6"},se={class:"grid-item-6"},oe={class:"grid-container"},de={class:"grid-item-12"};function ne(t,e,l,n,i,m){const r=f("SearchableList",!0),b=f("CodeExample");return z(),p("div",null,[a("section",null,[e[5]||(e[5]=U('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1)),a("div",G,[a("div",J,[c(r,{modelValue:i.selected,"onUpdate:modelValue":e[0]||(e[0]=o=>i.selected=o),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(o,h)=>({id:`baz${h}`,text:`Baz ${h}`}))]},null,8,["modelValue","possible-values"])]),a("div",K,"selected ids: "+v(i.selected),1)]),e[6]||(e[6]=a("br",null,null,-1)),e[7]||(e[7]=a("div",{class:"grid-container"},[a("div",{class:"grid-item-12"},[a("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1)),e[8]||(e[8]=a("br",null,null,-1)),a("div",Q,[a("div",W,[c(r,{modelValue:i.selected2,"onUpdate:modelValue":e[1]||(e[1]=o=>i.selected2=o),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:i.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),a("div",X,"selected ids: "+v(i.selected2),1)]),e[9]||(e[9]=a("br",null,null,-1)),e[10]||(e[10]=S(" Disabled ")),a("div",$,[a("div",ee,[c(r,{modelValue:i.disabledSelected2,"onUpdate:modelValue":e[2]||(e[2]=o=>i.disabledSelected2=o),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:i.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),e[11]||(e[11]=a("br",null,null,-1)),e[12]||(e[12]=S(" Compact ")),a("div",te,[a("div",ae,[c(r,{modelValue:i.disabledSelected2,"onUpdate:modelValue":e[3]||(e[3]=o=>i.disabledSelected2=o),size:4,"aria-label":"Compact...","with-bottom-value":"","show-search":!0,"bottom-value":{id:i.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],compact:""},null,8,["modelValue","bottom-value"])])]),e[13]||(e[13]=a("br",null,null,-1)),a("div",le,[a("div",ie,[c(r,{modelValue:i.withMissing,"onUpdate:modelValue":e[4]||(e[4]=o=>i.withMissing=o),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),a("div",se,"selected ids: "+v(i.withMissing),1)])]),a("section",null,[a("div",oe,[a("div",de,[c(b,{summary:"Show usage example"},{default:g(()=>[S(v(i.codeExample),1)]),_:1}),c(b,{summary:"Show SearchableList.vue source code"},{default:g(()=>[S(v(m.code),1)]),_:1})])])])])}const Se=_(Z,[["render",ne]]);export{Se as default};
