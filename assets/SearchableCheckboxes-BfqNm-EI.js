import{C as L}from"./CodeExample-BbryfRhw.js";import{aZ as k,j as B,U as u,$ as y,_ as C,r as f,o as v,c as _,b as t,l as F,w as g,d as h,m as p,t as x,y as E,ah as M,n as T,h as U,e as V}from"./index-CD8KxWJ5.js";import{u as N}from"./useSearch-BchrWsz2.js";import{C as A}from"./Checkboxes-D7_y5JE-.js";import{L as H}from"./Label-CYVmAyqu.js";import{c as O}from"./createMissingItem-PGCdVBns.js";import{u as P}from"./useLabelInfo-BWbGcw3N.js";import"./Checkbox-D7JgulVQ.js";const z=5,D=28,R={name:"SearchableCheckboxes",components:{Label:H,SearchInput:k,Checkboxes:A},props:{possibleValues:{type:Array,default:()=>{},validator(e){return Array.isArray(e)?e.every(a=>a.hasOwnProperty("id")&&a.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>[]},disabled:{type:Boolean,default:!1},withSearchLabel:{default:!1,type:Boolean},id:{type:String,default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},size:{type:Number,default:5,validator(e){return e>=0}},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},emptyStateLabel:{type:String,default:"No entries in this list"},initialSearchTerm:{type:String,required:!1,default:""},showEmptyState:{default:!0,type:Boolean},isValid:{default:!0,type:Boolean},emptyStateComponent:{default:null,type:Object},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const a=B(e.initialSearchTerm),s=B(e.initialCaseSensitiveSearch),r=u(()=>Object.assign({},...e.possibleValues.map((i,d)=>({[i.id]:{item:i,index:d}})))),o=u(()=>e.possibleValues.map(i=>{var d;return(d=r.value[i.id])==null?void 0:d.item})),l=u(()=>{var i;return e.modelValue?(i=e.modelValue)==null?void 0:i.filter(d=>!r.value[d]):[]}),c=u(()=>{var i;return(i=l.value)==null?void 0:i.map(d=>O(d))}),m=u(()=>e.modelValue===null?[]:[...c.value,...o.value]),n=N(a,s,m,y(e,"showSearch")),b=u(()=>n.value.length===0?[]:n.value.filter(i=>m.value.includes(i))),S=u(()=>e.showSearch&&a.value!==""),I=u(()=>b.value.filter(d=>d.text.toLowerCase().includes(a.value.toLowerCase()))),w=u(()=>{var i,d;return e.showSearch?S.value?P(I,o.value.length,y(e.modelValue??[])):`[ ${(d=e.modelValue)==null?void 0:d.length} selected ]`:`[ ${(i=e.modelValue)==null?void 0:i.length} selected ]`});return{searchTerm:a,visibleValues:m,concatenatedItems:b,caseSensitiveSearch:s,numLabelInfos:w,matchingInvalidValueIds:c,allItems:n}},computed:{withIsEmptyState(){return this.concatenatedItems.length===0},listSize(){if(this.possibleValues.length>=z){const e=this.size===0?this.possibleValues.length:this.size;return e>z?e:z}return this.size},cssStyleSize(){const e=`${this.listSize*D+2}px`;return this.listSize>0?{height:e}:{}},returnContainerRef(){return this.$refs.div},alignmentCheck(){return this.alignment==="vertical"?this.cssStyleSize:{height:"auto"}}},methods:{onSearchInput(e){this.searchTerm=e},onChange(e){this.$emit("update:modelValue",e)},hasSelection(){var e;return(((e=this.modelValue)==null?void 0:e.length)??0)>0},handleMouseIn(){!this.disabled&&this.size>=z&&(this.returnContainerRef.style.overflow="auto")},handleMouseLeave(){this.returnContainerRef.style.overflow="hidden"},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},q={class:"checkboxes-wrapper"},Z={class:"header"},j={class:"title"},X={key:0,class:"info"},G={key:0,class:"empty-state"};function J(e,a,s,r,o,l){const c=f("SearchInput"),m=f("Label"),n=f("Checkboxes");return v(),_("div",null,[t("div",q,[s.showSearch?(v(),F(m,{key:0,active:s.withSearchLabel,text:s.searchLabel,class:"search-wrapper"},{default:g(({labelForId:b})=>[h(c,{id:b,ref:"search",placeholder:s.searchPlaceholder,"model-value":r.searchTerm,label:s.searchLabel,"initial-case-sensitive-search":s.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:s.disabled,compact:s.compact,"onUpdate:modelValue":l.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=S=>r.caseSensitiveSearch=S)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):p("",!0),t("div",Z,[t("div",j,[r.numLabelInfos?(v(),_("div",X,x(r.numLabelInfos),1)):p("",!0)])])]),t("div",{ref:"div",class:T(["container",{disabled:s.disabled,"empty-box":l.withIsEmptyState}]),style:U([l.alignmentCheck,l.cssStyleSize]),onMouseenter:a[1]||(a[1]=(...b)=>l.handleMouseIn&&l.handleMouseIn(...b)),onMouseleave:a[2]||(a[2]=(...b)=>l.handleMouseLeave&&l.handleMouseLeave(...b))},[E(h(n,{ref:"form","empty-state-label":s.emptyStateLabel,"empty-state-component":s.emptyStateComponent,"model-value":s.modelValue,alignment:s.alignment,"possible-values":r.concatenatedItems,"is-valid":s.isValid,disabled:s.disabled,"onUpdate:modelValue":l.onChange},null,8,["empty-state-label","empty-state-component","model-value","alignment","possible-values","is-valid","disabled","onUpdate:modelValue"]),[[M,!l.withIsEmptyState]]),!r.concatenatedItems.length&&l.withIsEmptyState?(v(),_("div",G,[t("span",null,x(s.emptyStateLabel),1)])):p("",!0)],38)])}const K=C(R,[["render",J],["__scopeId","data-v-1c598773"]]),Q="",W=`<SearchableCheckboxes
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

/>`,Y={components:{CodeExample:L,SearchableCheckboxes:K},data(){return{codeExample:W,selectedHorizontal:["bar","baz"],selectedVertical:[],missingValues:["bar","I am a missing Value"]}},computed:{code(){return Q}}},$=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Checkboxes with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),ee={class:"grid-container"},te={class:"grid-item-5"},ae=t("span",null,"Horizontal",-1),se={class:"grid-item-2"},ie=t("br",null,null,-1),le={class:"grid-container"},oe={class:"grid-item-5"},de=t("span",null,"Vertical",-1),ne={class:"grid-item-2"},re=t("br",null,null,-1),ce={class:"grid-container"},ue={class:"grid-item-5"},he=t("span",null,"Disabled",-1),me=t("br",null,null,-1),be={class:"grid-container"},xe={class:"grid-item-5"},ve=t("span",null,"It can has missing values",-1),fe={class:"grid-item-2"},ze=t("br",null,null,-1),_e={class:"grid-container"},Se={class:"grid-item-5"},pe=t("span",null,"Compact",-1),ge={class:"grid-container"},Be={class:"grid-item-12"};function ye(e,a,s,r,o,l){const c=f("SearchableCheckboxes",!0),m=f("CodeExample");return v(),_("div",null,[t("section",null,[$,t("div",ee,[t("div",te,[ae,h(c,{modelValue:o.selectedHorizontal,"onUpdate:modelValue":a[0]||(a[0]=n=>o.selectedHorizontal=n),"show-search":!0,"possible-values":[{id:"foo 1",text:"Foo 1"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"foo 2",text:"Foo 2"},{id:"bar 2",text:"Bar 2"},{id:"baz 2",text:"Baz 2"},{id:"foo 3",text:"Foo 3"},{id:"bar 3",text:"Bar 3"},{id:"baz 3",text:"Baz 3"},{id:"foo 4",text:"Foo 4"},{id:"bar 4",text:"Bar 4"},{id:"baz 4",text:"Baz 4"},{id:"foo 5",text:"Foo 5"},{id:"bar 5",text:"Bar 5"},{id:"baz 5",text:"Baz 5"},{id:"foo 6",text:"Foo 6"},{id:"bar 6",text:"Bar 6"},{id:"baz 6",text:"Baz 6"},{id:"foo 7",text:"Foo 7"},{id:"bar 7",text:"Bar 7"},{id:"baz 7",text:"Baz 7"},{id:"foo 8",text:"Foo 8"},{id:"bar 8",text:"Bar 8"},{id:"baz 8",text:"Baz 8"},{id:"foo 9",text:"Foo 9"},{id:"bar 9",text:"Bar 9"},{id:"baz 9",text:"Baz 9"},{id:"foo 10",text:"Foo 10"},{id:"bar 10",text:"Bar 10"},{id:"baz 10",text:"Baz 10"},{id:"foo 11",text:"Foo 11"},{id:"bar 11",text:"Bar 11"},{id:"baz 11",text:"Baz 11"},{id:"foo 12",text:"Foo 12"},{id:"bar 12",text:"Bar 12"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",se,"selected ids: "+x(o.selectedHorizontal),1)]),ie,t("div",le,[t("div",oe,[de,h(c,{modelValue:o.selectedVertical,"onUpdate:modelValue":a[1]||(a[1]=n=>o.selectedVertical=n),alignment:"vertical","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz 1",text:"Baz 1"},{id:"baz 2",text:"Baz 2"},{id:"baz 3",text:"Baz 3"},{id:"baz 4",text:"Baz 4"},{id:"baz 5",text:"Baz 6"},{id:"baz 6",text:"Baz 6"},{id:"baz 7",text:"Baz 7"},{id:"baz 8",text:"Baz 8"},{id:"baz 9",text:"Baz 9"},{id:"baz 10",text:"Baz 10"},{id:"baz 11",text:"Baz 11"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",ne,"selected ids: "+x(o.selectedVertical),1)]),re,t("div",ce,[t("div",ue,[he,h(c,{"model-value":[],disabled:!0,"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])]),me,t("div",be,[t("div",xe,[ve,h(c,{modelValue:o.missingValues,"onUpdate:modelValue":a[2]||(a[2]=n=>o.missingValues=n),"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),t("div",fe,"selected ids: "+x(o.missingValues),1)]),ze,t("div",_e,[t("div",Se,[pe,h(c,{"model-value":[],disabled:!0,"show-search":!0,size:3,compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])])]),t("section",null,[t("div",ge,[t("div",Be,[h(m,{summary:"Show usage example"},{default:g(()=>[V(x(o.codeExample),1)]),_:1}),h(m,{summary:"Show SearchableCheckboxes.vue source code"},{default:g(()=>[V(x(l.code),1)]),_:1})])])])])}const Me=C(Y,[["render",ye]]);export{Me as default};
