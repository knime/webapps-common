import{C}from"./CodeExample-adW69SBO.js";import{M}from"./MultiselectListBox-dBWrXaD6.js";import{L as P}from"./Label-9I3kfKFP.js";import{at as T,E as V,G as d,_,r as v,o as S,c as g,j as O,w as y,d as m,l as w,b as n,t as p,F as j,e as I,a as E}from"./index-H-nx_xnf.js";import{u as k,a as N}from"./useSearch-DYpgz5bG.js";import{c as q}from"./createMissingItem-l6qmOyuX.js";import"./StyledListItem-cYu4w_9v.js";const F=`<script lang="ts">
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
`,z=5,U={components:{MultiselectListBox:M,Label:P,SearchInput:T},props:{initialCaseSensitiveSearch:{default:!1,type:Boolean},bottomValue:{type:Object,default:()=>({id:"bottom",text:"Other"}),validator(e){return e.hasOwnProperty("id")&&e.hasOwnProperty("text")}},withBottomValue:{type:Boolean,default:!1},ariaLabel:{type:String,required:!0,default:"Possible values"},size:{type:Number,default:0,validator(e){return e>=0}},alignment:{type:String,default:"horizontal",validator(e){return["horizontal","vertical"].includes(e)}},id:{type:String,default:null},modelValue:{type:Array,default:()=>{}},possibleValues:{type:Array,default:()=>[]},isValid:{default:!0,type:Boolean},withSearchLabel:{default:!1,type:Boolean},showSearch:{type:Boolean,default:!1},searchLabel:{type:String,required:!1,default:""},searchPlaceholder:{type:String,required:!1,default:"Search"},disabled:{type:Boolean,default:!1},initialSearchTerm:{type:String,default:""},showEmptyState:{default:!0,type:Boolean},emptyStateLabel:{default:"No entries in this list",type:String},emptyStateComponent:{default:null,type:Object},filterChosenValuesOnPossibleValuesChange:{type:Boolean,default:!0,required:!1},unknownValuesText:{type:String,required:!1,default:"Unknown values"}},emits:["update:modelValue"],setup(e){const a=V(e.modelValue),t=V(e.initialSearchTerm),o=V(e.initialCaseSensitiveSearch),l=d(()=>Object.assign({},...e.possibleValues.map((s,r)=>({[s.id]:{item:s,index:r}})))),u=d(()=>e.possibleValues.map(s=>{var r;return(r=l.value[s.id])==null?void 0:r.item})),c=d(()=>{var s;return a.value?(s=a.value)==null?void 0:s.filter(r=>!l.value[r]):[]}),h=d(()=>{var s;return(s=c.value)==null?void 0:s.map(r=>q(r))}),i=d(()=>a.value===null?[]:[...h.value,...u.value]),b=d(()=>e.showSearch?k(t,o,i):i.value),f=d(()=>b.value.length===0?[]:b.value.filter(s=>i.value.includes(s))),L=d(()=>e.showSearch&&t.value!==""),x=d(()=>f.value.filter(r=>r.text.toLowerCase().includes(t.value.toLowerCase()))),B=d(()=>{var s,r;return e.showSearch?L.value?N(x,u.value.length,a):`[ ${(r=a.value)==null?void 0:r.length} selected ]`:`[ ${(s=a.value)==null?void 0:s.length} selected ]`});return{concatenatedItems:f,visibleValues:i,selectedValues:a,searchTerm:t,matchingValidIds:u,caseSensitiveSearch:o,invalidValueIds:c,matchingInvalidValueIds:h,numLabelInfos:B,numMatchedSearchedItems:x,possibleValueMap:l}},computed:{listSize(){const e=this.size===0?this.possibleValues.length:this.size;return e>z?e:z}},watch:{possibleValues(e){if(this.filterChosenValuesOnPossibleValuesChange){const a=e.reduce((t,o)=>(t.push(...Object.values(o)),t),[]);this.selectedValues=(this.selectedValues??[]).filter(t=>a.includes(t))}},selectedValues(e,a){(a===null||(e==null?void 0:e.length)!==a.length||a.some((t,o)=>t!==e[o]))&&this.$emit("update:modelValue",this.selectedValues)}},methods:{hasSelection(){var e;return(((e=this.selectedValues)==null?void 0:e.length)??0)>0},onChange(e){this.selectedValues=e},onSearchInput(e){this.searchTerm=e},validate(){let e=!this.concatenatedItems.some(a=>a.invalid);return{isValid:e,errorMessage:e?null:"One or more of the selected items is invalid."}}}},A={class:"header"},D={class:"title"},R={key:0,class:"info"};function Z(e,a,t,o,l,u){const c=v("SearchInput"),h=v("Label"),i=v("MultiselectListBox");return S(),g(j,null,[t.showSearch?(S(),O(h,{key:0,active:t.withSearchLabel,text:t.searchLabel,class:"search-wrapper"},{default:y(({labelForId:b})=>[m(c,{id:b,ref:"search",placeholder:t.searchPlaceholder,"model-value":o.searchTerm,label:t.searchLabel,"initial-case-sensitive-search":t.initialCaseSensitiveSearch,"show-case-sensitive-search-button":"",disabled:t.disabled,"onUpdate:modelValue":u.onSearchInput,onToggleCaseSensitiveSearch:a[0]||(a[0]=f=>o.caseSensitiveSearch=f)},null,8,["id","placeholder","model-value","label","initial-case-sensitive-search","disabled","onUpdate:modelValue"])]),_:1},8,["active","text"])):w("",!0),n("div",A,[n("div",D,[o.numLabelInfos?(S(),g("div",R,p(o.numLabelInfos),1)):w("",!0)])]),m(i,{id:t.id,ref:"form",ariaLabel:t.ariaLabel,"with-is-empty-state":t.showEmptyState,"empty-state-label":t.emptyStateLabel,"empty-state-component":t.emptyStateComponent,size:u.listSize,"possible-values":o.concatenatedItems,"model-value":t.modelValue,"is-valid":t.isValid,"with-bottom-value":t.withBottomValue,"bottom-value":t.bottomValue,disabled:t.disabled,"onUpdate:modelValue":u.onChange},null,8,["id","ariaLabel","with-is-empty-state","empty-state-label","empty-state-component","size","possible-values","model-value","is-valid","with-bottom-value","bottom-value","disabled","onUpdate:modelValue"])],64)}const G=_(U,[["render",Z],["__scopeId","data-v-8a793952"]]),H=`<SearchableList
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
`,J={components:{SearchableList:G,CodeExample:C},data(){return{codeExample:H,selected:[],disabledSelected:[],selected2:[],disabledSelected2:[],withMissing:["foo","I am missing","bar"],bottomValueSymbol:Symbol("bottom value")}},computed:{code(){return F}}},K=E('<div class="grid-container"><div class="grid-item-12"><p> A list box for selecting multiple items which is searchable. It acts as a form element, so it emits an <code>input</code> event when something is (de-)selected, and it has a <code>value</code>. It has keyboard navigation with <code>Up</code>, <code>Down</code>, <code>Home</code>, <code>End</code>. It is possible to multi select via keyboard with <code>Shift+Up</code> and <code>Shift+Down</code>. Selective multi select is possible by <code>Ctrl+Click</code> or <code>Shift+Click</code>. Also multi select by dragging is supported. </p></div></div>',1),Q={class:"grid-container"},W={class:"grid-item-6"},X={class:"grid-item-6"},Y=n("br",null,null,-1),$=n("div",{class:"grid-container"},[n("div",{class:"grid-item-12"},[n("p",null," The SearchableList can display a bottom element (visually different but funcionally equivalent to an element lying below all other elements). The total size of the box does not depend on the bottom element (i.e. less elements are shown instead). ")])],-1),ee=n("br",null,null,-1),te={class:"grid-container"},ae={class:"grid-item-6"},ne={class:"grid-item-6"},le=n("br",null,null,-1),se={class:"grid-container"},ie={class:"grid-item-6"},oe=n("br",null,null,-1),re={class:"grid-container"},de={class:"grid-item-6"},ue={class:"grid-item-6"},ce={class:"grid-container"},me={class:"grid-item-12"};function he(e,a,t,o,l,u){const c=v("SearchableList",!0),h=v("CodeExample");return S(),g("div",null,[n("section",null,[K,n("div",Q,[n("div",W,[m(c,{modelValue:l.selected,"onUpdate:modelValue":a[0]||(a[0]=i=>l.selected=i),size:4,"aria-label":"Select stuff here!","show-search":!0,"search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},...Array.from({length:100},(i,b)=>({id:`baz${b}`,text:`Baz ${b}`}))]},null,8,["modelValue","possible-values"])]),n("div",X,"selected ids: "+p(l.selected),1)]),Y,$,ee,n("div",te,[n("div",ae,[m(c,{modelValue:l.selected2,"onUpdate:modelValue":a[1]||(a[1]=i=>l.selected2=i),size:4,"aria-label":"Select stuff here!","with-bottom-value":!0,"show-search":!0,"bottom-value":{id:l.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue","bottom-value"])]),n("div",ne,"selected ids: "+p(l.selected2),1)]),le,n("div",se,[n("div",ie,[m(c,{modelValue:l.disabledSelected2,"onUpdate:modelValue":a[2]||(a[2]=i=>l.disabledSelected2=i),size:4,"aria-label":"Disabled...","with-bottom-value":"","show-search":!0,"bottom-value":{id:l.bottomValueSymbol,text:"Custom text"},"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}],disabled:""},null,8,["modelValue","bottom-value"])])]),oe,n("div",re,[n("div",de,[m(c,{modelValue:l.withMissing,"onUpdate:modelValue":a[3]||(a[3]=i=>l.withMissing=i),size:4,"aria-label":"Disabled...","show-search":!0,"possible-values":[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"}]},null,8,["modelValue"])]),n("div",ue,"selected ids: "+p(l.withMissing),1)])]),n("section",null,[n("div",ce,[n("div",me,[m(h,{summary:"Show usage example"},{default:y(()=>[I(p(l.codeExample),1)]),_:1}),m(h,{summary:"Show SearchableList.vue source code"},{default:y(()=>[I(p(u.code),1)]),_:1})])])])])}const ye=_(J,[["render",he]]);export{ye as default};
