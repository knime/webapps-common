import{C as x}from"./CodeExample-196d5040.js";import{L as P}from"./Label-ace857d4.js";import{_ as I,a6 as M,r as d,o as u,c as w,j as y,w as h,d as r,l as v,v as _,n as k,b as l,e as b,t as m}from"./index-5120cc19.js";import{C as L}from"./Checkboxes-7df06587.js";import{V as C}from"./ValueSwitch-c09abfd9.js";import{T as U,f as T}from"./Twinlist-5961deb2.js";import{F as B}from"./filter-cacab68b.js";import"./Checkbox-5098445e.js";import"./BaseRadioButtons-fd5be440.js";import"./MultiselectListBox-4d788008.js";import"./StyledListItem-fdfd7530.js";import"./arrow-next-b8db4d75.js";const F={manual:"Manual",wildcard:"Wildcard",regex:"Regex",type:"Type"},A={components:{Label:P,FilterIcon:B,SearchInput:M,Checkboxes:L,ValueSwitch:C,Twinlist:U},props:{initialMode:{type:String,required:!1,default:"manual"},initialManuallySelected:{type:Array,default:()=>[]},initialIncludeUnknownValues:{type:Boolean,default:!1},initialPattern:{type:String,default:""},initialCaseSensitivePattern:{default:!1,type:Boolean},initialInversePattern:{default:!1,type:Boolean},withTypes:{type:Boolean,default:!0},initialSelectedTypes:{type:Array,default:()=>[]},showMode:{default:!1,type:Boolean},showUnknownValues:{default:!1,type:Boolean},showSearch:{default:!0,type:Boolean},disabled:{default:!1,type:Boolean},withModeLabel:{default:!1,type:Boolean},modeLabel:{type:String,required:!1,default:"Selection mode"},withPatternLabel:{default:!1,type:Boolean},patternLabel:{type:String,required:!1,default:"Pattern"},withTypesLabel:{default:!1,type:Boolean},typesLabel:{type:String,required:!1,default:"Selected types"},possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}},additionalPossibleTypes:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}}},emits:["input","includeUnknownValuesInput","patternInput","typesInput","modeInput","caseSensitivePatternInput","inversePatternInput"],data(){return{chosenValues:this.initialManuallySelected,chosenPattern:this.initialPattern,chosenTypes:this.initialSelectedTypes,invalidPossibleValueIds:new Set,mode:this.initialMode,caseSensitivePattern:this.initialCaseSensitivePattern,inversePattern:this.initialInversePattern,includeUnknownValues:this.initialIncludeUnknownValues}},computed:{possibleValueMap(){return Object.assign({},...this.possibleValues.map(e=>({[e.id]:e})))},possibleValueIds(){return this.possibleValues.map(({id:e})=>e)},possibleTypes(){const e=this.possibleValues.map(t=>t.type).filter(t=>t),n=e.map(t=>t.id);return[...this.additionalPossibleTypes.filter(t=>t&&!n.includes(t.id)),...e].filter(t=>t&&t.id!=="").filter((t,i,c)=>i===c.findIndex(o=>o.id===t.id&&o.text===t.text))},matchingValueIds(){return this.possibleValues.filter(e=>this.itemMatches(e)).map(e=>e.id)},selectedValues(){return this.mode==="manual"?this.chosenValues:this.matchingValueIds},deselectedValues(){return this.possibleValueIds.filter(e=>!this.selectedValues.includes(e))},selectionDisabled(){return this.disabled||this.mode!=="manual"},normalizedSearchTerm(){return this.mode==="manual"?null:T[this.mode].normalize(this.mode==="type"?this.chosenTypes:this.chosenPattern,this.caseSensitivePattern)},possibleModes(){let e=Object.entries(F).map(([n,s])=>({id:n,text:s}));return this.withTypes||(e=e.filter(n=>n.id!=="type")),e},possibleModeIds(){return this.possibleModes.map(e=>e.id)},unknownValuesVisible(){return this.showUnknownValues&&this.mode==="manual"}},watch:{selectedValues:{immediate:!0,handler(e,n){if(!n||e.length!==n.length||n.some((s,p)=>s!==e[p])){const s=this.mode==="manual",p={selected:this.selectedValues,isManual:s};s&&(p.deselected=this.deselectedValues),this.$emit("input",p)}}},includeUnknownValues(e){this.$emit("includeUnknownValuesInput",e)}},methods:{onManualInput(e){this.mode==="manual"&&(this.chosenValues=e)},onPatternInput(e){this.chosenPattern=e,this.$emit("patternInput",e)},onTypeInput(e){this.chosenTypes=e,this.$emit("typesInput",e,this.possibleTypes)},onModeChange(e){this.possibleModeIds.indexOf(e)!==-1&&(this.mode=e,this.$emit("modeInput",e))},onToggleCaseSensitivePattern(e){this.caseSensitivePattern=e,this.$emit("caseSensitivePatternInput",e)},onToggleInvsersePattern(e){this.inversePattern=e,this.$emit("inversePatternInput",e)},onUnkownColumnsInput(e){this.includeUnknownValues=e},validate(){return this.$refs.twinlist.validate()},hasSelection(){return this.selectedValues.length>0},itemMatches(e){const n=T[this.mode],s=e.type?e.type.id:void 0;return n.test(this.mode==="type"?s:e.text,this.normalizedSearchTerm,this.caseSensitivePattern,this.inversePattern)}}};function O(e,n,s,p,t,i){const c=d("ValueSwitch"),o=d("Label"),a=d("FilterIcon"),V=d("SearchInput"),S=d("Checkboxes"),g=d("Twinlist");return u(),w("div",{class:k(["multi-mode-twinlist",{disabled:s.disabled}])},[s.showMode?(u(),y(o,{key:0,active:s.withModeLabel,text:s.modeLabel,class:"label"},{default:h(({labelForId:f})=>[r(c,{id:f,ref:"mode","model-value":t.mode,disabled:s.disabled,"possible-values":i.possibleModes,"onUpdate:modelValue":i.onModeChange},null,8,["id","model-value","disabled","possible-values","onUpdate:modelValue"])]),_:1},8,["active","text"])):v("",!0),t.mode==="regex"||t.mode==="wildcard"?(u(),y(o,{key:1,active:s.withPatternLabel,text:s.patternLabel,class:"label"},{default:h(({labelForId:f})=>[r(V,{id:f,ref:"search","model-value":t.chosenPattern,label:s.patternLabel,"initial-case-sensitive-search":s.initialCaseSensitivePattern,"initial-inverse-search":s.initialInversePattern,placeholder:"Pattern","show-case-sensitive-search-button":"","show-inverse-search-button":"",disabled:s.disabled,"onUpdate:modelValue":i.onPatternInput,onToggleCaseSensitiveSearch:i.onToggleCaseSensitivePattern,onToggleInverseSearch:i.onToggleInvsersePattern},{icon:h(()=>[r(a)]),_:2},1032,["id","model-value","label","initial-case-sensitive-search","initial-inverse-search","disabled","onUpdate:modelValue","onToggleCaseSensitiveSearch","onToggleInverseSearch"])]),_:1},8,["active","text"])):v("",!0),t.mode==="type"&&i.possibleTypes.length>0?(u(),y(o,{key:2,active:s.withTypesLabel,text:s.typesLabel,class:"label"},{default:h(()=>[r(S,{"model-value":t.chosenTypes,"possible-values":i.possibleTypes,disabled:s.disabled,"onUpdate:modelValue":i.onTypeInput},null,8,["model-value","possible-values","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):v("",!0),r(g,_(e.$attrs,{ref:"twinlist",disabled:i.selectionDisabled,"show-search":t.mode==="manual"&&s.showSearch,"model-value":i.selectedValues,"possible-values":s.possibleValues,"show-unknown-values":i.unknownValuesVisible,"initial-include-unknown-values":t.includeUnknownValues,"onUpdate:modelValue":i.onManualInput,onIncludeUnknownValuesInput:i.onUnkownColumnsInput}),null,16,["disabled","show-search","model-value","possible-values","show-unknown-values","initial-include-unknown-values","onUpdate:modelValue","onIncludeUnknownValuesInput"])],2)}const z=I(A,[["render",O],["__scopeId","data-v-55f3efec"]]),j=`<script>
import Label from "./Label.vue";
import SearchInput from "./SearchInput.vue";
import Checkboxes from "./Checkboxes.vue";
import ValueSwitch from "./ValueSwitch.vue";
import Twinlist from "./Twinlist.vue";
import FilterIcon from "../../assets/img/icons/filter.svg";
import { filters } from "../../../util/filters";

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
      type: Array,
      default: () => [],
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
      type: Array,
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
      type: Array,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text")
        );
      },
    },
    /**
     * List of possible types which should be selectable but are not necessarily present in the possible values.
     */
    additionalPossibleTypes: {
      type: Array,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text")
        );
      },
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
  ],
  data() {
    return {
      chosenValues: this.initialManuallySelected,
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
    possibleValueMap() {
      // convert [{id: "key1", text: "asdf"}, ...] to {"key1": {id:"key1", text: "asdf"} ... }
      return Object.assign(
        {},
        ...this.possibleValues.map((obj) => ({ [obj.id]: obj }))
      );
    },
    possibleValueIds() {
      return this.possibleValues.map(({ id }) => id);
    },
    possibleTypes() {
      const possibleTypes = this.possibleValues
        .map((x) => x.type)
        .filter((type) => type);
      const possibleTypesIds = possibleTypes.map((type) => type.id);
      const additionalTypes = this.additionalPossibleTypes.filter(
        (type) => type && !possibleTypesIds.includes(type.id)
      );
      const allTypes = [...additionalTypes, ...possibleTypes];
      return allTypes
        .filter((type) => type && type.id !== "")
        .filter(
          // remove duplicates
          (val, index, self) =>
            index ===
            self.findIndex((t) => t.id === val.id && t.text === val.text)
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
    deselectedValues() {
      return this.possibleValueIds.filter(
        (id) => !this.selectedValues.includes(id)
      );
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
        this.caseSensitivePattern
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
      handler(newVal, oldVal) {
        if (
          !oldVal ||
          newVal.length !== oldVal.length ||
          oldVal.some((item, i) => item !== newVal[i])
        ) {
          const isManual = this.mode === "manual";
          const event = { selected: this.selectedValues, isManual };
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
  },
  methods: {
    onManualInput(value) {
      if (this.mode === "manual") {
        this.chosenValues = value;
      }
    },
    onPatternInput(value) {
      this.chosenPattern = value;
      this.$emit("patternInput", value);
    },
    onTypeInput(value) {
      this.chosenTypes = value;
      this.$emit("typesInput", value, this.possibleTypes);
    },
    onModeChange(value) {
      if (this.possibleModeIds.indexOf(value) !== -1) {
        this.mode = value;
        this.$emit("modeInput", value);
      }
    },
    onToggleCaseSensitivePattern(value) {
      this.caseSensitivePattern = value;
      this.$emit("caseSensitivePatternInput", value);
    },
    onToggleInvsersePattern(value) {
      this.inversePattern = value;
      this.$emit("inversePatternInput", value);
    },
    onUnkownColumnsInput(value) {
      this.includeUnknownValues = value;
    },
    validate() {
      return this.$refs.twinlist.validate();
    },
    hasSelection() {
      return this.selectedValues.length > 0;
    },
    itemMatches(item) {
      const mode = filters[this.mode];
      // Needed as optional chaining is currently not supported, should be removed after the switch to vue3
      // eslint-disable-next-line no-undefined
      const optionalItemType = item.type ? item.type.id : undefined;
      return mode.test(
        this.mode === "type" ? optionalItemType : item.text,
        this.normalizedSearchTerm,
        this.caseSensitivePattern,
        this.inversePattern
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
      :possible-values="possibleValues"
      :show-unknown-values="unknownValuesVisible"
      :initial-include-unknown-values="includeUnknownValues"
      @update:model-value="onManualInput"
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
`,E={components:{MultiModeTwinlist:z,CodeExample:x},data(){return{codeExample:q,selected:[],manuallySelected:["missing"],isCaseSensitivePattern:!0,isInverted:!1,mode:"regex",pattern:"^[ab].*[57]$|$",selectedTypes:["Type1","Type"],key:0}},computed:{code(){return j},settingsHash(){return[`${this.manuallySelected}`,`${this.isCaseSensitivePattern}`,`${this.isInverted}`,`${this.mode}`,`${this.pattern}`,`${this.selectedTypes}`].join(", ")},demoValues(){return[{id:"foo",text:"foo",type:{id:"type1",text:"Type 1"}},{id:"Foo",text:"Foo",type:{id:"type1",text:"Type 1"}},{id:"bar",text:"Bar",type:{id:"type2",text:"Type 2"}},...Array.from({length:6},(e,n)=>({id:`baz${n}`,text:`Baz${n}`,type:{id:` type${n}`,text:` Type ${n}`}})),{id:"spec1",text:"Special *.^",type:{id:"type1",text:"Type 1"}},{id:"spec2",text:"Special $?]",type:{id:"type2",text:"Type 2"}}]}},watch:{settingsHash(e,n){e!==n&&(this.key+=1)}}},D=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null," A MultiModeTwinlist with mode selection set to initial regex selection. The demo list include items with special characters that need to be escaped for regular expression filters. On type selection mode, the types of the possible values as well as an additional option are selectable. ")])],-1),N={class:"grid-container"},H={class:"grid-item-6"},R={class:"grid-item-6"},W={key:0},X=l("br",null,null,-1),G={class:"grid-container"},J={class:"grid-item-6"},K=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null,"Optionally, labels can be shown and customized:")])],-1),Q={class:"grid-container"},Y={class:"grid-item-6"},Z={class:"grid-container"},$={class:"grid-item-12"};function ee(e,n,s,p,t,i){const c=d("MultiModeTwinlist",!0),o=d("CodeExample");return u(),w("div",null,[l("section",null,[D,l("div",N,[l("div",H,[r(c,{size:7,"show-mode":"","initial-case-sensitive-pattern":t.isCaseSensitivePattern,"initial-selected-types":t.selectedTypes,"initial-pattern":t.pattern,"initial-mode":t.mode,"initial-inverse-pattern":t.isInverted,"initial-manually-selected":t.manuallySelected,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","possible-values":i.demoValues,onInput:n[0]||(n[0]=a=>{t.selected=a,a.isManual&&(t.manuallySelected=a.selected)}),onPatternInput:n[1]||(n[1]=a=>t.pattern=a),onModeInput:n[2]||(n[2]=a=>t.mode=a),onTypesInput:n[3]||(n[3]=a=>t.selectedTypes=a),onInversePatternInput:n[4]||(n[4]=a=>t.isInverted=a),onCaseSensitivePatternInput:n[5]||(n[5]=a=>t.isCaseSensitivePattern=a)},null,8,["initial-case-sensitive-pattern","initial-selected-types","initial-pattern","initial-mode","initial-inverse-pattern","initial-manually-selected","possible-values"])]),l("div",R,[b(" selected ids: "+m(t.selected.selected)+" ",1),t.selected.isManual?(u(),w("br",W)):v("",!0),b(" "+m(t.selected.isManual?"deselected ids: ":"")+m(t.selected.deselected),1)])]),X,l("div",G,[l("div",J,[(u(),y(c,{key:t.key,disabled:"",size:7,"show-mode":"","initial-case-sensitive-pattern":t.isCaseSensitivePattern,"initial-selected-types":t.selectedTypes,"initial-pattern":t.pattern,"initial-mode":t.mode,"initial-inverse-pattern":t.isInverted,"initial-manually-selected":t.manuallySelected,"additional-possible-types":[{id:"additionalId",text:"additionalOption"}],"left-label":"Select from the visible items","right-label":"The selected stuff","mode-label":"Selection mode","possible-values":i.demoValues},null,8,["initial-case-sensitive-pattern","initial-selected-types","initial-pattern","initial-mode","initial-inverse-pattern","initial-manually-selected","possible-values"]))])]),K,l("div",Q,[l("div",Y,[(u(),y(c,{key:t.key,size:7,"show-mode":"","with-mode-label":!0,"with-search-label":!0,"with-pattern-label":!0,"with-types-label":!0,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":i.demoValues},null,8,["possible-values"]))])])]),l("section",null,[l("div",Z,[l("div",$,[r(o,{summary:"Show usage example"},{default:h(()=>[b(m(t.codeExample),1)]),_:1}),r(o,{summary:"Show MultiModeTwinlist.vue source code"},{default:h(()=>[b(m(i.code),1)]),_:1})])])])])}const he=I(E,[["render",ee]]);export{he as default};
