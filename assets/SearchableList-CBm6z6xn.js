import{C}from"./CodeExample-D5JV_nn3.js";import{aZ as M,j as y,U as c,$ as V,_ as L,r as f,o as z,c as p,l as U,w as _,d as u,m as B,b as t,t as v,e as S,a as k}from"./index-f-h5UuUy.js";import{u as T}from"./useSearch-BGeoWMSF.js";import{L as E}from"./Label-DKyu-lTK.js";import{M as F}from"./MultiselectListBox-DbrjOkA2.js";import{c as N}from"./createMissingItem-PGCdVBns.js";import{u as O}from"./useLabelInfo-BAor1DXD.js";import"./StyledListItem-BEVhqRCP.js";const w=5,A={name:"SearchableList",components:{MultiselectListBox:F,Label:E,SearchInput:M},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(e){return e>=0}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>[]},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},unknownValuesText:{type:String,required:!1,default:"Unknown values"},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const s=y(e.initialSearchTerm),a=y(e.initialCaseSensitiveSearch),n=c(()=>Object.assign({},...e.possibleValues.map((i,d)=>({[i.id]:{item:i,index:d}})))),l=c(()=>e.possibleValues.map(i=>{var d;return(d=n.value[i.id])==null?void 0:d.item})),m=c(()=>{var i;return e.modelValue?(i=e.modelValue)==null?void 0:i.filter(d=>!n.value[d]):[]}),r=c(()=>{var i;return(i=m.value)==null?void 0:i.map(d=>N(d))}),b=c(()=>e.modelValue===null?[]:[...r.value,...l.value]),o=T(s,a,b,V(e,"showSearch")),h=c(()=>o.value.length===0?[]:o.value.filter(i=>b.value.includes(i))),x=c(()=>e.showSearch&&s.value!==""),g=c(()=>h.value.filter(d=>d.text.toLowerCase().includes(s.value.toLowerCase()))),I=c(()=>{var i,d;return e.showSearch?x.value?O(g,l.value.length,V(e.modelValue??[])):`[ ${(d=e.modelValue)==null?void 0:d.length} selected ]`:`[ ${(i=e.modelValue)==null?void 0:i.length} selected ]`});return{concatenatedItems:h,visibleValues:b,searchTerm:s,matchingValidIds:l,caseSensitiveSearch:a,invalidValueIds:m,matchingInvalidValueIds:r,numLabelInfos:I,numMatchedSearchedItems:g,possibleValueMap:n}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>w?e:w}},methods:{hasSelection(){var e;return(((e=this.modelValue)==null?void 0:e.length)??0)>0},onChange(e){this.$emit("update:modelValue",e)},onSearchInput(e){this.searchTerm=e},validate(){let e=!this.concatenatedItems.some(s=>s.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},D={class:"header"},P={class:"title"},q={key:0,class:"info"};function j(e,s,a,n,l,m){const r=f("SearchInput"),b=f("Label"),o=f("MultiselectListBox");return z(),p("div",null,[a.showSearch?(z(),U(b,{key:0,active:a.withSearchLabel,text:a.searchLabel,class:"search-wrapper"},{default:_(({labelForId:h})=>[u(r,{id:h,ref:"search",placeholder:a.searchPlaceholder,"model-value":n.searchTerm,label:a.searchLabel,"initial-case-sensitive-search":a.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:a.disabled,compact:a.compact,"onUpdate:modelValue":m.onSearchInput,onToggleCaseSensitiveSearch:s[0]||(s[0]=x=>n.caseSensitiveSearch=x)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):B("",!0),t("div",D,[t("div",P,[n.numLabelInfos?(z(),p("div",q,v(n.numLabelInfos),1)):B("",!0)])]),u(o,{id:a.id,ref:"form",ariaLabel:a.ariaLabel,"with-is-empty-state":a.showEmptyState,"empty-state-label":a.emptyStateLabel,"empty-state-component":a.emptyStateComponent,size:m.listSize,"possible-values":n.concatenatedItems,"model-value":a.modelValue,"is-valid":a.isValid,"with-bottom-value":a.withBottomValue,"bottom-value":a.bottomValue,disabled:a.disabled,"onUpdate:modelValue":m.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])])}const Z=L(A,[["render",j],["__scopeId","data-v-a7a012f9"]]),H="",R=`<SearchableList
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
`,G={components:{SearchableList:Z,CodeExample:C},data(){return{codeExample:R,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return H}}},J=k('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),K={class:"grid-container"},Q={class:"grid-item-6"},W={class:"grid-item-6"},X=t("br",null,null,-1),Y=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),$=t("br",null,null,-1),ee={class:"grid-container"},te={class:"grid-item-6"},ae={class:"grid-item-6"},le=t("br",null,null,-1),se={class:"grid-container"},ie={class:"grid-item-6"},oe=t("br",null,null,-1),de={class:"grid-container"},ne={class:"grid-item-6"},re=t("br",null,null,-1),ce={class:"grid-container"},ue={class:"grid-item-6"},me={class:"grid-item-6"},be={class:"grid-container"},he={class:"grid-item-12"};function ve(e,s,a,n,l,m){const r=f("SearchableList",!0),b=f("CodeExample");return z(),p("div",null,[t("section",null,[J,t("div",K,[t("div",Q,[u(r,{modelValue:l.selected,"onUpdate:modelValue":s[0]||(s[0]=o=>l.selected=o),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(o,h)=>({id:`baz${h}`,text:`Baz ${h}`}))]},null,8,["modelValue","possible-values"])]),t("div",W,"selected ids: "+v(l.selected),1)]),X,Y,$,t("div",ee,[t("div",te,[u(r,{modelValue:l.selected2,"onUpdate:modelValue":s[1]||(s[1]=o=>l.selected2=o),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:l.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),t("div",ae,"selected ids: "+v(l.selected2),1)]),le,S(" Disabled "),t("div",se,[t("div",ie,[u(r,{modelValue:l.disabledSelected2,"onUpdate:modelValue":s[2]||(s[2]=o=>l.disabledSelected2=o),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:l.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),oe,S(" Compact "),t("div",de,[t("div",ne,[u(r,{modelValue:l.disabledSelected2,"onUpdate:modelValue":s[3]||(s[3]=o=>l.disabledSelected2=o),size:4,"aria-label":"Compact...","with-bottom-value":"","show-search":!0,"bottom-value":{id:l.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],compact:""},null,8,["modelValue","bottom-value"])])]),re,t("div",ce,[t("div",ue,[u(r,{modelValue:l.withMissing,"onUpdate:modelValue":s[4]||(s[4]=o=>l.withMissing=o),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),t("div",me,"selected ids: "+v(l.withMissing),1)])]),t("section",null,[t("div",be,[t("div",he,[u(b,{summary:"Show usage example"},{default:_(()=>[S(v(l.codeExample),1)]),_:1}),u(b,{summary:"Show SearchableList.vue source code"},{default:_(()=>[S(v(m.code),1)]),_:1})])])])])}const Ve=L(G,[["render",ve]]);export{Ve as default};
