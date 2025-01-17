import{C as k}from"./CodeExample-CCeogOWm.js";import{aU as L,j as p,U as h,$ as F,_ as V,r as f,o as v,c as S,b as t,l as E,w as B,d as m,m as g,t as x,y as M,ak as U,n as T,h as N,F as O,e as y}from"./index-Dj2AlS1B.js";import{u as P}from"./useSearch-DpAcz1xM.js";import{C as A}from"./Checkboxes-CK79mWlX.js";import{L as H}from"./Label-B07OPPTs.js";import{c as q}from"./createMissingItem-PGCdVBns.js";import{u as D}from"./useLabelInfo-qfxVMIiU.js";import"./Checkbox-DzkHQyz3.js";const _=5,R=28,j={name:"SearchableCheckboxes",components:{Label:H,SearchInput:L,Checkboxes:A},props:{possibleValues:{type:Array,default:()=>{},validator(e){return Array.isArray(e)?e.every(a=>a.hasOwnProperty("id")&&a.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>{}},disabled:{type:Boolean,default:!1},withSearchLabel:{default:!1,type:Boolean},id:{type:String,default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},size:{type:Number,default:5,validator(e){return e>=0}},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},emptyStateLabel:{type:String,default:"No entries in this list"},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},initialSearchTerm:{type:String,required:!1,default:""},showEmptyState:{default:!0,type:Boolean},isValid:{default:!0,type:Boolean},emptyStateComponent:{default:null,type:Object},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const a=p(e.modelValue),s=p(e.initialSearchTerm),r=p(e.initialCaseSensitiveSearch),o=h(()=>Object.assign({},...e.possibleValues.map((i,n)=>({[i.id]:{item:i,index:n}})))),l=h(()=>e.possibleValues.map(i=>{var n;return(n=o.value[i.id])==null?void 0:n.item})),c=h(()=>{var i;return a.value?(i=a.value)==null?void 0:i.filter(n=>!o.value[n]):[]}),b=h(()=>{var i;return(i=c.value)==null?void 0:i.map(n=>q(n))}),d=h(()=>a.value===null?[]:[...b.value,...l.value]),u=P(s,r,d,F(e,"showSearch")),z=h(()=>u.value.length===0?[]:u.value.filter(i=>d.value.includes(i))),C=h(()=>e.showSearch&&s.value!==""),I=h(()=>z.value.filter(n=>n.text.toLowerCase().includes(s.value.toLowerCase()))),w=h(()=>{var i,n;return e.showSearch?C.value?D(I,l.value.length,a):`[ ${(n=a.value)==null?void 0:n.length} selected ]`:`[ ${(i=a.value)==null?void 0:i.length} selected ]`});return{selectedValues:a,searchTerm:s,visibleValues:d,concatenatedItems:z,caseSensitiveSearch:r,numLabelInfos:w,matchingInvalidValueIds:b,allItems:u}},computed:{withIsEmptyState(){return this.concatenatedItems.length===0},listSize(){if(this.possibleValues.length>=_){const e=this.size===0?this.possibleValues.length:this.size;return e>_?e:_}return this.size},cssStyleSize(){const e=`${this.listSize*R+2}px`;return this.listSize>0?{height:e}:{}},returnContainerRef(){return this.$refs.div},allignmentCheck(){return this.alignment==="vertical"?this.cssStyleSize:{height:"auto"}}},methods:{onSearchInput(e){this.searchTerm=e},onChange(e){this.$emit("update:modelValue",e),this.selectedValues=e},hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},handleMouseIn(){!this.disabled&&this.size>=_&&(this.returnContainerRef.style.overflow="auto")},handleMouseLeave(){this.returnContainerRef.style.overflow="hidden"},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},Z={class:"checkboxes-wrapper"},X={class:"header"},G={class:"title"},J={key:0,class:"info"},K={key:0,class:"empty-state"};function Q(e,a,s,r,o,l){const c=f("SearchInput"),b=f("Label"),d=f("Checkboxes");return v(),S(O,null,[t("div",Z,[s.showSearch?(v(),E(b,{key:0,active:s.withSearchLabel,text:s.searchLabel,class:"search-wrapper"},{default:B(({labelForId:u})=>[m(c,{id:u,ref:"search",placeholder:s.searchPlaceholder,"model-value":r.searchTerm,label:s.searchLabel,"initial-case-sensitive-search":s.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:s.disabled,compact:s.compact,"onUpdate:modelValue":l.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=z=>r.caseSensitiveSearch=z)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):g("",!0),t("div",X,[t("div",G,[r.numLabelInfos?(v(),S("div",J,x(r.numLabelInfos),1)):g("",!0)])])]),t("div",{ref:"div",class:T(["container",{disabled:s.disabled,"empty-box":l.withIsEmptyState}]),style:N([l.allignmentCheck,l.cssStyleSize]),onMouseenter:a[1]||(a[1]=(...u)=>l.handleMouseIn&&l.handleMouseIn(...u)),onMouseleave:a[2]||(a[2]=(...u)=>l.handleMouseLeave&&l.handleMouseLeave(...u))},[M(m(d,{ref:"form","empty-state-label":s.emptyStateLabel,"empty-state-component":s.emptyStateComponent,"model-value":s.modelValue,alignment:s.alignment,"possible-values":r.concatenatedItems,"is-valid":s.isValid,disabled:s.disabled,"onUpdate:modelValue":l.onChange},null,8,["empty-state-label","empty-state-component","model-value","alignment","possible-values","is-valid","disabled","onUpdate:modelValue"]),[[U,!l.withIsEmptyState]]),!r.concatenatedItems.length&&l.withIsEmptyState?(v(),S("div",K,[t("span",null,x(s.emptyStateLabel),1)])):g("",!0)],38)],64)}const W=V(j,[["render",Q],["__scopeId","data-v-67572ca1"]]),Y="",$=`<SearchableCheckboxes
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

/>`,ee={components:{CodeExample:k,SearchableCheckboxes:W},data(){return{codeExample:$,selectedHorizontal:["bar","baz"],selectedVertical:[],missingValues:["bar","I am a missing Value"]}},computed:{code(){return Y}}},te=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Checkboxes with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),ae={class:"grid-container"},se={class:"grid-item-5"},le=t("span",null,"Horizontal",-1),ie={class:"grid-item-2"},oe=t("br",null,null,-1),ne={class:"grid-container"},de={class:"grid-item-5"},re=t("span",null,"Vertical",-1),ce={class:"grid-item-2"},ue=t("br",null,null,-1),he={class:"grid-container"},me={class:"grid-item-5"},be=t("span",null,"Disabled",-1),xe=t("br",null,null,-1),ve={class:"grid-container"},fe={class:"grid-item-5"},ze=t("span",null,"It can has missing values",-1),_e={class:"grid-item-2"},Se=t("br",null,null,-1),pe={class:"grid-container"},ge={class:"grid-item-5"},Be=t("span",null,"Compact",-1),ye={class:"grid-container"},Ve={class:"grid-item-12"};function Ce(e,a,s,r,o,l){const c=f("SearchableCheckboxes",!0),b=f("CodeExample");return v(),S("div",null,[t("section",null,[te,t("div",ae,[t("div",se,[le,m(c,{modelValue:o.selectedHorizontal,"onUpdate:modelValue":a[0]||(a[0]=d=>o.selectedHorizontal=d),"show-search":!0,"possible-values":[{id:"foo 1",text:"Foo 1"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"foo 2",text:"Foo 2"},{id:"bar 2",text:"Bar 2"},{id:"baz 2",text:"Baz 2"},{id:"foo 3",text:"Foo 3"},{id:"bar 3",text:"Bar 3"},{id:"baz 3",text:"Baz 3"},{id:"foo 4",text:"Foo 4"},{id:"bar 4",text:"Bar 4"},{id:"baz 4",text:"Baz 4"},{id:"foo 5",text:"Foo 5"},{id:"bar 5",text:"Bar 5"},{id:"baz 5",text:"Baz 5"},{id:"foo 6",text:"Foo 6"},{id:"bar 6",text:"Bar 6"},{id:"baz 6",text:"Baz 6"},{id:"foo 7",text:"Foo 7"},{id:"bar 7",text:"Bar 7"},{id:"baz 7",text:"Baz 7"},{id:"foo 8",text:"Foo 8"},{id:"bar 8",text:"Bar 8"},{id:"baz 8",text:"Baz 8"},{id:"foo 9",text:"Foo 9"},{id:"bar 9",text:"Bar 9"},{id:"baz 9",text:"Baz 9"},{id:"foo 10",text:"Foo 10"},{id:"bar 10",text:"Bar 10"},{id:"baz 10",text:"Baz 10"},{id:"foo 11",text:"Foo 11"},{id:"bar 11",text:"Bar 11"},{id:"baz 11",text:"Baz 11"},{id:"foo 12",text:"Foo 12"},{id:"bar 12",text:"Bar 12"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",ie,"selected ids: "+x(o.selectedHorizontal),1)]),oe,t("div",ne,[t("div",de,[re,m(c,{modelValue:o.selectedVertical,"onUpdate:modelValue":a[1]||(a[1]=d=>o.selectedVertical=d),alignment:"vertical","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz 1",text:"Baz 1"},{id:"baz 2",text:"Baz 2"},{id:"baz 3",text:"Baz 3"},{id:"baz 4",text:"Baz 4"},{id:"baz 5",text:"Baz 6"},{id:"baz 6",text:"Baz 6"},{id:"baz 7",text:"Baz 7"},{id:"baz 8",text:"Baz 8"},{id:"baz 9",text:"Baz 9"},{id:"baz 10",text:"Baz 10"},{id:"baz 11",text:"Baz 11"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",ce,"selected ids: "+x(o.selectedVertical),1)]),ue,t("div",he,[t("div",me,[be,m(c,{"model-value":[],disabled:!0,"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])]),xe,t("div",ve,[t("div",fe,[ze,m(c,{modelValue:o.missingValues,"onUpdate:modelValue":a[2]||(a[2]=d=>o.missingValues=d),"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),t("div",_e,"selected ids: "+x(o.missingValues),1)]),Se,t("div",pe,[t("div",ge,[Be,m(c,{"model-value":[],disabled:!0,"show-search":!0,size:3,compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])])]),t("section",null,[t("div",ye,[t("div",Ve,[m(b,{summary:"Show usage example"},{default:B(()=>[y(x(o.codeExample),1)]),_:1}),m(b,{summary:"Show SearchableCheckboxes.vue source code"},{default:B(()=>[y(x(l.code),1)]),_:1})])])])])}const Te=V(ee,[["render",Ce]]);export{Te as default};
