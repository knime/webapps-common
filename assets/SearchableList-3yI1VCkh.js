import{C}from"./CodeExample-hs5fgC2N.js";import{M}from"./MultiselectListBox-brBEzOyT.js";import{L as P}from"./Label-zEwet40Y.js";import{at as T,E as g,G as u,_,r as v,o as V,c as y,j as O,w as x,d as m,l as w,b as l,t as p,F as j,e as S,a as E}from"./index-8-qSyOs3.js";import{u as k,a as N}from"./useSearch-PR9GOq4W.js";import{c as F}from"./createMissingItem-l6qmOyuX.js";import"./StyledListItem-oz2SqvDp.js";const U=`<script lang="ts">
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
      this.$emit("update:modelValue", newVal);
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
`,I=5,q={components:{MultiselectListBox:M,Label:P,SearchInput:T},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(e){return e>=0}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>{}},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},unknownValuesText:{type:String,required:!1,default:"Unknown values"},compact:{type:Boolean,default:!1}},emits:["update:modelValue"],setup(e){const a=g(e.modelValue),t=g(e.initialSearchTerm),o=g(e.initialCaseSensitiveSearch),n=u(()=>Object.assign({},...e.possibleValues.map((i,r)=>({[i.id]:{item:i,index:r}})))),c=u(()=>e.possibleValues.map(i=>{var r;return(r=n.value[i.id])==null?void 0:r.item})),d=u(()=>{var i;return a.value?(i=a.value)==null?void 0:i.filter(r=>!n.value[r]):[]}),h=u(()=>{var i;return(i=d.value)==null?void 0:i.map(r=>F(r))}),s=u(()=>a.value===null?[]:[...h.value,...c.value]),b=u(()=>e.showSearch?k(t,o,s):s.value),f=u(()=>b.value.length===0?[]:b.value.filter(i=>s.value.includes(i))),B=u(()=>e.showSearch&&t.value!==""),z=u(()=>f.value.filter(r=>r.text.toLowerCase().includes(t.value.toLowerCase()))),L=u(()=>{var i,r;return e.showSearch?B.value?N(z,c.value.length,a):`[ ${(r=a.value)==null?void 0:r.length} selected ]`:`[ ${(i=a.value)==null?void 0:i.length} selected ]`});return{concatenatedItems:f,visibleValues:s,selectedValues:a,searchTerm:t,matchingValidIds:c,caseSensitiveSearch:o,invalidValueIds:d,matchingInvalidValueIds:h,numLabelInfos:L,numMatchedSearchedItems:z,possibleValueMap:n}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>I?e:I}},watch:{possibleValues(e){if(this.filterChosenValuesOnPossibleValuesChange){const a=e.reduce((t,o)=>(t.push(...Object.values(o)),t),[]);this.selectedValues=(this.selectedValues??[]).filter(t=>a.includes(t))}},selectedValues(e,a){(a===null||(e==null?void 0:e.length)!==a.length||a.some((t,o)=>t!==e[o]))&&this.$emit("update:modelValue",this.selectedValues)}},methods:{hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},onChange(e){this.selectedValues=e,this.$emit("update:modelValue",e)},onSearchInput(e){this.searchTerm=e},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},A={class:"header"},D={class:"title"},R={key:0,class:"info"};function Z(e,a,t,o,n,c){const d=v("SearchInput"),h=v("Label"),s=v("MultiselectListBox");return V(),y(j,null,[t.showSearch?(V(),O(h,{key:0,active:t.withSearchLabel,text:t.searchLabel,class:"search-wrapper"},{default:x(({labelForId:b})=>[m(d,{id:b,ref:"search",placeholder:t.searchPlaceholder,"model-value":o.searchTerm,label:t.searchLabel,"initial-case-sensitive-search":t.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:t.disabled,compact:t.compact,"onUpdate:modelValue":c.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=f=>o.caseSensitiveSearch=f)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","compact","onUpdate:modelValue"])]),_:1},8,["active","text"])):w("",!0),l("div",A,[l("div",D,[o.numLabelInfos?(V(),y("div",R,p(o.numLabelInfos),1)):w("",!0)])]),m(s,{id:t.id,ref:"form",ariaLabel:t.ariaLabel,"with-is-empty-state":t.showEmptyState,"empty-state-label":t.emptyStateLabel,"empty-state-component":t.emptyStateComponent,size:c.listSize,"possible-values":o.concatenatedItems,"model-value":t.modelValue,"is-valid":t.isValid,"with-bottom-value":t.withBottomValue,"bottom-value":t.bottomValue,disabled:t.disabled,"onUpdate:modelValue":c.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])],64)}const G=_(q,[["render",Z],["__scopeId","data-v-344daf8b"]]),H=`<SearchableList
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
`,J={components:{SearchableList:G,CodeExample:C},data(){return{codeExample:H,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return U}}},K=E('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),Q={class:"grid-container"},W={class:"grid-item-6"},X={class:"grid-item-6"},Y=l("br",null,null,-1),$=l("div",{class:"grid-container"},[l("div",{class:"grid-item-12"},[l("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),ee=l("br",null,null,-1),te={class:"grid-container"},ae={class:"grid-item-6"},le={class:"grid-item-6"},ne=l("br",null,null,-1),se={class:"grid-container"},ie={class:"grid-item-6"},oe=l("br",null,null,-1),re={class:"grid-container"},de={class:"grid-item-6"},ue=l("br",null,null,-1),ce={class:"grid-container"},me={class:"grid-item-6"},he={class:"grid-item-6"},be={class:"grid-container"},pe={class:"grid-item-12"};function ve(e,a,t,o,n,c){const d=v("SearchableList",!0),h=v("CodeExample");return V(),y("div",null,[l("section",null,[K,l("div",Q,[l("div",W,[m(d,{modelValue:n.selected,"onUpdate:modelValue":a[0]||(a[0]=s=>n.selected=s),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(s,b)=>({id:`baz${b}`,text:`Baz ${b}`}))]},null,8,["modelValue","possible-values"])]),l("div",X,"selected ids: "+p(n.selected),1)]),Y,$,ee,l("div",te,[l("div",ae,[m(d,{modelValue:n.selected2,"onUpdate:modelValue":a[1]||(a[1]=s=>n.selected2=s),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:n.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),l("div",le,"selected ids: "+p(n.selected2),1)]),ne,S(" Disabled "),l("div",se,[l("div",ie,[m(d,{modelValue:n.disabledSelected2,"onUpdate:modelValue":a[2]||(a[2]=s=>n.disabledSelected2=s),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:n.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),oe,S(" Compact "),l("div",re,[l("div",de,[m(d,{modelValue:n.disabledSelected2,"onUpdate:modelValue":a[3]||(a[3]=s=>n.disabledSelected2=s),size:4,"aria-label":"Compact...","with-bottom-value":"","show-search":!0,"bottom-value":{id:n.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],compact:""},null,8,["modelValue","bottom-value"])])]),ue,l("div",ce,[l("div",me,[m(d,{modelValue:n.withMissing,"onUpdate:modelValue":a[4]||(a[4]=s=>n.withMissing=s),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),l("div",he,"selected ids: "+p(n.withMissing),1)])]),l("section",null,[l("div",be,[l("div",pe,[m(h,{summary:"Show usage example"},{default:x(()=>[S(p(n.codeExample),1)]),_:1}),m(h,{summary:"Show SearchableList.vue source code"},{default:x(()=>[S(p(c.code),1)]),_:1})])])])])}const we=_(J,[["render",ve]]);export{we as default};
