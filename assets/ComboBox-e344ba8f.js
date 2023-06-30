import{C}from"./CodeExample-ed2ff8ca.js";import{l as y}from"./lodash-02979024.js";import{M as B}from"./Multiselect-16ff8c7c.js";import{q as S,s as F,O as E,_ as V,r as f,o as I,j as _,w as v,b as t,x as m,y as u,n as M,c as g,F as k,g as z,t as r,d as l,P as x,h as T,a7 as D,W as A,e as b}from"./index-d22b6a08.js";import"./Checkbox-9816cc0b.js";import"./arrow-dropdown-5115e8ba.js";const w="draft-id-combobox-preview-item",R=S({components:{Multiselect:B,FunctionButton:F,CloseIcon:E},props:{possibleValues:{type:Array,default:()=>[],validator(e){return Array.isArray(e)?e.every(s=>s.hasOwnProperty("id")&&s.hasOwnProperty("text")):!1}},initialSelectedIds:{type:Array,default:()=>[]},sizeVisibleOptions:{type:Number,default:5,validator(e){return e>=0}},closeDropdownOnSelection:{type:Boolean,default:!1},isValid:{type:Boolean,default:!0},allowNewValues:{type:Boolean,default:!1}},emits:{"update:selectedIds":e=>!0,change:e=>!0},data(){return{selectedIds:this.initialSelectedIds,searchValue:"",inputOrOptionsFocussed:!1,focusElement:null,refocusElement:null,allPossibleItems:this.possibleValues}},computed:{isSearchEmpty(){return!this.searchValue.trim()},searchResults(){const e=this.allPossibleItems.some(({text:d})=>d.toLowerCase()===this.searchValue.toLowerCase()),s=this.allPossibleItems.filter(({text:d})=>d.toLowerCase().includes(this.searchValue.toLowerCase()));return this.allowNewValues&&!e&&!this.isSearchEmpty?[{id:w,text:`${this.searchValue} (new item)`},...s]:s},hasSelection(){return this.selectedValues.length>0},inputWidth(){return this.inputOrOptionsFocussed&&this.searchResults.length>0?{}:{width:"0%"}},selectedValues(){return this.selectedIds.length===0?[]:this.selectedIds.map(e=>this.allPossibleItems.find(d=>d.id===e)||{id:e,text:e})},maxSizeVisibleOptions(){return this.searchResults.length<this.sizeVisibleOptions?this.searchResults.length:this.sizeVisibleOptions}},mounted(){this.focusElement=this.$refs.searchInput,this.refocusElement=this.$refs.listBox},methods:{focusInput(){this.$refs.searchInput.focus()},onDown(){this.$refs.combobox.onDown()},onEnter(){var e;this.isSearchEmpty||(this.updateSelectedIds([...this.selectedIds,(e=this.searchResults[0])==null?void 0:e.id]),this.searchValue="")},onBackspace(){this.searchValue||(this.selectedIds=this.selectedIds.slice(0,-1),this.$emit("update:selectedIds",this.selectedIds),this.$emit("change",this.selectedValues))},onFocusOutside(){this.inputOrOptionsFocussed=!1,this.searchValue=""},onInput(){this.$refs.combobox.updateFocusOptions()},onInputFocus(){this.inputOrOptionsFocussed||this.$refs.combobox.toggle(),this.inputOrOptionsFocussed=!0,this.$refs.combobox.updateFocusOptions()},updateSelectedIds(e){const s=a=>{this.selectedIds=y.uniq(a).filter(Boolean),this.$emit("update:selectedIds",this.selectedIds),this.$emit("change",this.selectedValues)};if(!e.includes(w)){s(e);return}const p={id:y.kebabCase(this.searchValue),text:this.searchValue.trim()};this.allPossibleItems.some(a=>a.id===p.id)||(this.allPossibleItems.push(p),s(e.map(a=>a===w?p.id:a)))},removeTag(e){this.updateSelectedIds(this.selectedIds.filter(s=>s!==e)),this.closeOptions()},removeAllTags(){this.updateSelectedIds([]),this.closeOptions()},closeOptions(){this.$refs.combobox.closeOptions()}}});const P=["title"],$={class:"text"},L={class:"icon-right"};function N(e,s,d,p,n,a){const c=f("CloseIcon"),h=f("FunctionButton"),o=f("Multiselect");return I(),_(o,{ref:"combobox","model-value":e.selectedIds,"possible-values":e.searchResults,"use-custom-list-box":"","size-visible-options":e.maxSizeVisibleOptions,"parent-focus-element":e.focusElement,"parent-refocus-element-on-close":e.refocusElement,"close-dropdown-on-selection":e.closeDropdownOnSelection,"is-valid":e.isValid,onFocusOutside:e.onFocusOutside,"onUpdate:modelValue":e.updateSelectedIds},{listBox:v(()=>[t("div",{ref:"listBox",class:"summary-input-icon-wrapper",tabindex:"0",onKeydown:s[8]||(s[8]=m(u((...i)=>e.focusInput&&e.focusInput(...i),["prevent","self"]),["enter"]))},[t("div",{class:M(["summary-input-wrapper",{"with-icon-right":e.hasSelection}]),onClick:s[7]||(s[7]=u((...i)=>e.focusInput&&e.focusInput(...i),["stop"]))},[(I(!0),g(k,null,z(e.selectedValues,(i,O)=>(I(),g("div",{key:`item.id${O}`,class:"tag",title:i.text},[t("span",$,r(i.text),1),l(h,{class:"remove-tag-button",onClick:u(be=>e.removeTag(i.id),["stop"])},{default:v(()=>[l(c,{class:"remove-tag-button-icon"})]),_:2},1032,["onClick"])],8,P))),128)),x(t("input",{ref:"searchInput","onUpdate:modelValue":s[0]||(s[0]=i=>e.searchValue=i),class:"search-input",type:"text",style:T(e.inputWidth),onFocus:s[1]||(s[1]=(...i)=>e.onInputFocus&&e.onInputFocus(...i)),onInput:s[2]||(s[2]=(...i)=>e.onInput&&e.onInput(...i)),onKeydown:[s[3]||(s[3]=m(u((...i)=>e.onEnter&&e.onEnter(...i),["prevent"]),["enter"])),s[4]||(s[4]=m((...i)=>e.onBackspace&&e.onBackspace(...i),["backspace"])),s[5]||(s[5]=m(u((...i)=>e.onDown&&e.onDown(...i),["stop","prevent"]),["down"])),s[6]||(s[6]=m(u((...i)=>e.closeOptions&&e.closeOptions(...i),["stop","prevent"]),["esc"]))]},null,36),[[D,e.searchValue]])],2),x(t("div",L,[l(h,{ref:"removeAllTags",class:"remove-all-tags-button",onClick:u(e.removeAllTags,["stop"])},{default:v(()=>[l(c)]),_:1},8,["onClick"])],512),[[A,e.hasSelection]])],544)]),_:1},8,["model-value","possible-values","size-visible-options","parent-focus-element","parent-refocus-element-on-close","close-dropdown-on-selection","is-valid","onFocusOutside","onUpdate:modelValue"])}const U=V(R,[["render",N],["__scopeId","data-v-d6518f73"]]),W=`<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { kebabCase, uniq } from "lodash";

import Multiselect from "./Multiselect.vue";
import FunctionButton from "../FunctionButton.vue";
import CloseIcon from "../../assets/img/icons/close.svg";

const DRAFT_ITEM_ID = "draft-id-combobox-preview-item";

interface ComboBoxItem {
  id: string;
  text: string;
}

interface ComponentData {
  selectedIds: Array<string>;
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
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text")
        );
      },
    },
    /**
     * List of initial selected ids.
     */
    initialSelectedIds: {
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
    "update:selectedIds": (_payload: Array<string>) => true,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    change: (_payload: Array<ComboBoxItem>) => true,
  },

  data(): ComponentData {
    return {
      selectedIds: this.initialSelectedIds,
      searchValue: "",
      inputOrOptionsFocussed: false,
      /*
       * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
       * When the searchInput of this component is focussed then they shouldn't be closed either, which is why
       * it needs to be passed to the Multiselect component.
       */
      focusElement: null,
      refocusElement: null,
      allPossibleItems: this.possibleValues,
    };
  },

  computed: {
    isSearchEmpty() {
      return !this.searchValue.trim();
    },

    searchResults() {
      const hasExactSearchMatch = this.allPossibleItems.some(
        ({ text }) => text.toLowerCase() === this.searchValue.toLowerCase()
      );

      const fuzzyMatchedItems = this.allPossibleItems.filter(({ text }) =>
        text.toLowerCase().includes(this.searchValue.toLowerCase())
      );

      if (this.allowNewValues && !hasExactSearchMatch && !this.isSearchEmpty) {
        // add a preview for a non existing items
        return [
          { id: DRAFT_ITEM_ID, text: \`\${this.searchValue} (new item)\` },
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
      return this.selectedIds.length === 0
        ? []
        : this.selectedIds.map((id) => {
            const item = this.allPossibleItems.find((item) => item.id === id);
            return item || { id, text: id };
          });
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
    focusInput() {
      (this.$refs.searchInput as HTMLInputElement).focus();
    },
    onDown() {
      (this.$refs.combobox as MultiselectRef).onDown();
    },
    onEnter() {
      if (this.isSearchEmpty) {
        return;
      }

      this.updateSelectedIds([...this.selectedIds, this.searchResults[0]?.id]);
      this.searchValue = "";
    },
    onBackspace() {
      if (!this.searchValue) {
        this.selectedIds = this.selectedIds.slice(0, -1);
        this.$emit("update:selectedIds", this.selectedIds);
        this.$emit("change", this.selectedValues);
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
      const setSelectedIds = (value: Array<string>) => {
        this.selectedIds = uniq(value).filter(Boolean);
        this.$emit("update:selectedIds", this.selectedIds);
        this.$emit("change", this.selectedValues);
      };

      const hasNewItem = selectedIds.includes(DRAFT_ITEM_ID);

      if (!hasNewItem) {
        setSelectedIds(selectedIds);
        return;
      }

      const newItem: ComboBoxItem = {
        id: kebabCase(this.searchValue),
        text: this.searchValue.trim(),
      };

      const isDuplicateItem = this.allPossibleItems.some(
        (item) => item.id === newItem.id
      );

      if (isDuplicateItem) {
        return;
      }

      this.allPossibleItems.push(newItem);

      setSelectedIds(
        selectedIds.map((id) => (id === DRAFT_ITEM_ID ? newItem.id : id))
      );
    },

    removeTag(idToRemove: string) {
      this.updateSelectedIds(
        this.selectedIds.filter((id) => id !== idToRemove)
      );
      this.closeOptions();
    },

    removeAllTags() {
      this.updateSelectedIds([]);
      this.closeOptions();
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
    :model-value="selectedIds"
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
            @keydown.esc.stop.prevent="closeOptions"
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
    border: 1px solid var(--knime-stone-gray);
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
      padding: 11px;
      cursor: text;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      flex: 1;

      &.with-icon-right {
        max-width: calc(100% - 40px);
        padding: 11px 0 11px 11px;
      }

      & .search-input {
        all: unset;
        height: 18px;
        font-size: 13px;
        font-weight: 300;
        line-height: normal;
        flex: 1;
      }

      & .tag {
        height: 18px;
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
`,j=`<ComboBox
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
  :initialSelectedIds="selected"
  :size-visible-options="3"
  close-dropdown-on-selection
  @update:selected-ids="selectedValues => selected = selectedValues"
/>`,q={components:{ComboBox:U,CodeExample:C},data(){return{codeExample:j,selected:[[],[],[]],selectedValues:[],values:[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"lorem",text:"Lorem"},{id:"ipsum",text:"Ipsum"},{id:"dolor",text:"dolor"}]}},computed:{code(){return W}}},H=t("div",{class:"grid-container"},[t("div",{class:"grid-item-12"},[t("p",null,[b(" A combobox component. It emits an "),t("code",null,"update"),b(" event when an option is (de-)selected and has a list of selected "),t("code",null,"values"),b(". ")])])],-1),K={class:"grid-container"},G=t("div",{class:"grid-item-3"},"default",-1),J={class:"grid-item-6"},Q={class:"grid-item-3"},X=t("br",null,null,-1),Y={class:"grid-container"},Z=t("div",{class:"grid-item-3"},"max visible options: 3",-1),ee={class:"grid-item-6"},se={class:"grid-item-3"},te=t("br",null,null,-1),ne={class:"grid-container"},ie=t("div",{class:"grid-item-3"},"allow new values",-1),oe={class:"grid-item-6"},le={class:"grid-item-3"},ae=t("br",null,null,-1),de={class:"grid-container"},re=t("div",{class:"grid-item-3"},"close dropdown on selection",-1),ce={class:"grid-item-6"},ue={class:"grid-item-3"},pe={class:"grid-container"},he={class:"grid-item-12"},me={class:"grid-container"},fe={class:"grid-item-12"};function ve(e,s,d,p,n,a){const c=f("ComboBox",!0),h=f("CodeExample");return I(),g("div",null,[t("section",null,[H,t("div",K,[G,t("div",J,[l(c,{"possible-values":n.values,"initial-selected-ids":n.selected[0],"onUpdate:selectedIds":s[0]||(s[0]=o=>n.selected[0]=o),onChange:s[1]||(s[1]=o=>n.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),t("div",Q,"selected-ids: "+r(n.selected[0]),1)]),X,t("div",Y,[Z,t("div",ee,[l(c,{"possible-values":n.values,"initial-selected-ids":n.selected[1],"size-visible-options":3,"onUpdate:selectedIds":s[2]||(s[2]=o=>n.selected[1]=o),onChange:s[3]||(s[3]=o=>n.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),t("div",se,"selected-ids: "+r(n.selected[1]),1)]),te,t("div",ne,[ie,t("div",oe,[l(c,{"possible-values":n.values,"initial-selected-ids":n.selected[0],"allow-new-values":"","onUpdate:selectedIds":s[4]||(s[4]=o=>n.selected[0]=o),onChange:s[5]||(s[5]=o=>n.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),t("div",le,"selected-ids: "+r(n.selected[0]),1)]),ae,t("div",de,[re,t("div",ce,[l(c,{"possible-values":n.values,"initial-selected-ids":n.selected[2],"close-dropdown-on-selection":"","onUpdate:selectedIds":s[6]||(s[6]=o=>n.selected[2]=o),onChange:s[7]||(s[7]=o=>n.selectedValues=o)},null,8,["possible-values","initial-selected-ids"])]),t("div",ue,"selected-ids: "+r(n.selected[2]),1)]),t("div",pe,[t("div",he,"Selected Values: "+r(n.selectedValues),1)])]),t("section",null,[t("div",me,[t("div",fe,[l(h,{summary:"Show usage example"},{default:v(()=>[b(r(n.codeExample),1)]),_:1}),l(h,{summary:"Show ComboBox.vue source code"},{default:v(()=>[b(r(a.code),1)]),_:1})])])])])}const Oe=V(q,[["render",ve]]);export{Oe as default};
