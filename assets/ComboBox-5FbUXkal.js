import{C as S}from"./CodeExample-bO3A3Wb_.js";import{u as O,v as B,P as F,_ as x,r as h,o as b,j as C,w as f,b as t,m,q as c,n as E,c as g,F as M,g as T,t as d,d as i,Q as V,h as k,au as z,Y as _,e as v}from"./index-_HOv_LZu.js";import{M as A}from"./Multiselect-t1MN8pKl.js";import"./Checkbox-64FFNbkw.js";import"./arrow-dropdown-CvvA8uXe.js";const w="draft-id-combobox-preview-item",R=O({components:{Multiselect:A,FunctionButton:B,CloseIcon:F},props:{possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(n=>n.hasOwnProperty("id")&&n.hasOwnProperty("text")):!1}},modelValue:{type:Array,default:()=>[]},sizeVisibleOptions:{type:Number,default:5,validator(e){return e>=0}},closeDropdownOnSelection:{type:Boolean,default:!1},isValid:{type:Boolean,default:!0},allowNewValues:{type:Boolean,default:!1}},emits:{"update:modelValue":e=>!0},data(){return{searchValue:"",inputOrOptionsFocussed:!1,focusElement:null,refocusElement:null,allPossibleItems:[...this.possibleValues]}},computed:{trimmedSearchValue(){return this.searchValue.trim()},trimmedLowerCasedSearchValue(){return this.trimmedSearchValue.toLowerCase()},isSearchEmpty(){return!this.trimmedSearchValue},searchResults(){const e=this.allPossibleItems.some(({id:a,text:r})=>a===this.trimmedSearchValue||r===this.trimmedSearchValue),n=this.allPossibleItems.filter(({id:a,text:r})=>r.toLowerCase().includes(this.trimmedLowerCasedSearchValue)||a===this.trimmedSearchValue);return this.allowNewValues&&!e&&!this.isSearchEmpty?[{id:w,text:`${this.trimmedSearchValue} (new item)`},...n]:n},hasSelection(){return this.selectedValues.length>0},inputWidth(){return this.inputOrOptionsFocussed&&this.searchResults.length>0?{}:{width:"0%"}},selectedValues(){return this.modelValue.map(e=>this.allPossibleItems.find(n=>n.id===e)||{id:e,text:e})},maxSizeVisibleOptions(){return this.searchResults.length<this.sizeVisibleOptions?this.searchResults.length:this.sizeVisibleOptions}},mounted(){this.focusElement=this.$refs.searchInput,this.refocusElement=this.$refs.listBox},methods:{emitNewSelection(e){this.$emit("update:modelValue",e)},focusInput(){this.$refs.searchInput.focus()},onDown(){this.$refs.combobox.onDown()},onEnter(){var e;this.isSearchEmpty||typeof((e=this.searchResults[0])==null?void 0:e.id)>"u"||this.modelValue.includes(this.searchResults[0].id)||(this.updateSelectedIds([...this.modelValue,this.searchResults[0].id]),this.searchValue="")},onBackspace(){this.searchValue||this.emitNewSelection(this.modelValue.slice(0,-1))},onFocusOutside(){this.inputOrOptionsFocussed=!1,this.searchValue=""},onInput(){this.$refs.combobox.updateFocusOptions()},onInputFocus(){this.inputOrOptionsFocussed||this.$refs.combobox.toggle(),this.inputOrOptionsFocussed=!0,this.$refs.combobox.updateFocusOptions()},updateSelectedIds(e){if(!e.includes(w)){this.emitNewSelection(e);return}const a={id:this.trimmedSearchValue,text:this.trimmedSearchValue};this.allPossibleItems.push(a),this.emitNewSelection(e.map(r=>r===w?a.id:r))},removeTag(e){this.emitNewSelection(this.modelValue.filter(n=>n!==e)),this.closeOptions()},removeAllTags(){this.emitNewSelection([]),this.closeOptions()},closeOptionsAndStop(e){this.$refs.combobox.closeOptionsAndStop(e)},closeOptions(){this.$refs.combobox.closeOptions()}}}),D=["title"],N={class:"text"},$={class:"icon-right"};function P(e,n,a,r,o,y){const u=h("CloseIcon"),p=h("FunctionButton"),l=h("Multiselect");return b(),C(l,{ref:"combobox","model-value":e.modelValue,"possible-values":e.searchResults,"use-custom-list-box":"","size-visible-options":e.maxSizeVisibleOptions,"parent-focus-element":e.focusElement,"parent-refocus-element-on-close":e.refocusElement,"close-dropdown-on-selection":e.closeDropdownOnSelection,"is-valid":e.isValid,onFocusOutside:e.onFocusOutside,"onUpdate:modelValue":e.updateSelectedIds},{listBox:f(()=>[t("div",{ref:"listBox",class:"summary-input-icon-wrapper",tabindex:"0",onKeydown:n[8]||(n[8]=m(c((...s)=>e.focusInput&&e.focusInput(...s),["prevent","self"]),["enter"]))},[t("div",{class:E(["summary-input-wrapper",{"with-icon-right":e.hasSelection}]),onClick:n[7]||(n[7]=c((...s)=>e.focusInput&&e.focusInput(...s),["stop"]))},[(b(!0),g(M,null,T(e.selectedValues,(s,I)=>(b(),g("div",{key:`item.id${I}`,class:"tag",title:s.text},[t("span",N,d(s.text),1),i(p,{class:"remove-tag-button",onClick:c(he=>e.removeTag(s.id),["stop"])},{default:f(()=>[i(u,{class:"remove-tag-button-icon"})]),_:2},1032,["onClick"])],8,D))),128)),V(t("input",{ref:"searchInput","onUpdate:modelValue":n[0]||(n[0]=s=>e.searchValue=s),class:"search-input",type:"text",style:k(e.inputWidth),onFocus:n[1]||(n[1]=(...s)=>e.onInputFocus&&e.onInputFocus(...s)),onInput:n[2]||(n[2]=(...s)=>e.onInput&&e.onInput(...s)),onKeydown:[n[3]||(n[3]=m(c((...s)=>e.onEnter&&e.onEnter(...s),["prevent"]),["enter"])),n[4]||(n[4]=m((...s)=>e.onBackspace&&e.onBackspace(...s),["backspace"])),n[5]||(n[5]=m(c((...s)=>e.onDown&&e.onDown(...s),["stop","prevent"]),["down"])),n[6]||(n[6]=m((...s)=>e.closeOptionsAndStop&&e.closeOptionsAndStop(...s),["esc"]))]},null,36),[[z,e.searchValue]])],2),V(t("div",$,[i(p,{ref:"removeAllTags",class:"remove-all-tags-button",onClick:c(e.removeAllTags,["stop"])},{default:f(()=>[i(u)]),_:1},8,["onClick"])],512),[[_,e.hasSelection]])],544)]),_:1},8,["model-value","possible-values","size-visible-options","parent-focus-element","parent-refocus-element-on-close","close-dropdown-on-selection","is-valid","onFocusOutside","onUpdate:modelValue"])}const L=x(R,[["render",P],["__scopeId","data-v-f3d99b09"]]),U=`<script lang="ts">
import "./variables.css";
import { defineComponent, type PropType } from "vue";

import Multiselect from "./Multiselect.vue";
import FunctionButton from "../FunctionButton.vue";
import CloseIcon from "../../assets/img/icons/close.svg";

const DRAFT_ITEM_ID = "draft-id-combobox-preview-item";

interface ComboBoxItem {
  id: string;
  text: string;
}

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
  allPossibleItems: Array<ComboBoxItem>;
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
      type: Array as PropType<Array<ComboBoxItem>>,
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
      type: Array as PropType<Array<string>>,
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
  },

  emits: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    "update:modelValue": (_payload: Array<string>) => true,
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
          this.allPossibleItems.find((item) => item.id === id) || {
            id,
            text: id,
          },
      );
    },

    maxSizeVisibleOptions() {
      return this.searchResults.length < this.sizeVisibleOptions
        ? this.searchResults.length
        : this.sizeVisibleOptions;
    },
  },

  mounted() {
    this.focusElement = this.$refs.searchInput as HTMLInputElement;
    this.refocusElement = this.$refs.listBox as HTMLDivElement;
  },

  methods: {
    emitNewSelection(newSelectedIds: string[]) {
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

    updateSelectedIds(selectedIds: Array<string>) {
      const hasNewItem = selectedIds.includes(DRAFT_ITEM_ID);

      if (!hasNewItem) {
        this.emitNewSelection(selectedIds);
        return;
      }

      const newItem: ComboBoxItem = {
        id: this.trimmedSearchValue,
        text: this.trimmedSearchValue,
      };

      this.allPossibleItems.push(newItem);

      this.emitNewSelection(
        selectedIds.map((id) => (id === DRAFT_ITEM_ID ? newItem.id : id)),
      );
    },

    removeTag(idToRemove: string) {
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
            { 'with-icon-right': hasSelection },
          ]"
          @click.stop="focusInput"
        >
          <div
            v-for="(item, index) in selectedValues"
            :key="\`item.id\${index}\`"
            class="tag"
            :title="item.text"
          >
            <span class="text">{{ item.text }}</span>
            <FunctionButton
              class="remove-tag-button"
              @click.stop="removeTag(item.id)"
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
`,W=`<ComboBox
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
/>`,j={components:{ComboBox:L,CodeExample:S},data(){return{codeExample:W,selected:[[],[],[],[]],values:[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"lorem",text:"Lorem"},{id:"ipsum",text:"Ipsum"},{id:"dolor",text:"dolor"}]}},computed:{code(){return U}}},K=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null,[v(" A combobox component. It emits an "),t("code",null,"update"),v(" event when an option is (de-)selected and has a list of selected "),t("code",null,"values"),v(". ")])])],-1),H={class:"grid-container"},q=t("div",{class:"grid-item-3"},"default",-1),Q={class:"grid-item-6"},Y={class:"grid-item-3"},G=t("br",null,null,-1),J={class:"grid-container"},X=t("div",{class:"grid-item-3"},"max visible options: 3",-1),Z={class:"grid-item-6"},ee={class:"grid-item-3"},ne=t("br",null,null,-1),te={class:"grid-container"},se=t("div",{class:"grid-item-3"},"allow new values",-1),oe={class:"grid-item-6"},ie={class:"grid-item-3"},le=t("br",null,null,-1),ae={class:"grid-container"},re=t("div",{class:"grid-item-3"},"close dropdown on selection",-1),ue={class:"grid-item-6"},de={class:"grid-item-3"},ce={class:"grid-container"},pe={class:"grid-item-12"};function me(e,n,a,r,o,y){const u=h("ComboBox",!0),p=h("CodeExample");return b(),g("div",null,[t("section",null,[K,t("div",H,[q,t("div",Q,[i(u,{modelValue:o.selected[0],"onUpdate:modelValue":n[0]||(n[0]=l=>o.selected[0]=l),"possible-values":o.values},null,8,["modelValue","possible-values"])]),t("div",Y,"selected-ids: "+d(o.selected[0]),1)]),G,t("div",J,[X,t("div",Z,[i(u,{modelValue:o.selected[1],"onUpdate:modelValue":n[1]||(n[1]=l=>o.selected[1]=l),"possible-values":o.values,"size-visible-options":3},null,8,["modelValue","possible-values"])]),t("div",ee,"selected-ids: "+d(o.selected[1]),1)]),ne,t("div",te,[se,t("div",oe,[i(u,{modelValue:o.selected[2],"onUpdate:modelValue":n[2]||(n[2]=l=>o.selected[2]=l),"possible-values":o.values,"allow-new-values":""},null,8,["modelValue","possible-values"])]),t("div",ie,"selected-ids: "+d(o.selected[2]),1)]),le,t("div",ae,[re,t("div",ue,[i(u,{modelValue:o.selected[3],"onUpdate:modelValue":n[3]||(n[3]=l=>o.selected[3]=l),"possible-values":o.values,"close-dropdown-on-selection":""},null,8,["modelValue","possible-values"])]),t("div",de,"selected-ids: "+d(o.selected[3]),1)])]),t("section",null,[t("div",ce,[t("div",pe,[i(p,{summary:"Show usage example"},{default:f(()=>[v(d(o.codeExample),1)]),_:1}),i(p,{summary:"Show ComboBox.vue source code"},{default:f(()=>[v(d(y.code),1)]),_:1})])])])])}const ye=x(j,[["render",me]]);export{ye as default};
