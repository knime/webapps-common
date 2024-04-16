import{C as g}from"./CodeExample-I0T9PPj7.js";import{L as P}from"./Label-A9YWeNu7.js";import{at as M,_ as T,r as d,o as r,c as w,j as y,w as h,d as u,l as f,v as k,n as _,b as i,e as b,t as m}from"./index-hS3kbgGg.js";import{C}from"./Checkboxes-DaSB6y_W.js";import{V as L}from"./ValueSwitch-w3O1Drxb.js";import{T as U,f as V}from"./Twinlist-sW6sgnZP.js";import{F as B}from"./filter-bmwfmoYg.js";import"./Checkbox-Ek_hA2eH.js";import"./BaseRadioButtons-VSb9hNnu.js";import"./MultiselectListBox-mzoQLySG.js";import"./StyledListItem-E3oXGHmP.js";import"./arrow-next-3rDmQkVH.js";import"./createMissingItem-gAI5zZ9a.js";const D={manual:"Manual",wildcard:"Wildcard",regex:"Regex",type:"Type"},F={components:{Label:P,FilterIcon:B,SearchInput:M,Checkboxes:C,ValueSwitch:L,Twinlist:U},props:{initialMode:{type:String,required:!1,default:"manual"},initialManuallySelected:{type:Array,default:()=>[]},initialManuallyDeselected:{required:!1,type:Array,default:null},initialIncludeUnknownValues:{type:Boolean,default:!1},initialPattern:{type:String,default:""},initialCaseSensitivePattern:{default:!1,type:Boolean},initialInversePattern:{default:!1,type:Boolean},withTypes:{type:Boolean,default:!0},initialSelectedTypes:{type:Array,default:()=>[]},showMode:{default:!1,type:Boolean},showUnknownValues:{default:!1,type:Boolean},showSearch:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},withModeLabel:{default:!1,type:Boolean},modeLabel:{type:String,required:!1,default:"Selection mode"},withPatternLabel:{default:!1,type:Boolean},patternLabel:{type:String,required:!1,default:"Pattern"},withTypesLabel:{default:!1,type:Boolean},typesLabel:{type:String,required:!1,default:"Selected types"},possibleValues:{type:Array,default:()=>[]},additionalPossibleTypes:{type:Array,default:()=>[]}},emits:["input","includeUnknownValuesInput","patternInput","typesInput","modeInput","caseSensitivePatternInput","inversePatternInput","update:excludedValues"],data(){return{chosenValues:this.initialManuallySelected,manuallyDeselected:this.initialManuallyDeselected,chosenPattern:this.initialPattern,chosenTypes:this.initialSelectedTypes,invalidPossibleValueIds:new Set,mode:this.initialMode,caseSensitivePattern:this.initialCaseSensitivePattern,inversePattern:this.initialInversePattern,includeUnknownValues:this.initialIncludeUnknownValues}},computed:{possibleValueIds(){return this.possibleValues.map(({id:e})=>e)},possibleTypes(){const e=this.possibleValues.map(({type:n})=>n).filter(Boolean),t=e.map(n=>n.id);return[...this.additionalPossibleTypes.filter(n=>n&&!t.includes(n.id)),...e].filter(n=>n&&n.id!=="").filter((n,s,c)=>s===c.findIndex(o=>o.id===n.id&&o.text===n.text))},matchingValueIds(){return this.possibleValues.filter(e=>this.itemMatches(e)).map(e=>e.id)},selectedValues(){return this.mode==="manual"?this.chosenValues:this.matchingValueIds},excludedValues(){return this.mode==="manual"?this.manuallyDeselected:null},deselectedValues(){if(this.excludedValues)return this.excludedValues;const e=new Set(this.selectedValues??[]);return this.possibleValueIds.filter(t=>!e.has(t))},selectionDisabled(){return this.disabled||this.mode!=="manual"},normalizedSearchTerm(){return this.mode==="manual"?null:V[this.mode].normalize(this.mode==="type"?this.chosenTypes:this.chosenPattern,this.caseSensitivePattern)},possibleModes(){let e=Object.entries(D).map(([t,l])=>({id:t,text:l}));return this.withTypes||(e=e.filter(t=>t.id!=="type")),e},possibleModeIds(){return this.possibleModes.map(e=>e.id)},unknownValuesVisible(){return this.showUnknownValues&&this.mode==="manual"}},watch:{selectedValues:{immediate:!0,handler(e,t){if(!(!t||e===null)&&(e.length!==t.length||t.some((l,p)=>l!==e[p]))){const l=this.mode==="manual",p={selected:this.selectedValues,isManual:l};l&&(p.deselected=this.deselectedValues),this.$emit("input",p)}}},includeUnknownValues(e){this.$emit("includeUnknownValuesInput",e)},initialManuallySelected(e,t){(e===null||t===null)&&(this.chosenValues=e)},initialManuallyDeselected(e,t){(e===null||t===null)&&(this.manuallyDeselected=e)}},methods:{onManualInput(e){this.mode==="manual"&&(this.chosenValues=e)},onExcludedValuesUpdate(e){this.manuallyDeselected=e},onPatternInput(e){this.chosenPattern=e,this.$emit("patternInput",e)},onTypeInput(e){this.chosenTypes=e,this.$emit("typesInput",e,this.possibleTypes)},onModeChange(e){this.possibleModeIds.indexOf(e)!==-1&&(this.mode=e,this.$emit("modeInput",e))},onToggleCaseSensitivePattern(e){this.caseSensitivePattern=e,this.$emit("caseSensitivePatternInput",e)},onToggleInvsersePattern(e){this.inversePattern=e,this.$emit("inversePatternInput",e)},onUnkownColumnsInput(e){this.includeUnknownValues=e},validate(){return this.$refs.twinlist.validate()},hasSelection(){var e;return!!((e=this.selectedValues)!=null&&e.length)},itemMatches(e){var l;return V[this.mode].test(this.mode==="type"?(l=e.type)==null?void 0:l.id:e.text,this.normalizedSearchTerm,this.caseSensitivePattern,this.inversePattern)}}};function z(e,t,l,p,n,s){const c=d("ValueSwitch"),o=d("Label"),a=d("FilterIcon"),I=d("SearchInput"),x=d("Checkboxes"),S=d("Twinlist");return r(),w("div",{class:_(["multi-mode-twinlist",{disabled:l.disabled}])},[l.showMode?(r(),y(o,{key:0,active:l.withModeLabel,text:l.modeLabel,class:"label"},{default:h(({labelForId:v})=>[u(c,{id:v,ref:"mode","model-value":n.mode,disabled:l.disabled,"possible-values":s.possibleModes,"onUpdate:modelValue":s.onModeChange},null,8,["id","model-value","disabled","possible-values","onUpdate:modelValue"])]),_:1},8,["active","text"])):f("",!0),n.mode==="regex"||n.mode==="wildcard"?(r(),y(o,{key:1,active:l.withPatternLabel,text:l.patternLabel,class:"label"},{default:h(({labelForId:v})=>[u(I,{id:v,ref:"search","model-value":n.chosenPattern,label:l.patternLabel,"initial-case-sensitive-search":l.initialCaseSensitivePattern,"initial-inverse-search":l.initialInversePattern,placeholder:"Pattern","show-case-sensitive-search-button":"","show-inverse-search-button":"",disabled:l.disabled,tooltips:{inverseSearch:"Move matching to other side"},"onUpdate:modelValue":s.onPatternInput,onToggleCaseSensitiveSearch:s.onToggleCaseSensitivePattern,onToggleInverseSearch:s.onToggleInvsersePattern},{icon:h(()=>[u(a)]),_:2},1032,["id","model-value","label","initial-case-sensitive-search","initial-inverse-search","disabled","onUpdate:modelValue","onToggleCaseSensitiveSearch","onToggleInverseSearch"])]),_:1},8,["active","text"])):f("",!0),n.mode==="type"&&s.possibleTypes.length>0?(r(),y(o,{key:2,active:l.withTypesLabel,text:l.typesLabel,class:"label"},{default:h(()=>[u(x,{"model-value":n.chosenTypes,"possible-values":s.possibleTypes,disabled:l.disabled,"onUpdate:modelValue":s.onTypeInput},null,8,["model-value","possible-values","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):f("",!0),u(S,k(e.$attrs,{ref:"twinlist",disabled:s.selectionDisabled,"show-search":n.mode==="manual"&&l.showSearch,"model-value":s.selectedValues,"excluded-values":s.excludedValues,"possible-values":l.possibleValues,"show-unknown-values":s.unknownValuesVisible,"initial-include-unknown-values":n.includeUnknownValues,"onUpdate:modelValue":s.onManualInput,"onUpdate:excludedValues":s.onExcludedValuesUpdate,onIncludeUnknownValuesInput:s.onUnkownColumnsInput}),null,16,["disabled","show-search","model-value","excluded-values","possible-values","show-unknown-values","initial-include-unknown-values","onUpdate:modelValue","onUpdate:excludedValues","onIncludeUnknownValuesInput"])],2)}const A=T(F,[["render",z],["__scopeId","data-v-003db06f"]]),E=`<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "./SearchInput.vue";
import Checkboxes from "./Checkboxes.vue";
import ValueSwitch from "./ValueSwitch.vue";
import Twinlist from "./Twinlist.vue";
import {
  type PossibleValue as TwinlistPossibleValue,
  type Id,
} from "./possibleValues/PossibleValue";
import FilterIcon from "../../assets/img/icons/filter.svg";
import { filters } from "../../../util/filters";
import type { PropType } from "vue";

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
    initialMode: {
      type: String,
      required: false,
      default: "manual",
    },
    initialManuallySelected: {
      type: Array as PropType<Id[] | null>,
      default: () => [],
    },
    /**
     * Passed on to the Twinlist prop "excludedValues" in case of manual mode
     * Only required (in combination with the @update:excludedValues event) whenever missing excluded values are desired.
     * Because, if this prop is not set, the excluded list will simply be the possible values which are not part of the modelValue.
     */
    initialManuallyDeselected: {
      required: false,
      type: Array as PropType<Id[] | null>,
      default: null,
    },
    initialIncludeUnknownValues: {
      type: Boolean,
      default: false,
    },
    initialPattern: {
      type: String,
      default: "",
    },
    initialCaseSensitivePattern: {
      default: false,
      type: Boolean,
    },
    initialInversePattern: {
      default: false,
      type: Boolean,
    },
    withTypes: {
      type: Boolean,
      default: true,
    },
    initialSelectedTypes: {
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
    showUnknownValues: {
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
    "input",
    "includeUnknownValuesInput",
    "patternInput",
    "typesInput",
    "modeInput",
    "caseSensitivePatternInput",
    "inversePatternInput",
    /**
     * Propagated 1 to 1 from Twinlist.
     */
    "update:excludedValues",
  ],
  data() {
    return {
      chosenValues: this.initialManuallySelected,
      manuallyDeselected: this.initialManuallyDeselected,
      chosenPattern: this.initialPattern,
      chosenTypes: this.initialSelectedTypes,
      invalidPossibleValueIds: new Set(),
      mode: this.initialMode,
      caseSensitivePattern: this.initialCaseSensitivePattern,
      inversePattern: this.initialInversePattern,
      includeUnknownValues: this.initialIncludeUnknownValues,
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
    selectedValues() {
      return this.mode === "manual" ? this.chosenValues : this.matchingValueIds;
    },
    excludedValues() {
      return this.mode === "manual" ? this.manuallyDeselected : null;
    },
    deselectedValues() {
      if (this.excludedValues) {
        return this.excludedValues;
      }
      const selectedValuesSet = new Set(this.selectedValues ?? []);
      return this.possibleValueIds.filter((id) => !selectedValuesSet.has(id));
    },
    selectionDisabled() {
      return this.disabled || this.mode !== "manual";
    },
    normalizedSearchTerm() {
      if (this.mode === "manual") {
        return null;
      }
      return filters[this.mode].normalize(
        this.mode === "type" ? this.chosenTypes : this.chosenPattern,
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
    possibleModeIds() {
      return this.possibleModes.map((mode) => mode.id);
    },
    unknownValuesVisible() {
      return this.showUnknownValues && this.mode === "manual";
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
          const isManual = this.mode === "manual";
          const event = {
            selected: this.selectedValues,
            isManual,
          } as {
            selected: Id[];
            isManual: boolean;
            deselected?: Id[];
          };
          if (isManual) {
            event.deselected = this.deselectedValues;
          }
          this.$emit("input", event);
        }
      },
    },
    includeUnknownValues(newVal) {
      this.$emit("includeUnknownValuesInput", newVal);
    },
    initialManuallySelected(newVal, oldVal) {
      if (newVal === null || oldVal === null) {
        this.chosenValues = newVal;
      }
    },
    initialManuallyDeselected(newVal, oldVal) {
      if (newVal === null || oldVal === null) {
        this.manuallyDeselected = newVal;
      }
    },
  },
  methods: {
    onManualInput(value: Id[]) {
      if (this.mode === "manual") {
        this.chosenValues = value;
      }
    },
    onExcludedValuesUpdate(excludedValues: Id[]) {
      this.manuallyDeselected = excludedValues;
    },
    onPatternInput(value: string) {
      this.chosenPattern = value;
      this.$emit("patternInput", value);
    },
    onTypeInput(value: string[]) {
      this.chosenTypes = value;
      this.$emit("typesInput", value, this.possibleTypes);
    },
    onModeChange(value: keyof typeof allModes) {
      if (this.possibleModeIds.indexOf(value) !== -1) {
        this.mode = value;
        this.$emit("modeInput", value);
      }
    },
    onToggleCaseSensitivePattern(value: boolean) {
      this.caseSensitivePattern = value;
      this.$emit("caseSensitivePatternInput", value);
    },
    onToggleInvsersePattern(value: boolean) {
      this.inversePattern = value;
      this.$emit("inversePatternInput", value);
    },
    onUnkownColumnsInput(value: boolean) {
      this.includeUnknownValues = value;
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
        :model-value="chosenPattern"
        :label="patternLabel"
        :initial-case-sensitive-search="initialCaseSensitivePattern"
        :initial-inverse-search="initialInversePattern"
        placeholder="Pattern"
        show-case-sensitive-search-button
        show-inverse-search-button
        :disabled="disabled"
        :tooltips="{
          inverseSearch: 'Move matching to other side',
        }"
        @update:model-value="onPatternInput"
        @toggle-case-sensitive-search="onToggleCaseSensitivePattern"
        @toggle-inverse-search="onToggleInvsersePattern"
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
        :model-value="chosenTypes"
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
      :model-value="selectedValues"
      :excluded-values="excludedValues"
      :possible-values="possibleValues"
      :show-unknown-values="unknownValuesVisible"
      :initial-include-unknown-values="includeUnknownValues"
      @update:model-value="onManualInput"
      @update:excluded-values="onExcludedValuesUpdate"
      @include-unknown-values-input="onUnkownColumnsInput"
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
`,q=`<MultiModeTwinlist
  :size="7"
  show-mode
  initial-case-sensitive-pattern
  left-label="Select from the 7 visible items (size)"
  right-label="The selected stuff"
  mode-label="Selection mode"
  initial-pattern="^[ab].*[357]$|$"
  :initial-selected-types="['Type1', 'Type3']"
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
`,O={components:{MultiModeTwinlist:A,CodeExample:g},data(){return{codeExample:q,selected:[],manuallySelected:["missing"],isCaseSensitivePattern:!0,isInverted:!1,mode:"regex",pattern:"^[ab].*[57]$|$",selectedTypes:["Type1","Type"],key:0}},computed:{code(){return E},settingsHash(){return[`${this.manuallySelected}`,`${this.isCaseSensitivePattern}`,`${this.isInverted}`,`${this.mode}`,`${this.pattern}`,`${this.selectedTypes}`].join(", ")},demoValues(){return[{id:"foo",text:"foo",type:{id:"type1",text:"Type 1"}},{id:"Channel Name",text:"Channel Name",type:{id:"type1",text:"Type 1"}},{id:"Reservation AOV",text:"Reservation AOV",type:{id:"type2",text:"Type 2"}},...Array.from({length:6},(e,t)=>({id:`baz${t}`,text:`Baz${t}`,type:{id:` type${t}`,text:` Type ${t}`}})),{id:"spec1",text:"Special *.^",type:{id:"type1",text:"Type 1"}},{id:"spec2",text:"Special $?]",type:{id:"type2",text:"Type 2"}}]}},watch:{settingsHash(e,t){e!==t&&(this.key+=1)}}},N=i("div",{class:"grid-container"},[i("div",{class:"grid-item-12"},[i("p",null," A MultiModeTwinlist with mode selection set to initial regex selection. The demo list include items with special characters that need to be escaped for regular expression filters. On type selection mode, the types of the possible values as well as an additional option are selectable. ")])],-1),j={class:"grid-container"},R={class:"grid-item-6"},H={class:"grid-item-6"},W={key:0},X=i("br",null,null,-1),G={class:"grid-container"},J={class:"grid-item-6"},K=i("div",{class:"grid-container"},[i("div",{class:"grid-item-12"},[i("p",null,"Optionally, labels can be shown and customized:")])],-1),Q={class:"grid-container"},Y={class:"grid-item-6"},Z={class:"grid-container"},$={class:"grid-item-12"};function ee(e,t,l,p,n,s){const c=d("MultiModeTwinlist",!0),o=d("CodeExample");return r(),w("div",null,[i("section",null,[N,i("div",j,[i("div",R,[u(c,{size:7,"show-mode":"","initial-case-sensitive-pattern":n.isCaseSensitivePattern,"initial-selected-types":n.selectedTypes,"initial-pattern":n.pattern,"initial-mode":n.mode,"initial-inverse-pattern":n.isInverted,"initial-manually-selected":n.manuallySelected,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","possible-values":s.demoValues,onInput:t[0]||(t[0]=a=>{n.selected=a,a.isManual&&(n.manuallySelected=a.selected)}),onPatternInput:t[1]||(t[1]=a=>n.pattern=a),onModeInput:t[2]||(t[2]=a=>n.mode=a),onTypesInput:t[3]||(t[3]=a=>n.selectedTypes=a),onInversePatternInput:t[4]||(t[4]=a=>n.isInverted=a),onCaseSensitivePatternInput:t[5]||(t[5]=a=>n.isCaseSensitivePattern=a)},null,8,["initial-case-sensitive-pattern","initial-selected-types","initial-pattern","initial-mode","initial-inverse-pattern","initial-manually-selected","possible-values"])]),i("div",H,[b(" selected ids: "+m(n.selected.selected)+" ",1),n.selected.isManual?(r(),w("br",W)):f("",!0),b(" "+m(n.selected.isManual?"deselected ids: ":"")+m(n.selected.deselected),1)])]),X,i("div",G,[i("div",J,[(r(),y(c,{key:n.key,disabled:"",size:7,"show-mode":"","initial-case-sensitive-pattern":n.isCaseSensitivePattern,"initial-selected-types":n.selectedTypes,"initial-pattern":n.pattern,"initial-mode":n.mode,"initial-inverse-pattern":n.isInverted,"initial-manually-selected":n.manuallySelected,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","possible-values":s.demoValues},null,8,["initial-case-sensitive-pattern","initial-selected-types","initial-pattern","initial-mode","initial-inverse-pattern","initial-manually-selected","possible-values"]))])]),K,i("div",Q,[i("div",Y,[(r(),y(c,{key:n.key,size:7,"show-mode":"","with-mode-label":!0,"with-search-label":!0,"with-pattern-label":!0,"with-types-label":!0,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":s.demoValues},null,8,["possible-values"]))])])]),i("section",null,[i("div",Z,[i("div",$,[u(o,{summary:"Show usage example"},{default:h(()=>[b(m(n.codeExample),1)]),_:1}),u(o,{summary:"Show MultiModeTwinlist.vue source code"},{default:h(()=>[b(m(s.code),1)]),_:1})])])])])}const me=T(O,[["render",ee]]);export{me as default};
