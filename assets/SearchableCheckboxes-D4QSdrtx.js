import{C as L}from"./CodeExample-CRVpy_lk.js";import{aw as k,R as p,X as c,_ as V,r as f,o as x,c as S,b as t,j as F,w as B,d as m,l as g,t as v,E,a3 as M,n as T,h as N,F as U,e as y}from"./index-1E1C3O_a.js";import{L as O}from"./Label-BDyWpAia.js";import{C as P}from"./Checkboxes-CQ1okY4J.js";import{c as A}from"./createMissingItem-PGCdVBns.js";import{u as H,a as q}from"./useSearch-TXevmWXA.js";import"./Checkbox-BwYxANut.js";const _=5,D=28,R={name:"SearchableCheckboxes",components:{Label:O,SearchInput:k,Checkboxes:P},props:{possibleValues:{type:Array,default:()=>{},validator(e){return Array.isArray(e)?e.every(a=>a.hasOwnProperty("id")&&a.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>{}},disabled:{type:Boolean,default:!1},withSearchLabel:{default:!1,type:Boolean},id:{type:String,default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},size:{type:Number,default:5,validator(e){return e>=0}},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},emptyStateLabel:{type:String,default:"No entries in this list"},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},initialSearchTerm:{type:String,required:!1,default:""},showEmptyState:{default:!0,type:Boolean},isValid:{default:!0,type:Boolean},emptyStateComponent:{default:null,type:Object},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const a=p(e.modelValue),s=p(e.initialSearchTerm),r=p(e.initialCaseSensitiveSearch),o=c(()=>Object.assign({},...e.possibleValues.map((i,n)=>({[i.id]:{item:i,index:n}})))),l=c(()=>e.possibleValues.map(i=>{var n;return(n=o.value[i.id])==null?void 0:n.item})),u=c(()=>{var i;return a.value?(i=a.value)==null?void 0:i.filter(n=>!o.value[n]):[]}),b=c(()=>{var i;return(i=u.value)==null?void 0:i.map(n=>A(n))}),d=c(()=>a.value===null?[]:[...b.value,...l.value]),h=c(()=>e.showSearch?H(s,r,d):d.value),z=c(()=>h.value.length===0?[]:h.value.filter(i=>d.value.includes(i))),C=c(()=>e.showSearch&&s.value!==""),I=c(()=>z.value.filter(n=>n.text.toLowerCase().includes(s.value.toLowerCase()))),w=c(()=>{var i,n;return e.showSearch?C.value?q(I,l.value.length,a):`[ ${(n=a.value)==null?void 0:n.length} selected ]`:`[ ${(i=a.value)==null?void 0:i.length} selected ]`});return{selectedValues:a,searchTerm:s,visibleValues:d,concatenatedItems:z,caseSensitiveSearch:r,numLabelInfos:w,matchingInvalidValueIds:b,allItems:h}},computed:{withIsEmptyState(){return this.concatenatedItems.length===0},listSize(){if(this.possibleValues.length>=_){const e=this.size===0?this.possibleValues.length:this.size;return e>_?e:_}return this.size},cssStyleSize(){const e=`${this.listSize*D+2}px`;return this.listSize>0?{height:e}:{}},returnContainerRef(){return this.$refs.div},allignmentCheck(){return this.alignment==="vertical"?this.cssStyleSize:{height:"auto"}}},methods:{onSearchInput(e){this.searchTerm=e},onChange(e){this.$emit("update:modelValue",e),this.selectedValues=e},hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},handleMouseIn(){!this.disabled&&this.size>=_&&(this.returnContainerRef.style.overflow="auto")},handleMouseLeave(){this.returnContainerRef.style.overflow="hidden"},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},j={class:"checkboxes-wrapper"},X={class:"header"},Z={class:"title"},G={key:0,class:"info"},J={key:0,class:"empty-state"};function K(e,a,s,r,o,l){const u=f("SearchInput"),b=f("Label"),d=f("Checkboxes");return x(),S(U,null,[t("div",j,[s.showSearch?(x(),F(b,{key:0,active:s.withSearchLabel,text:s.searchLabel,class:"search-wrapper"},{default:B(({labelForId:h})=>[m(u,{id:h,ref:"search",placeholder:s.searchPlaceholder,"model-value":r.searchTerm,label:s.searchLabel,"initial-case-sensitive-search":s.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:s.disabled,compact:s.compact,"onUpdate:modelValue":l.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=z=>r.caseSensitiveSearch=z)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):g("",!0),t("div",X,[t("div",Z,[r.numLabelInfos?(x(),S("div",G,v(r.numLabelInfos),1)):g("",!0)])])]),t("div",{ref:"div",class:T(["container",{disabled:s.disabled,"empty-box":l.withIsEmptyState}]),style:N([l.allignmentCheck,l.cssStyleSize]),onMouseenter:a[1]||(a[1]=(...h)=>l.handleMouseIn&&l.handleMouseIn(...h)),onMouseleave:a[2]||(a[2]=(...h)=>l.handleMouseLeave&&l.handleMouseLeave(...h))},[E(m(d,{ref:"form","empty-state-label":s.emptyStateLabel,"empty-state-component":s.emptyStateComponent,"model-value":s.modelValue,alignment:s.alignment,"possible-values":r.concatenatedItems,"is-valid":s.isValid,disabled:s.disabled,"onUpdate:modelValue":l.onChange},null,8,["empty-state-label","empty-state-component","model-value","alignment","possible-values","is-valid","disabled","onUpdate:modelValue"]),[[M,!l.withIsEmptyState]]),!r.concatenatedItems.length&&l.withIsEmptyState?(x(),S("div",J,[t("span",null,v(s.emptyStateLabel),1)])):g("",!0)],38)],64)}const Q=V(R,[["render",K],["__scopeId","data-v-3bff9ce7"]]),W="",Y=`<SearchableCheckboxes
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

/>`,$={components:{CodeExample:L,SearchableCheckboxes:Q},data(){return{codeExample:Y,selectedHorizontal:["bar","baz"],selectedVertical:[],missingValues:["bar","I am a missing Value"]}},computed:{code(){return W}}},ee=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Checkboxes with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),te={class:"grid-container"},ae={class:"grid-item-5"},se=t("span",null,"Horizontal",-1),le={class:"grid-item-2"},ie=t("br",null,null,-1),oe={class:"grid-container"},ne={class:"grid-item-5"},de=t("span",null,"Vertical",-1),re={class:"grid-item-2"},ce=t("br",null,null,-1),ue={class:"grid-container"},he={class:"grid-item-5"},me=t("span",null,"Disabled",-1),be=t("br",null,null,-1),ve={class:"grid-container"},xe={class:"grid-item-5"},fe=t("span",null,"It can has missing values",-1),ze={class:"grid-item-2"},_e=t("br",null,null,-1),Se={class:"grid-container"},pe={class:"grid-item-5"},ge=t("span",null,"Compact",-1),Be={class:"grid-container"},ye={class:"grid-item-12"};function Ve(e,a,s,r,o,l){const u=f("SearchableCheckboxes",!0),b=f("CodeExample");return x(),S("div",null,[t("section",null,[ee,t("div",te,[t("div",ae,[se,m(u,{modelValue:o.selectedHorizontal,"onUpdate:modelValue":a[0]||(a[0]=d=>o.selectedHorizontal=d),"show-search":!0,"possible-values":[{id:"foo 1",text:"Foo 1"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"foo 2",text:"Foo 2"},{id:"bar 2",text:"Bar 2"},{id:"baz 2",text:"Baz 2"},{id:"foo 3",text:"Foo 3"},{id:"bar 3",text:"Bar 3"},{id:"baz 3",text:"Baz 3"},{id:"foo 4",text:"Foo 4"},{id:"bar 4",text:"Bar 4"},{id:"baz 4",text:"Baz 4"},{id:"foo 5",text:"Foo 5"},{id:"bar 5",text:"Bar 5"},{id:"baz 5",text:"Baz 5"},{id:"foo 6",text:"Foo 6"},{id:"bar 6",text:"Bar 6"},{id:"baz 6",text:"Baz 6"},{id:"foo 7",text:"Foo 7"},{id:"bar 7",text:"Bar 7"},{id:"baz 7",text:"Baz 7"},{id:"foo 8",text:"Foo 8"},{id:"bar 8",text:"Bar 8"},{id:"baz 8",text:"Baz 8"},{id:"foo 9",text:"Foo 9"},{id:"bar 9",text:"Bar 9"},{id:"baz 9",text:"Baz 9"},{id:"foo 10",text:"Foo 10"},{id:"bar 10",text:"Bar 10"},{id:"baz 10",text:"Baz 10"},{id:"foo 11",text:"Foo 11"},{id:"bar 11",text:"Bar 11"},{id:"baz 11",text:"Baz 11"},{id:"foo 12",text:"Foo 12"},{id:"bar 12",text:"Bar 12"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",le,"selected ids: "+v(o.selectedHorizontal),1)]),ie,t("div",oe,[t("div",ne,[de,m(u,{modelValue:o.selectedVertical,"onUpdate:modelValue":a[1]||(a[1]=d=>o.selectedVertical=d),alignment:"vertical","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz 1",text:"Baz 1"},{id:"baz 2",text:"Baz 2"},{id:"baz 3",text:"Baz 3"},{id:"baz 4",text:"Baz 4"},{id:"baz 5",text:"Baz 6"},{id:"baz 6",text:"Baz 6"},{id:"baz 7",text:"Baz 7"},{id:"baz 8",text:"Baz 8"},{id:"baz 9",text:"Baz 9"},{id:"baz 10",text:"Baz 10"},{id:"baz 11",text:"Baz 11"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",re,"selected ids: "+v(o.selectedVertical),1)]),ce,t("div",ue,[t("div",he,[me,m(u,{"model-value":[],disabled:!0,"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])]),be,t("div",ve,[t("div",xe,[fe,m(u,{modelValue:o.missingValues,"onUpdate:modelValue":a[2]||(a[2]=d=>o.missingValues=d),"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),t("div",ze,"selected ids: "+v(o.missingValues),1)]),_e,t("div",Se,[t("div",pe,[ge,m(u,{"model-value":[],disabled:!0,"show-search":!0,size:3,compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])])]),t("section",null,[t("div",Be,[t("div",ye,[m(b,{summary:"Show usage example"},{default:B(()=>[y(v(o.codeExample),1)]),_:1}),m(b,{summary:"Show SearchableCheckboxes.vue source code"},{default:B(()=>[y(v(l.code),1)]),_:1})])])])])}const Me=V($,[["render",Ve]]);export{Me as default};
