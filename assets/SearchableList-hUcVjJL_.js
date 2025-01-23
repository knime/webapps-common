import{C as I}from"./CodeExample-pewhKcZw.js";import{aU as U,j as x,U as u,$ as M,_ as w,r as f,o as z,c as _,l as k,w as g,d as m,m as B,b as l,t as v,F,e as S,a as T}from"./index-DEvE_v6q.js";import{u as E}from"./useSearch-D2YBdigw.js";import{L as O}from"./Label-DbiODzQF.js";import{M as N}from"./MultiselectListBox-CN3gIxWV.js";import{c as P}from"./createMissingItem-PGCdVBns.js";import{u as q}from"./useLabelInfo-BAXVsDO5.js";import"./StyledListItem-DXhqJv0Y.js";const V=5,A={name:"SearchableList",components:{MultiselectListBox:N,Label:O,SearchInput:U},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(e){return e>=0}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>{}},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},unknownValuesText:{type:String,required:!1,default:"Unknown values"},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const a=x(e.modelValue),t=x(e.initialSearchTerm),d=x(e.initialCaseSensitiveSearch),s=u(()=>Object.assign({},...e.possibleValues.map((o,n)=>({[o.id]:{item:o,index:n}})))),c=u(()=>e.possibleValues.map(o=>{var n;return(n=s.value[o.id])==null?void 0:n.item})),r=u(()=>{var o;return a.value?(o=a.value)==null?void 0:o.filter(n=>!s.value[n]):[]}),h=u(()=>{var o;return(o=r.value)==null?void 0:o.map(n=>P(n))}),i=u(()=>a.value===null?[]:[...h.value,...c.value]),b=E(t,d,i,M(e,"showSearch")),p=u(()=>b.value.length===0?[]:b.value.filter(o=>i.value.includes(o))),L=u(()=>e.showSearch&&t.value!==""),y=u(()=>p.value.filter(n=>n.text.toLowerCase().includes(t.value.toLowerCase()))),C=u(()=>{var o,n;return e.showSearch?L.value?q(y,c.value.length,a):`[ ${(n=a.value)==null?void 0:n.length} selected ]`:`[ ${(o=a.value)==null?void 0:o.length} selected ]`});return{concatenatedItems:p,visibleValues:i,selectedValues:a,searchTerm:t,matchingValidIds:c,caseSensitiveSearch:d,invalidValueIds:r,matchingInvalidValueIds:h,numLabelInfos:C,numMatchedSearchedItems:y,possibleValueMap:s}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>V?e:V}},watch:{possibleValues(e){if(this.filterChosenValuesOnPossibleValuesChange){const a=e.reduce((t,d)=>(t.push(...Object.values(d)),t),[]);this.selectedValues=(this.selectedValues??[]).filter(t=>a.includes(t))}},selectedValues(e,a){(a===null||(e==null?void 0:e.length)!==a.length||a.some((t,d)=>t!==e[d]))&&this.$emit("update:modelValue",this.selectedValues)}},methods:{hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},onChange(e){this.selectedValues=e,this.$emit("update:modelValue",e)},onSearchInput(e){this.searchTerm=e},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},D={class:"header"},j={class:"title"},H={key:0,class:"info"};function R(e,a,t,d,s,c){const r=f("SearchInput"),h=f("Label"),i=f("MultiselectListBox");return z(),_(F,null,[t.showSearch?(z(),k(h,{key:0,active:t.withSearchLabel,text:t.searchLabel,class:"search-wrapper"},{default:g(({labelForId:b})=>[m(r,{id:b,ref:"search",placeholder:t.searchPlaceholder,"model-value":d.searchTerm,label:t.searchLabel,"initial-case-sensitive-search":t.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:t.disabled,compact:t.compact,"onUpdate:modelValue":c.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=p=>d.caseSensitiveSearch=p)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):B("",!0),l("div",D,[l("div",j,[d.numLabelInfos?(z(),_("div",H,v(d.numLabelInfos),1)):B("",!0)])]),m(i,{id:t.id,ref:"form",ariaLabel:t.ariaLabel,"with-is-empty-state":t.showEmptyState,"empty-state-label":t.emptyStateLabel,"empty-state-component":t.emptyStateComponent,size:c.listSize,"possible-values":d.concatenatedItems,"model-value":t.modelValue,"is-valid":t.isValid,"with-bottom-value":t.withBottomValue,"bottom-value":t.bottomValue,disabled:t.disabled,"onUpdate:modelValue":c.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])],64)}const Z=w(A,[["render",R],["__scopeId","data-v-d65dfe39"]]),G="",J=`<SearchableList
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
`,K={components:{SearchableList:Z,CodeExample:I},data(){return{codeExample:J,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return G}}},Q=T('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),W={class:"grid-container"},X={class:"grid-item-6"},Y={class:"grid-item-6"},$=l("br",null,null,-1),ee=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),te=l("br",null,null,-1),ae={class:"grid-container"},le={class:"grid-item-6"},se={class:"grid-item-6"},ie=l("br",null,null,-1),oe={class:"grid-container"},de={class:"grid-item-6"},ne=l("br",null,null,-1),re={class:"grid-container"},ce={class:"grid-item-6"},ue=l("br",null,null,-1),me={class:"grid-container"},he={class:"grid-item-6"},be={class:"grid-item-6"},ve={class:"grid-container"},fe={class:"grid-item-12"};function pe(e,a,t,d,s,c){const r=f("SearchableList",!0),h=f("CodeExample");return z(),_("div",null,[l("section",null,[Q,l("div",W,[l("div",X,[m(r,{modelValue:s.selected,"onUpdate:modelValue":a[0]||(a[0]=i=>s.selected=i),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(i,b)=>({id:`baz${b}`,text:`Baz ${b}`}))]},null,8,["modelValue","possible-values"])]),l("div",Y,"selected ids: "+v(s.selected),1)]),$,ee,te,l("div",ae,[l("div",le,[m(r,{modelValue:s.selected2,"onUpdate:modelValue":a[1]||(a[1]=i=>s.selected2=i),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),l("div",se,"selected ids: "+v(s.selected2),1)]),ie,S(" Disabled "),l("div",oe,[l("div",de,[m(r,{modelValue:s.disabledSelected2,"onUpdate:modelValue":a[2]||(a[2]=i=>s.disabledSelected2=i),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),ne,S(" Compact "),l("div",re,[l("div",ce,[m(r,{modelValue:s.disabledSelected2,"onUpdate:modelValue":a[3]||(a[3]=i=>s.disabledSelected2=i),size:4,"aria-label":"Compact...","with-bottom-value":"","show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],compact:""},null,8,["modelValue","bottom-value"])])]),ue,l("div",me,[l("div",he,[m(r,{modelValue:s.withMissing,"onUpdate:modelValue":a[4]||(a[4]=i=>s.withMissing=i),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),l("div",be,"selected ids: "+v(s.withMissing),1)])]),l("section",null,[l("div",ve,[l("div",fe,[m(h,{summary:"Show usage example"},{default:g(()=>[S(v(s.codeExample),1)]),_:1}),m(h,{summary:"Show SearchableList.vue source code"},{default:g(()=>[S(v(c.code),1)]),_:1})])])])])}const we=w(K,[["render",pe]]);export{we as default};
