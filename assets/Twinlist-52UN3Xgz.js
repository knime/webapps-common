import{C as m}from"./CodeExample-adW69SBO.js";import{T as v}from"./Twinlist-1hzTE4Fw.js";import{L as p}from"./LoadingIcon-XvPar7Nm.js";import{_ as b,s as f,r as c,o as w,c as V,b as e,d as s,t as i,w as h,e as d}from"./index-H-nx_xnf.js";import"./Label-9I3kfKFP.js";import"./MultiselectListBox-dBWrXaD6.js";import"./StyledListItem-cYu4w_9v.js";import"./arrow-next-ys8IHpHk.js";import"./useSearch-DYpgz5bG.js";import"./createMissingItem-l6qmOyuX.js";import"./svgWithTitle-Xk3tlKLB.js";const g=`<!-- eslint-disable max-lines -->
<script lang="ts">
import Label from "./Label.vue";
import SearchInput from "../forms/SearchInput.vue";
import MultiselectListBox from "../forms/MultiselectListBox.vue";
import ArrowNextIcon from "../../assets/img/icons/arrow-next.svg";
import ArrowNextDoubleIcon from "../../assets/img/icons/arrow-next-double.svg";
import ArrowPrevIcon from "../../assets/img/icons/arrow-prev.svg";
import ArrowPrevDoubleIcon from "../../assets/img/icons/arrow-prev-double.svg";
import { computed, ref, toRef, type PropType, type Ref } from "vue";
import {
  useSearch,
  useLabelInfo,
  createMissingItem,
  type Id,
  type PossibleValue,
} from "./possibleValues";

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
  const showUnknownExcludedValues = computed(
    () => includeUnknownValues.value === false,
  );
  const showUnknownIncludedValues = computed(
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
    showUnknownExcludedValues,
    showUnknownIncludedValues,
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
      showUnknownExcludedValues,
      showUnknownIncludedValues,
      getEmitValue,
    } = useTwinlistModelValue(toRef(props, "modelValue"));

    const searchTerm = ref<string>(props.initialSearchTerm);
    const caseSensitiveSearch = ref<boolean>(props.initialCaseSensitiveSearch);

    const possibleValueIds = computed(() => {
      return props.possibleValues.map((x) => x.id);
    });

    const possibleValueIdsSet = computed(() => {
      return new Set(possibleValueIds.value);
    });

    const knownIncludedValues = computed(() => {
      if (!includedValues.value) {
        return null;
      }
      if (showUnknownIncludedValues.value) {
        return includedValues.value.filter((id) =>
          possibleValueIdsSet.value.has(id),
        );
      }
      return includedValues.value;
    });

    const possibleValueMap = computed(() => {
      return Object.assign(
        {},
        ...props.possibleValues.map((obj: PossibleValue, index) => ({
          [obj.id]: { item: obj, index },
        })),
      ) as Record<Id, { item: PossibleValue; index: number }>;
    });

    const allIncludedItems = computed(() => {
      if (knownIncludedValues.value === null) {
        return [];
      }
      return knownIncludedValues.value.map(
        (value) =>
          (possibleValueMap.value[value]?.item as PossibleValue) ||
          createMissingItem(value),
      );
    });

    const filteredIncludedItems = computed(() => {
      if (!props.showSearch) {
        return allIncludedItems.value;
      }
      return useSearch(searchTerm, caseSensitiveSearch, allIncludedItems);
    });

    const knownExcludedValues = computed(() => {
      if (!excludedValues.value) {
        const includedValuesSet = new Set(includedValues.value);
        return possibleValueIds.value.filter(
          (id) => !includedValuesSet.has(id),
        );
      }
      if (showUnknownExcludedValues.value) {
        return excludedValues.value.filter((id) =>
          possibleValueIdsSet.value.has(id),
        );
      }
      return excludedValues.value;
    });

    const allExcludedItems = computed(() => {
      if (knownIncludedValues.value === null) {
        return [];
      }
      return knownExcludedValues.value.map(
        (value) =>
          (possibleValueMap.value[value]?.item as PossibleValue) ||
          createMissingItem(value),
      );
    });

    const filteredExcludedItems = computed(() => {
      if (!props.showSearch) {
        return allExcludedItems.value;
      }

      return useSearch(searchTerm, caseSensitiveSearch, allExcludedItems);
    });

    const hasActiveSearch = computed(() => {
      return props.showSearch && searchTerm.value !== "";
    });

    const excludedLabels = computed(() => {
      if (!props.showSearch) {
        return null;
      }
      return hasActiveSearch.value
        ? useLabelInfo(filteredExcludedItems, knownExcludedValues.value.length)
        : null;
    });

    const includedLabels = computed(() => {
      if (!props.showSearch) {
        return null;
      }
      return hasActiveSearch.value
        ? useLabelInfo(
            filteredIncludedItems,
            knownIncludedValues.value?.length as number,
          )
        : null;
    });

    return {
      includedValues,
      excludedValues,
      showUnknownExcludedValues,
      showUnknownIncludedValues,
      getEmitValue,
      searchTerm,
      filteredExcludedItems,
      filteredIncludedItems,
      knownExcludedValues,
      knownIncludedValues,
      possibleValueIds,
      possibleValueIdsSet,
      excludedLabels,
      includedLabels,
      caseSensitiveSearch,
      allIncludedItems,
      possibleValueMap,
    };
  },
  data() {
    return {
      invalidPossibleValueIds: new Set(),
      rightSelected: [] as Id[],
      leftSelected: [] as Id[],
      unknownValuesId: Symbol("Unknown values"),
    };
  },
  computed: {
    listSize() {
      // fixed size even when showing all to prevent height jumping when moving items between lists
      const size = this.size === 0 ? this.possibleValues.length : this.size;
      // limit size to minimum
      return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
    },
    moveAllRightButtonDisabled() {
      return (
        this.filteredExcludedItems.length === 0 &&
        !this.showUnknownExcludedValues
      );
    },
    moveRightButtonDisabled() {
      return this.leftSelected.length === 0;
    },
    moveAllLeftButtonDisabled() {
      return (
        this.filteredIncludedItems.length === 0 &&
        !this.showUnknownIncludedValues
      );
    },
    moveLeftButtonDisabled() {
      return this.rightSelected.length === 0;
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
      const excludedItemIds = this.filteredExcludedItems.map((x) => x.id);
      this.moveRight(
        excludedItemIds.concat(
          this.showUnknownExcludedValues ? [this.unknownValuesId] : [],
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
      const includedItemIds = this.filteredIncludedItems.map((x) => x.id);
      this.moveLeft(
        includedItemIds.concat(
          this.showUnknownIncludedValues ? [this.unknownValuesId] : [],
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
        !this.filteredIncludedItems.some((x) => x.invalid) &&
        (!this.excludedValues ||
          !this.filteredExcludedItems.some((x) => x.invalid));
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
        <div v-if="excludedLabels" :title="excludedLabels" class="info">
          {{ excludedLabels }}
        </div>
      </div>
      <div class="space" />
      <div class="title">
        <div class="label" :title="rightLabel">
          {{ rightLabel }}
        </div>
        <div v-if="includedLabels" :title="includedLabels" class="info">
          {{ includedLabels }}
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
        :with-bottom-value="showUnknownExcludedValues"
        :bottom-value="{ id: unknownValuesId, text: unknownValuesText }"
        :is-valid="isValid"
        :possible-values="filteredExcludedItems"
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
        :with-bottom-value="showUnknownIncludedValues"
        :bottom-value="{ id: unknownValuesId, text: unknownValuesText }"
        :with-is-empty-state="showEmptyState"
        :empty-state-label="emptyStateLabel"
        :empty-state-component="emptyStateComponent"
        :possible-values="filteredIncludedItems"
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
/>`,I={components:{Twinlist:v,CodeExample:m},data(){return{codeExample:x,selected:[],includeUnknownValues:!1,withMissing:["foo","I am missing","bar"],withUnknownValues:{includedValues:["foo","I am missing","bar"],excludedValues:["baz","I am missing on the left","baz2","baz3","baz4","baz5","baz6","baz7","baz8","baz9","baz10","baz11"],includeUnknownValues:!0},selectedUnknown:[],selectedSearchLabel:[],selected2:[],loadingIconRef:f(p)}},computed:{code(){return g},demoValues(){return[{id:"foo",text:"Foo"},{id:"bar",text:"Bar"},{id:"baz",text:"Baz"},{id:"baz2",text:"Baz 2"},{id:"baz3",text:"Baz 3"},{id:"baz4",text:"Baz 4"},{id:"baz5",text:"Baz 5"},{id:"baz6",text:"Baz 6"},{id:"baz7",text:"Baz 7"},{id:"baz8",text:"Baz 8"},{id:"baz9",text:"Baz 9"},{id:"baz10",text:"Baz 10"},{id:"baz11",text:"Baz 11"}]}},methods:{updateExcludedMissing(u){this.excludedMissing=u}}},k=e("div",{class:"grid-container"},[e("div",{class:"grid-item-12"},[e("p",null,[d(" Two list boxes for selecting multiple items. It acts as a form element, so it emits an "),e("code",null,"input"),d(" event when selection changes, and it has a "),e("code",null,"value"),d(". For keyboard navigation inside of the lists see "),e("code",null,"MultiselectListBox"),d(". With "),e("code",null,"DoubleClick"),d(" the items can also be moved between the lists. ")])])],-1),S={class:"grid-container"},y={class:"grid-item-6"},L={class:"grid-item-6"},T=e("br",null,null,-1),E={class:"grid-container"},M={class:"grid-item-6"},_={class:"grid-item-6"},B=e("br",null,null,-1),z=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null," The Twinlist with a search field enabled and an initial search term defined. Case-sensitive search can be enabled through a button on the right. ")])],-1),U={class:"grid-container"},P={class:"grid-item-6"},R={class:"grid-item-6"},C=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with missing selected items.")])],-1),A={class:"grid-container"},N={class:"grid-item-6"},D={class:"grid-item-6"},K=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist with unknown items.")])],-1),O={class:"grid-container"},j={class:"grid-item-6"},F={class:"grid-item-6"},q=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The Twinlist can show a customizable search label.")])],-1),W={class:"grid-container"},Y={class:"grid-item-6"},Z={class:"grid-item-6"},H=e("div",{class:"grid-container"},[e("div",{class:"grid-item-6"},[e("p",null,"The content visible in empty boxes is customizable.")])],-1),X={class:"grid-container"},G={class:"grid-item-6"},J={class:"grid-item-6"},Q={class:"grid-container"},$={class:"grid-item-12"};function ee(u,l,ne,le,n,o){const a=c("Twinlist",!0),r=c("CodeExample");return w(),V("div",null,[e("section",null,[k,e("div",S,[e("div",y,[s(a,{modelValue:n.selected,"onUpdate:modelValue":l[0]||(l[0]=t=>n.selected=t),size:7,"left-label":"Select from the 7 visible items (size)","right-label":"The selected stuff","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",L,"selected ids: "+i(n.selected),1)]),T,e("div",E,[e("div",M,[s(a,{modelValue:n.selected,"onUpdate:modelValue":l[1]||(l[1]=t=>n.selected=t),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":o.demoValues,disabled:""},null,8,["modelValue","possible-values"])]),e("div",_,"selected ids: "+i(n.selected),1)]),B,z,e("div",U,[e("div",P,[s(a,{modelValue:n.selected,"onUpdate:modelValue":l[2]||(l[2]=t=>n.selected=t),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","initial-search-term":"bar","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",R,"selected ids: "+i(n.selected),1)]),C,e("div",A,[e("div",N,[s(a,{modelValue:n.withMissing,"onUpdate:modelValue":l[3]||(l[3]=t=>n.withMissing=t),"show-unknown-values":!0,size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",D,i(n.withMissing),1)]),K,e("div",O,[e("div",j,[s(a,{modelValue:n.withUnknownValues,"onUpdate:modelValue":l[4]||(l[4]=t=>n.withUnknownValues=t),size:7,"show-search":"","show-unknown-values":!0,"unknown-values-text":"My unknowns","left-label":"Select from the visible items","right-label":"The selected stuff","search-placeholder":"Placeholder","possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",F,"selected ids: "+i(n.withUnknownValues),1)]),q,e("div",W,[e("div",Y,[s(a,{modelValue:n.selectedSearchLabel,"onUpdate:modelValue":l[5]||(l[5]=t=>n.selectedSearchLabel=t),size:7,"show-search":"","left-label":"Select from the visible items","right-label":"The selected stuff","search-label":"Search items","search-placeholder":"Placeholder","with-search-label":!0,"possible-values":o.demoValues},null,8,["modelValue","possible-values"])]),e("div",Z,"selected ids: "+i(n.selectedSearchLabel),1)]),H,e("div",X,[e("div",G,[s(a,{modelValue:n.selected2,"onUpdate:modelValue":l[6]||(l[6]=t=>n.selected2=t),size:7,"left-label":"Select from the visible items","right-label":"The selected stuff","possible-values":o.demoValues,"empty-state-component":n.loadingIconRef},null,8,["modelValue","possible-values","empty-state-component"])]),e("div",J,"selected ids: "+i(n.selectedSearchLabel),1)])]),e("section",null,[e("div",Q,[e("div",$,[s(r,{summary:"Show usage example"},{default:h(()=>[d(i(n.codeExample),1)]),_:1}),s(r,{summary:"Show Twinlist.vue source code"},{default:h(()=>[d(i(o.code),1)]),_:1})])])])])}const ve=b(I,[["render",ee]]);export{ve as default};
