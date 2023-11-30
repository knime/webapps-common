import{C as h}from"./CodeExample-ae96cd93.js";import{T as m}from"./Twinlist-8efef0ab.js";import{L as f}from"./LoadingIcon-7892035d.js";import{_ as v,m as b,r as c,o as p,c as g,b as e,d as l,t as i,w as u,e as r}from"./index-0e8d0cb5.js";import"./Label-14ecfd6d.js";import"./MultiselectListBox-3f7712d6.js";import"./StyledListItem-08670508.js";import"./arrow-next-5405069b.js";import"./svgWithTitle-95ade1d2.js";const w=`<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import MultiselectListBox from "../forms/MultiselectListBox.vue";
import ArrowNextIcon from "../../assets/img/icons/arrow-next.svg";
import ArrowNextDoubleIcon from "../../assets/img/icons/arrow-next-double.svg";
import ArrowPrevIcon from "../../assets/img/icons/arrow-prev.svg";
import ArrowPrevDoubleIcon from "../../assets/img/icons/arrow-prev-double.svg";
import { filters } from "../../../util/filters";
import type { PropType } from "vue";

const KEY_ENTER = "Enter";
const MIN_LIST_SIZE = 5;

export type Id = string | number | symbol;

export interface PossibleValue {
  id: Id;
  text: string;
  invalid?: boolean;
}

export default {
  components: {
    ArrowNextDoubleIcon,
    ArrowNextIcon,
    ArrowPrevDoubleIcon,
    ArrowPrevIcon,
    MultiselectListBox,
    Label,
    SearchInput,
  },
  props: {
    modelValue: {
      type: Array as PropType<Id[] | null>,
      default: null,
    },
    initialCaseSensitiveSearch: {
      default: false,
      type: Boolean,
    },
    initialSearchTerm: {
      type: String,
      required: false,
      default: "",
    },
    initialIncludeUnknownValues: {
      type: Boolean,
      default: false,
    },

    /**
     * Hiding and disabling
     */
    showSearch: {
      default: false,
      type: Boolean,
    },
    showUnknownValues: {
      type: Boolean,
      default: false,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    showEmptyState: {
      default: true,
      type: Boolean,
    },
    /**
     * Labels
     */
    leftLabel: {
      type: String,
      required: true,
      default: "Possible values",
    },
    rightLabel: {
      type: String,
      required: true,
      default: "Selected values",
    },
    withSearchLabel: {
      default: false,
      type: Boolean,
    },
    searchLabel: {
      type: String,
      required: false,
      default: "Search values",
    },
    searchPlaceholder: {
      type: String,
      required: false,
      default: "Search",
    },
    unknownValuesText: {
      type: String,
      required: false,
      default: "Unknown values",
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
    isValid: {
      default: true,
      type: Boolean,
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
     */
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => [],
    },
    /**
     * If this setting is true, on a change of possible values, the currently
     * chosen values which are missing with respect to the new possible values
     * are removed.
     */
    filterChosenValuesOnPossibleValuesChange: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  emits: ["update:modelValue", "includeUnknownValuesInput"],
  data() {
    return {
      chosenValues: this.modelValue,
      invalidPossibleValueIds: new Set(),
      rightSelected: [] as Id[],
      leftSelected: [] as Id[],
      searchTerm: this.initialSearchTerm,
      caseSensitiveSearch: this.initialCaseSensitiveSearch,
      includeUnknownValues: this.initialIncludeUnknownValues,
      unknownValuesId: Symbol("Unknown values"),
    };
  },
  computed: {
    possibleValueMap() {
      return Object.assign(
        {},
        ...this.possibleValues.map((obj: PossibleValue, index) => ({
          [obj.id]: { item: obj, index },
        })),
      ) as Record<Id, { item: PossibleValue; index: number }>;
    },
    possibleValueIds() {
      return this.possibleValues.map((x) => x.id);
    },
    invalidValueIds() {
      if (this.chosenValues === null) {
        return [];
      }
      return this.chosenValues.filter((x: Id) => !this.possibleValueMap[x]);
    },
    matchingInvalidValueIds() {
      return this.invalidValueIds.filter((item) =>
        this.itemMatchesSearch(this.generateInvalidItem(item)),
      );
    },
    matchingValidIds() {
      return this.possibleValues
        .filter((possibleValue) => this.itemMatchesSearch(possibleValue))
        .map((possibleValue) => possibleValue.id);
    },
    visibleValueIds() {
      if (this.chosenValues === null) {
        return new Set();
      }
      return new Set([
        ...this.matchingValidIds,
        ...this.matchingInvalidValueIds,
      ]);
    },
    leftItems() {
      if (this.visibleValueIds.size === 0) {
        return [];
      }
      const chosenValuesSet = new Set(this.chosenValues);
      return this.possibleValues.filter(
        (value) =>
          this.visibleValueIds.has(value.id) && !chosenValuesSet.has(value.id),
      );
    },
    rightItems() {
      if (this.chosenValues === null) {
        return [];
      }
      return this.chosenValues
        .map(
          (value) =>
            this.possibleValueMap[value]?.item ||
            this.generateInvalidItem(value),
        )
        .filter((value) => this.visibleValueIds.has(value.id));
    },
    listSize() {
      // fixed size even when showing all to prevent height jumping when moving items between lists
      const size = this.size === 0 ? this.possibleValues.length : this.size;
      // limit size to minimum
      return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
    },
    showUnknownValuesLeft() {
      return this.showUnknownValues && !this.includeUnknownValues;
    },
    showUnknownValuesRight() {
      return this.showUnknownValues && this.includeUnknownValues;
    },
    moveAllRightButtonDisabled() {
      return this.leftItems.length === 0 && !this.showUnknownValuesLeft;
    },
    moveRightButtonDisabled() {
      return this.leftSelected.length === 0;
    },
    moveAllLeftButtonDisabled() {
      return this.rightItems.length === 0 && !this.showUnknownValuesRight;
    },
    moveLeftButtonDisabled() {
      return this.rightSelected.length === 0;
    },
    normalizedSearchTerm() {
      if (!this.showSearch) {
        return "";
      }
      return filters.search.normalize(
        this.searchTerm,
        this.caseSensitiveSearch,
      );
    },
    numAllItems() {
      return this.invalidValueIds.length + this.possibleValues.length;
    },
    numAllRightItems() {
      if (this.chosenValues === null) {
        return 0;
      }
      return this.chosenValues.length;
    },
    numShownRightItems() {
      return this.rightItems.length;
    },
    numAllLeftItems() {
      return (
        this.possibleValues.length +
        this.invalidValueIds.length -
        this.numAllRightItems
      );
    },
    numShownLeftItems() {
      return this.leftItems.length;
    },
    hasActiveSearch() {
      return this.showSearch && this.searchTerm !== "";
    },
    leftInfo() {
      return this.getInfoText(this.numShownLeftItems, this.numAllLeftItems);
    },
    rightInfo() {
      return this.getInfoText(this.numShownRightItems, this.numAllRightItems);
    },
  },
  watch: {
    modelValue(newValue) {
      if (
        this.chosenValues?.length !== newValue.length ||
        JSON.stringify(newValue) !== JSON.stringify(this.chosenValues)
      ) {
        this.chosenValues = newValue;
      }
    },
    possibleValues(newPossibleValues: PossibleValue[]) {
      if (this.filterChosenValuesOnPossibleValuesChange) {
        // Required to prevent invalid values from appearing (e.g. missing b/c of upstream filtering)
        let allValues = newPossibleValues.reduce((arr, valObj) => {
          arr.push(...Object.values(valObj));
          return arr;
        }, [] as Id[]);
        // Reset chosenValues as subset of original to prevent re-execution from resetting value
        this.chosenValues = (this.chosenValues ?? []).filter((item) =>
          allValues.includes(item),
        );
      }
    },
    chosenValues(newVal: Id[], oldVal: Id[] | null) {
      if (
        oldVal === null ||
        newVal.length !== oldVal.length ||
        oldVal.some((item, i) => item !== newVal[i])
      ) {
        this.$emit("update:modelValue", this.chosenValues);
      }
    },
    includeUnknownValues(newVal) {
      this.$emit("includeUnknownValuesInput", newVal);
    },
  },
  methods: {
    generateInvalidItem(id: Id) {
      return { id, text: \`(MISSING) \${String(id)}\`, invalid: true };
    },
    getIndex(id: Id) {
      return this.possibleValueMap[id]?.index ?? -1;
    },
    compareByOriginalSorting(a: Id, b: Id) {
      return this.getIndex(a) - this.getIndex(b);
    },
    clearSelections() {
      (this.$refs.right as any).clearSelection();
      (this.$refs.left as any).clearSelection();
    },
    moveRight(itemsParam: Id[] | null = null) {
      // add all left items to our values
      const items = itemsParam ?? this.leftSelected;
      if (this.chosenValues !== null) {
        this.chosenValues = [
          ...items.filter((item) => item !== this.unknownValuesId),
          ...this.chosenValues,
        ].sort(this.compareByOriginalSorting);
      }
      if (items.includes(this.unknownValuesId)) {
        this.includeUnknownValues = true;
      }
      this.clearSelections();
    },
    moveLeft(itemsParam: Id[] | null = null) {
      // remove all right values from or chosenValues
      const items = itemsParam ?? this.rightSelected;
      // add the invalid items to the possible items
      const invalidValueIdsSet = new Set(this.invalidValueIds);
      const invalidItems = items.filter((x) => invalidValueIdsSet.has(x));
      invalidItems.forEach((x) => this.invalidPossibleValueIds.add(x));
      const itemsSet = new Set(items);
      if (this.chosenValues !== null) {
        this.chosenValues = this.chosenValues
          .filter((x) => !itemsSet.has(x))
          .sort(this.compareByOriginalSorting);
      }
      if (itemsSet.has(this.unknownValuesId)) {
        this.includeUnknownValues = false;
      }
      this.clearSelections();
    },
    onMoveRightButtonClick() {
      this.moveRight();
    },
    onMoveAllRightButtonClick() {
      // only move valid items
      this.moveRight(this.leftItems.filter((x) => !x.invalid).map((x) => x.id));
      this.includeUnknownValues = true;
    },
    onMoveAllRightButtonKey(e: KeyboardEvent) {
      if (e.key === KEY_ENTER) {
        this.onMoveAllRightButtonClick();
        this.stopPropagation(e);
      }
    },
    onMoveRightButtonKey(e: KeyboardEvent) {
      if (e.key === KEY_ENTER) {
        this.moveRight();
        this.stopPropagation(e);
      }
    },
    onMoveLeftButtonClick() {
      this.moveLeft();
    },
    onMoveAllLeftButtonClick() {
      this.moveLeft(this.rightItems.map((x) => x.id));
      this.includeUnknownValues = false;
    },
    onMoveLeftButtonKey(e: KeyboardEvent) {
      if (e.key === KEY_ENTER) {
        this.moveLeft();
        this.stopPropagation(e);
      }
    },
    onMoveAllLeftButtonKey(e: KeyboardEvent) {
      if (e.key === KEY_ENTER) {
        this.onMoveAllLeftButtonClick();
        this.stopPropagation(e);
      }
    },
    stopPropagation(e: KeyboardEvent) {
      e.preventDefault();
      e.stopPropagation();
    },
    onLeftListBoxDoubleClick(item: Id) {
      this.moveRight([item]);
    },
    onLeftListBoxShiftDoubleClick(items: Id[]) {
      this.moveRight(items);
    },
    onRightListBoxDoubleClick(item: Id) {
      this.moveLeft([item]);
    },
    onRightListBoxShiftDoubleClick(items: Id[]) {
      this.moveLeft(items);
    },
    onLeftInput(value: Id[]) {
      if (value.length > 0) {
        (this.$refs.right as any).clearSelection();
      }
      this.leftSelected = value;
    },
    onRightInput(value: Id[]) {
      if (value.length > 0) {
        (this.$refs.left as any).clearSelection();
      }
      this.rightSelected = value;
    },
    onKeyRightArrow() {
      this.moveRight();
    },
    onKeyLeftArrow() {
      this.moveLeft();
    },
    onSearchInput(value: string) {
      this.searchTerm = value;
    },
    hasSelection() {
      return (this.chosenValues?.length ?? 0) > 0;
    },
    validate() {
      let isValid = !this.rightItems.some((x) => x.invalid);
      return {
        isValid,
        errorMessage: isValid
          ? null
          : "One or more of the selected items is invalid.",
      };
    },
    itemMatchesSearch(item: PossibleValue) {
      return filters.search.test(
        item.text,
        this.normalizedSearchTerm,
        this.caseSensitiveSearch,
        false,
      );
    },
    getInfoText(numShownItems: number, numAllItems: number) {
      return this.hasActiveSearch
        ? \`\${numShownItems} of \${numAllItems} entries\`
        : null;
    },
  },
};
<\/script>

<template>
  <div class="twinlist">
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
        <div class="label" :title="leftLabel">
          {{ leftLabel }}
        </div>
        <div v-if="leftInfo" :title="leftInfo" class="info">
          {{ leftInfo }}
        </div>
      </div>
      <div class="space" />
      <div class="title">
        <div class="label" :title="rightLabel">
          {{ rightLabel }}
        </div>
        <div v-if="rightInfo" :title="rightInfo" class="info">
          {{ rightInfo }}
        </div>
      </div>
    </div>
    <div :class="['lists', { disabled }]">
      <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
      <MultiselectListBox
        ref="left"
        :with-is-empty-state="showEmptyState"
        :empty-state-label="emptyStateLabel"
        :empty-state-component="emptyStateComponent"
        :size="listSize"
        class="list-box"
        :model-value="leftSelected"
        :with-bottom-value="showUnknownValuesLeft"
        :bottom-value="{ id: unknownValuesId, text: unknownValuesText }"
        :is-valid="isValid"
        :possible-values="leftItems"
        :ariaLabel="leftLabel"
        :disabled="disabled"
        @double-click-on-item="onLeftListBoxDoubleClick"
        @double-click-shift="onLeftListBoxShiftDoubleClick"
        @key-arrow-right="onKeyRightArrow"
        @update:model-value="onLeftInput"
      />
      <!--  eslint-enable vue/attribute-hyphenation -->
      <div class="buttons">
        <div
          ref="moveRight"
          :class="{ disabled: moveRightButtonDisabled || disabled }"
          role="button"
          tabindex="0"
          @click="onMoveRightButtonClick"
          @keydown="onMoveRightButtonKey"
        >
          <ArrowNextIcon class="icon" />
        </div>
        <div
          ref="moveAllRight"
          :class="{ disabled: moveAllRightButtonDisabled || disabled }"
          role="button"
          tabindex="0"
          @click="onMoveAllRightButtonClick"
          @keydown="onMoveAllRightButtonKey"
        >
          <ArrowNextDoubleIcon class="icon" />
        </div>
        <div
          ref="moveLeft"
          :class="{ disabled: moveLeftButtonDisabled || disabled }"
          role="button"
          tabindex="0"
          @click="onMoveLeftButtonClick"
          @keydown="onMoveLeftButtonKey"
        >
          <ArrowPrevIcon class="icon" />
        </div>
        <div
          ref="moveAllLeft"
          :class="{ disabled: moveAllLeftButtonDisabled || disabled }"
          role="button"
          tabindex="0"
          @click="onMoveAllLeftButtonClick"
          @keydown="onMoveAllLeftButtonKey"
        >
          <ArrowPrevDoubleIcon class="icon" />
        </div>
      </div>
      <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
      <MultiselectListBox
        ref="right"
        class="list-box"
        :class="{ 'with-empty-state-icon': emptyStateComponent }"
        :model-value="rightSelected"
        :with-bottom-value="showUnknownValuesRight"
        :bottom-value="{ id: unknownValuesId, text: unknownValuesText }"
        :with-is-empty-state="showEmptyState"
        :empty-state-label="emptyStateLabel"
        :empty-state-component="emptyStateComponent"
        :possible-values="rightItems"
        :size="listSize"
        :ariaLabel="rightLabel"
        :disabled="disabled"
        @double-click-on-item="onRightListBoxDoubleClick"
        @double-click-shift="onRightListBoxShiftDoubleClick"
        @key-arrow-left="onKeyLeftArrow"
        @update:model-value="onRightInput"
      />
      <!--  eslint-enable vue/attribute-hyphenation -->
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.twinlist {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  --button-bar-width: 30px;

  & .title {
    line-height: 18px;
    margin-bottom: 3px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 5px;

    & .label {
      font-weight: 500;
      font-family: var(--theme-text-medium-font-family);
      color: var(--theme-text-medium-color);
      font-size: 13px;
      flex: 1 0 0;
      text-overflow: ellipsis;
      overflow: hidden;
      min-width: 50px;
    }

    & .info {
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 8px;
      font-weight: 300;
      white-space: nowrap;
      display: flex;
    }
  }

  & .lists,
  & .header {
    display: flex;
    align-items: stretch;
    flex-direction: row;
  }

  & .space,
  & .buttons {
    flex: 0 0 var(--button-bar-width);
  }

  & .title,
  & .list-box {
    flex: 3 1 auto;
    max-width: calc(50% - (var(--button-bar-width) / 2));
  }

  & .with-empty-state-icon :deep(svg) {
    height: 13px;
  }

  & .list-box {
    display: flex;
    align-items: stretch;
    flex-direction: row;
  }

  & .buttons {
    flex: 0 0 30px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  & [role="button"] {
    cursor: pointer;
    width: 30px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    background: var(--theme-select-control-background-color);
    color: var(--theme-select-control-foreground-color);

    &:hover {
      background: var(--theme-select-control-background-color-hover);
    }

    & .icon {
      width: 15px;
      height: 15px;
      stroke-width: calc(32px / 15);
      pointer-events: none;
      stroke: var(--theme-select-control-foreground-color-hover);
    }

    &:focus {
      outline: none;
      background: var(--theme-select-control-background-color-focus);
      color: var(--theme-select-control-foreground-color-focus);

      & .icon {
        stroke: var(--theme-select-control-foreground-color-focus);
      }
    }

    &:active {
      background: var(--theme-select-control-background-color-focus);
      color: var(--theme-select-control-foreground-color-focus);

      & .icon {
        stroke: var(--theme-select-control-foreground-color-focus);
      }
    }

    /* disabled icons */
    &.disabled {
      cursor: default;
      opacity: 0.5;
      pointer-events: none;
      background: var(--theme-select-control-background-color-disabled);

      & .icon {
        stroke: var(--theme-select-control-foreground-color);
      }

      &:focus,
      &:active,
      &:hover {
        & .icon {
          stroke: var(--theme-select-control-foreground-color);
        }

        background: transparent;
        color: var(--theme-select-control-foreground-color);
      }
    }
  }

  & .search-wrapper {
    margin-bottom: 10px;
  }
}
</style>
`,V=`<Twinlist
  v-model="selected"
  left-label="Select stuff here"
  right-label="The selected stuff"
  initial-search-term=""
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
<Twinlist
  v-model="selected"
  show-search
  left-label="Select stuff here"
  right-label="The selected stuff"
  search-label="Search items"
  search-placeholder="Placeholder"
  initial-search-term="bar"
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
<Twinlist
  v-model="selectedSearchLabel"
  show-search
  left-label="Select from the visible items"
  right-label="The selected stuff"
  search-label="Search items"
  search-placeholder="Placeholder"
  :with-search-label="true"
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
/>`,x={components:{Twinlist:m,CodeExample:h},data(){return{codeExample:V,selected:[],selectedMissing:["foo","I am missing","bar"],selectedUnknown:[],selectedSearchLabel:[],loadingIconRef:b(f)}},computed:{code(){return w},demoValues(){return[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"},{id:"baz7",text:"Baz 7"},{id:"baz8",text:"Baz 8"},{id:"baz9",text:"Baz 9"},{id:"baz10",text:"Baz 10"},{id:"baz11",text:"Baz 11"}]}}},I=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[r(" Two list boxes for selecting multiple items. It acts as a form element, so it emits an "),e("code",null,"input"),r(" event when selection changes, and it has a "),e("code",null,"value"),r(". For keyboard navigation inside of the lists see "),e("code",null,"MultiselectListBox"),r(". With "),e("code",null,"DoubleClick"),r(" the items can also be moved between the lists. ")])])],-1),S={class:"grid-container"},y={class:"grid-item-6"},k={class:"grid-item-6"},L=e("br",null,null,-1),_={class:"grid-container"},B={class:"grid-item-6"},z={class:"grid-item-6"},T=e("br",null,null,-1),R=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null," The Twinlist with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),A={class:"grid-container"},M={class:"grid-item-6"},P={class:"grid-item-6"},C=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with missing selected items.")])],-1),E={class:"grid-container"},U={class:"grid-item-6"},D={class:"grid-item-6"},N=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with unknown items.")])],-1),K={class:"grid-container"},O={class:"grid-item-6"},j={class:"grid-item-6"},q=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist can show a customizable search label.")])],-1),F={class:"grid-container"},Y={class:"grid-item-6"},Z={class:"grid-item-6"},J=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The content visible in empty boxes is customizable.")])],-1),G={class:"grid-container"},H={class:"grid-item-6"},W={class:"grid-item-6"},X={class:"grid-container"},Q={class:"grid-item-12"};function $(ee,t,ne,te,n,o){const a=c("Twinlist",!0),d=c("CodeExample");return p(),g("div",null,[e("section",null,[I,e("div",S,[e("div",y,[l(a,{modelValue:n.selected,"onUpdate:modelValue":t[0]||(t[0]=s=>n.selected=s),size:7,"left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",k,"selected ids: "+i(n.selected),1)]),L,e("div",_,[e("div",B,[l(a,{modelValue:n.selected,"onUpdate:modelValue":t[1]||(t[1]=s=>n.selected=s),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":o.demoValues,disabled:""},null,8,["modelValue","possible-values"])]),e("div",z,"selected ids: "+i(n.selected),1)]),T,R,e("div",A,[e("div",M,[l(a,{modelValue:n.selected,"onUpdate:modelValue":t[2]||(t[2]=s=>n.selected=s),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","initial-search-term":"bar","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",P,"selected ids: "+i(n.selected),1)]),C,e("div",E,[e("div",U,[l(a,{modelValue:n.selectedMissing,"onUpdate:modelValue":t[3]||(t[3]=s=>n.selectedMissing=s),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",D,"selected ids: "+i(n.selectedMissing),1)]),N,e("div",K,[e("div",O,[l(a,{modelValue:n.selectedUnknown,"onUpdate:modelValue":t[4]||(t[4]=s=>n.selectedUnknown=s),size:7,"show-search":"","show-unknown-values":"","unknown-values-text":"My unknowns","left-label":"Select from the visible items","right-label":"The selected stuff","search-placeholder":"Placeholder","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",j,"selected ids: "+i(n.selectedUnknown),1)]),q,e("div",F,[e("div",Y,[l(a,{modelValue:n.selectedSearchLabel,"onUpdate:modelValue":t[5]||(t[5]=s=>n.selectedSearchLabel=s),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",Z,"selected ids: "+i(n.selectedSearchLabel),1)]),J,e("div",G,[e("div",H,[l(a,{"model-value":[],size:7,"possible-values":o.demoValues,"left-label":"Select from the visible items","right-label":"The selected stuff","empty-state-component":n.loadingIconRef},null,8,["possible-values","empty-state-component"])]),e("div",W,"selected ids: "+i(n.selectedSearchLabel),1)])]),e("section",null,[e("div",X,[e("div",Q,[l(d,{summary:"Show usage example"},{default:u(()=>[r(i(n.codeExample),1)]),_:1}),l(d,{summary:"Show Twinlist.vue source code"},{default:u(()=>[r(i(o.code),1)]),_:1})])])])])}const he=v(x,[["render",$]]);export{he as default};
