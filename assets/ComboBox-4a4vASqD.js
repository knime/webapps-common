import{C as _}from"./CodeExample-Ujd6Yu0u.js";import{u as B,v as E,P as M,_ as S,r as h,o as b,j as C,w as f,b as n,m,q as u,n as I,c as g,F as T,g as k,t as r,d as l,Q as x,h as z,au as A,Y as R,e as v}from"./index-gPJumjSm.js";import{M as D}from"./Multiselect-5EN38Hiq.js";import{c as N}from"./createMissingItem-l6qmOyuX.js";import"./Checkbox-8M6wRxPM.js";import"./arrow-dropdown-CzLioXmG.js";const w="draft-id-combobox-preview-item",P=B({components:{Multiselect:D,FunctionButton:E,CloseIcon:M},props:{possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(s=>s.hasOwnProperty("id")&&s.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>[]},sizeVisibleOptions:{type:Number,default:5,validator(e){return e>=0}},closeDropdownOnSelection:{type:Boolean,default:!1},isValid:{type:Boolean,default:!0},allowNewValues:{type:Boolean,default:!1},compact:{type:Boolean,default:!1}},emits:{"update:modelValue":e=>!0},data(){return{searchValue:"",inputOrOptionsFocussed:!1,focusElement:null,refocusElement:null,allPossibleItems:[...this.possibleValues]}},computed:{trimmedSearchValue(){return this.searchValue.trim()},trimmedLowerCasedSearchValue(){return this.trimmedSearchValue.toLowerCase()},isSearchEmpty(){return!this.trimmedSearchValue},searchResults(){const e=this.allPossibleItems.some(({id:c,text:d})=>c===this.trimmedSearchValue||d===this.trimmedSearchValue),s=this.allPossibleItems.filter(({id:c,text:d})=>d.toLowerCase().includes(this.trimmedLowerCasedSearchValue)||c===this.trimmedSearchValue);return this.allowNewValues&&!e&&!this.isSearchEmpty?[{id:w,text:`${this.trimmedSearchValue} (new item)`},...s]:s},hasSelection(){return this.selectedValues.length>0},inputWidth(){return this.inputOrOptionsFocussed&&this.searchResults.length>0?{}:{width:"0%"}},selectedValues(){return this.modelValue.map(e=>this.allPossibleItems.find(s=>e===s.id)||N(e))},maxSizeVisibleOptions(){return this.searchResults.length<this.sizeVisibleOptions?this.searchResults.length:this.sizeVisibleOptions}},created(){this.allowNewValues||this.$watch("possibleValues",e=>{this.allPossibleItems=[...e]})},mounted(){this.focusElement=this.$refs.searchInput,this.refocusElement=this.$refs.listBox},methods:{emitNewSelection(e){this.$emit("update:modelValue",e)},focusInput(){this.$refs.searchInput.focus()},onDown(){this.$refs.combobox.onDown()},onEnter(){var e;this.isSearchEmpty||typeof((e=this.searchResults[0])==null?void 0:e.id)>"u"||this.modelValue.includes(this.searchResults[0].id)||(this.updateSelectedIds([...this.modelValue,this.searchResults[0].id]),this.searchValue="")},onBackspace(){this.searchValue||this.emitNewSelection(this.modelValue.slice(0,-1))},onFocusOutside(){this.inputOrOptionsFocussed=!1,this.searchValue=""},onInput(){this.$refs.combobox.updateFocusOptions()},onInputFocus(){this.inputOrOptionsFocussed||this.$refs.combobox.toggle(),this.inputOrOptionsFocussed=!0,this.$refs.combobox.updateFocusOptions()},updateSelectedIds(e){if(!e.includes(w)){this.emitNewSelection(e);return}const c={id:this.trimmedSearchValue,text:this.trimmedSearchValue};this.allPossibleItems.push(c),this.emitNewSelection(e.map(d=>d===w?c.id:d))},removeTag(e){this.emitNewSelection(this.modelValue.filter(s=>s!==e)),this.closeOptions()},removeAllTags(){this.emitNewSelection([]),this.closeOptions()},closeOptionsAndStop(e){this.$refs.combobox.closeOptionsAndStop(e)},closeOptions(){this.$refs.combobox.closeOptions()}}}),L=["title"],$={class:"icon-right"};function U(e,s,c,d,t,V){const a=h("CloseIcon"),p=h("FunctionButton"),i=h("Multiselect");return b(),C(i,{ref:"combobox","model-value":e.modelValue,"possible-values":e.searchResults,"use-custom-list-box":"","size-visible-options":e.maxSizeVisibleOptions,"parent-focus-element":e.focusElement,"parent-refocus-element-on-close":e.refocusElement,"close-dropdown-on-selection":e.closeDropdownOnSelection,"is-valid":e.isValid,compact:e.compact,onFocusOutside:e.onFocusOutside,"onUpdate:modelValue":e.updateSelectedIds},{listBox:f(()=>[n("div",{ref:"listBox",class:"summary-input-icon-wrapper",tabindex:"0",onKeydown:s[8]||(s[8]=m(u((...o)=>e.focusInput&&e.focusInput(...o),["prevent","self"]),["enter"]))},[n("div",{class:I(["summary-input-wrapper",{"with-icon-right":e.hasSelection,compact:e.compact}]),onClick:s[7]||(s[7]=u((...o)=>e.focusInput&&e.focusInput(...o),["stop"]))},[(b(!0),g(T,null,k(e.selectedValues,({id:o,text:y,invalid:O},F)=>(b(),g("div",{key:`item.id${F}`,class:"tag",title:y},[n("span",{class:I(["text",{invalid:O}])},r(y),3),l(p,{class:"remove-tag-button",compact:e.compact,onClick:u(Fe=>e.removeTag(o),["stop"])},{default:f(()=>[l(a,{class:"remove-tag-button-icon"})]),_:2},1032,["compact","onClick"])],8,L))),128)),x(n("input",{ref:"searchInput","onUpdate:modelValue":s[0]||(s[0]=o=>e.searchValue=o),class:"search-input",type:"text",style:z(e.inputWidth),onFocus:s[1]||(s[1]=(...o)=>e.onInputFocus&&e.onInputFocus(...o)),onInput:s[2]||(s[2]=(...o)=>e.onInput&&e.onInput(...o)),onKeydown:[s[3]||(s[3]=m(u((...o)=>e.onEnter&&e.onEnter(...o),["prevent"]),["enter"])),s[4]||(s[4]=m((...o)=>e.onBackspace&&e.onBackspace(...o),["backspace"])),s[5]||(s[5]=m(u((...o)=>e.onDown&&e.onDown(...o),["stop","prevent"]),["down"])),s[6]||(s[6]=m((...o)=>e.closeOptionsAndStop&&e.closeOptionsAndStop(...o),["esc"]))]},null,36),[[A,e.searchValue]])],2),x(n("div",$,[l(p,{ref:"removeAllTags",class:"remove-all-tags-button",compact:e.compact,onClick:u(e.removeAllTags,["stop"])},{default:f(()=>[l(a)]),_:1},8,["compact","onClick"])],512),[[R,e.hasSelection]])],544)]),_:1},8,["model-value","possible-values","size-visible-options","parent-focus-element","parent-refocus-element-on-close","close-dropdown-on-selection","is-valid","compact","onFocusOutside","onUpdate:modelValue"])}const W=S(P,[["render",U],["__scopeId","data-v-cb54b2fe"]]),j=`<script lang="ts">
import "./variables.css";
import { defineComponent, type PropType } from "vue";

import Multiselect from "./Multiselect.vue";
import FunctionButton from "../FunctionButton.vue";
import CloseIcon from "../../assets/img/icons/close.svg";
import { createMissingItem } from "./possibleValues";
import type { PossibleValue, Id } from "./possibleValues";

const DRAFT_ITEM_ID = "draft-id-combobox-preview-item";

interface ComponentData {
  searchValue: string;
  inputOrOptionsFocussed: boolean;
  /*
   * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
   * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
   * it needs to be passed to the Multiselect component.
   */
  focusElement: any; // TODO - remove any type. Multiselect is not properly typed so when this value is passed as a prop the type-checker errors out
  refocusElement: any; // TODO - remove any type. Multiselect is not properly typed so when this value is passed as a prop the type-checker errors out
  allPossibleItems: Array<PossibleValue>;
}

type MultiselectRef = InstanceType<typeof Multiselect>;

export default defineComponent({
  components: {
    Multiselect,
    FunctionButton,
    CloseIcon,
  },
  props: {
    /**
     * List of possible values. Each item must have an \`id\` and a \`text\` property. Some optional properties
     * can be used that are specified in Multiselect.vue.
     */
    possibleValues: {
      type: Array as PropType<Array<PossibleValue>>,
      default: () => [],
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    /**
     * List of initial selected ids.
     */
    modelValue: {
      type: Array as PropType<Array<Id>>,
      default: () => [],
    },
    /**
     * Limit the number of visible options in the dropdown.
     */
    sizeVisibleOptions: {
      type: Number,
      default: 5,
      validator(value: number) {
        return value >= 0;
      },
    },
    /**
     * Close the dropdown when an entry was selected.
     */
    closeDropdownOnSelection: {
      type: Boolean,
      default: false,
    },
    isValid: {
      type: Boolean,
      default: true,
    },
    /**
     * Allow adding and selecting new tags, not just possible values
     */
    allowNewValues: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    "update:modelValue": (_payload: Array<Id>) => true,
  },

  data(): ComponentData {
    return {
      searchValue: "",
      inputOrOptionsFocussed: false,
      /*
       * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
       * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
       * it needs to be passed to the Multiselect component.
       */
      focusElement: null,
      refocusElement: null,
      allPossibleItems: [...this.possibleValues],
    };
  },

  computed: {
    trimmedSearchValue() {
      return this.searchValue.trim();
    },
    trimmedLowerCasedSearchValue() {
      return this.trimmedSearchValue.toLowerCase();
    },
    isSearchEmpty() {
      return !this.trimmedSearchValue;
    },

    searchResults() {
      const newIdIsExistingIdOrText = this.allPossibleItems.some(
        ({ id, text }) =>
          id === this.trimmedSearchValue || text === this.trimmedSearchValue,
      );

      const fuzzyMatchedItems = this.allPossibleItems.filter(
        ({ id, text }) =>
          text.toLowerCase().includes(this.trimmedLowerCasedSearchValue) ||
          id === this.trimmedSearchValue,
      );

      if (
        this.allowNewValues &&
        !newIdIsExistingIdOrText &&
        !this.isSearchEmpty
      ) {
        // add a preview for a non existing item
        return [
          { id: DRAFT_ITEM_ID, text: \`\${this.trimmedSearchValue} (new item)\` },
          ...fuzzyMatchedItems,
        ];
      }

      return fuzzyMatchedItems;
    },

    hasSelection() {
      return this.selectedValues.length > 0;
    },

    inputWidth() {
      return this.inputOrOptionsFocussed && this.searchResults.length > 0
        ? {}
        : { width: "0%" };
    },

    selectedValues() {
      return this.modelValue.map(
        (id) =>
          this.allPossibleItems.find((item) => id === item.id) ||
          createMissingItem(id),
      );
    },

    maxSizeVisibleOptions() {
      return this.searchResults.length < this.sizeVisibleOptions
        ? this.searchResults.length
        : this.sizeVisibleOptions;
    },
  },

  created() {
    if (!this.allowNewValues) {
      this.$watch("possibleValues", (newPossibleValues) => {
        this.allPossibleItems = [...newPossibleValues];
      });
    }
  },

  mounted() {
    this.focusElement = this.$refs.searchInput as HTMLInputElement;
    this.refocusElement = this.$refs.listBox as HTMLDivElement;
  },

  methods: {
    emitNewSelection(newSelectedIds: Id[]) {
      this.$emit("update:modelValue", newSelectedIds);
    },
    focusInput() {
      (this.$refs.searchInput as HTMLInputElement).focus();
    },
    onDown() {
      (this.$refs.combobox as MultiselectRef).onDown();
    },
    onEnter() {
      if (
        this.isSearchEmpty ||
        typeof this.searchResults[0]?.id === "undefined" ||
        this.modelValue.includes(this.searchResults[0].id)
      ) {
        return;
      }

      this.updateSelectedIds([...this.modelValue, this.searchResults[0].id]);
      this.searchValue = "";
    },
    onBackspace() {
      if (!this.searchValue) {
        this.emitNewSelection(this.modelValue.slice(0, -1));
      }
      // else regular backspace behavior
    },
    onFocusOutside() {
      this.inputOrOptionsFocussed = false;
      this.searchValue = "";
    },
    onInput() {
      (this.$refs.combobox as MultiselectRef).updateFocusOptions();
    },
    onInputFocus() {
      if (!this.inputOrOptionsFocussed) {
        (this.$refs.combobox as MultiselectRef).toggle();
      }

      this.inputOrOptionsFocussed = true;
      (this.$refs.combobox as MultiselectRef).updateFocusOptions();
    },

    updateSelectedIds(selectedIds: Array<Id>) {
      const hasNewItem = selectedIds.includes(DRAFT_ITEM_ID);

      if (!hasNewItem) {
        this.emitNewSelection(selectedIds);
        return;
      }

      const newItem: PossibleValue = {
        id: this.trimmedSearchValue,
        text: this.trimmedSearchValue,
      };

      this.allPossibleItems.push(newItem);

      this.emitNewSelection(
        selectedIds.map((id) => (id === DRAFT_ITEM_ID ? newItem.id : id)),
      );
    },

    removeTag(idToRemove: Id) {
      this.emitNewSelection(this.modelValue.filter((id) => id !== idToRemove));
      this.closeOptions();
    },

    removeAllTags() {
      this.emitNewSelection([]);
      this.closeOptions();
    },
    closeOptionsAndStop(event: KeyboardEvent) {
      (this.$refs.combobox as MultiselectRef).closeOptionsAndStop(event);
    },
    closeOptions() {
      (this.$refs.combobox as MultiselectRef).closeOptions();
    },
  },
});
<\/script>

<template>
  <Multiselect
    ref="combobox"
    :model-value="modelValue"
    :possible-values="searchResults"
    use-custom-list-box
    :size-visible-options="maxSizeVisibleOptions"
    :parent-focus-element="focusElement"
    :parent-refocus-element-on-close="refocusElement"
    :close-dropdown-on-selection="closeDropdownOnSelection"
    :is-valid="isValid"
    :compact="compact"
    @focus-outside="onFocusOutside"
    @update:model-value="updateSelectedIds"
  >
    <template #listBox>
      <div
        ref="listBox"
        class="summary-input-icon-wrapper"
        tabindex="0"
        @keydown.enter.prevent.self="focusInput"
      >
        <div
          :class="[
            'summary-input-wrapper',
            { 'with-icon-right': hasSelection, compact },
          ]"
          @click.stop="focusInput"
        >
          <div
            v-for="({ id, text, invalid }, index) in selectedValues"
            :key="\`item.id\${index}\`"
            class="tag"
            :title="text"
          >
            <span :class="['text', { invalid }]">{{ text }}</span>
            <FunctionButton
              class="remove-tag-button"
              :compact="compact"
              @click.stop="removeTag(id)"
            >
              <CloseIcon class="remove-tag-button-icon" />
            </FunctionButton>
          </div>
          <input
            ref="searchInput"
            v-model="searchValue"
            class="search-input"
            type="text"
            :style="inputWidth"
            @focus="onInputFocus"
            @input="onInput"
            @keydown.enter.prevent="onEnter"
            @keydown.backspace="onBackspace"
            @keydown.down.stop.prevent="onDown"
            @keydown.esc="closeOptionsAndStop"
          />
        </div>
        <div v-show="hasSelection" class="icon-right">
          <FunctionButton
            ref="removeAllTags"
            class="remove-all-tags-button"
            :compact="compact"
            @click.stop="removeAllTags"
          >
            <CloseIcon />
          </FunctionButton>
        </div>
      </div>
    </template>
  </Multiselect>
</template>

<style lang="postcss" scoped>
.multiselect {
  & .summary-input-icon-wrapper {
    border: var(--form-border-width) solid var(--knime-stone-gray);
    display: flex;
    justify-content: space-between;
    max-width: 100%;

    &:focus-within {
      border-color: var(--knime-masala);
    }

    &:focus {
      outline: none;
    }

    & .summary-input-wrapper {
      max-width: 100%;
      cursor: text;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      flex: 1;

      /** The height of the input field and tags inside the summary */
      --inner-height: 18px;

      padding: calc(
        (
            var(--single-line-form-height) - 2 * var(--form-border-width) -
              var(--inner-height)
          ) / 2
      );

      &.compact {
        padding: calc(
          (
              var(--single-line-form-height-compact) - 2 *
                var(--form-border-width) - var(--inner-height)
            ) / 2
        );
      }

      &.with-icon-right {
        max-width: calc(100% - 40px);
        padding-right: 0;
      }

      & .search-input {
        all: unset;
        height: var(--inner-height);
        font-size: 13px;
        font-weight: 300;
        line-height: normal;
        flex: 1;
      }

      & .tag {
        height: var(--inner-height);
        max-width: 100%;
        overflow: hidden;
        padding: 2px 2px 2px 5px;
        gap: 2px;
        display: flex;
        align-items: center;
        cursor: default;
        border: 1px solid var(--knime-dove-gray);

        & .text {
          font-weight: 500;
          font-size: 12px;
          color: var(--knime-dove-gray);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 12px;

          &.invalid {
            color: var(--theme-color-error);
          }
        }

        & .remove-tag-button {
          padding: 2px;

          & :deep(svg) {
            --icon-size: 10;

            width: calc(var(--icon-size) * 1px);
            height: calc(var(--icon-size) * 1px);
            stroke-width: calc(32px / var(--icon-size));
          }
        }
      }
    }

    & .icon-right {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
`,K=`<ComboBox
  v-model="modelValue"
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
  :possible-values="values"
  :size-visible-options="3"
  close-dropdown-on-selection
/>`,H={components:{ComboBox:W,CodeExample:_},data(){return{codeExample:K,selected:[[],[],[],["Missing"],[],[]],values:[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"lorem",text:"Lorem"},{id:"ipsum",text:"Ipsum"},{id:"dolor",text:"dolor"}]}},computed:{code(){return j}}},q=n("div",{class:"grid-container"},[n("div",{class:"grid-item-12"},[n("p",null,[v(" A combobox component. It emits an "),n("code",null,"update"),v(" event when an option is (de-)selected and has a list of selected "),n("code",null,"values"),v(". ")])])],-1),Q={class:"grid-container"},Y=n("div",{class:"grid-item-3"},"Default",-1),G={class:"grid-item-6"},J={class:"grid-item-3"},X=n("br",null,null,-1),Z={class:"grid-container"},ee=n("div",{class:"grid-item-3"},"Max visible options: 3",-1),ne={class:"grid-item-6"},se={class:"grid-item-3"},te=n("br",null,null,-1),oe={class:"grid-container"},ie=n("div",{class:"grid-item-3"},"Allow new values",-1),le={class:"grid-item-6"},ae={class:"grid-item-3"},re=n("br",null,null,-1),ce={class:"grid-container"},de=n("div",{class:"grid-item-3"},"Missing values",-1),ue={class:"grid-item-6"},pe={class:"grid-item-3"},me=n("br",null,null,-1),he={class:"grid-container"},fe=n("div",{class:"grid-item-3"},"Close dropdown on selection",-1),ve={class:"grid-item-6"},be={class:"grid-item-3"},we=n("br",null,null,-1),ge={class:"grid-container"},Ve=n("div",{class:"grid-item-3"},"Compact mode",-1),ye={class:"grid-item-6"},Ie={class:"grid-item-3"},xe={class:"grid-container"},Se={class:"grid-item-12"};function Oe(e,s,c,d,t,V){const a=h("ComboBox",!0),p=h("CodeExample");return b(),g("div",null,[n("section",null,[q,n("div",Q,[Y,n("div",G,[l(a,{modelValue:t.selected[0],"onUpdate:modelValue":s[0]||(s[0]=i=>t.selected[0]=i),"possible-values":t.values},null,8,["modelValue","possible-values"])]),n("div",J,"selected-ids: "+r(t.selected[0]),1)]),X,n("div",Z,[ee,n("div",ne,[l(a,{modelValue:t.selected[1],"onUpdate:modelValue":s[1]||(s[1]=i=>t.selected[1]=i),"possible-values":t.values,"size-visible-options":3},null,8,["modelValue","possible-values"])]),n("div",se,"selected-ids: "+r(t.selected[1]),1)]),te,n("div",oe,[ie,n("div",le,[l(a,{modelValue:t.selected[2],"onUpdate:modelValue":s[2]||(s[2]=i=>t.selected[2]=i),"possible-values":t.values,"allow-new-values":""},null,8,["modelValue","possible-values"])]),n("div",ae,"selected-ids: "+r(t.selected[2]),1)]),re,n("div",ce,[de,n("div",ue,[l(a,{modelValue:t.selected[3],"onUpdate:modelValue":s[3]||(s[3]=i=>t.selected[3]=i),"possible-values":t.values},null,8,["modelValue","possible-values"])]),n("div",pe,"selected-ids: "+r(t.selected[3]),1)]),me,n("div",he,[fe,n("div",ve,[l(a,{modelValue:t.selected[4],"onUpdate:modelValue":s[4]||(s[4]=i=>t.selected[4]=i),"possible-values":t.values,"close-dropdown-on-selection":""},null,8,["modelValue","possible-values"])]),n("div",be,"selected-ids: "+r(t.selected[4]),1)]),we,n("div",ge,[Ve,n("div",ye,[l(a,{modelValue:t.selected[5],"onUpdate:modelValue":s[5]||(s[5]=i=>t.selected[5]=i),"possible-values":t.values,"close-dropdown-on-selection":"",compact:""},null,8,["modelValue","possible-values"])]),n("div",Ie,"selected-ids: "+r(t.selected[5]),1)])]),n("section",null,[n("div",xe,[n("div",Se,[l(p,{summary:"Show usage example"},{default:f(()=>[v(r(t.codeExample),1)]),_:1}),l(p,{summary:"Show ComboBox.vue source code"},{default:f(()=>[v(r(V.code),1)]),_:1})])])])])}const ke=S(H,[["render",Oe]]);export{ke as default};
