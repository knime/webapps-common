import{C as M}from"./CodeExample-9wTT2Cq1.js";import{M as P}from"./MultiselectListBox-UUtT5x64.js";import{L as T}from"./Label-3upj6llV.js";import{at as O,E as S,G as u,_ as L,r as v,o as V,c as g,j,w as y,d as h,l as I,b as a,t as p,F as E,e as z,a as k}from"./index-1EVMs0HF.js";import{u as N,a as q}from"./useSearch-lRba5gAV.js";import{c as F}from"./createMissingItem-l6qmOyuX.js";import"./StyledListItem-NXWhtZP1.js";const U=`<script lang="ts">
import MultiselectListBox from "../forms/MultiselectListBox.vue";
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import { ref, computed } from "vue";
import type { PropType, Ref } from "vue";
import {
  useSearch,
  useLabelInfo,
  createMissingItem,
  type Id,
  type PossibleValue,
  type BottomValue,
} from "./possibleValues";

const MIN_LIST_SIZE = 5;

export default {
  components: {
    MultiselectListBox,
    Label,
    SearchInput,
  },
  props: {
    initialCaseSensitiveSearch: {
      default: false,
      type: Boolean,
    },
    bottomValue: {
      type: Object as PropType<BottomValue>,
      default: () => ({ id: "bottom", text: "Other" }),
      validator(value: BottomValue) {
        return value.hasOwnProperty("id") && value.hasOwnProperty("text");
      },
    },
    withBottomValue: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      required: true,
      default: "Possible values",
    },
    /**
     * Controls the size of the list.
     * Number of visible items (for others user need to scroll)
     * - 0 means all
     * - values 1 - 4  are ignored; 5 is minimum
     */
    size: {
      type: Number,
      default: 0,
      validator(value: number) {
        return value >= 0;
      },
    },
    alignment: {
      type: String,
      default: "horizontal",
      validator(value: string) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
    id: {
      type: String,
      default: null,
    },
    modelValue: {
      type: Array as PropType<Id[] | null>,
      default: () => {},
    },
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => [],
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    withSearchLabel: {
      default: false,
      type: Boolean,
    },
    showSearch: {
      type: Boolean,
      default: false,
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
    disabled: {
      type: Boolean,
      default: false,
    },
    initialSearchTerm: {
      type: String,
      default: "",
    },
    showEmptyState: {
      default: true,
      type: Boolean,
    },
    /**
     * Is only used when emptyStateComponent is null
     */
    emptyStateLabel: {
      default: "No entries in this list",
      type: String,
    },
    /**
     * this component is displayed centered in the middle of the box in case it is empty
     */
    emptyStateComponent: {
      default: null,
      type: Object,
    },
    filterChosenValuesOnPossibleValuesChange: {
      type: Boolean,
      default: true,
      required: false,
    },

    unknownValuesText: {
      type: String,
      required: false,
      default: "Unknown values",
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
      concatenatedItems,
      visibleValues,
      selectedValues,
      searchTerm,
      matchingValidIds,
      caseSensitiveSearch,
      invalidValueIds,
      matchingInvalidValueIds,
      numLabelInfos,
      numMatchedSearchedItems,
      possibleValueMap,
    };
  },
  computed: {
    listSize() {
      // fixed size even when showing all to prevent height jumping when moving items between lists
      const size = this.size === 0 ? this.possibleValues.length : this.size;
      // limit size to minimum
      return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
    },
  },
  watch: {
    possibleValues(newPossibleValues: PossibleValue[]) {
      if (this.filterChosenValuesOnPossibleValuesChange) {
        // Required to prevent invalid values from appearing (e.g. missing b/c of upstream filtering)
        const allValues = newPossibleValues.reduce((arr, valObj) => {
          arr.push(...Object.values(valObj));
          return arr;
        }, [] as Id[]);

        // Reset selectedValues as subset of original to prevent re-execution from resetting value
        this.selectedValues = (this.selectedValues ?? []).filter((item) =>
          allValues.includes(item),
        );
      }
    },
    selectedValues(newVal: Id[], oldVal: Id[] | null) {
      if (
        oldVal === null ||
        newVal?.length !== oldVal.length ||
        oldVal.some((item, i) => item !== newVal[i])
      ) {
        this.$emit("update:modelValue", this.selectedValues);
      }
    },
  },
  methods: {
    hasSelection() {
      return (this.selectedValues?.length ?? 0) > 0;
    },
    onChange(newVal: Id[]) {
      this.selectedValues = newVal;
    },
    onSearchInput(value: string) {
      this.searchTerm = value;
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
  <!-- eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->

  <MultiselectListBox
    :id="id"
    ref="form"
    :ariaLabel="ariaLabel"
    :with-is-empty-state="showEmptyState"
    :empty-state-label="emptyStateLabel"
    :empty-state-component="emptyStateComponent"
    :size="listSize"
    :possible-values="concatenatedItems"
    :model-value="modelValue"
    :is-valid="isValid"
    :with-bottom-value="withBottomValue"
    :bottom-value="bottomValue"
    :disabled="disabled"
    @update:model-value="onChange"
  />
</template>

<style scoped>
.header {
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
</style>
`,_=5,A={components:{MultiselectListBox:P,Label:T,SearchInput:O},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(e){return e>=0}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>{}},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},unknownValuesText:{type:String,required:!1,default:"Unknown values"}},emits:["update:modelValue"],setup(e){const n=S(e.possibleValues),t=S(e.modelValue),i=S(e.initialSearchTerm),l=S(e.initialCaseSensitiveSearch),c=u(()=>Object.assign({},...n.value.map((s,r)=>({[s.id]:{item:s,index:r}})))),d=u(()=>n.value.map(s=>{var r;return(r=c.value[s.id])==null?void 0:r.item})),b=u(()=>{var s;return t.value?(s=t.value)==null?void 0:s.filter(r=>!c.value[r]):[]}),o=u(()=>{var s;return(s=b.value)==null?void 0:s.map(r=>F(r))}),m=u(()=>t.value===null?[]:[...o.value,...d.value]),f=u(()=>e.showSearch?N(i,l,m):m.value),x=u(()=>f.value.length===0?[]:f.value.filter(s=>m.value.includes(s))),B=u(()=>e.showSearch&&i.value!==""),w=u(()=>x.value.filter(r=>r.text.toLowerCase().includes(i.value.toLowerCase()))),C=u(()=>{var s,r;return e.showSearch?B.value?q(w,d.value.length,t):`[ ${(r=t.value)==null?void 0:r.length} selected ]`:`[ ${(s=t.value)==null?void 0:s.length} selected ]`});return{concatenatedItems:x,visibleValues:m,selectedValues:t,searchTerm:i,matchingValidIds:d,caseSensitiveSearch:l,invalidValueIds:b,matchingInvalidValueIds:o,numLabelInfos:C,numMatchedSearchedItems:w,possibleValueMap:c}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>_?e:_}},watch:{possibleValues(e){if(this.filterChosenValuesOnPossibleValuesChange){const n=e.reduce((t,i)=>(t.push(...Object.values(i)),t),[]);this.selectedValues=(this.selectedValues??[]).filter(t=>n.includes(t))}},selectedValues(e,n){(n===null||(e==null?void 0:e.length)!==n.length||n.some((t,i)=>t!==e[i]))&&this.$emit("update:modelValue",this.selectedValues)}},methods:{hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},onChange(e){this.selectedValues=e},onSearchInput(e){this.searchTerm=e},validate(){let e=!this.concatenatedItems.some(n=>n.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},D={class:"header"},R={class:"title"},Z={key:0,class:"info"};function G(e,n,t,i,l,c){const d=v("SearchInput"),b=v("Label"),o=v("MultiselectListBox");return V(),g(E,null,[t.showSearch?(V(),j(b,{key:0,active:t.withSearchLabel,text:t.searchLabel,class:"search-wrapper"},{default:y(({labelForId:m})=>[h(d,{id:m,ref:"search",placeholder:t.searchPlaceholder,"model-value":i.searchTerm,label:t.searchLabel,"initial-case-sensitive-search":t.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:t.disabled,"onUpdate:modelValue":c.onSearchInput,onToggleCaseSensitiveSearch:n[0]||(n[0]=f=>i.caseSensitiveSearch=f)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):I("",!0),a("div",D,[a("div",R,[i.numLabelInfos?(V(),g("div",Z,p(i.numLabelInfos),1)):I("",!0)])]),h(o,{id:t.id,ref:"form",ariaLabel:t.ariaLabel,"with-is-empty-state":t.showEmptyState,"empty-state-label":t.emptyStateLabel,"empty-state-component":t.emptyStateComponent,size:c.listSize,"possible-values":i.concatenatedItems,"model-value":t.modelValue,"is-valid":t.isValid,"with-bottom-value":t.withBottomValue,"bottom-value":t.bottomValue,disabled:t.disabled,"onUpdate:modelValue":c.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])],64)}const H=L(A,[["render",G],["__scopeId","data-v-8f6d2a2d"]]),J=`<SearchableList
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
  :show-search = "true"
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
/>

<SearchableList
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
  :show-search = "true"
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
  disabled
/>

<SearchableList
  v-model="selected"
  :size="4"
  aria-label="Select stuff here!"
  :show-search = "true"
  with-bottom-value="true"
            :bottom-value="{
              id: bottomValueSymbol,
              text: 'Custom text',
            }"
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
/>

<SearchableList
  v-model="selected"
  :size="4"
  :show-search = "true"
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
/>
`,K={components:{SearchableList:H,CodeExample:M},data(){return{codeExample:J,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return U}}},Q=k('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),W={class:"grid-container"},X={class:"grid-item-6"},Y={class:"grid-item-6"},$=a("br",null,null,-1),ee=a("div",{class:"grid-container"},[a("div",{class:"grid-item-12"},[a("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),te=a("br",null,null,-1),ae={class:"grid-container"},ne={class:"grid-item-6"},le={class:"grid-item-6"},se=a("br",null,null,-1),ie={class:"grid-container"},oe={class:"grid-item-6"},re=a("br",null,null,-1),de={class:"grid-container"},ue={class:"grid-item-6"},ce={class:"grid-item-6"},me={class:"grid-container"},he={class:"grid-item-12"};function be(e,n,t,i,l,c){const d=v("SearchableList",!0),b=v("CodeExample");return V(),g("div",null,[a("section",null,[Q,a("div",W,[a("div",X,[h(d,{modelValue:l.selected,"onUpdate:modelValue":n[0]||(n[0]=o=>l.selected=o),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(o,m)=>({id:`baz${m}`,text:`Baz ${m}`}))]},null,8,["modelValue","possible-values"])]),a("div",Y,"selected ids: "+p(l.selected),1)]),$,ee,te,a("div",ae,[a("div",ne,[h(d,{modelValue:l.selected2,"onUpdate:modelValue":n[1]||(n[1]=o=>l.selected2=o),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:l.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),a("div",le,"selected ids: "+p(l.selected2),1)]),se,a("div",ie,[a("div",oe,[h(d,{modelValue:l.disabledSelected2,"onUpdate:modelValue":n[2]||(n[2]=o=>l.disabledSelected2=o),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:l.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),re,a("div",de,[a("div",ue,[h(d,{modelValue:l.withMissing,"onUpdate:modelValue":n[3]||(n[3]=o=>l.withMissing=o),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),a("div",ce,"selected ids: "+p(l.withMissing),1)])]),a("section",null,[a("div",me,[a("div",he,[h(b,{summary:"Show usage example"},{default:y(()=>[z(p(l.codeExample),1)]),_:1}),h(b,{summary:"Show SearchableList.vue source code"},{default:y(()=>[z(p(c.code),1)]),_:1})])])])])}const xe=L(K,[["render",be]]);export{xe as default};
