import{C as P}from"./CodeExample-3obvIH87.js";import{L as I}from"./Label-NpzPpIE9.js";import{at as M,a0 as _,_ as g,r as u,o as d,c as v,j as m,w as c,d as p,l as y,y as L,n as C,b as s,F as B,t as b,e as T}from"./index-EckSR7mm.js";import{C as k}from"./Checkboxes-Sh5H8SB9.js";import{V as z}from"./ValueSwitch-cfADbunG.js";import{T as F,u as U}from"./Twinlist-K0EUHX6h.js";import{f as S}from"./createMissingItem-l6qmOyuX.js";import{F as A}from"./filter-NyvfIOrH.js";import"./Checkbox-M1dy-7Ve.js";import"./BaseRadioButtons-omBDlegB.js";import"./MultiselectListBox-XoZ7VXbm.js";import"./StyledListItem-BUXcmuQz.js";import"./arrow-next-_bFNtYkP.js";import"./useSearch-Y1851mGo.js";const O={manual:"Manual",wildcard:"Wildcard",regex:"Regex",type:"Type"},q={components:{Label:I,FilterIcon:A,SearchInput:M,Checkboxes:k,ValueSwitch:z,Twinlist:F},props:{mode:{type:String,required:!1,default:"manual"},manualSelection:{type:[Object,Array,null],default:()=>[]},pattern:{type:String,default:""},caseSensitivePattern:{default:!1,type:Boolean},inversePattern:{default:!1,type:Boolean},withTypes:{type:Boolean,default:!0},selectedTypes:{type:Array,default:()=>[]},showMode:{default:!1,type:Boolean},showSearch:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},withModeLabel:{default:!1,type:Boolean},modeLabel:{type:String,required:!1,default:"Selection mode"},withPatternLabel:{default:!1,type:Boolean},patternLabel:{type:String,required:!1,default:"Pattern"},withTypesLabel:{default:!1,type:Boolean},typesLabel:{type:String,required:!1,default:"Selected types"},possibleValues:{type:Array,default:()=>[]},additionalPossibleTypes:{type:Array,default:()=>[]},compact:{type:Boolean,default:!1}},emits:["update:manualSelection","update:pattern","update:selectedTypes","update:mode","update:caseSensitivePattern","update:inversePattern","update:selected"],setup(t){const{includedValues:n}=U(_(t,"manualSelection"));return{manuallySelected:n}},data(){return{invalidPossibleValueIds:new Set}},computed:{possibleValueIds(){return this.possibleValues.map(({id:t})=>t)},possibleTypes(){const t=this.possibleValues.map(({type:e})=>e).filter(Boolean),n=t.map(e=>e.id);return[...this.additionalPossibleTypes.filter(e=>e&&!n.includes(e.id)),...t].filter(e=>e&&e.id!=="").filter((e,a,r)=>a===r.findIndex(o=>o.id===e.id&&o.text===e.text))},matchingValueIds(){return this.possibleValues.filter(t=>this.itemMatches(t)).map(t=>t.id)},twinlistModelValue(){return this.mode==="manual"?this.manualSelection:this.matchingValueIds},selectedValues(){return this.mode==="manual"?this.manuallySelected:this.matchingValueIds},selectionDisabled(){return this.disabled||this.mode!=="manual"},normalizedSearchTerm(){return this.mode==="manual"?null:S[this.mode].normalize(this.mode==="type"?this.selectedTypes:this.pattern,this.caseSensitivePattern)},possibleModes(){let t=Object.entries(O).map(([n,l])=>({id:n,text:l}));return this.withTypes||(t=t.filter(n=>n.id!=="type")),t}},watch:{selectedValues:{immediate:!0,handler(t,n){!n||t===null||(t.length!==n.length||n.some((l,h)=>l!==t[h]))&&this.$emit("update:selected",this.selectedValues)}}},methods:{onManualInput(t){this.mode==="manual"&&this.$emit("update:manualSelection",t)},onPatternInput(t){this.$emit("update:pattern",t)},onTypeInput(t){this.$emit("update:selectedTypes",t,this.possibleTypes)},onModeChange(t){this.$emit("update:mode",t)},onToggleCaseSensitivePattern(t){this.$emit("update:caseSensitivePattern",t)},onToggleInversePattern(t){this.$emit("update:inversePattern",t)},validate(){return this.$refs.twinlist.validate()},hasSelection(){var t;return!!((t=this.selectedValues)!=null&&t.length)},itemMatches(t){var l;return S[this.mode].test(this.mode==="type"?(l=t.type)==null?void 0:l.id:t.text,this.normalizedSearchTerm,this.caseSensitivePattern,this.inversePattern)}}};function E(t,n,l,h,e,a){const r=u("ValueSwitch"),o=u("Label"),i=u("FilterIcon"),w=u("SearchInput"),V=u("Checkboxes"),x=u("Twinlist");return d(),v("div",{class:C(["multi-mode-twinlist",{disabled:l.disabled}])},[l.showMode?(d(),m(o,{key:0,active:l.withModeLabel,text:l.modeLabel,class:"label"},{default:c(({labelForId:f})=>[p(r,{id:f,ref:"mode",compact:l.compact,"model-value":l.mode,disabled:l.disabled,"possible-values":a.possibleModes,"onUpdate:modelValue":a.onModeChange},null,8,["id","compact","model-value","disabled","possible-values","onUpdate:modelValue"])]),_:1},8,["active","text"])):y("",!0),l.mode==="regex"||l.mode==="wildcard"?(d(),m(o,{key:1,active:l.withPatternLabel,text:l.patternLabel,class:"label"},{default:c(({labelForId:f})=>[p(w,{id:f,ref:"search","model-value":l.pattern,label:l.patternLabel,"initial-case-sensitive-search":l.caseSensitivePattern,"initial-inverse-search":l.inversePattern,placeholder:"Pattern","show-case-sensitive-search-button":"","show-inverse-search-button":"",disabled:l.disabled,tooltips:{inverseSearch:"Move matching to other side"},compact:l.compact,"onUpdate:modelValue":a.onPatternInput,onToggleCaseSensitiveSearch:a.onToggleCaseSensitivePattern,onToggleInverseSearch:a.onToggleInversePattern},{icon:c(()=>[p(i)]),_:2},1032,["id","model-value","label","initial-case-sensitive-search","initial-inverse-search","disabled","compact","onUpdate:modelValue","onToggleCaseSensitiveSearch","onToggleInverseSearch"])]),_:1},8,["active","text"])):y("",!0),l.mode==="type"&&a.possibleTypes.length>0?(d(),m(o,{key:2,active:l.withTypesLabel,text:l.typesLabel,class:"label"},{default:c(()=>[p(V,{"model-value":l.selectedTypes,"possible-values":a.possibleTypes,disabled:l.disabled,"onUpdate:modelValue":a.onTypeInput},null,8,["model-value","possible-values","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):y("",!0),p(x,L(t.$attrs,{ref:"twinlist",disabled:a.selectionDisabled,"show-search":l.mode==="manual"&&l.showSearch,"model-value":a.twinlistModelValue,"possible-values":l.possibleValues,compact:l.compact,"onUpdate:modelValue":a.onManualInput}),null,16,["disabled","show-search","model-value","possible-values","compact","onUpdate:modelValue"])],2)}const N=g(q,[["render",E],["__scopeId","data-v-274f1b7a"]]),R=`<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "./SearchInput.vue";
import Checkboxes from "./Checkboxes.vue";
import ValueSwitch from "./ValueSwitch.vue";
import Twinlist, {
  type TwinlistModelValue,
  useTwinlistModelValue,
} from "./Twinlist.vue";
import {
  type PossibleValue as TwinlistPossibleValue,
  type Id,
} from "./possibleValues";
import FilterIcon from "../../assets/img/icons/filter.svg";
import { filters } from "../../../util/filters";
import { toRef, type PropType } from "vue";

type PossibleType = { id: string; text: string };
type PossibleValue = TwinlistPossibleValue & { type?: PossibleType };

const allModes = {
  manual: "Manual",
  wildcard: "Wildcard",
  regex: "Regex",
  type: "Type",
};

export default {
  components: {
    Label,
    FilterIcon,
    SearchInput,
    Checkboxes,
    ValueSwitch,
    Twinlist,
  },
  props: {
    /**
     * initial values
     */
    mode: {
      type: String,
      required: false,
      default: "manual",
    },
    manualSelection: {
      type: [Object, Array, null] as PropType<TwinlistModelValue>,
      default: () => [],
    },
    pattern: {
      type: String,
      default: "",
    },
    caseSensitivePattern: {
      default: false,
      type: Boolean,
    },
    inversePattern: {
      default: false,
      type: Boolean,
    },
    withTypes: {
      type: Boolean,
      default: true,
    },
    selectedTypes: {
      type: Array as PropType<Array<string>>,
      default: () => [],
    },

    /**
     * Hiding and disabling
     */
    showMode: {
      default: false,
      type: Boolean,
    },
    // enable search in case of manual selection
    showSearch: {
      default: true,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },

    /**
     * Labels
     */
    withModeLabel: {
      default: false,
      type: Boolean,
    },
    modeLabel: {
      type: String,
      required: false,
      default: "Selection mode",
    },
    withPatternLabel: {
      default: false,
      type: Boolean,
    },
    patternLabel: {
      type: String,
      required: false,
      default: "Pattern",
    },
    withTypesLabel: {
      default: false,
      type: Boolean,
    },
    typesLabel: {
      type: String,
      required: false,
      default: "Selected types",
    },
    /**
     * List of possible values. Each item must have an \`id\` and a \`text\` property
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }]
     * For type selection, additionally, an element has to have a property \`type\` wich itself has properties
     * \`id\` and \`text\`, e.g.
     * [{
     *   id: 'pdf',
     *   text: 'PDF',
     *   type: {
     *     id: 'StringValue',
     *     text: 'String'
     *  }]
     */
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => [],
    },
    /**
     * List of possible types which should be selectable but are not necessarily present in the possible values.
     */
    additionalPossibleTypes: {
      type: Array as PropType<PossibleType[]>,
      default: () => [],
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    // Prop updates
    "update:manualSelection",
    "update:pattern",
    "update:selectedTypes",
    "update:mode",
    "update:caseSensitivePattern",
    "update:inversePattern",
    // Non-prop update
    "update:selected",
  ],
  setup(props) {
    const { includedValues: manuallySelected } = useTwinlistModelValue(
      toRef(props, "manualSelection"),
    );
    return { manuallySelected };
  },
  data() {
    return {
      invalidPossibleValueIds: new Set(),
    };
  },
  computed: {
    possibleValueIds() {
      return this.possibleValues.map(({ id }) => id);
    },
    possibleTypes() {
      const possibleTypes = this.possibleValues
        .map(({ type }) => type)
        .filter(Boolean) as PossibleType[];
      const possibleTypesIds = possibleTypes.map((type) => type.id);
      const additionalTypes = this.additionalPossibleTypes.filter(
        (type) => type && !possibleTypesIds.includes(type.id),
      );
      const allTypes = [...additionalTypes, ...possibleTypes];
      return allTypes
        .filter((type) => type && type.id !== "")
        .filter(
          // remove duplicates
          (val, index, self) =>
            index ===
            self.findIndex((t) => t.id === val.id && t.text === val.text),
        );
    },
    matchingValueIds() {
      return this.possibleValues
        .filter((possibleValue) => this.itemMatches(possibleValue))
        .map((possibleValue) => possibleValue.id);
    },
    twinlistModelValue() {
      return this.mode === "manual"
        ? this.manualSelection
        : this.matchingValueIds;
    },
    selectedValues() {
      return this.mode === "manual"
        ? this.manuallySelected
        : this.matchingValueIds;
    },
    selectionDisabled() {
      return this.disabled || this.mode !== "manual";
    },
    normalizedSearchTerm() {
      if (this.mode === "manual") {
        return null;
      }
      return filters[this.mode].normalize(
        this.mode === "type" ? this.selectedTypes : this.pattern,
        this.caseSensitivePattern,
      );
    },
    possibleModes() {
      let modes = Object.entries(allModes).map(([id, text]) => ({ id, text }));
      if (!this.withTypes) {
        modes = modes.filter((mode) => mode.id !== "type");
      }
      return modes;
    },
  },
  watch: {
    selectedValues: {
      immediate: true,
      handler(newVal: Id[] | null, oldVal: Id[] | null | undefined) {
        if (!oldVal || newVal === null) {
          return;
        }
        if (
          newVal.length !== oldVal.length ||
          oldVal.some((item, i) => item !== newVal[i])
        ) {
          this.$emit("update:selected", this.selectedValues);
        }
      },
    },
  },
  methods: {
    onManualInput(value: TwinlistModelValue) {
      if (this.mode === "manual") {
        this.$emit("update:manualSelection", value);
      }
    },
    onPatternInput(value: string) {
      this.$emit("update:pattern", value);
    },
    onTypeInput(value: string[]) {
      this.$emit("update:selectedTypes", value, this.possibleTypes);
    },
    onModeChange(value: keyof typeof allModes) {
      this.$emit("update:mode", value);
    },
    onToggleCaseSensitivePattern(value: boolean) {
      this.$emit("update:caseSensitivePattern", value);
    },
    onToggleInversePattern(value: boolean) {
      this.$emit("update:inversePattern", value);
    },
    validate() {
      return (this.$refs.twinlist as any).validate();
    },
    hasSelection() {
      return Boolean(this.selectedValues?.length);
    },
    itemMatches(item: PossibleValue) {
      const mode = filters[this.mode];
      return mode.test(
        this.mode === "type" ? item.type?.id : item.text,
        this.normalizedSearchTerm,
        this.caseSensitivePattern,
        this.inversePattern,
      );
    },
  },
};
<\/script>

<template>
  <div class="multi-mode-twinlist" :class="{ disabled }">
    <Label
      v-if="showMode"
      #default="{ labelForId }"
      :active="withModeLabel"
      :text="modeLabel"
      class="label"
    >
      <ValueSwitch
        :id="labelForId"
        ref="mode"
        :compact="compact"
        :model-value="mode"
        :disabled="disabled"
        :possible-values="possibleModes"
        @update:model-value="onModeChange"
      />
    </Label>
    <Label
      v-if="mode === 'regex' || mode === 'wildcard'"
      #default="{ labelForId }"
      :active="withPatternLabel"
      :text="patternLabel"
      class="label"
    >
      <SearchInput
        :id="labelForId"
        ref="search"
        :model-value="pattern"
        :label="patternLabel"
        :initial-case-sensitive-search="caseSensitivePattern"
        :initial-inverse-search="inversePattern"
        placeholder="Pattern"
        show-case-sensitive-search-button
        show-inverse-search-button
        :disabled="disabled"
        :tooltips="{
          inverseSearch: 'Move matching to other side',
        }"
        :compact="compact"
        @update:model-value="onPatternInput"
        @toggle-case-sensitive-search="onToggleCaseSensitivePattern"
        @toggle-inverse-search="onToggleInversePattern"
      >
        <template #icon>
          <FilterIcon />
        </template>
      </SearchInput>
    </Label>
    <Label
      v-if="mode === 'type' && possibleTypes.length > 0"
      :active="withTypesLabel"
      :text="typesLabel"
      class="label"
    >
      <Checkboxes
        :model-value="selectedTypes"
        :possible-values="possibleTypes"
        :disabled="disabled"
        @update:model-value="onTypeInput"
      />
    </Label>
    <Twinlist
      v-bind="$attrs"
      ref="twinlist"
      :disabled="selectionDisabled"
      :show-search="mode === 'manual' && showSearch"
      :model-value="twinlistModelValue"
      :possible-values="possibleValues"
      :compact="compact"
      @update:model-value="onManualInput"
    />
  </div>
</template>

<style lang="postcss" scoped>
.multi-mode-twinlist {
  display: flex;
  align-items: stretch;
  flex-direction: column;

  &.disabled {
    opacity: 0.5;
  }

  & .label {
    margin-bottom: 10px;
  }
}
</style>
`,D=`<MultiModeTwinlist
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
<MultiModeTwinlist
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
`,j={components:{MultiModeTwinlist:N,CodeExample:P},data(){return{codeExample:D,selected:[],withMissing:["missing"],manualSelection:{includedValues:["missing"],excludedValues:["foo","Channel Name","Reservation AOV","baz0","baz1","baz2","baz3","baz4","baz5","spec1","spec2"],includeUnknownValues:!1},manualSelection2:[],isCaseSensitivePattern:!0,isInverted:!1,mode:"regex",pattern:"^[ab].*[57]$|$",selectedTypes:["Type1","Type"],key:0}},computed:{code(){return R},settingsHash(){return[`${this.manualSelection}`,`${this.isCaseSensitivePattern}`,`${this.isInverted}`,`${this.mode}`,`${this.pattern}`,`${this.selectedTypes}`].join(", ")},demoValues(){return[{id:"foo",text:"foo",type:{id:"type1",text:"Type 1"}},{id:"Channel Name",text:"Channel Name",type:{id:"type1",text:"Type 1"}},{id:"Reservation AOV",text:"Reservation AOV",type:{id:"type2",text:"Type 2"}},...Array.from({length:6},(t,n)=>({id:`baz${n}`,text:`Baz${n}`,type:{id:` type${n}`,text:` Type ${n}`}})),{id:"spec1",text:"Special *.^",type:{id:"type1",text:"Type 1"}},{id:"spec2",text:"Special $?]",type:{id:"type2",text:"Type 2"}}]}},watch:{settingsHash(t,n){t!==n&&(this.key+=1)}}},H=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null," A MultiModeTwinlist with mode selection set to initial regex selection. The demo list include items with special characters that need to be escaped for regular expression filters. On type selection mode, the types of the possible values as well as an additional option are selectable. ")])],-1),W={class:"grid-container"},X={class:"grid-item-6"},G={class:"grid-item-6"},J=s("br",null,null,-1),K=s("br",null,null,-1),Q=s("br",null,null,-1),Y={class:"grid-container"},Z={class:"grid-item-6"},$=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null,"Optionally, labels can be shown and customized:")])],-1),ee={class:"grid-container"},te={class:"grid-item-6"},ne=s("div",{class:"grid-container"},[s("div",{class:"grid-item-12"},[s("p",null,"Compact mode")])],-1),le={class:"grid-container"},se={class:"grid-item-6"},ae={class:"grid-container"},ie={class:"grid-item-12"};function oe(t,n,l,h,e,a){const r=u("MultiModeTwinlist",!0),o=u("CodeExample");return d(),v("div",null,[s("section",null,[H,s("div",W,[s("div",X,[p(r,{pattern:e.pattern,"onUpdate:pattern":n[0]||(n[0]=i=>e.pattern=i),manualSelection:e.manualSelection,"onUpdate:manualSelection":n[1]||(n[1]=i=>e.manualSelection=i),"case-sensitive-pattern":e.isCaseSensitivePattern,"onUpdate:caseSensitivePattern":n[2]||(n[2]=i=>e.isCaseSensitivePattern=i),"inverse-pattern":e.isInverted,"onUpdate:inversePattern":n[3]||(n[3]=i=>e.isInverted=i),mode:e.mode,"onUpdate:mode":n[4]||(n[4]=i=>e.mode=i),"selected-types":e.selectedTypes,"onUpdate:selectedTypes":n[5]||(n[5]=i=>e.selectedTypes=i),"show-mode":"",size:7,"possible-values":a.demoValues,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","onUpdate:selected":n[6]||(n[6]=i=>{e.selected=i})},null,8,["pattern","manualSelection","case-sensitive-pattern","inverse-pattern","mode","selected-types","possible-values"])]),s("div",G,[e.mode==="manual"?(d(),v(B,{key:0},[J,s("span",null," selected ids: "+b(e.manualSelection.includedValues),1),K,s("span",null," deselected ids: "+b(e.manualSelection.excludedValues),1)],64)):y("",!0)])]),Q,s("div",Y,[s("div",Z,[(d(),m(r,{key:e.key,disabled:"",size:7,"show-mode":"","case-sensitive-pattern":e.isCaseSensitivePattern,"selected-types":e.selectedTypes,pattern:e.pattern,mode:e.mode,"inverse-pattern":e.isInverted,"manual-selection":e.manualSelection.includedValues,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","possible-values":a.demoValues},null,8,["case-sensitive-pattern","selected-types","pattern","mode","inverse-pattern","manual-selection","possible-values"]))])]),$,s("div",ee,[s("div",te,[(d(),m(r,{key:e.key,manualSelection:e.manualSelection2,"onUpdate:manualSelection":n[7]||(n[7]=i=>e.manualSelection2=i),size:7,"show-mode":"","with-mode-label":!0,"with-search-label":!0,"with-pattern-label":!0,"with-types-label":!0,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":a.demoValues},null,8,["manualSelection","possible-values"]))])]),ne,s("div",le,[s("div",se,[(d(),m(r,{key:e.key,manualSelection:e.manualSelection2,"onUpdate:manualSelection":n[8]||(n[8]=i=>e.manualSelection2=i),size:7,"show-mode":"","with-mode-label":!0,"with-search-label":!0,"with-pattern-label":!0,"with-types-label":!0,"left-label":"Select from the visible items","right-label":"The selected stuff",compact:"","possible-values":a.demoValues},null,8,["manualSelection","possible-values"]))])])]),s("section",null,[s("div",ae,[s("div",ie,[p(o,{summary:"Show usage example"},{default:c(()=>[T(b(e.codeExample),1)]),_:1}),p(o,{summary:"Show MultiModeTwinlist.vue source code"},{default:c(()=>[T(b(a.code),1)]),_:1})])])])])}const we=g(j,[["render",oe]]);export{we as default};
