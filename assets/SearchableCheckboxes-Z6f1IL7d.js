import{C as L}from"./CodeExample-w4OHw7Vv.js";import{L as k}from"./Label-IMNe067z.js";import{at as M,E as g,G as c,_,r as f,o as v,c as y,b as t,j as E,w as z,d as m,l as I,t as b,Q as F,Y as T,n as P,h as N,F as O,e as V}from"./index-sjtTwBE-.js";import{C as A}from"./Checkboxes-1Xdf20Kd.js";import{u as j,a as R}from"./useSearch-qBcRtJzy.js";import{c as Z}from"./createMissingItem-l6qmOyuX.js";import"./Checkbox-xS9S-RB2.js";const q=`<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import Checkboxes from "../forms/Checkboxes.vue";
import { ref, computed } from "vue";
import type { PropType, Ref } from "vue";
import {
  useSearch,
  useLabelInfo,
  type Id,
  type PossibleValue,
  createMissingItem,
} from "./possibleValues";

const MIN_LIST_SIZE = 5;
const DEF_PIX_SIZE = 28;

export default {
  components: { Label, SearchInput, Checkboxes },

  props: {
    /**
     *  selected value (which is a list of ids of entries)
     */
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => {},
      validator(values: PossibleValue) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    modelValue: {
      type: Array as PropType<Id[] | null>,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    withSearchLabel: {
      default: false,
      type: Boolean,
    },
    id: {
      type: String,
      default: null,
    },
    initialCaseSensitiveSearch: {
      default: false,
      type: Boolean,
    },

    showSearch: {
      type: Boolean,
      default: false,
    },

    /**
     * Controls the size of the list.
     * Number of visible items (for others user need to scroll)
     * - 0 means all
     * - values 1 - 4  are ignored; 5 is minimum
     */

    size: {
      type: Number,
      default: 5,
      validator(value: number) {
        return value >= 0;
      },
    },
    /**
     * Labels
     */
    searchLabel: {
      type: String,
      required: false,
      default: "",
    },
    searchPlaceholder: {
      type: String,
      required: false,
      default: "Search",
    },
    /**
     * controls the alignment
     */
    alignment: {
      type: String,
      default: "horizontal",
      validator(value: string) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
    /**
     * Is only used when emptyStateComponent is null
     */

    emptyStateLabel: {
      type: String,
      default: "No entries in this list",
    },
    filterChosenValuesOnPossibleValuesChange: {
      type: Boolean,
      default: true,
      required: false,
    },
    initialSearchTerm: {
      type: String,
      required: false,
      default: "",
    },
    showEmptyState: {
      default: true,
      type: Boolean,
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    /**
     * Is only used when emptyStateComponent is null
     */

    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
      default: null,
      type: Object,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props) {
    const selectedValues = ref(props.modelValue);
    const searchTerm = ref(props.initialSearchTerm);
    const caseSensitiveSearch = ref(props.initialCaseSensitiveSearch);

    const possibleValueMap = computed(() => {
      return Object.assign(
        {},
        ...props.possibleValues.map((obj: PossibleValue, index) => ({
          [obj.id]: { item: obj, index },
        })),
      ) as Record<Id, { item: PossibleValue; index: number }>;
    });

    const matchingValidIds = computed(() => {
      return props.possibleValues.map(
        (possibleValue) =>
          possibleValueMap.value[possibleValue.id]?.item as PossibleValue,
      );
    });

    const invalidValueIds = computed(() => {
      if (!selectedValues.value) {
        return [];
      }
      return selectedValues.value?.filter(
        (x: Id) => !possibleValueMap.value[x],
      );
    });

    const matchingInvalidValueIds = computed(() => {
      return invalidValueIds.value?.map((item: Id) => createMissingItem(item));
    });

    const visibleValues = computed(() => {
      if (selectedValues.value === null) {
        return [];
      }
      return [...matchingInvalidValueIds.value, ...matchingValidIds.value];
    });

    const allItems = computed(() => {
      if (!props.showSearch) {
        return visibleValues.value;
      }
      return useSearch(searchTerm, caseSensitiveSearch, visibleValues);
    });

    const concatenatedItems = computed(() => {
      if (allItems.value.length === 0) {
        return [];
      }
      return allItems.value.filter((value: PossibleValue) =>
        visibleValues.value.includes(value),
      );
    });

    const hasActiveSearch = computed(() => {
      return props.showSearch && searchTerm.value !== "";
    });

    const numMatchedSearchedItems = computed(() => {
      const filteredList = concatenatedItems.value.filter(
        (item: { text: string }) =>
          item.text.toLowerCase().includes(searchTerm.value.toLowerCase()),
      );
      return filteredList;
    });

    const numLabelInfos = computed(() => {
      if (!props.showSearch) {
        return \`[ \${selectedValues.value?.length} selected ]\`;
      }
      return hasActiveSearch.value
        ? useLabelInfo(
            numMatchedSearchedItems,
            matchingValidIds.value.length,
            selectedValues as Ref<Id[]>,
          )
        : \`[ \${selectedValues.value?.length} selected ]\`;
    });
    return {
      selectedValues,
      searchTerm,
      visibleValues,
      concatenatedItems,
      caseSensitiveSearch,
      numLabelInfos,
      matchingInvalidValueIds,
      allItems,
    };
  },

  computed: {
    withIsEmptyState() {
      return this.concatenatedItems.length === 0;
    },
    listSize() {
      if (this.possibleValues.length >= MIN_LIST_SIZE) {
        const size = this.size === 0 ? this.possibleValues.length : this.size;
        return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
      }
      return this.size;
    },
    cssStyleSize() {
      const pixSize = \`\${this.listSize * DEF_PIX_SIZE + 2}px\`;
      return this.listSize > 0 ? { height: pixSize } : {};
    },
    returnContainerRef() {
      return this.$refs.div as HTMLDivElement;
    },
    allignmentCheck() {
      if (this.alignment === "vertical") {
        const calcedStyle = this.cssStyleSize;

        return calcedStyle;
      }
      return { height: "auto" };
    },
  },
  methods: {
    onSearchInput(value: string) {
      this.searchTerm = value;
    },
    onChange(newVal: Id[]) {
      this.$emit("update:modelValue", newVal);
      this.selectedValues = newVal;
    },
    hasSelection() {
      return (this.selectedValues?.length ?? 0) > 0;
    },

    handleMouseIn() {
      if (!this.disabled && this.size >= MIN_LIST_SIZE) {
        this.returnContainerRef.style.overflow = "auto";
      }
    },
    handleMouseLeave() {
      this.returnContainerRef.style.overflow = "hidden";
    },
    validate() {
      let isValid = !this.concatenatedItems.some(
        (x: PossibleValue) => x.invalid,
      );
      return {
        isValid,
        errorMessage: isValid
          ? null
          : "One or more of the selected items is invalid.",
      };
    },
  },
};
<\/script>

<template>
  <div class="checkboxes-wrapper">
    <Label
      v-if="showSearch"
      #default="{ labelForId }"
      :active="withSearchLabel"
      :text="searchLabel"
      class="search-wrapper"
    >
      <SearchInput
        :id="labelForId"
        ref="search"
        :placeholder="searchPlaceholder"
        :model-value="searchTerm"
        :label="searchLabel"
        :initial-case-sensitive-search="initialCaseSensitiveSearch"
        show-case-sensitive-search-button
        :disabled="disabled"
        :compact="compact"
        @update:model-value="onSearchInput"
        @toggle-case-sensitive-search="caseSensitiveSearch = $event"
      />
    </Label>
    <div class="header">
      <div class="title">
        <div v-if="numLabelInfos" class="info">{{ numLabelInfos }}</div>
      </div>
    </div>
  </div>

  <div
    ref="div"
    class="container"
    :class="{ disabled, 'empty-box': withIsEmptyState }"
    :style="[allignmentCheck, cssStyleSize]"
    @mouseenter="handleMouseIn"
    @mouseleave="handleMouseLeave"
  >
    <Checkboxes
      v-show="!withIsEmptyState"
      ref="form"
      :empty-state-label="emptyStateLabel"
      :empty-state-component="emptyStateComponent"
      :model-value="modelValue"
      :alignment="alignment"
      :possible-values="concatenatedItems"
      :is-valid="isValid"
      :disabled="disabled"
      @update:model-value="onChange"
    />
    <div
      v-if="!concatenatedItems.length && withIsEmptyState"
      class="empty-state"
    >
      <span>
        {{ emptyStateLabel }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.checkboxes-wrapper {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  --button-bar-width: 30px;

  & .header {
    display: flex;
    align-items: stretch;
    flex-direction: row;
    justify-content: flex-end;
    height: 20px;

    & .info {
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 8px;
      font-weight: 300;
      white-space: nowrap;
      display: flex;
    }

    & .title {
      line-height: 18px;
      margin-bottom: 3px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 5px;
    }
  }
}

.container {
  overflow: hidden;
}

& .empty-box {
  background: var(--theme-empty-multiselect-listbox-background-color);

  & .empty-state {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & span {
      color: var(--theme-dropdown-foreground-color);
      font-style: italic;
      font-size: 10px;
    }
  }
}
</style>
`,x=5,D=28,U={components:{Label:k,SearchInput:M,Checkboxes:A},props:{possibleValues:{type:Array,default:()=>{},validator(e){return Array.isArray(e)?e.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>{}},disabled:{type:Boolean,default:!1},withSearchLabel:{default:!1,type:Boolean},id:{type:String,default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},size:{type:Number,default:5,validator(e){return e>=0}},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},emptyStateLabel:{type:String,default:"No entries in this list"},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},initialSearchTerm:{type:String,required:!1,default:""},showEmptyState:{default:!0,type:Boolean},isValid:{default:!0,type:Boolean},emptyStateComponent:{default:null,type:Object},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const n=g(e.modelValue),a=g(e.initialSearchTerm),d=g(e.initialCaseSensitiveSearch),i=c(()=>Object.assign({},...e.possibleValues.map((l,o)=>({[l.id]:{item:l,index:o}})))),s=c(()=>e.possibleValues.map(l=>{var o;return(o=i.value[l.id])==null?void 0:o.item})),u=c(()=>{var l;return n.value?(l=n.value)==null?void 0:l.filter(o=>!i.value[o]):[]}),p=c(()=>{var l;return(l=u.value)==null?void 0:l.map(o=>Z(o))}),r=c(()=>n.value===null?[]:[...p.value,...s.value]),h=c(()=>e.showSearch?j(a,d,r):r.value),S=c(()=>h.value.length===0?[]:h.value.filter(l=>r.value.includes(l))),w=c(()=>e.showSearch&&a.value!==""),B=c(()=>S.value.filter(o=>o.text.toLowerCase().includes(a.value.toLowerCase()))),C=c(()=>{var l,o;return e.showSearch?w.value?R(B,s.value.length,n):`[ ${(o=n.value)==null?void 0:o.length} selected ]`:`[ ${(l=n.value)==null?void 0:l.length} selected ]`});return{selectedValues:n,searchTerm:a,visibleValues:r,concatenatedItems:S,caseSensitiveSearch:d,numLabelInfos:C,matchingInvalidValueIds:p,allItems:h}},computed:{withIsEmptyState(){return this.concatenatedItems.length===0},listSize(){if(this.possibleValues.length>=x){const e=this.size===0?this.possibleValues.length:this.size;return e>x?e:x}return this.size},cssStyleSize(){const e=`${this.listSize*D+2}px`;return this.listSize>0?{height:e}:{}},returnContainerRef(){return this.$refs.div},allignmentCheck(){return this.alignment==="vertical"?this.cssStyleSize:{height:"auto"}}},methods:{onSearchInput(e){this.searchTerm=e},onChange(e){this.$emit("update:modelValue",e),this.selectedValues=e},hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},handleMouseIn(){!this.disabled&&this.size>=x&&(this.returnContainerRef.style.overflow="auto")},handleMouseLeave(){this.returnContainerRef.style.overflow="hidden"},validate(){let e=!this.concatenatedItems.some(n=>n.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},H={class:"checkboxes-wrapper"},X={class:"header"},G={class:"title"},Q={key:0,class:"info"},Y={key:0,class:"empty-state"};function J(e,n,a,d,i,s){const u=f("SearchInput"),p=f("Label"),r=f("Checkboxes");return v(),y(O,null,[t("div",H,[a.showSearch?(v(),E(p,{key:0,active:a.withSearchLabel,text:a.searchLabel,class:"search-wrapper"},{default:z(({labelForId:h})=>[m(u,{id:h,ref:"search",placeholder:a.searchPlaceholder,"model-value":d.searchTerm,label:a.searchLabel,"initial-case-sensitive-search":a.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:a.disabled,compact:a.compact,"onUpdate:modelValue":s.onSearchInput,onToggleCaseSensitiveSearch:n[0]||(n[0]=S=>d.caseSensitiveSearch=S)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):I("",!0),t("div",X,[t("div",G,[d.numLabelInfos?(v(),y("div",Q,b(d.numLabelInfos),1)):I("",!0)])])]),t("div",{ref:"div",class:P(["container",{disabled:a.disabled,"empty-box":s.withIsEmptyState}]),style:N([s.allignmentCheck,s.cssStyleSize]),onMouseenter:n[1]||(n[1]=(...h)=>s.handleMouseIn&&s.handleMouseIn(...h)),onMouseleave:n[2]||(n[2]=(...h)=>s.handleMouseLeave&&s.handleMouseLeave(...h))},[F(m(r,{ref:"form","empty-state-label":a.emptyStateLabel,"empty-state-component":a.emptyStateComponent,"model-value":a.modelValue,alignment:a.alignment,"possible-values":d.concatenatedItems,"is-valid":a.isValid,disabled:a.disabled,"onUpdate:modelValue":s.onChange},null,8,["empty-state-label","empty-state-component","model-value","alignment","possible-values","is-valid","disabled","onUpdate:modelValue"]),[[T,!s.withIsEmptyState]]),!d.concatenatedItems.length&&s.withIsEmptyState?(v(),y("div",Y,[t("span",null,b(a.emptyStateLabel),1)])):I("",!0)],38)],64)}const K=_(U,[["render",J],["__scopeId","data-v-b02f162c"]]),W=`<SearchableCheckboxes
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

/>`,$={components:{CodeExample:L,SearchableCheckboxes:K},data(){return{codeExample:W,selectedHorizontal:["bar","baz"],selectedVertical:[],missingValues:["bar","I am a missing Value"]}},computed:{code(){return q}}},ee=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Checkboxes with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),te={class:"grid-container"},ne={class:"grid-item-5"},ae=t("span",null,"Horizontal",-1),se={class:"grid-item-2"},le=t("br",null,null,-1),ie={class:"grid-container"},oe={class:"grid-item-5"},re=t("span",null,"Vertical",-1),de={class:"grid-item-2"},ce=t("br",null,null,-1),ue={class:"grid-container"},he={class:"grid-item-5"},me=t("span",null,"Disabled",-1),pe=t("br",null,null,-1),be={class:"grid-container"},ve={class:"grid-item-5"},fe=t("span",null,"It can has missing values",-1),Se={class:"grid-item-2"},xe=t("br",null,null,-1),ye={class:"grid-container"},ge={class:"grid-item-5"},Ie=t("span",null,"Compact",-1),ze={class:"grid-container"},Ve={class:"grid-item-12"};function _e(e,n,a,d,i,s){const u=f("SearchableCheckboxes",!0),p=f("CodeExample");return v(),y("div",null,[t("section",null,[ee,t("div",te,[t("div",ne,[ae,m(u,{modelValue:i.selectedHorizontal,"onUpdate:modelValue":n[0]||(n[0]=r=>i.selectedHorizontal=r),"show-search":!0,"possible-values":[{id:"foo 1",text:"Foo 1"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"foo 2",text:"Foo 2"},{id:"bar 2",text:"Bar 2"},{id:"baz 2",text:"Baz 2"},{id:"foo 3",text:"Foo 3"},{id:"bar 3",text:"Bar 3"},{id:"baz 3",text:"Baz 3"},{id:"foo 4",text:"Foo 4"},{id:"bar 4",text:"Bar 4"},{id:"baz 4",text:"Baz 4"},{id:"foo 5",text:"Foo 5"},{id:"bar 5",text:"Bar 5"},{id:"baz 5",text:"Baz 5"},{id:"foo 6",text:"Foo 6"},{id:"bar 6",text:"Bar 6"},{id:"baz 6",text:"Baz 6"},{id:"foo 7",text:"Foo 7"},{id:"bar 7",text:"Bar 7"},{id:"baz 7",text:"Baz 7"},{id:"foo 8",text:"Foo 8"},{id:"bar 8",text:"Bar 8"},{id:"baz 8",text:"Baz 8"},{id:"foo 9",text:"Foo 9"},{id:"bar 9",text:"Bar 9"},{id:"baz 9",text:"Baz 9"},{id:"foo 10",text:"Foo 10"},{id:"bar 10",text:"Bar 10"},{id:"baz 10",text:"Baz 10"},{id:"foo 11",text:"Foo 11"},{id:"bar 11",text:"Bar 11"},{id:"baz 11",text:"Baz 11"},{id:"foo 12",text:"Foo 12"},{id:"bar 12",text:"Bar 12"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",se,"selected ids: "+b(i.selectedHorizontal),1)]),le,t("div",ie,[t("div",oe,[re,m(u,{modelValue:i.selectedVertical,"onUpdate:modelValue":n[1]||(n[1]=r=>i.selectedVertical=r),alignment:"vertical","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz 1",text:"Baz 1"},{id:"baz 2",text:"Baz 2"},{id:"baz 3",text:"Baz 3"},{id:"baz 4",text:"Baz 4"},{id:"baz 5",text:"Baz 6"},{id:"baz 6",text:"Baz 6"},{id:"baz 7",text:"Baz 7"},{id:"baz 8",text:"Baz 8"},{id:"baz 9",text:"Baz 9"},{id:"baz 10",text:"Baz 10"},{id:"baz 11",text:"Baz 11"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",de,"selected ids: "+b(i.selectedVertical),1)]),ce,t("div",ue,[t("div",he,[me,m(u,{"model-value":[],disabled:!0,"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])]),pe,t("div",be,[t("div",ve,[fe,m(u,{modelValue:i.missingValues,"onUpdate:modelValue":n[2]||(n[2]=r=>i.missingValues=r),"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),t("div",Se,"selected ids: "+b(i.missingValues),1)]),xe,t("div",ye,[t("div",ge,[Ie,m(u,{"model-value":[],disabled:!0,"show-search":!0,size:3,compact:"","possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])])]),t("section",null,[t("div",ze,[t("div",Ve,[m(p,{summary:"Show usage example"},{default:z(()=>[V(b(i.codeExample),1)]),_:1}),m(p,{summary:"Show SearchableCheckboxes.vue source code"},{default:z(()=>[V(b(s.code),1)]),_:1})])])])])}const Fe=_($,[["render",_e]]);export{Fe as default};
