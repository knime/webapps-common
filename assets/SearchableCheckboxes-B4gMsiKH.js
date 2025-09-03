import{C as k}from"./CodeExample-Bj71wWgG.js";import{b9 as L,i as y,K as c,R as V,_ as C,r as v,c as z,o as x,b as a,k as F,l as g,w as B,d as u,t as b,s as E,ad as M,n as T,g as N,e as _}from"./index-VvEFFTOG.js";import{u as U}from"./useSearch-CwWgWim7.js";import{C as A}from"./Checkboxes-UxbHyTn4.js";import{L as H}from"./Label-DnsnoKMU.js";import{c as O}from"./createMissingItem-PGCdVBns.js";import{u as P}from"./useLabelInfo-BTdMvL9y.js";import"./Checkbox-hpBsG4u6.js";import"./v4-BKrj-4V8.js";const f=5,R=28,D={name:"SearchableCheckboxes",components:{Label:H,SearchInput:L,Checkboxes:A},props:{possibleValues:{type:Array,default:()=>{},validator(t){return Array.isArray(t)?t.every(e=>e.hasOwnProperty("id")&&e.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>[]},disabled:{type:Boolean,default:!1},withSearchLabel:{default:!1,type:Boolean},id:{type:String,default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},size:{type:Number,default:5,validator(t){return t>=0}},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},alignment:{type:String,default:"horizontal",validator(t){return["horizontal","vertical"].includes(t)}},emptyStateLabel:{type:String,default:"No entries in this list"},initialSearchTerm:{type:String,required:!1,default:""},showEmptyState:{default:!0,type:Boolean},isValid:{default:!0,type:Boolean},emptyStateComponent:{default:null,type:Object},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(t){const e=y(t.initialSearchTerm),s=y(t.initialCaseSensitiveSearch),n=c(()=>Object.assign({},...t.possibleValues.map((d,p)=>({[d.id]:{item:d,index:p}})))),i=c(()=>t.possibleValues.map(d=>n.value[d.id]?.item)),l=c(()=>t.modelValue?t.modelValue?.filter(d=>!n.value[d]):[]),r=c(()=>l.value?.map(d=>O(d))),m=c(()=>t.modelValue===null?[]:[...r.value,...i.value]),o=U(e,s,m,V(t,"showSearch")),h=c(()=>o.value.length===0?[]:o.value.filter(d=>m.value.includes(d))),S=c(()=>t.showSearch&&e.value!==""),I=c(()=>h.value.filter(p=>p.text.toLowerCase().includes(e.value.toLowerCase()))),w=c(()=>t.showSearch?S.value?P(I,i.value.length,V(t.modelValue??[])):`[ ${t.modelValue?.length} selected ]`:`[ ${t.modelValue?.length} selected ]`);return{searchTerm:e,visibleValues:m,concatenatedItems:h,caseSensitiveSearch:s,numLabelInfos:w,matchingInvalidValueIds:r,allItems:o}},computed:{withIsEmptyState(){return this.concatenatedItems.length===0},listSize(){if(this.possibleValues.length>=f){const t=this.size===0?this.possibleValues.length:this.size;return t>f?t:f}return this.size},cssStyleSize(){const t=`${this.listSize*R+2}px`;return this.listSize>0?{height:t}:{}},returnContainerRef(){return this.$refs.div},alignmentCheck(){return this.alignment==="vertical"?this.cssStyleSize:{height:"auto"}}},methods:{onSearchInput(t){this.searchTerm=t},onChange(t){this.$emit("update:modelValue",t)},hasSelection(){return(this.modelValue?.length??0)>0},handleMouseIn(){!this.disabled&&this.size>=f&&(this.returnContainerRef.style.overflow="auto")},handleMouseLeave(){this.returnContainerRef.style.overflow="hidden"},validate(){const t=!this.concatenatedItems.some(e=>e.invalid);return{isValid:t,errorMessage:t?null:"One or more of the selected items is invalid."}}}},q={class:"checkboxes-wrapper"},Z={class:"header"},j={class:"title"},K={key:0,class:"info"},X={key:0,class:"empty-state"};function G(t,e,s,n,i,l){const r=v("SearchInput"),m=v("Label"),o=v("Checkboxes");return x(),z("div",null,[a("div",q,[s.showSearch?(x(),F(m,{key:0,active:s.withSearchLabel,text:s.searchLabel,class:"search-wrapper"},{default:B(({labelForId:h})=>[u(r,{id:h,ref:"search",placeholder:s.searchPlaceholder,"model-value":n.searchTerm,label:s.searchLabel,"initial-case-sensitive-search":s.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:s.disabled,compact:s.compact,"onUpdate:modelValue":l.onSearchInput,onToggleCaseSensitiveSearch:e[0]||(e[0]=S=>n.caseSensitiveSearch=S)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):g("",!0),a("div",Z,[a("div",j,[n.numLabelInfos?(x(),z("div",K,b(n.numLabelInfos),1)):g("",!0)])])]),a("div",{ref:"div",class:N(["container",{disabled:s.disabled,"empty-box":l.withIsEmptyState}]),style:T([l.alignmentCheck,l.cssStyleSize]),onMouseenter:e[1]||(e[1]=(...h)=>l.handleMouseIn&&l.handleMouseIn(...h)),onMouseleave:e[2]||(e[2]=(...h)=>l.handleMouseLeave&&l.handleMouseLeave(...h))},[E(u(o,{ref:"form","empty-state-label":s.emptyStateLabel,"empty-state-component":s.emptyStateComponent,"model-value":s.modelValue,alignment:s.alignment,"possible-values":n.concatenatedItems,"is-valid":s.isValid,disabled:s.disabled,"onUpdate:modelValue":l.onChange},null,8,["empty-state-label","empty-state-component","model-value","alignment","possible-values","is-valid","disabled","onUpdate:modelValue"]),[[M,!l.withIsEmptyState]]),!n.concatenatedItems.length&&l.withIsEmptyState?(x(),z("div",X,[a("span",null,b(s.emptyStateLabel),1)])):g("",!0)],38)])}const J=C(D,[["render",G],["__scopeId","data-v-a352b922"]]),Q="",W=`<SearchableCheckboxes
  v-model="selected"
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

  <SearchableCheckboxes
            v-model="selected"
            show-search="true"
            placeholder="Select stuff here!"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />

          <SearchableCheckboxes
            v-model="selected"
            :disabled="true"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />

/>`,Y={components:{CodeExample:k,SearchableCheckboxes:J},data(){return{codeExample:W,selectedHorizontal:["bar","baz"],selectedVertical:[],missingValues:["bar","I am a missing Value"]}},computed:{code(){return Q}}},$={class:"grid-container"},ee={class:"grid-item-5"},te={class:"grid-item-2"},ae={class:"grid-container"},se={class:"grid-item-5"},le={class:"grid-item-2"},ie={class:"grid-container"},oe={class:"grid-item-5"},de={class:"grid-container"},ne={class:"grid-item-5"},re={class:"grid-item-2"},ce={class:"grid-container"},ue={class:"grid-item-5"},me={class:"grid-container"},he={class:"grid-item-12"};function be(t,e,s,n,i,l){const r=v("SearchableCheckboxes",!0),m=v("CodeExample");return x(),z("div",null,[a("section",null,[e[8]||(e[8]=a("div",{class:"grid-container"},[a("div",{class:"grid-item-12"},[a("p",null," Checkboxes with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1)),a("div",$,[a("div",ee,[e[3]||(e[3]=a("span",null,"Horizontal",-1)),u(r,{modelValue:i.selectedHorizontal,"onUpdate:modelValue":e[0]||(e[0]=o=>i.selectedHorizontal=o),"show-search":!0,"possible-values":[{id:"foo 1",text:"Foo 1"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"foo 2",text:"Foo 2"},{id:"bar 2",text:"Bar 2"},{id:"baz 2",text:"Baz 2"},{id:"foo 3",text:"Foo 3"},{id:"bar 3",text:"Bar 3"},{id:"baz 3",text:"Baz 3"},{id:"foo 4",text:"Foo 4"},{id:"bar 4",text:"Bar 4"},{id:"baz 4",text:"Baz 4"},{id:"foo 5",text:"Foo 5"},{id:"bar 5",text:"Bar 5"},{id:"baz 5",text:"Baz 5"},{id:"foo 6",text:"Foo 6"},{id:"bar 6",text:"Bar 6"},{id:"baz 6",text:"Baz 6"},{id:"foo 7",text:"Foo 7"},{id:"bar 7",text:"Bar 7"},{id:"baz 7",text:"Baz 7"},{id:"foo 8",text:"Foo 8"},{id:"bar 8",text:"Bar 8"},{id:"baz 8",text:"Baz 8"},{id:"foo 9",text:"Foo 9"},{id:"bar 9",text:"Bar 9"},{id:"baz 9",text:"Baz 9"},{id:"foo 10",text:"Foo 10"},{id:"bar 10",text:"Bar 10"},{id:"baz 10",text:"Baz 10"},{id:"foo 11",text:"Foo 11"},{id:"bar 11",text:"Bar 11"},{id:"baz 11",text:"Baz 11"},{id:"foo 12",text:"Foo 12"},{id:"bar 12",text:"Bar 12"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),a("div",te,"selected ids: "+b(i.selectedHorizontal),1)]),e[9]||(e[9]=a("br",null,null,-1)),a("div",ae,[a("div",se,[e[4]||(e[4]=a("span",null,"Vertical",-1)),u(r,{modelValue:i.selectedVertical,"onUpdate:modelValue":e[1]||(e[1]=o=>i.selectedVertical=o),alignment:"vertical","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz 1",text:"Baz 1"},{id:"baz 2",text:"Baz 2"},{id:"baz 3",text:"Baz 3"},{id:"baz 4",text:"Baz 4"},{id:"baz 5",text:"Baz 6"},{id:"baz 6",text:"Baz 6"},{id:"baz 7",text:"Baz 7"},{id:"baz 8",text:"Baz 8"},{id:"baz 9",text:"Baz 9"},{id:"baz 10",text:"Baz 10"},{id:"baz 11",text:"Baz 11"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),a("div",le,"selected ids: "+b(i.selectedVertical),1)]),e[10]||(e[10]=a("br",null,null,-1)),a("div",ie,[a("div",oe,[e[5]||(e[5]=a("span",null,"Disabled",-1)),u(r,{"model-value":[],disabled:!0,"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])]),e[11]||(e[11]=a("br",null,null,-1)),a("div",de,[a("div",ne,[e[6]||(e[6]=a("span",null,"It can has missing values",-1)),u(r,{modelValue:i.missingValues,"onUpdate:modelValue":e[2]||(e[2]=o=>i.missingValues=o),"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),a("div",re,"selected ids: "+b(i.missingValues),1)]),e[12]||(e[12]=a("br",null,null,-1)),a("div",ce,[a("div",ue,[e[7]||(e[7]=a("span",null,"Compact",-1)),u(r,{"model-value":[],disabled:!0,"show-search":!0,size:3,compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])])]),a("section",null,[a("div",me,[a("div",he,[u(m,{summary:"Show usage example"},{default:B(()=>[_(b(i.codeExample),1)]),_:1}),u(m,{summary:"Show SearchableCheckboxes.vue source code"},{default:B(()=>[_(b(l.code),1)]),_:1})])])])])}const Ve=C(Y,[["render",be]]);export{Ve as default};
