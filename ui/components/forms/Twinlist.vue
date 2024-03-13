<script lang="ts">
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
     * List of possible values. Each item must have an `id` and a `text` property
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
        this.itemMatchesSearch(createMissingItem(item)),
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
            this.possibleValueMap[value]?.item || createMissingItem(value),
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
        ? `${numShownItems} of ${numAllItems} entries`
        : null;
    },
  },
};
</script>

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
