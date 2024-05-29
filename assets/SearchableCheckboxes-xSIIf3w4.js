import{C as k}from"./CodeExample-oz6H8A5_.js";import{L as M}from"./Label-CngQPpRb.js";import{at as E,E as x,G as u,_ as w,r as S,o as f,c as g,b as t,j as T,w as V,d as m,l as I,t as p,Q as F,Y as P,n as N,h as O,F as A,e as _}from"./index-099kMGOp.js";import{C as j}from"./Checkboxes-lGvVdkD0.js";import{u as R,a as Z}from"./useSearch-s1H9ALfE.js";import{c as q}from"./createMissingItem-l6qmOyuX.js";import"./Checkbox-iuSlpew8.js";const D=`<script lang="ts">
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
  },
  emits: ["update:modelValue"],
  setup(props) {
    const possibleValues = ref(props.possibleValues);
    const selectedValues = ref(props.modelValue);
    const searchTerm = ref(props.initialSearchTerm);
    const caseSensitiveSearch = ref(props.initialCaseSensitiveSearch);

    const possibleValueMap = computed(() => {
      return Object.assign(
        {},
        ...possibleValues.value.map((obj: PossibleValue, index) => ({
          [obj.id]: { item: obj, index },
        })),
      ) as Record<Id, { item: PossibleValue; index: number }>;
    });

    const matchingValidIds = computed(() => {
      return possibleValues.value.map(
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
`,y=5,U=28,H={components:{Label:M,SearchInput:E,Checkboxes:j},props:{possibleValues:{type:Array,default:()=>{},validator(e){return Array.isArray(e)?e.every(a=>a.hasOwnProperty("id")&&a.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>{}},disabled:{type:Boolean,default:!1},withSearchLabel:{default:!1,type:Boolean},id:{type:String,default:null},initialCaseSensitiveSearch:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},size:{type:Number,default:5,validator(e){return e>=0}},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},emptyStateLabel:{type:String,default:"No entries in this list"},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},initialSearchTerm:{type:String,required:!1,default:""},showEmptyState:{default:!0,type:Boolean},isValid:{default:!0,type:Boolean},emptyStateComponent:{default:null,type:Object}},emits:["update:modelValue"],setup(e){const a=x(e.possibleValues),n=x(e.modelValue),r=x(e.initialSearchTerm),i=x(e.initialCaseSensitiveSearch),s=u(()=>Object.assign({},...a.value.map((l,o)=>({[l.id]:{item:l,index:o}})))),h=u(()=>a.value.map(l=>{var o;return(o=s.value[l.id])==null?void 0:o.item})),b=u(()=>{var l;return n.value?(l=n.value)==null?void 0:l.filter(o=>!s.value[o]):[]}),d=u(()=>{var l;return(l=b.value)==null?void 0:l.map(o=>q(o))}),c=u(()=>n.value===null?[]:[...d.value,...h.value]),v=u(()=>e.showSearch?R(r,i,c):c.value),z=u(()=>v.value.length===0?[]:v.value.filter(l=>c.value.includes(l))),B=u(()=>e.showSearch&&r.value!==""),C=u(()=>z.value.filter(o=>o.text.toLowerCase().includes(r.value.toLowerCase()))),L=u(()=>{var l,o;return e.showSearch?B.value?Z(C,h.value.length,n):`[ ${(o=n.value)==null?void 0:o.length} selected ]`:`[ ${(l=n.value)==null?void 0:l.length} selected ]`});return{selectedValues:n,searchTerm:r,visibleValues:c,concatenatedItems:z,caseSensitiveSearch:i,numLabelInfos:L,matchingInvalidValueIds:d,allItems:v}},computed:{withIsEmptyState(){return this.concatenatedItems.length===0},listSize(){if(this.possibleValues.length>=y){const e=this.size===0?this.possibleValues.length:this.size;return e>y?e:y}return this.size},cssStyleSize(){const e=`${this.listSize*U+2}px`;return this.listSize>0?{height:e}:{}},returnContainerRef(){return this.$refs.div},allignmentCheck(){return this.alignment==="vertical"?this.cssStyleSize:{height:"auto"}}},methods:{onSearchInput(e){this.searchTerm=e},onChange(e){this.$emit("update:modelValue",e),this.selectedValues=e},hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},handleMouseIn(){!this.disabled&&this.size>=y&&(this.returnContainerRef.style.overflow="auto")},handleMouseLeave(){this.returnContainerRef.style.overflow="hidden"},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},X={class:"checkboxes-wrapper"},G={class:"header"},Q={class:"title"},Y={key:0,class:"info"},J={key:0,class:"empty-state"};function K(e,a,n,r,i,s){const h=S("SearchInput"),b=S("Label"),d=S("Checkboxes");return f(),g(A,null,[t("div",X,[n.showSearch?(f(),T(b,{key:0,active:n.withSearchLabel,text:n.searchLabel,class:"search-wrapper"},{default:V(({labelForId:c})=>[m(h,{id:c,ref:"search",placeholder:n.searchPlaceholder,"model-value":r.searchTerm,label:n.searchLabel,"initial-case-sensitive-search":n.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:n.disabled,"onUpdate:modelValue":s.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=v=>r.caseSensitiveSearch=v)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):I("",!0),t("div",G,[t("div",Q,[r.numLabelInfos?(f(),g("div",Y,p(r.numLabelInfos),1)):I("",!0)])])]),t("div",{ref:"div",class:N(["container",{disabled:n.disabled,"empty-box":s.withIsEmptyState}]),style:O([s.allignmentCheck,s.cssStyleSize]),onMouseenter:a[1]||(a[1]=(...c)=>s.handleMouseIn&&s.handleMouseIn(...c)),onMouseleave:a[2]||(a[2]=(...c)=>s.handleMouseLeave&&s.handleMouseLeave(...c))},[F(m(d,{ref:"form","empty-state-label":n.emptyStateLabel,"empty-state-component":n.emptyStateComponent,"model-value":n.modelValue,alignment:n.alignment,"possible-values":r.concatenatedItems,"is-valid":n.isValid,disabled:n.disabled,"onUpdate:modelValue":s.onChange},null,8,["empty-state-label","empty-state-component","model-value","alignment","possible-values","is-valid","disabled","onUpdate:modelValue"]),[[P,!s.withIsEmptyState]]),!r.concatenatedItems.length&&s.withIsEmptyState?(f(),g("div",J,[t("span",null,p(n.emptyStateLabel),1)])):I("",!0)],38)],64)}const W=w(H,[["render",K],["__scopeId","data-v-f5f7179c"]]),$=`<SearchableCheckboxes
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

/>`,ee={components:{CodeExample:k,SearchableCheckboxes:W},data(){return{codeExample:$,selectedHorizontal:["bar","baz"],selectedVertical:[],missingValues:["bar","I am a missing Value"]}},computed:{code(){return D}}},te=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null," Checkboxes with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),ne={class:"grid-container"},ae={class:"grid-item-5"},se=t("span",null,"Horizontal",-1),le={class:"grid-item-2"},ie=t("br",null,null,-1),oe={class:"grid-container"},re={class:"grid-item-5"},de=t("span",null,"Vertical",-1),ce={class:"grid-item-2"},ue=t("br",null,null,-1),he={class:"grid-container"},me={class:"grid-item-5"},pe=t("span",null,"Disabled",-1),be=t("br",null,null,-1),ve={class:"grid-container"},fe={class:"grid-item-5"},Se=t("span",null,"It can has missing values",-1),xe={class:"grid-item-2"},ye={class:"grid-container"},ge={class:"grid-item-12"};function Ie(e,a,n,r,i,s){const h=S("SearchableCheckboxes",!0),b=S("CodeExample");return f(),g("div",null,[t("section",null,[te,t("div",ne,[t("div",ae,[se,m(h,{modelValue:i.selectedHorizontal,"onUpdate:modelValue":a[0]||(a[0]=d=>i.selectedHorizontal=d),"show-search":!0,"possible-values":[{id:"foo 1",text:"Foo 1"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"foo 2",text:"Foo 2"},{id:"bar 2",text:"Bar 2"},{id:"baz 2",text:"Baz 2"},{id:"foo 3",text:"Foo 3"},{id:"bar 3",text:"Bar 3"},{id:"baz 3",text:"Baz 3"},{id:"foo 4",text:"Foo 4"},{id:"bar 4",text:"Bar 4"},{id:"baz 4",text:"Baz 4"},{id:"foo 5",text:"Foo 5"},{id:"bar 5",text:"Bar 5"},{id:"baz 5",text:"Baz 5"},{id:"foo 6",text:"Foo 6"},{id:"bar 6",text:"Bar 6"},{id:"baz 6",text:"Baz 6"},{id:"foo 7",text:"Foo 7"},{id:"bar 7",text:"Bar 7"},{id:"baz 7",text:"Baz 7"},{id:"foo 8",text:"Foo 8"},{id:"bar 8",text:"Bar 8"},{id:"baz 8",text:"Baz 8"},{id:"foo 9",text:"Foo 9"},{id:"bar 9",text:"Bar 9"},{id:"baz 9",text:"Baz 9"},{id:"foo 10",text:"Foo 10"},{id:"bar 10",text:"Bar 10"},{id:"baz 10",text:"Baz 10"},{id:"foo 11",text:"Foo 11"},{id:"bar 11",text:"Bar 11"},{id:"baz 11",text:"Baz 11"},{id:"foo 12",text:"Foo 12"},{id:"bar 12",text:"Bar 12"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",le,"selected ids: "+p(i.selectedHorizontal),1)]),ie,t("div",oe,[t("div",re,[de,m(h,{modelValue:i.selectedVertical,"onUpdate:modelValue":a[1]||(a[1]=d=>i.selectedVertical=d),alignment:"vertical","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz 1",text:"Baz 1"},{id:"baz 2",text:"Baz 2"},{id:"baz 3",text:"Baz 3"},{id:"baz 4",text:"Baz 4"},{id:"baz 5",text:"Baz 6"},{id:"baz 6",text:"Baz 6"},{id:"baz 7",text:"Baz 7"},{id:"baz 8",text:"Baz 8"},{id:"baz 9",text:"Baz 9"},{id:"baz 10",text:"Baz 10"},{id:"baz 11",text:"Baz 11"},{id:"baz 12",text:"Baz 12"}]},null,8,["modelValue"])]),t("div",ce,"selected ids: "+p(i.selectedVertical),1)]),ue,t("div",he,[t("div",me,[pe,m(h,{"model-value":[],disabled:!0,"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]})])]),be,t("div",ve,[t("div",fe,[Se,m(h,{modelValue:i.missingValues,"onUpdate:modelValue":a[2]||(a[2]=d=>i.missingValues=d),"show-search":!0,size:3,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"}]},null,8,["modelValue"])]),t("div",xe,"selected ids: "+p(i.missingValues),1)])]),t("section",null,[t("div",ye,[t("div",ge,[m(b,{summary:"Show usage example"},{default:V(()=>[_(p(i.codeExample),1)]),_:1}),m(b,{summary:"Show SearchableCheckboxes.vue source code"},{default:V(()=>[_(p(s.code),1)]),_:1})])])])])}const ke=w(ee,[["render",Ie]]);export{ke as default};
