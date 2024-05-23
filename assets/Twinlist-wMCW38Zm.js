import{C as m}from"./CodeExample-paad31RA.js";import{T as v}from"./Twinlist-MUsqVKFp.js";import{L as f}from"./LoadingIcon-eoswyz_y.js";import{_ as b,s as p,r as c,o as w,c as g,b as e,d as s,t as i,w as h,e as r}from"./index-I9l7b4pS.js";import"./Label-dUfs4D3r.js";import"./MultiselectListBox-iX96KlZm.js";import"./StyledListItem-jeNzV65e.js";import"./arrow-next-rPP7Gt36.js";import"./createMissingItem-gAI5zZ9a.js";import"./svgWithTitle-Ta6Tvzje.js";const V=`<!-- eslint-disable max-lines -->
<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import MultiselectListBox from "../forms/MultiselectListBox.vue";
import ArrowNextIcon from "../../assets/img/icons/arrow-next.svg";
import ArrowNextDoubleIcon from "../../assets/img/icons/arrow-next-double.svg";
import ArrowPrevIcon from "../../assets/img/icons/arrow-prev.svg";
import ArrowPrevDoubleIcon from "../../assets/img/icons/arrow-prev-double.svg";
import { filters } from "../../../util/filters";
import { computed, toRef, type PropType, type Ref } from "vue";
import type { Id, PossibleValue } from "./possibleValues/PossibleValue";
import createMissingItem from "./possibleValues/createMissingItem";

const KEY_ENTER = "Enter";
const MIN_LIST_SIZE = 5;

interface TransformOnMovePayload {
  /**
   * The to be updated list of ids
   */
  previous: Id[];
  movingParts: {
    /**
     * The moved items that are not the "unknown values"
     */
    knownValues: Array<Id>;
    /**
     * Whether the unknown values are part of the moved items
     */
    movingUnknownValues: boolean;
  };
}

/** The included values or null if not yet known. Values which are not an id in the possible values will be shown as missing. */
type SimpleTwinlistModelValue<T extends Id> = null | T[];

/**
 * using this form of model value allows showing unknown values. With that the logic for missing values also changes:
 * Missing values on the same side as unknown values are not displayed and removed as soon as the user moves items.
 * Also missing values now can always exist on the opposite side of the unknown values which is why we also need to
 *  keep track of the excluded values as data.
 */
interface TwinlistModelValueWithUnknownValues<T extends Id> {
  /**
   * null if not yet known
   */
  includedValues: T[] | null;
  /**
   * null if not yet known
   */
  excludedValues: T[] | null;
  includeUnknownValues: boolean;
}

type TwinlistModelValue<T extends Id = Id> =
  | SimpleTwinlistModelValue<T>
  | TwinlistModelValueWithUnknownValues<T>;

const useTwinlistModelValue = (modelValue: Ref<TwinlistModelValue>) => {
  /**
   * Either the model value if it is of the object form (with unknown and excluded values) or null if not
   */
  const splitModelValue = computed(() =>
    modelValue.value !== null && "includeUnknownValues" in modelValue.value
      ? { withUnknownValues: modelValue.value }
      : { standard: modelValue.value },
  );

  const includedValues = computed(() => {
    if (typeof splitModelValue.value.standard !== "undefined") {
      return splitModelValue.value.standard;
    }
    return splitModelValue.value.withUnknownValues.includedValues;
  });

  const excludedValues = computed(
    () => splitModelValue.value.withUnknownValues?.excludedValues ?? null,
  );

  const includeUnknownValues = computed(
    () => splitModelValue.value.withUnknownValues?.includeUnknownValues ?? null,
  );
  const showUnknownValuesLeft = computed(
    () => includeUnknownValues.value === false,
  );
  const showUnknownValuesRight = computed(
    () => includeUnknownValues.value === true,
  );
  const getEmitValue = (
    newIncludedValues: Id[] | null,
    toNewExcluded: (oldVal: Id[] | null) => Id[] | null = (oldVal) => oldVal,
    toNewIncludeUnknownValues: (oldVal: boolean) => boolean = (oldVal) =>
      oldVal,
  ): TwinlistModelValue => {
    if (splitModelValue.value.withUnknownValues) {
      return {
        includedValues: newIncludedValues,
        excludedValues: toNewExcluded(excludedValues.value),
        includeUnknownValues: toNewIncludeUnknownValues(
          splitModelValue.value.withUnknownValues.includeUnknownValues,
        ),
      };
    } else {
      return newIncludedValues;
    }
  };

  return {
    includedValues,
    excludedValues,
    showUnknownValuesLeft,
    showUnknownValuesRight,
    getEmitValue,
  };
};

export { type TwinlistModelValue, useTwinlistModelValue };

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
      type: [Object, Array, null] as PropType<TwinlistModelValue>,
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

    /**
     * Hiding and disabling
     */
    showSearch: {
      default: false,
      type: Boolean,
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
     * This event gets emitted whenever the user changes the selection.
     * In case the modelValue of this Twinlist is with unknown values, the emitted value here will also be.
     */
    "update:modelValue",
  ],
  setup(props) {
    const {
      includedValues,
      excludedValues,
      showUnknownValuesLeft,
      showUnknownValuesRight,
      getEmitValue,
    } = useTwinlistModelValue(toRef(props, "modelValue"));
    return {
      includedValues,
      excludedValues,
      showUnknownValuesLeft,
      showUnknownValuesRight,
      getEmitValue,
    };
  },
  data() {
    return {
      invalidPossibleValueIds: new Set(),
      rightSelected: [] as Id[],
      leftSelected: [] as Id[],
      searchTerm: this.initialSearchTerm,
      caseSensitiveSearch: this.initialCaseSensitiveSearch,
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
      if (!this.excludedValues) {
        const chosenValuesSet = new Set(this.includedValues);
        return this.possibleValueIds.filter((id) => !chosenValuesSet.has(id));
      }
      if (this.showUnknownValuesLeft) {
        return this.excludedValues.filter((id) =>
          this.possibleValueIdsSet.has(id),
        );
      }
      return this.excludedValues;
    },
    knownChosenValues() {
      if (!this.includedValues) {
        return null;
      }
      if (this.showUnknownValuesRight) {
        return this.includedValues.filter((id) =>
          this.possibleValueIdsSet.has(id),
        );
      }
      return this.includedValues;
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
    possibleValues(newPossibleValues: PossibleValue[]) {
      if (this.filterChosenValuesOnPossibleValuesChange) {
        // Required to prevent invalid values from appearing (e.g. missing b/c of upstream filtering)
        let allValues = newPossibleValues.reduce((arr, valObj) => {
          arr.push(...Object.values(valObj));
          return arr;
        }, [] as Id[]);
        // Reset chosenValues as subset of original to prevent re-execution from resetting value
        const newIncludedValues = (this.includedValues ?? []).filter((item) =>
          allValues.includes(item),
        );
        this.$emit("update:modelValue", this.getEmitValue(newIncludedValues));
      }
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
        toNewIncludedValues,
        toNewExcludedValues,
      }: {
        toNewIncludedValues: (params: TransformOnMovePayload) => Id[];
        toNewExcludedValues: (params: TransformOnMovePayload) => Id[];
      },
    ) {
      const knownValues = items.filter((item) => item !== this.unknownValuesId);
      const movingUnknownValues = items.length > knownValues.length;
      const movingParts = {
        knownValues,
        movingUnknownValues,
      };
      let newIncludedValues: Id[] | null = null;
      let newExcludedValues: Id[] | null = null;
      if (this.includedValues !== null) {
        newIncludedValues = toNewIncludedValues({
          previous: this.includedValues,
          movingParts,
        });
      }
      if (this.excludedValues) {
        newExcludedValues = toNewExcludedValues({
          previous: this.knownExcludedValues,
          movingParts,
        });
      }
      this.clearSelections();
      this.$emit(
        "update:modelValue",
        this.getEmitValue(
          newIncludedValues,
          () => newExcludedValues,
          (currentIncludeUnknownValues) =>
            movingUnknownValues
              ? !currentIncludeUnknownValues
              : currentIncludeUnknownValues,
        ),
      );
    },
    moveRight(itemsParam: Id[] | null = null) {
      this.moveItems(itemsParam ?? this.leftSelected, {
        toNewIncludedValues: this.addMovedItems.bind(this),
        toNewExcludedValues: this.filterMovedItems.bind(this),
      });
    },
    moveLeft(itemsParam: Id[] | null = null) {
      this.moveItems(itemsParam ?? this.rightSelected, {
        toNewIncludedValues: this.filterMovedItems.bind(this),
        toNewExcludedValues: this.addMovedItems.bind(this),
      });
    },
    /**
     * Filters out the moved items and also invalid items if unknown values are being moved.
     */
    filterMovedItems({
      previous,
      movingParts: { movingUnknownValues, knownValues },
    }: TransformOnMovePayload) {
      const knownValuesSet = new Set(knownValues);
      return previous.filter(
        (item) =>
          !knownValuesSet.has(item) &&
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
        ...knownValues.filter((item) => this.possibleValueIdsSet.has(item)),
      ].sort(this.compareByOriginalSorting);
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
    onSearchInput(value: string) {
      this.searchTerm = value;
    },
    hasSelection() {
      return (this.includedValues?.length ?? 0) > 0;
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
        @key-arrow-right="moveRight"
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
        @key-arrow-left="moveLeft"
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
/>`,I={components:{Twinlist:v,CodeExample:m},data(){return{codeExample:x,selected:[],includeUnknownValues:!1,withMissing:["foo","I am missing","bar"],withUnknownValues:{includedValues:["foo","I am missing","bar"],excludedValues:["baz","I am missing on the left","baz2","baz3","baz4","baz5","baz6","baz7","baz8","baz9","baz10","baz11"],includeUnknownValues:!0},selectedUnknown:[],selectedSearchLabel:[],loadingIconRef:p(f)}},computed:{code(){return V},demoValues(){return[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"},{id:"baz7",text:"Baz 7"},{id:"baz8",text:"Baz 8"},{id:"baz9",text:"Baz 9"},{id:"baz10",text:"Baz 10"},{id:"baz11",text:"Baz 11"}]}},methods:{updateExcludedMissing(u){this.excludedMissing=u}}},k=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[r(" Two list boxes for selecting multiple items. It acts as a form element, so it emits an "),e("code",null,"input"),r(" event when selection changes, and it has a "),e("code",null,"value"),r(". For keyboard navigation inside of the lists see "),e("code",null,"MultiselectListBox"),r(". With "),e("code",null,"DoubleClick"),r(" the items can also be moved between the lists. ")])])],-1),S={class:"grid-container"},y={class:"grid-item-6"},L={class:"grid-item-6"},T=e("br",null,null,-1),M={class:"grid-container"},_={class:"grid-item-6"},B={class:"grid-item-6"},z=e("br",null,null,-1),U=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null," The Twinlist with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),E={class:"grid-container"},R={class:"grid-item-6"},P={class:"grid-item-6"},C=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with missing selected items.")])],-1),A={class:"grid-container"},N={class:"grid-item-6"},D={class:"grid-item-6"},K=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with unknown items.")])],-1),O={class:"grid-container"},j={class:"grid-item-6"},F={class:"grid-item-6"},q=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist can show a customizable search label.")])],-1),W={class:"grid-container"},Y={class:"grid-item-6"},Z={class:"grid-item-6"},H=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The content visible in empty boxes is customizable.")])],-1),X={class:"grid-container"},G={class:"grid-item-6"},J={class:"grid-item-6"},Q={class:"grid-container"},$={class:"grid-item-12"};function ee(u,t,ne,te,n,o){const a=c("Twinlist",!0),d=c("CodeExample");return w(),g("div",null,[e("section",null,[k,e("div",S,[e("div",y,[s(a,{modelValue:n.selected,"onUpdate:modelValue":t[0]||(t[0]=l=>n.selected=l),size:7,"left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",L,"selected ids: "+i(n.selected),1)]),T,e("div",M,[e("div",_,[s(a,{modelValue:n.selected,"onUpdate:modelValue":t[1]||(t[1]=l=>n.selected=l),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":o.demoValues,disabled:""},null,8,["modelValue","possible-values"])]),e("div",B,"selected ids: "+i(n.selected),1)]),z,U,e("div",E,[e("div",R,[s(a,{modelValue:n.selected,"onUpdate:modelValue":t[2]||(t[2]=l=>n.selected=l),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","initial-search-term":"bar","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",P,"selected ids: "+i(n.selected),1)]),C,e("div",A,[e("div",N,[s(a,{modelValue:n.withMissing,"onUpdate:modelValue":t[3]||(t[3]=l=>n.withMissing=l),"show-unknown-values":"",size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",D,i(n.withMissing),1)]),K,e("div",O,[e("div",j,[s(a,{modelValue:n.withUnknownValues,"onUpdate:modelValue":t[4]||(t[4]=l=>n.withUnknownValues=l),size:7,"show-search":"","show-unknown-values":"","unknown-values-text":"My unknowns","left-label":"Select from the visible items","right-label":"The selected stuff","search-placeholder":"Placeholder","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",F,"selected ids: "+i(n.withUnknownValues),1)]),q,e("div",W,[e("div",Y,[s(a,{modelValue:n.selectedSearchLabel,"onUpdate:modelValue":t[5]||(t[5]=l=>n.selectedSearchLabel=l),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",Z,"selected ids: "+i(n.selectedSearchLabel),1)]),H,e("div",X,[e("div",G,[s(a,{"model-value":[],size:7,"possible-values":o.demoValues,"left-label":"Select from the visible items","right-label":"The selected stuff","empty-state-component":n.loadingIconRef},null,8,["possible-values","empty-state-component"])]),e("div",J,"selected ids: "+i(n.selectedSearchLabel),1)])]),e("section",null,[e("div",Q,[e("div",$,[s(d,{summary:"Show usage example"},{default:h(()=>[r(i(n.codeExample),1)]),_:1}),s(d,{summary:"Show Twinlist.vue source code"},{default:h(()=>[r(i(o.code),1)]),_:1})])])])])}const me=b(I,[["render",ee]]);export{me as default};
