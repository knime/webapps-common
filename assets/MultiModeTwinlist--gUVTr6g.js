import{C as P}from"./CodeExample-Hk4yfbmz.js";import{L as I}from"./Label-6ShWjpNA.js";import{at as M,a0 as _,_ as g,r as d,o as u,c as T,j as h,w as c,d as r,l as b,y as L,n as C,b as l,e as v,t as m,F as B}from"./index-fm9vnfBQ.js";import{C as k}from"./Checkboxes-OrPEFdpF.js";import{V as F}from"./ValueSwitch-8ugazcJd.js";import{T as z,u as U,f as S}from"./Twinlist-ODMOFq9U.js";import{F as A}from"./filter-mFw5-T54.js";import"./Checkbox-qLWr-9uy.js";import"./BaseRadioButtons-Cikc1KQ4.js";import"./MultiselectListBox-vq-u2ew_.js";import"./StyledListItem-bdVZVMpY.js";import"./arrow-next-D-3OyYl9.js";import"./createMissingItem-gAI5zZ9a.js";const O={manual:"Manual",wildcard:"Wildcard",regex:"Regex",type:"Type"},q={components:{Label:I,FilterIcon:A,SearchInput:M,Checkboxes:k,ValueSwitch:F,Twinlist:z},props:{mode:{type:String,required:!1,default:"manual"},manualSelection:{type:[Object,Array,null],default:()=>[]},pattern:{type:String,default:""},caseSensitivePattern:{default:!1,type:Boolean},inversePattern:{default:!1,type:Boolean},withTypes:{type:Boolean,default:!0},selectedTypes:{type:Array,default:()=>[]},showMode:{default:!1,type:Boolean},showSearch:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},withModeLabel:{default:!1,type:Boolean},modeLabel:{type:String,required:!1,default:"Selection mode"},withPatternLabel:{default:!1,type:Boolean},patternLabel:{type:String,required:!1,default:"Pattern"},withTypesLabel:{default:!1,type:Boolean},typesLabel:{type:String,required:!1,default:"Selected types"},possibleValues:{type:Array,default:()=>[]},additionalPossibleTypes:{type:Array,default:()=>[]}},emits:["update:manualSelection","update:pattern","update:selectedTypes","update:mode","update:caseSensitivePattern","update:inversePattern","update:selected"],setup(e){const{includedValues:n}=U(_(e,"manualSelection"));return{manuallySelected:n}},data(){return{invalidPossibleValueIds:new Set}},computed:{possibleValueIds(){return this.possibleValues.map(({id:e})=>e)},possibleTypes(){const e=this.possibleValues.map(({type:t})=>t).filter(Boolean),n=e.map(t=>t.id);return[...this.additionalPossibleTypes.filter(t=>t&&!n.includes(t.id)),...e].filter(t=>t&&t.id!=="").filter((t,a,p)=>a===p.findIndex(o=>o.id===t.id&&o.text===t.text))},matchingValueIds(){return this.possibleValues.filter(e=>this.itemMatches(e)).map(e=>e.id)},twinlistModelValue(){return this.mode==="manual"?this.manualSelection:this.matchingValueIds},selectedValues(){return this.mode==="manual"?this.manuallySelected:this.matchingValueIds},selectionDisabled(){return this.disabled||this.mode!=="manual"},normalizedSearchTerm(){return this.mode==="manual"?null:S[this.mode].normalize(this.mode==="type"?this.selectedTypes:this.pattern,this.caseSensitivePattern)},possibleModes(){let e=Object.entries(O).map(([n,s])=>({id:n,text:s}));return this.withTypes||(e=e.filter(n=>n.id!=="type")),e}},watch:{selectedValues:{immediate:!0,handler(e,n){!n||e===null||(e.length!==n.length||n.some((s,y)=>s!==e[y]))&&this.$emit("update:selected",this.selectedValues)}}},methods:{onManualInput(e){this.mode==="manual"&&this.$emit("update:manualSelection",e)},onPatternInput(e){this.$emit("update:pattern",e)},onTypeInput(e){this.$emit("update:selectedTypes",e,this.possibleTypes)},onModeChange(e){this.$emit("update:mode",e)},onToggleCaseSensitivePattern(e){this.$emit("update:caseSensitivePattern",e)},onToggleInversePattern(e){this.$emit("update:inversePattern",e)},validate(){return this.$refs.twinlist.validate()},hasSelection(){var e;return!!((e=this.selectedValues)!=null&&e.length)},itemMatches(e){var s;return S[this.mode].test(this.mode==="type"?(s=e.type)==null?void 0:s.id:e.text,this.normalizedSearchTerm,this.caseSensitivePattern,this.inversePattern)}}};function E(e,n,s,y,t,a){const p=d("ValueSwitch"),o=d("Label"),i=d("FilterIcon"),w=d("SearchInput"),V=d("Checkboxes"),x=d("Twinlist");return u(),T("div",{class:C(["multi-mode-twinlist",{disabled:s.disabled}])},[s.showMode?(u(),h(o,{key:0,active:s.withModeLabel,text:s.modeLabel,class:"label"},{default:c(({labelForId:f})=>[r(p,{id:f,ref:"mode","model-value":s.mode,disabled:s.disabled,"possible-values":a.possibleModes,"onUpdate:modelValue":a.onModeChange},null,8,["id","model-value","disabled","possible-values","onUpdate:modelValue"])]),_:1},8,["active","text"])):b("",!0),s.mode==="regex"||s.mode==="wildcard"?(u(),h(o,{key:1,active:s.withPatternLabel,text:s.patternLabel,class:"label"},{default:c(({labelForId:f})=>[r(w,{id:f,ref:"search","model-value":s.pattern,label:s.patternLabel,"initial-case-sensitive-search":s.caseSensitivePattern,"initial-inverse-search":s.inversePattern,placeholder:"Pattern","show-case-sensitive-search-button":"","show-inverse-search-button":"",disabled:s.disabled,tooltips:{inverseSearch:"Move matching to other side"},"onUpdate:modelValue":a.onPatternInput,onToggleCaseSensitiveSearch:a.onToggleCaseSensitivePattern,onToggleInverseSearch:a.onToggleInversePattern},{icon:c(()=>[r(i)]),_:2},1032,["id","model-value","label","initial-case-sensitive-search","initial-inverse-search","disabled","onUpdate:modelValue","onToggleCaseSensitiveSearch","onToggleInverseSearch"])]),_:1},8,["active","text"])):b("",!0),s.mode==="type"&&a.possibleTypes.length>0?(u(),h(o,{key:2,active:s.withTypesLabel,text:s.typesLabel,class:"label"},{default:c(()=>[r(V,{"model-value":s.selectedTypes,"possible-values":a.possibleTypes,disabled:s.disabled,"onUpdate:modelValue":a.onTypeInput},null,8,["model-value","possible-values","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):b("",!0),r(x,L(e.$attrs,{ref:"twinlist",disabled:a.selectionDisabled,"show-search":s.mode==="manual"&&s.showSearch,"model-value":a.twinlistModelValue,"possible-values":s.possibleValues,"onUpdate:modelValue":a.onManualInput}),null,16,["disabled","show-search","model-value","possible-values","onUpdate:modelValue"])],2)}const N=g(q,[["render",E],["__scopeId","data-v-bdf1cb29"]]),R=`<script lang="ts">
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
} from "./possibleValues/PossibleValue";
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
`,j={components:{MultiModeTwinlist:N,CodeExample:P},data(){return{codeExample:D,selected:[],manualSelection:{includedValues:["missing","spec1","spec2"],excludedValues:["also missing","foo","Channel Name","Reservation AOV"],includeUnknownValues:!0},isCaseSensitivePattern:!0,isInverted:!1,mode:"regex",pattern:"^[ab].*[57]$|$",selectedTypes:["Type1","Type"],key:0}},computed:{code(){return R},settingsHash(){return[`${this.manualSelection}`,`${this.isCaseSensitivePattern}`,`${this.isInverted}`,`${this.mode}`,`${this.pattern}`,`${this.selectedTypes}`].join(", ")},demoValues(){return[{id:"foo",text:"foo",type:{id:"type1",text:"Type 1"}},{id:"Channel Name",text:"Channel Name",type:{id:"type1",text:"Type 1"}},{id:"Reservation AOV",text:"Reservation AOV",type:{id:"type2",text:"Type 2"}},...Array.from({length:6},(e,n)=>({id:`baz${n}`,text:`Baz${n}`,type:{id:` type${n}`,text:` Type ${n}`}})),{id:"spec1",text:"Special *.^",type:{id:"type1",text:"Type 1"}},{id:"spec2",text:"Special $?]",type:{id:"type2",text:"Type 2"}}]}},watch:{settingsHash(e,n){e!==n&&(this.key+=1)}}},H=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null," A MultiModeTwinlist with mode selection set to initial regex selection. The demo list include items with special characters that need to be escaped for regular expression filters. On type selection mode, the types of the possible values as well as an additional option are selectable. ")])],-1),W={class:"grid-container"},X={class:"grid-item-6"},G={class:"grid-item-6"},J=l("br",null,null,-1),K=l("br",null,null,-1),Q=l("br",null,null,-1),Y={class:"grid-container"},Z={class:"grid-item-6"},$=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null,"Optionally, labels can be shown and customized:")])],-1),ee={class:"grid-container"},te={class:"grid-item-6"},ne={class:"grid-container"},se={class:"grid-item-12"};function le(e,n,s,y,t,a){const p=d("MultiModeTwinlist",!0),o=d("CodeExample");return u(),T("div",null,[l("section",null,[H,l("div",W,[l("div",X,[r(p,{pattern:t.pattern,"onUpdate:pattern":n[0]||(n[0]=i=>t.pattern=i),manualSelection:t.manualSelection,"onUpdate:manualSelection":n[1]||(n[1]=i=>t.manualSelection=i),"case-sensitive-pattern":t.isCaseSensitivePattern,"onUpdate:caseSensitivePattern":n[2]||(n[2]=i=>t.isCaseSensitivePattern=i),"inverse-pattern":t.isInverted,"onUpdate:inversePattern":n[3]||(n[3]=i=>t.isInverted=i),mode:t.mode,"onUpdate:mode":n[4]||(n[4]=i=>t.mode=i),"selected-types":t.selectedTypes,"onUpdate:selectedTypes":n[5]||(n[5]=i=>t.selectedTypes=i),"show-mode":"",size:7,"possible-values":a.demoValues,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","onUpdate:selected":n[6]||(n[6]=i=>{t.selected=i})},null,8,["pattern","manualSelection","case-sensitive-pattern","inverse-pattern","mode","selected-types","possible-values"])]),l("div",G,[v(" selected ids: "+m(t.selected)+" ",1),t.mode==="manual"?(u(),T(B,{key:0},[J,l("span",null," left: "+m(t.manualSelection.excludedValues),1),K,l("span",null," right: "+m(t.manualSelection.includedValues),1)],64)):b("",!0)])]),Q,l("div",Y,[l("div",Z,[(u(),h(p,{key:t.key,disabled:"",size:7,"show-mode":"","case-sensitive-pattern":t.isCaseSensitivePattern,"selected-types":t.selectedTypes,pattern:t.pattern,mode:t.mode,"inverse-pattern":t.isInverted,"manual-selection":t.manualSelection.includedValues,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","possible-values":a.demoValues},null,8,["case-sensitive-pattern","selected-types","pattern","mode","inverse-pattern","manual-selection","possible-values"]))])]),$,l("div",ee,[l("div",te,[(u(),h(p,{key:t.key,size:7,"show-mode":"","with-mode-label":!0,"with-search-label":!0,"with-pattern-label":!0,"with-types-label":!0,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":a.demoValues},null,8,["possible-values"]))])])]),l("section",null,[l("div",ne,[l("div",se,[r(o,{summary:"Show usage example"},{default:c(()=>[v(m(t.codeExample),1)]),_:1}),r(o,{summary:"Show MultiModeTwinlist.vue source code"},{default:c(()=>[v(m(a.code),1)]),_:1})])])])])}const ve=g(j,[["render",le]]);export{ve as default};
