import{C}from"./CodeExample-La__JCd8.js";import{D as L}from"./index-CtER9vWE.js";import{F as U}from"./filter-CYURne9T.js";import{f as g}from"./useSearch-BGbfkKQu.js";import{C as k}from"./Checkboxes-Bzk1JjEE.js";import{L as B}from"./Label-Col_s6as.js";import{b9 as D,R as E,_ as P,r as c,c as S,o as p,k as b,l as h,d as o,w as d,E as x,W as w,X as V,y as F,g as I,b as s,F as M,t as m,e as T}from"./index-CdRYFHYy.js";import{T as A,u as O}from"./Twinlist-DOu2I0eU.js";import{V as N}from"./ValueSwitch-DHVGHmR6.js";import"./Checkbox-DDjjyswv.js";import"./v4-BKrj-4V8.js";import"./arrow-next-B6_CVf18.js";import"./arrow-prev-DNHV_IcL.js";import"./throttle-C6Heuwer.js";import"./debounce-DcF-OxTq.js";import"./MultiselectListBox-DNgOc5ti.js";import"./StyledListItem-WHBzlEmJ.js";import"./createMissingItem-PGCdVBns.js";import"./useLabelInfo-BBdI1Bsq.js";import"./BaseRadioButtons-CsBsXguJ.js";const R={manual:"Manual",wildcard:"Wildcard",regex:"Regex",type:"Type"},q={name:"MultiModeTwinlist",components:{Label:B,FilterIcon:U,SearchInput:D,Checkboxes:k,ValueSwitch:N,Twinlist:A},props:{mode:{type:String,required:!1,default:"manual"},manualSelection:{type:[Object,Array,null],default:()=>[]},pattern:{type:String,default:""},caseSensitivePattern:{default:!1,type:Boolean},inversePattern:{default:!1,type:Boolean},withTypes:{type:Boolean,default:!0},selectedTypes:{type:Array,default:()=>[]},showMode:{default:!0,type:Boolean},showSearch:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},withModeLabel:{default:!1,type:Boolean},modeLabel:{type:String,required:!1,default:"Selection mode"},withPatternLabel:{default:!1,type:Boolean},patternLabel:{type:String,required:!1,default:"Pattern"},withTypesLabel:{default:!1,type:Boolean},typesLabel:{type:String,required:!1,default:"Selected types"},possibleValues:{type:Array,default:()=>[]},additionalPossibleTypes:{type:Array,default:()=>[]},compact:{type:Boolean,default:!1}},emits:["update:manualSelection","update:pattern","update:selectedTypes","update:mode","update:caseSensitivePattern","update:inversePattern","update:selected"],setup(l){const{includedValues:e}=O(E(l,"manualSelection"));return{manuallySelected:e}},data(){return{invalidPossibleValueIds:new Set}},computed:{possibleValueIds(){return this.possibleValues.map(({id:l})=>l)},possibleTypes(){const l=this.possibleValues.map(({type:t})=>t).filter(Boolean),e=l.map(t=>t.id);return[...this.additionalPossibleTypes.filter(t=>t&&!e.includes(t.id)),...l].filter(t=>t&&t.id!=="").filter((t,n,u)=>n===u.findIndex(r=>r.id===t.id&&r.text===t.text))},matchingValueIds(){return this.possibleValues.filter(l=>this.itemMatches(l)).map(l=>l.id)},twinlistModelValue(){return this.mode==="manual"?this.manualSelection:this.matchingValueIds},selectedValues(){return this.mode==="manual"?this.manuallySelected:this.matchingValueIds},selectionDisabled(){return this.disabled||this.mode!=="manual"},normalizedSearchTerm(){return this.mode==="manual"?null:g[this.mode].normalize(this.mode==="type"?this.selectedTypes:this.pattern,this.caseSensitivePattern)},possibleModes(){let l=Object.entries(R).map(([e,a])=>({id:e,text:a}));return this.withTypes||(l=l.filter(e=>e.id!=="type")),l}},watch:{selectedValues:{immediate:!0,handler(l,e){!e||l===null||(l.length!==e.length||e.some((a,v)=>a!==l[v]))&&this.$emit("update:selected",this.selectedValues)}}},methods:{onManualInput(l){this.mode==="manual"&&this.$emit("update:manualSelection",l)},onPatternInput(l){this.$emit("update:pattern",l)},onTypeInput(l){this.$emit("update:selectedTypes",l,this.possibleTypes)},onModeChange(l){this.$emit("update:mode",l)},onToggleCaseSensitivePattern(l){this.$emit("update:caseSensitivePattern",l)},onToggleInversePattern(l){this.$emit("update:inversePattern",l)},validate(){return this.$refs.twinlist.validate()},hasSelection(){return!!this.selectedValues?.length},itemMatches(l){return g[this.mode].test(this.mode==="type"?l.type?.id:l.text,this.normalizedSearchTerm,this.caseSensitivePattern,this.inversePattern)}}};function j(l,e,a,v,t,n){const u=c("ValueSwitch"),r=c("Label"),f=c("FilterIcon"),i=c("SearchInput"),_=c("Checkboxes"),z=c("Twinlist");return p(),S("div",{class:I(["multi-mode-twinlist",{disabled:a.disabled}])},[a.showMode?(p(),b(r,{key:0,active:a.withModeLabel,text:a.modeLabel,class:"label"},{default:d(({labelForId:y})=>[o(u,{id:y,ref:"mode",compact:a.compact,"model-value":a.mode,disabled:a.disabled,"possible-values":n.possibleModes,"onUpdate:modelValue":n.onModeChange},null,8,["id","compact","model-value","disabled","possible-values","onUpdate:modelValue"])]),_:1},8,["active","text"])):h("",!0),a.mode==="regex"||a.mode==="wildcard"?(p(),b(r,{key:1,active:a.withPatternLabel,text:a.patternLabel,class:"label"},{default:d(({labelForId:y})=>[o(i,{id:y,ref:"search","model-value":a.pattern,label:a.patternLabel,"initial-case-sensitive-search":a.caseSensitivePattern,"initial-inverse-search":a.inversePattern,placeholder:"Pattern","show-case-sensitive-search-button":"","show-inverse-search-button":"",disabled:a.disabled,tooltips:{inverseSearch:"Move matching to other side"},compact:a.compact,"onUpdate:modelValue":n.onPatternInput,onToggleCaseSensitiveSearch:n.onToggleCaseSensitivePattern,onToggleInverseSearch:n.onToggleInversePattern},{icon:d(()=>[o(f)]),_:2},1032,["id","model-value","label","initial-case-sensitive-search","initial-inverse-search","disabled","compact","onUpdate:modelValue","onToggleCaseSensitiveSearch","onToggleInverseSearch"])]),_:1},8,["active","text"])):h("",!0),a.mode==="type"&&n.possibleTypes.length>0?(p(),b(r,{key:2,active:a.withTypesLabel,text:a.typesLabel,class:"label"},{default:d(()=>[o(_,{"model-value":a.selectedTypes,"possible-values":n.possibleTypes,disabled:a.disabled,"onUpdate:modelValue":n.onTypeInput},{label:d(y=>[x(l.$slots,"type",w(V(y)),void 0,!0)]),_:3},8,["model-value","possible-values","disabled","onUpdate:modelValue"])]),_:3},8,["active","text"])):h("",!0),o(z,F(l.$attrs,{ref:"twinlist",disabled:n.selectionDisabled,"show-search":a.mode==="manual"&&a.showSearch,"model-value":n.twinlistModelValue,"possible-values":a.possibleValues,compact:a.compact,"onUpdate:modelValue":n.onManualInput}),{option:d(y=>[x(l.$slots,"option",w(V(y)),void 0,!0)]),_:3},16,["disabled","show-search","model-value","possible-values","compact","onUpdate:modelValue"])],2)}const H=P(q,[["render",j],["__scopeId","data-v-398d9cb1"]]),W="",X=`<MultiModeTwinList
  :size="7"
  show-mode
  case-sensitive-pattern
  left-label="Select from the 7 visible items (size)"
  right-label="The selected stuff"
  mode-label="Selection mode"
  pattern="^[ab].*[357]$|$"
  :selected-types="['Type1', 'Type3']"
  :possible-values="[{
    id: 'foo',
    text: 'foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'Foo',
    text: 'Foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'bar',
    text: 'Bar',
    type: { id: 'type2', text: 'Type 2' }
  }]"
/>
<MultiModeTwinList
  :size="7"
  show-mode
  :with-mode-label="false"
  :with-search-label="false"
  :with-pattern-label="false"
  :with-types-label="false"
  left-label="Select from the visible items"
  right-label="The selected stuff"
  :possible-values="[{
    id: 'foo',
    text: 'foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'Foo',
    text: 'Foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'bar',
    text: 'Bar',
    type: { id: 'type2', text: 'Type 2' }
  }]"
/>
`,G=`<MultiModeTwinList
  show-mode
  with-types
  :size="7"
  :possible-values="[
        "string-datatype",
        "date-datatype",
        "tool-datatype",
        "number-integer-datatype",
        "path-datatype",
      ].map((typeId) => ({
        id: \`id-\${typeId}\`,
        text: \`Text for \${typeId}\`,
        type: { id: typeId, text: \`Type of \${typeId}\` },
      }))"
  ><template #option="{ slotItem }">
    <div :class="['data-type-entry', { invalid: slotItem.invalid }]">
      <DataType
        :icon-name="slotItem?.type?.id"
        :icon-title="slotItem?.type?.text"
        size="small"
      />
      <span>{{ slotItem.text }}</span>
    </div>
  </template>
  <template #type="{ slotItem }">
    <DataType
      :icon-name="slotItem.id"
      :icon-title="slotItem.text"
      size="small"
    />
    <span class="data-type-text">{{ slotItem.text }}</span>
  </template></MultiModeTwinList
>`,J={components:{MultiModeTwinList:H,CodeExample:C,DataType:L},data(){return{codeExample:X,codeExampleSlotted:G,selected:[],withMissing:["missing"],manualSelection:{includedValues:["missing"],excludedValues:["foo","Channel Name","Reservation AOV","baz0","baz1","baz2","baz3","baz4","baz5","spec1","spec2"],includeUnknownValues:!1},manualSelection2:[],isCaseSensitivePattern:!0,isInverted:!1,mode:"regex",pattern:"^[ab].*[57]$|$",selectedTypes:["Type1","Type"],key:0,slottedProps:{pattern:"^[ab].*[57]$|$",manualSelection:{includedValues:["missingIncluded"],excludedValues:["missingExcluded"],includeUnknownValues:!1},mode:"type",selectedTypes:[]}}},computed:{code(){return W},settingsHash(){return[`${this.manualSelection}`,`${this.isCaseSensitivePattern}`,`${this.isInverted}`,`${this.mode}`,`${this.pattern}`,`${this.selectedTypes}`].join(", ")},demoValues(){return[{id:"foo",text:"foo",type:{id:"type1",text:"Type 1"}},{id:"Channel Name",text:"Channel Name",type:{id:"type1",text:"Type 1"}},{id:"Reservation AOV",text:"Reservation AOV",type:{id:"type2",text:"Type 2"}},...Array.from({length:6},(l,e)=>({id:`baz${e}`,text:`Baz${e}`,type:{id:` type${e}`,text:` Type ${e}`}})),{id:"spec1",text:"Special *.^",type:{id:"type1",text:"Type 1"}},{id:"spec2",text:"Special $?]",type:{id:"type2",text:"Type 2"}}]},slottedDemoValues(){return["string-datatype","date-datatype","tool-datatype","number-integer-datatype","path-datatype"].map(l=>({id:`id-${l}`,text:`Text for ${l}`,type:{id:l,text:`Type of ${l}`}}))}},watch:{settingsHash(l,e){l!==e&&(this.key+=1)}}},K={class:"grid-container"},Q={class:"grid-item-6"},Y={class:"grid-item-6"},Z={class:"grid-container"},$={class:"grid-item-6"},ee={class:"grid-container"},te={class:"grid-item-6"},le={class:"grid-container"},se={class:"grid-item-6"},ie={class:"grid-container"},ae={class:"grid-item-12"},ne={class:"grid-container"},oe={class:"grid-item-6"},de={class:"data-type-text"},re={class:"grid-item-6"},pe={class:"grid-container"},ue={class:"grid-item-12"};function me(l,e,a,v,t,n){const u=c("MultiModeTwinList"),r=c("CodeExample"),f=c("DataType");return p(),S("div",null,[s("section",null,[e[15]||(e[15]=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null," A MultiModeTwinList with mode selection set to initial regex selection. The demo list include items with special characters that need to be escaped for regular expression filters. On type selection mode, the types of the possible values as well as an additional option are selectable. ")])],-1)),s("div",K,[s("div",Q,[o(u,{pattern:t.pattern,"onUpdate:pattern":e[0]||(e[0]=i=>t.pattern=i),manualSelection:t.manualSelection,"onUpdate:manualSelection":e[1]||(e[1]=i=>t.manualSelection=i),"case-sensitive-pattern":t.isCaseSensitivePattern,"onUpdate:caseSensitivePattern":e[2]||(e[2]=i=>t.isCaseSensitivePattern=i),"inverse-pattern":t.isInverted,"onUpdate:inversePattern":e[3]||(e[3]=i=>t.isInverted=i),mode:t.mode,"onUpdate:mode":e[4]||(e[4]=i=>t.mode=i),"selected-types":t.selectedTypes,"onUpdate:selectedTypes":e[5]||(e[5]=i=>t.selectedTypes=i),"show-mode":"",size:7,"possible-values":n.demoValues,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","onUpdate:selected":e[6]||(e[6]=i=>{t.selected=i})},null,8,["pattern","manualSelection","case-sensitive-pattern","inverse-pattern","mode","selected-types","possible-values"])]),s("div",Y,[t.mode==="manual"?(p(),S(M,{key:0},[e[13]||(e[13]=s("br",null,null,-1)),s("span",null," selected ids: "+m(t.manualSelection.includedValues),1),e[14]||(e[14]=s("br",null,null,-1)),s("span",null," deselected ids: "+m(t.manualSelection.excludedValues),1)],64)):h("",!0)])]),e[16]||(e[16]=s("br",null,null,-1)),s("div",Z,[s("div",$,[(p(),b(u,{key:t.key,disabled:"",size:7,"show-mode":"","case-sensitive-pattern":t.isCaseSensitivePattern,"selected-types":t.selectedTypes,pattern:t.pattern,mode:t.mode,"inverse-pattern":t.isInverted,"manual-selection":t.manualSelection.includedValues,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","possible-values":n.demoValues},null,8,["case-sensitive-pattern","selected-types","pattern","mode","inverse-pattern","manual-selection","possible-values"]))])]),e[17]||(e[17]=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null,"Optionally, labels can be shown and customized:")])],-1)),s("div",ee,[s("div",te,[(p(),b(u,{key:t.key,manualSelection:t.manualSelection2,"onUpdate:manualSelection":e[7]||(e[7]=i=>t.manualSelection2=i),size:7,"show-mode":"","with-mode-label":!0,"with-search-label":!0,"with-pattern-label":!0,"with-types-label":!0,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":n.demoValues},null,8,["manualSelection","possible-values"]))])]),e[18]||(e[18]=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null,"Compact mode")])],-1)),s("div",le,[s("div",se,[(p(),b(u,{key:t.key,manualSelection:t.manualSelection2,"onUpdate:manualSelection":e[8]||(e[8]=i=>t.manualSelection2=i),size:7,"show-mode":"","with-mode-label":!0,"with-search-label":!0,"with-pattern-label":!0,"with-types-label":!0,"left-label":"Select from the visible items","right-label":"The selected stuff",compact:"","possible-values":n.demoValues},null,8,["manualSelection","possible-values"]))])])]),s("section",null,[s("div",ie,[s("div",ae,[o(r,{summary:"Show usage example"},{default:d(()=>[T(m(t.codeExample),1)]),_:1}),o(r,{summary:"Show MultiModeTwinList.vue source code"},{default:d(()=>[T(m(n.code),1)]),_:1})])])]),s("section",null,[e[21]||(e[21]=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("h4",null,"Slotted MultiModeTwinList")])],-1)),s("div",ne,[s("div",oe,[o(u,{manualSelection:t.slottedProps.manualSelection,"onUpdate:manualSelection":e[9]||(e[9]=i=>t.slottedProps.manualSelection=i),mode:t.slottedProps.mode,"onUpdate:mode":e[10]||(e[10]=i=>t.slottedProps.mode=i),"selected-types":t.slottedProps.selectedTypes,"onUpdate:selectedTypes":e[11]||(e[11]=i=>t.slottedProps.selectedTypes=i),"show-mode":"","with-types":"",size:7,"possible-values":n.slottedDemoValues,"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","onUpdate:selected":e[12]||(e[12]=i=>{t.selected=i})},{option:d(({slotItem:i})=>[s("div",{class:I(["data-type-entry",{invalid:i.invalid}])},[o(f,{"icon-name":i?.type?.id,"icon-title":i?.type?.text,size:"small"},null,8,["icon-name","icon-title"]),s("span",null,m(i.text),1)],2)]),type:d(({slotItem:i})=>[o(f,{"icon-name":i.id,"icon-title":i.text,size:"small"},null,8,["icon-name","icon-title"]),s("span",de,m(i.text),1)]),_:1},8,["manualSelection","mode","selected-types","possible-values"])]),s("div",re,[t.mode==="manual"?(p(),S(M,{key:0},[e[19]||(e[19]=s("br",null,null,-1)),s("span",null," selected ids: "+m(t.slottedProps.manualSelection.includedValues),1),e[20]||(e[20]=s("br",null,null,-1)),s("span",null," deselected ids: "+m(t.slottedProps.manualSelection.excludedValues),1)],64)):h("",!0)])])]),s("section",null,[s("div",pe,[s("div",ue,[o(r,{summary:"Show usage example"},{default:d(()=>[T(m(t.codeExampleSlotted),1)]),_:1})])])])])}const ke=P(J,[["render",me],["__scopeId","data-v-f8232bf6"]]);export{ke as default};
