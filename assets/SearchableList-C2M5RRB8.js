import{C as I}from"./CodeExample-Bckx9qRZ.js";import{aT as M,j as x,U as u,$ as U,_ as w,r as f,o as z,c as _,l as T,w as g,d as m,m as y,b as t,t as v,F as k,e as p,a as F}from"./index-LDr8wY-6.js";import{u as E}from"./useSearch-BewlqOEv.js";import{L as O}from"./Label-vKlR_LdK.js";import{M as N}from"./MultiselectListBox-C4wfpGNP.js";import{c as P}from"./createMissingItem-PGCdVBns.js";import{u as q}from"./useLabelInfo-BlSM7aAL.js";import"./StyledListItem-CIE37aiy.js";const B=5,A={name:"SearchableList",components:{MultiselectListBox:N,Label:O,SearchInput:M},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(e){return e>=0}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>{}},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},unknownValuesText:{type:String,required:!1,default:"Unknown values"},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const l=x(e.modelValue),a=x(e.initialSearchTerm),d=x(e.initialCaseSensitiveSearch),s=u(()=>Object.assign({},...e.possibleValues.map((o,n)=>({[o.id]:{item:o,index:n}})))),c=u(()=>e.possibleValues.map(o=>{var n;return(n=s.value[o.id])==null?void 0:n.item})),r=u(()=>{var o;return l.value?(o=l.value)==null?void 0:o.filter(n=>!s.value[n]):[]}),h=u(()=>{var o;return(o=r.value)==null?void 0:o.map(n=>P(n))}),i=u(()=>l.value===null?[]:[...h.value,...c.value]),b=E(a,d,i,U(e,"showSearch")),S=u(()=>b.value.length===0?[]:b.value.filter(o=>i.value.includes(o))),L=u(()=>e.showSearch&&a.value!==""),V=u(()=>S.value.filter(n=>n.text.toLowerCase().includes(a.value.toLowerCase()))),C=u(()=>{var o,n;return e.showSearch?L.value?q(V,c.value.length,l):`[ ${(n=l.value)==null?void 0:n.length} selected ]`:`[ ${(o=l.value)==null?void 0:o.length} selected ]`});return{concatenatedItems:S,visibleValues:i,selectedValues:l,searchTerm:a,matchingValidIds:c,caseSensitiveSearch:d,invalidValueIds:r,matchingInvalidValueIds:h,numLabelInfos:C,numMatchedSearchedItems:V,possibleValueMap:s}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>B?e:B}},watch:{possibleValues(e){if(this.filterChosenValuesOnPossibleValuesChange){const l=e.map(({id:d})=>d),a=(this.selectedValues??[]).filter(d=>l.includes(d));this.onChange(a)}}},methods:{hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},onChange(e){this.selectedValues=e,this.$emit("update:modelValue",e)},onSearchInput(e){this.searchTerm=e},validate(){let e=!this.concatenatedItems.some(l=>l.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},D={class:"header"},j={class:"title"},H={key:0,class:"info"};function R(e,l,a,d,s,c){const r=f("SearchInput"),h=f("Label"),i=f("MultiselectListBox");return z(),_(k,null,[a.showSearch?(z(),T(h,{key:0,active:a.withSearchLabel,text:a.searchLabel,class:"search-wrapper"},{default:g(({labelForId:b})=>[m(r,{id:b,ref:"search",placeholder:a.searchPlaceholder,"model-value":d.searchTerm,label:a.searchLabel,"initial-case-sensitive-search":a.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:a.disabled,compact:a.compact,"onUpdate:modelValue":c.onSearchInput,onToggleCaseSensitiveSearch:l[0]||(l[0]=S=>d.caseSensitiveSearch=S)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):y("",!0),t("div",D,[t("div",j,[d.numLabelInfos?(z(),_("div",H,v(d.numLabelInfos),1)):y("",!0)])]),m(i,{id:a.id,ref:"form",ariaLabel:a.ariaLabel,"with-is-empty-state":a.showEmptyState,"empty-state-label":a.emptyStateLabel,"empty-state-component":a.emptyStateComponent,size:c.listSize,"possible-values":d.concatenatedItems,"model-value":a.modelValue,"is-valid":a.isValid,"with-bottom-value":a.withBottomValue,"bottom-value":a.bottomValue,disabled:a.disabled,"onUpdate:modelValue":c.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])],64)}const Z=w(A,[["render",R],["__scopeId","data-v-b7d8d33c"]]),G="",J=`<SearchableList
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
`,K={components:{SearchableList:Z,CodeExample:I},data(){return{codeExample:J,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return G}}},Q=F('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),W={class:"grid-container"},X={class:"grid-item-6"},Y={class:"grid-item-6"},$=t("br",null,null,-1),ee=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),te=t("br",null,null,-1),ae={class:"grid-container"},le={class:"grid-item-6"},se={class:"grid-item-6"},ie=t("br",null,null,-1),oe={class:"grid-container"},de={class:"grid-item-6"},ne=t("br",null,null,-1),re={class:"grid-container"},ce={class:"grid-item-6"},ue=t("br",null,null,-1),me={class:"grid-container"},he={class:"grid-item-6"},be={class:"grid-item-6"},ve={class:"grid-container"},fe={class:"grid-item-12"};function Se(e,l,a,d,s,c){const r=f("SearchableList",!0),h=f("CodeExample");return z(),_("div",null,[t("section",null,[Q,t("div",W,[t("div",X,[m(r,{modelValue:s.selected,"onUpdate:modelValue":l[0]||(l[0]=i=>s.selected=i),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(i,b)=>({id:`baz${b}`,text:`Baz ${b}`}))]},null,8,["modelValue","possible-values"])]),t("div",Y,"selected ids: "+v(s.selected),1)]),$,ee,te,t("div",ae,[t("div",le,[m(r,{modelValue:s.selected2,"onUpdate:modelValue":l[1]||(l[1]=i=>s.selected2=i),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),t("div",se,"selected ids: "+v(s.selected2),1)]),ie,p(" Disabled "),t("div",oe,[t("div",de,[m(r,{modelValue:s.disabledSelected2,"onUpdate:modelValue":l[2]||(l[2]=i=>s.disabledSelected2=i),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),ne,p(" Compact "),t("div",re,[t("div",ce,[m(r,{modelValue:s.disabledSelected2,"onUpdate:modelValue":l[3]||(l[3]=i=>s.disabledSelected2=i),size:4,"aria-label":"Compact...","with-bottom-value":"","show-search":!0,"bottom-value":{id:s.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],compact:""},null,8,["modelValue","bottom-value"])])]),ue,t("div",me,[t("div",he,[m(r,{modelValue:s.withMissing,"onUpdate:modelValue":l[4]||(l[4]=i=>s.withMissing=i),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),t("div",be,"selected ids: "+v(s.withMissing),1)])]),t("section",null,[t("div",ve,[t("div",fe,[m(h,{summary:"Show usage example"},{default:g(()=>[p(v(s.codeExample),1)]),_:1}),m(h,{summary:"Show SearchableList.vue source code"},{default:g(()=>[p(v(c.code),1)]),_:1})])])])])}const we=w(K,[["render",Se]]);export{we as default};
