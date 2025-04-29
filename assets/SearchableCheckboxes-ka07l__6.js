import{C as k}from"./CodeExample-DbSxdUj1.js";import{aY as L,i as y,R as u,Y as V,_ as C,r as f,o as v,c as S,b as a,k as F,w as B,d as m,l as p,t as x,v as E,af as M,n as T,g as N,e as _}from"./index-CHQARVD7.js";import{u as U}from"./useSearch-zCGPiFVw.js";import{C as A}from"./Checkboxes-CLJNJ196.js";import{L as H}from"./Label-D6rijDzx.js";import{c as O}from"./createMissingItem-PGCdVBns.js";import{u as P}from"./useLabelInfo-dHjk5sD5.js";import"./Checkbox-BV3ejMJy.js";const z=5,R=28,D={name:"SearchableCheckboxes",components:{Label:H,SearchInput:L,Checkboxes:A},props:{possibleValues:{type:Array,default:()=>{},validator(t){return Array.isArray(t)?t.every(e=>e.hasOwnProperty("id")&&e.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>[]},disabled:{type:Boolean,default:!1},withSearchLabel:{default:!1,type:Boolean},id:{type:String,default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},size:{type:Number,default:5,validator(t){return t>=0}},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},alignment:{type:String,default:"horizontal",validator(t){return["horizontal","vertical"].includes(t)}},emptyStateLabel:{type:String,default:"No entries in this list"},initialSearchTerm:{type:String,required:!1,default:""},showEmptyState:{default:!0,type:Boolean},isValid:{default:!0,type:Boolean},emptyStateComponent:{default:null,type:Object},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(t){const e=y(t.initialSearchTerm),s=y(t.initialCaseSensitiveSearch),r=u(()=>Object.assign({},...t.possibleValues.map((l,n)=>({[l.id]:{item:l,index:n}})))),o=u(()=>t.possibleValues.map(l=>{var n;return(n=r.value[l.id])==null?void 0:n.item})),i=u(()=>{var l;return t.modelValue?(l=t.modelValue)==null?void 0:l.filter(n=>!r.value[n]):[]}),c=u(()=>{var l;return(l=i.value)==null?void 0:l.map(n=>O(n))}),h=u(()=>t.modelValue===null?[]:[...c.value,...o.value]),d=U(e,s,h,V(t,"showSearch")),b=u(()=>d.value.length===0?[]:d.value.filter(l=>h.value.includes(l))),g=u(()=>t.showSearch&&e.value!==""),I=u(()=>b.value.filter(n=>n.text.toLowerCase().includes(e.value.toLowerCase()))),w=u(()=>{var l,n;return t.showSearch?g.value?P(I,o.value.length,V(t.modelValue??[])):`[ ${(n=t.modelValue)==null?void 0:n.length} selected ]`:`[ ${(l=t.modelValue)==null?void 0:l.length} selected ]`});return{searchTerm:e,visibleValues:h,concatenatedItems:b,caseSensitiveSearch:s,numLabelInfos:w,matchingInvalidValueIds:c,allItems:d}},computed:{withIsEmptyState(){return this.concatenatedItems.length===0},listSize(){if(this.possibleValues.length>=z){const t=this.size===0?this.possibleValues.length:this.size;return t>z?t:z}return this.size},cssStyleSize(){const t=`${this.listSize*R+2}px`;return this.listSize>0?{height:t}:{}},returnContainerRef(){return this.$refs.div},alignmentCheck(){return this.alignment==="vertical"?this.cssStyleSize:{height:"auto"}}},methods:{onSearchInput(t){this.searchTerm=t},onChange(t){this.$emit("update:modelValue",t)},hasSelection(){var t;return(((t=this.modelValue)==null?void 0:t.length)??0)>0},handleMouseIn(){!this.disabled&&this.size>=z&&(this.returnContainerRef.style.overflow="auto")},handleMouseLeave(){this.returnContainerRef.style.overflow="hidden"},validate(){const t=!this.concatenatedItems.some(e=>e.invalid);return{isValid:t,errorMessage:t?null:"One or more of the selected items is invalid."}}}},q={class:"checkboxes-wrapper"},Y={class:"header"},Z={class:"title"},j={key:0,class:"info"},X={key:0,class:"empty-state"};function G(t,e,s,r,o,i){const c=f("SearchInput"),h=f("Label"),d=f("Checkboxes");return v(),S("div",null,[a("div",q,[s.showSearch?(v(),F(h,{key:0,active:s.withSearchLabel,text:s.searchLabel,class:"search-wrapper"},{default:B(({labelForId:b})=>[m(c,{id:b,ref:"search",placeholder:s.searchPlaceholder,"model-value":r.searchTerm,label:s.searchLabel,"initial-case-sensitive-search":s.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:s.disabled,compact:s.compact,"onUpdate:modelValue":i.onSearchInput,onToggleCaseSensitiveSearch:e[0]||(e[0]=g=>r.caseSensitiveSearch=g)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):p("",!0),a("div",Y,[a("div",Z,[r.numLabelInfos?(v(),S("div",j,x(r.numLabelInfos),1)):p("",!0)])])]),a("div",{ref:"div",class:T(["container",{disabled:s.disabled,"empty-box":i.withIsEmptyState}]),style:N([i.alignmentCheck,i.cssStyleSize]),onMouseenter:e[1]||(e[1]=(...b)=>i.handleMouseIn&&i.handleMouseIn(...b)),onMouseleave:e[2]||(e[2]=(...b)=>i.handleMouseLeave&&i.handleMouseLeave(...b))},[E(m(d,{ref:"form","empty-state-label":s.emptyStateLabel,"empty-state-component":s.emptyStateComponent,"model-value":s.modelValue,alignment:s.alignment,"possible-values":r.concatenatedItems,"is-valid":s.isValid,disabled:s.disabled,"onUpdate:modelValue":i.onChange},null,8,["empty-state-label","empty-state-component","model-value","alignment","possible-values","is-valid","disabled","onUpdate:modelValue"]),[[M,!i.withIsEmptyState]]),!r.concatenatedItems.length&&i.withIsEmptyState?(v(),S("div",X,[a("span",null,x(s.emptyStateLabel),1)])):p("",!0)],38)])}const J=C(D,[["render",G],["__scopeId","data-v-a352b922"]]),K="",Q=`<SearchableCheckboxes
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

/>`,W={components:{CodeExample:k,SearchableCheckboxes:J},data(){return{codeExample:Q,selectedHorizontal:["bar","baz"],selectedVertical:[],missingValues:["bar","I am a missing Value"]}},computed:{code(){return K}}},$={class:"grid-container"},ee={class:"grid-item-5"},te={class:"grid-item-2"},ae={class:"grid-container"},se={class:"grid-item-5"},le={class:"grid-item-2"},ie={class:"grid-container"},oe={class:"grid-item-5"},ne={class:"grid-container"},de={class:"grid-item-5"},re={class:"grid-item-2"},ce={class:"grid-container"},ue={class:"grid-item-5"},me={class:"grid-container"},he={class:"grid-item-12"};function be(t,e,s,r,o,i){const c=f("SearchableCheckboxes",!0),h=f("CodeExample");return v(),S("div",null,[a("section",null,[e[8]||(e[8]=a("div",{class:"grid-container"},[a("div",{class:"grid-item-12"},[a("p",null," Checkboxes with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1)),a("div",$,[a("div",ee,[e[3]||(e[3]=a("span",null,"Horizontal",-1)),m(c,{modelValue:o.selectedHorizontal,"onUpdate:modelValue":e[0]||(e[0]=d=>o.selectedHorizontal=d),"show-search":!0,"possible-values":[{id:"foo 1",text:"Foo 1"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"foo 2",text:"Foo 2"},{id:"bar 2",text:"Bar 2"},{id:"baz 2",text:"Baz 2"},{id:"foo 3",text:"Foo 3"},{id:"bar 3",text:"Bar 3"},{id:"baz 3",text:"Baz 3"},{id:"foo 4",text:"Foo 4"},{id:"bar 4",text:"Bar 4"},{id:"baz 4",text:"Baz 4"},{id:"foo 5",text:"Foo 5"},{id:"bar 5",text:"Bar 5"},{id:"baz 5",text:"Baz 5"},{id:"foo 6",text:"Foo 6"},{id:"bar 6",text:"Bar 6"},{id:"baz 6",text:"Baz 6"},{id:"foo 7",text:"Foo 7"},{id:"bar 7",text:"Bar 7"},{id:"baz 7",text:"Baz 7"},{id:"foo 8",text:"Foo 8"},{id:"bar 8",text:"Bar 8"},{id:"baz 8",text:"Baz 8"},{id:"foo 9",text:"Foo 9"},{id:"bar 9",text:"Bar 9"},{id:"baz 9",text:"Baz 9"},{id:"foo 10",text:"Foo 10"},{id:"bar 10",text:"Bar 10"},{id:"baz 10",text:"Baz 10"},{id:"foo 11",text:"Foo 11"},{id:"bar 11",text:"Bar 11"},{id:"baz 11",text:"Baz 11"},{id:"foo 12",text:"Foo 12"},{id:"bar 12",text:"Bar 12"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),a("div",te,"selected ids: "+x(o.selectedHorizontal),1)]),e[9]||(e[9]=a("br",null,null,-1)),a("div",ae,[a("div",se,[e[4]||(e[4]=a("span",null,"Vertical",-1)),m(c,{modelValue:o.selectedVertical,"onUpdate:modelValue":e[1]||(e[1]=d=>o.selectedVertical=d),alignment:"vertical","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz 1",text:"Baz 1"},{id:"baz 2",text:"Baz 2"},{id:"baz 3",text:"Baz 3"},{id:"baz 4",text:"Baz 4"},{id:"baz 5",text:"Baz 6"},{id:"baz 6",text:"Baz 6"},{id:"baz 7",text:"Baz 7"},{id:"baz 8",text:"Baz 8"},{id:"baz 9",text:"Baz 9"},{id:"baz 10",text:"Baz 10"},{id:"baz 11",text:"Baz 11"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),a("div",le,"selected ids: "+x(o.selectedVertical),1)]),e[10]||(e[10]=a("br",null,null,-1)),a("div",ie,[a("div",oe,[e[5]||(e[5]=a("span",null,"Disabled",-1)),m(c,{"model-value":[],disabled:!0,"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])]),e[11]||(e[11]=a("br",null,null,-1)),a("div",ne,[a("div",de,[e[6]||(e[6]=a("span",null,"It can has missing values",-1)),m(c,{modelValue:o.missingValues,"onUpdate:modelValue":e[2]||(e[2]=d=>o.missingValues=d),"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),a("div",re,"selected ids: "+x(o.missingValues),1)]),e[12]||(e[12]=a("br",null,null,-1)),a("div",ce,[a("div",ue,[e[7]||(e[7]=a("span",null,"Compact",-1)),m(c,{"model-value":[],disabled:!0,"show-search":!0,size:3,compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])])]),a("section",null,[a("div",me,[a("div",he,[m(h,{summary:"Show usage example"},{default:B(()=>[_(x(o.codeExample),1)]),_:1}),m(h,{summary:"Show SearchableCheckboxes.vue source code"},{default:B(()=>[_(x(i.code),1)]),_:1})])])])])}const ye=C(W,[["render",be]]);export{ye as default};
