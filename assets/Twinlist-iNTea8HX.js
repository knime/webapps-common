import{C as m}from"./CodeExample-I0T9PPj7.js";import{T as v}from"./Twinlist-sW6sgnZP.js";import{L as f}from"./LoadingIcon-fUJrbpuW.js";import{_ as b,m as p,r as c,o as g,c as w,b as e,d as o,t as l,w as h,e as r}from"./index-hS3kbgGg.js";import"./Label-A9YWeNu7.js";import"./MultiselectListBox-mzoQLySG.js";import"./StyledListItem-E3oXGHmP.js";import"./arrow-next-3rDmQkVH.js";import"./createMissingItem-gAI5zZ9a.js";import"./svgWithTitle-Anj-2aBe.js";const V=`<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import MultiselectListBox from "../forms/MultiselectListBox.vue";
import ArrowNextIcon from "../../assets/img/icons/arrow-next.svg";
import ArrowNextDoubleIcon from "../../assets/img/icons/arrow-next-double.svg";
import ArrowPrevIcon from "../../assets/img/icons/arrow-prev.svg";
import ArrowPrevDoubleIcon from "../../assets/img/icons/arrow-prev-double.svg";
import { filters } from "../../../util/filters";
import type { PropType } from "vue";
import type { Id, PossibleValue } from "./possibleValues/PossibleValue";
import createMissingItem from "./possibleValues/createMissingItem";

const KEY_ENTER = "Enter";
const MIN_LIST_SIZE = 5;

const arraysDiffer = (first: Id[] | null, second: Id[]) =>
  first?.length !== second?.length ||
  JSON.stringify(first) !== JSON.stringify(second);

interface TransformOnMovePayload {
  /**
   * The to be updated list of ids
   */
  previous: Id[];
  movingParts: {
    /**
     * The moved items that are not the "unknown values"
     */
    knownValues: Set<Id>;
    /**
     * Whether the unknown values are part of the moved items
     */
    movingUnknownValues: boolean;
  };
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
    /**
     * Only required (in combination with the @update:excludedValues event) whenever missing excluded values are desired.
     * Because, if this prop is not set, the excluded list will simply be the possible values which are not part of the modelValue.
     */
    excludedValues: {
      type: Array as PropType<Id[] | null>,
      required: false,
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
  emits: [
    /**
     * Enable whenever the modelValue needs to be adjusted to match what is to be displayed.
     */
    "update:modelValue",
    /**
     * Emitted whenever the excluded values prop is set and these need to be adjusted to match
     * what is to be displayed.
     * In particular, there is no such update initially whenever any unknown value is excluded, too.
     */
    "update:excludedValues",
    "includeUnknownValuesInput",
  ],
  data() {
    return {
      chosenValues: this.modelValue,
      currentExcludedValues: this.excludedValues,
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
    possibleValueIdsSet() {
      return new Set(this.possibleValueIds);
    },
    knownExcludedValues() {
      if (!this.currentExcludedValues) {
        const chosenValuesSet = new Set(this.chosenValues);
        return this.possibleValueIds.filter((id) => !chosenValuesSet.has(id));
      }
      if (this.showUnknownValuesLeft) {
        return this.currentExcludedValues.filter((id) =>
          this.possibleValueIdsSet.has(id),
        );
      }
      return this.currentExcludedValues;
    },
    knownChosenValues() {
      if (!this.chosenValues) {
        return null;
      }
      if (this.showUnknownValuesRight) {
        return this.chosenValues.filter((id) =>
          this.possibleValueIdsSet.has(id),
        );
      }
      return this.chosenValues;
    },
    leftItems() {
      if (this.knownChosenValues === null) {
        return [];
      }
      return this.knownExcludedValues
        .map(
          (value) =>
            this.possibleValueMap[value]?.item || createMissingItem(value),
        )
        .filter((value) => this.itemMatchesSearch(value));
    },
    rightItems() {
      if (this.knownChosenValues === null) {
        return [];
      }
      return this.knownChosenValues
        .map(
          (value) =>
            this.possibleValueMap[value]?.item || createMissingItem(value),
        )
        .filter((value) => this.itemMatchesSearch(value));
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
      return this.numAllLeftItems + this.numAllRightItems;
    },
    numAllRightItems() {
      if (this.knownChosenValues === null) {
        return 0;
      }
      return this.knownChosenValues.length;
    },
    numAllLeftItems() {
      return this.knownExcludedValues.length;
    },
    numShownRightItems() {
      return this.rightItems.length;
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
      if (arraysDiffer(this.chosenValues, newValue)) {
        this.chosenValues = newValue;
      }
    },
    excludedValues(newValue) {
      if (arraysDiffer(this.currentExcludedValues, newValue)) {
        this.currentExcludedValues = newValue;
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
      if (oldVal === null) {
        return;
      }
      if (
        newVal.length !== oldVal.length ||
        oldVal.some((item, i) => item !== newVal[i])
      ) {
        this.$emit("update:modelValue", newVal);
      }
    },
    includeUnknownValues(newVal) {
      this.$emit("includeUnknownValuesInput", newVal);
    },
  },
  methods: {
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
    moveItems(
      items: Id[],
      {
        toNewChosenValues,
        toNewExcludedValues,
        moveToIncluded,
      }: {
        toNewChosenValues: (params: TransformOnMovePayload) => Id[];
        toNewExcludedValues: (params: TransformOnMovePayload) => Id[];
        moveToIncluded: boolean;
      },
    ) {
      const knownValues = items.filter((item) => item !== this.unknownValuesId);
      const movingUnknownValues = items.length > knownValues.length;
      const movingParts = {
        knownValues: new Set(knownValues),
        movingUnknownValues,
      };
      if (this.chosenValues !== null) {
        this.chosenValues = toNewChosenValues({
          previous: this.chosenValues,
          movingParts,
        });
      }
      if (movingUnknownValues) {
        this.includeUnknownValues = moveToIncluded;
      }
      if (
        this.currentExcludedValues &&
        this.inducesExcludedValuesChange(items)
      ) {
        this.currentExcludedValues = toNewExcludedValues({
          previous: this.currentExcludedValues,
          movingParts,
        });
        this.emitUpdatedExcludedColumns();
      }
      this.clearSelections();
    },
    moveRight(itemsParam: Id[] | null = null) {
      this.moveItems(itemsParam ?? this.leftSelected, {
        toNewChosenValues: this.addMovedItems.bind(this),
        toNewExcludedValues: this.filterMovedItems.bind(this),
        moveToIncluded: true,
      });
    },
    moveLeft(itemsParam: Id[] | null = null) {
      this.moveItems(itemsParam ?? this.rightSelected, {
        toNewChosenValues: this.filterMovedItems.bind(this),
        toNewExcludedValues: this.addMovedItems.bind(this),
        moveToIncluded: false,
      });
    },
    /**
     * Filters out the moved items and also invalid items if unknown values are being moved.
     */
    filterMovedItems({
      previous,
      movingParts: { movingUnknownValues, knownValues },
    }: TransformOnMovePayload) {
      return previous.filter(
        (item) =>
          !knownValues.has(item) &&
          (!movingUnknownValues || this.possibleValueIdsSet.has(item)),
      );
    },
    /**
     * Adds the given items sorting by the order in the possible values afterwards and removing invalid items
     * if unknown values are being moved
     */
    addMovedItems({
      previous,
      movingParts: { movingUnknownValues, knownValues },
    }: TransformOnMovePayload) {
      return [
        ...(movingUnknownValues
          ? previous.filter((item) => this.possibleValueIdsSet.has(item))
          : previous),
        ...knownValues,
      ].sort(this.compareByOriginalSorting);
    },
    emitUpdatedExcludedColumns() {
      this.$emit("update:excludedValues", this.knownExcludedValues);
    },
    inducesExcludedValuesChange(itemsDiff: Id[]) {
      const validItemIsPartOfDiff = itemsDiff.some((item) =>
        this.possibleValueIdsSet.has(item),
      );
      if (validItemIsPartOfDiff) {
        return true;
      }
      // only invalid values moved. In this case we only do not need to update if unknown values are not on the left
      return !this.showUnknownValuesLeft;
    },
    onMoveRightButtonClick() {
      this.moveRight();
    },
    onMoveAllRightButtonClick() {
      const leftItemsIds = this.leftItems.map((x) => x.id);
      this.moveRight(
        leftItemsIds.concat(
          this.showUnknownValuesLeft ? [this.unknownValuesId] : [],
        ),
      );
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
      const rightItemIds = this.rightItems.map((x) => x.id);
      this.moveLeft(
        rightItemIds.concat(
          this.showUnknownValuesRight ? [this.unknownValuesId] : [],
        ),
      );
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
      let isValid =
        !this.rightItems.some((x) => x.invalid) &&
        (!this.excludedValues || !this.leftItems.some((x) => x.invalid));
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
        :tooltips="{
          inverseSearch: 'Move matching to other side',
        }"
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
`,x=`<Twinlist
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
/>`,I={components:{Twinlist:v,CodeExample:m},data(){return{codeExample:x,selected:[],selectedMissing:["foo","I am missing","bar"],excludedMissing:["baz","I am missing on the left","baz2","baz3","baz4","baz5","baz6","baz7","baz8","baz9","baz10","baz11"],selectedUnknown:[],selectedSearchLabel:[],loadingIconRef:p(f)}},computed:{code(){return V},demoValues(){return[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"},{id:"baz7",text:"Baz 7"},{id:"baz8",text:"Baz 8"},{id:"baz9",text:"Baz 9"},{id:"baz10",text:"Baz 10"},{id:"baz11",text:"Baz 11"}]}},methods:{updateExcludedMissing(d){this.excludedMissing=d}}},k=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[r(" Two list boxes for selecting multiple items. It acts as a form element, so it emits an "),e("code",null,"input"),r(" event when selection changes, and it has a "),e("code",null,"value"),r(". For keyboard navigation inside of the lists see "),e("code",null,"MultiselectListBox"),r(". With "),e("code",null,"DoubleClick"),r(" the items can also be moved between the lists. ")])])],-1),y={class:"grid-container"},S={class:"grid-item-6"},L={class:"grid-item-6"},_=e("br",null,null,-1),B={class:"grid-container"},T={class:"grid-item-6"},z={class:"grid-item-6"},M=e("br",null,null,-1),E=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null," The Twinlist with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),P={class:"grid-container"},C={class:"grid-item-6"},R={class:"grid-item-6"},A=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with missing selected items.")])],-1),U={class:"grid-container"},D={class:"grid-item-6"},N={class:"grid-item-6"},K=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with unknown items.")])],-1),O={class:"grid-container"},j={class:"grid-item-6"},q={class:"grid-item-6"},F=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist can show a customizable search label.")])],-1),Y={class:"grid-container"},Z={class:"grid-item-6"},J={class:"grid-item-6"},W=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The content visible in empty boxes is customizable.")])],-1),H={class:"grid-container"},X={class:"grid-item-6"},G={class:"grid-item-6"},Q={class:"grid-container"},$={class:"grid-item-12"};function ee(d,t,ne,te,n,i){const a=c("Twinlist",!0),u=c("CodeExample");return g(),w("div",null,[e("section",null,[k,e("div",y,[e("div",S,[o(a,{modelValue:n.selected,"onUpdate:modelValue":t[0]||(t[0]=s=>n.selected=s),size:7,"left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":i.demoValues},null,8,["modelValue","possible-values"])]),e("div",L,"selected ids: "+l(n.selected),1)]),_,e("div",B,[e("div",T,[o(a,{modelValue:n.selected,"onUpdate:modelValue":t[1]||(t[1]=s=>n.selected=s),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":i.demoValues,disabled:""},null,8,["modelValue","possible-values"])]),e("div",z,"selected ids: "+l(n.selected),1)]),M,E,e("div",P,[e("div",C,[o(a,{modelValue:n.selected,"onUpdate:modelValue":t[2]||(t[2]=s=>n.selected=s),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","initial-search-term":"bar","possible-values":i.demoValues},null,8,["modelValue","possible-values"])]),e("div",R,"selected ids: "+l(n.selected),1)]),A,e("div",U,[e("div",D,[o(a,{modelValue:n.selectedMissing,"onUpdate:modelValue":t[3]||(t[3]=s=>n.selectedMissing=s),"excluded-values":n.excludedMissing,"show-unknown-values":"","initial-include-unknown-values":!1,size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":i.demoValues,"onUpdate:excludedValues":i.updateExcludedMissing},null,8,["modelValue","excluded-values","possible-values","onUpdate:excludedValues"])]),e("div",N," selected ids: "+l(n.selectedMissing)+", excluded ids: "+l(n.excludedMissing),1)]),K,e("div",O,[e("div",j,[o(a,{modelValue:n.selectedUnknown,"onUpdate:modelValue":t[4]||(t[4]=s=>n.selectedUnknown=s),size:7,"show-search":"","show-unknown-values":"","unknown-values-text":"My unknowns","left-label":"Select from the visible items","right-label":"The selected stuff","search-placeholder":"Placeholder","possible-values":i.demoValues},null,8,["modelValue","possible-values"])]),e("div",q,"selected ids: "+l(n.selectedUnknown),1)]),F,e("div",Y,[e("div",Z,[o(a,{modelValue:n.selectedSearchLabel,"onUpdate:modelValue":t[5]||(t[5]=s=>n.selectedSearchLabel=s),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":i.demoValues},null,8,["modelValue","possible-values"])]),e("div",J,"selected ids: "+l(n.selectedSearchLabel),1)]),W,e("div",H,[e("div",X,[o(a,{"model-value":[],size:7,"possible-values":i.demoValues,"left-label":"Select from the visible items","right-label":"The selected stuff","empty-state-component":n.loadingIconRef},null,8,["possible-values","empty-state-component"])]),e("div",G,"selected ids: "+l(n.selectedSearchLabel),1)])]),e("section",null,[e("div",Q,[e("div",$,[o(u,{summary:"Show usage example"},{default:h(()=>[r(l(n.codeExample),1)]),_:1}),o(u,{summary:"Show Twinlist.vue source code"},{default:h(()=>[r(l(i.code),1)]),_:1})])])])])}const me=b(I,[["render",ee]]);export{me as default};
