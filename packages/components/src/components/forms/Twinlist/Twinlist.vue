<!-- eslint-disable max-lines -->
<script lang="ts">
import { type PropType, type Ref, computed, ref, toRef } from "vue";

import ArrowNextDoubleIcon from "@knime/styles/img/icons/arrow-next-double.svg";
import ArrowNextIcon from "@knime/styles/img/icons/arrow-next.svg";
import ArrowPrevDoubleIcon from "@knime/styles/img/icons/arrow-prev-double.svg";
import ArrowPrevIcon from "@knime/styles/img/icons/arrow-prev.svg";

import useSearch from "../../../composables/useSearch";
import ResizeHandle from "../../ResizeHandle/ResizeHandle.vue";
import Label from "../Label/Label.vue";
import MultiselectListBox from "../MultiselectListBox/MultiselectListBox.vue";
import SearchInput from "../SearchInput/SearchInput.vue";
import {
  type Id,
  type PossibleValue,
  createMissingItem,
  useLabelInfo,
} from "../possibleValues";

const KEY_ENTER = "Enter";
const MIN_LIST_SIZE = 5;
const BUTTON_WIDTH = 30;
const BUTTON_HEIGHT = 24;
const NUMBER_OF_BUTTONS = 4;
const BUTTONS_MARGIN_TOP = 56;
const LIST_BOX_REFS = ["left", "right"] as const;
const MAX_HEIGHT_BUTTONS_CENTER_ALIGNMENT =
  NUMBER_OF_BUTTONS * BUTTON_HEIGHT + 2 * BUTTONS_MARGIN_TOP;

// Two resize handles are used, one below each box, which should take up 1/3 width each of each box => 1/6 of the total
// width of the boxes, which is the width of the whole twinlist minus the button gap between the two lists
const RESIZE_HANDLE_WIDTH = `calc((100% - ${BUTTON_WIDTH}px) * 1 / 6)`;

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
  name: "Twinlist",
  components: {
    ArrowNextDoubleIcon,
    ArrowNextIcon,
    ArrowPrevDoubleIcon,
    ArrowPrevIcon,
    MultiselectListBox,
    Label,
    SearchInput,
    ResizeHandle,
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
      default: "Possible values",
    },
    rightLabel: {
      type: String,
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
      type: Object as PropType<Record<string, unknown> | null>,
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
    showResizeHandle: {
      type: Boolean,
      default: false,
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
    compact: {
      type: Boolean,
      default: false,
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

    const showSearch = toRef(props, "showSearch");

    const filteredIncludedItems = useSearch(
      searchTerm,
      caseSensitiveSearch,
      allIncludedItems,
      showSearch,
    );

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

    const filteredExcludedItems = useSearch(
      searchTerm,
      caseSensitiveSearch,
      allExcludedItems,
      showSearch,
    );

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
      constants: Object.freeze({
        MIN_LIST_SIZE,
        BUTTON_HEIGHT,
        BUTTON_WIDTH,
        RESIZE_HANDLE_WIDTH,
        MAX_HEIGHT_BUTTONS_CENTER_ALIGNMENT,
      }),
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
  mounted() {
    if (this.showResizeHandle) {
      this.getListBoxes().forEach((listBox) => listBox.initResizeHeight());
    }
  },
  methods: {
    getIndex(id: Id) {
      return this.possibleValueMap[id]?.index ?? -1;
    },
    compareByOriginalSorting(a: Id, b: Id) {
      return this.getIndex(a) - this.getIndex(b);
    },
    clearSelections() {
      this.getListBoxes().forEach((listBox) => listBox.clearSelection());
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
        (
          this.$refs.right as InstanceType<typeof MultiselectListBox>
        ).clearSelection();
      }
      this.leftSelected = value;
    },
    onRightInput(value: Id[]) {
      if (value.length > 0) {
        (
          this.$refs.left as InstanceType<typeof MultiselectListBox>
        ).clearSelection();
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
      const isValid =
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
    getListBoxes() {
      return LIST_BOX_REFS.map(
        (refName) =>
          this.$refs[refName] as InstanceType<typeof MultiselectListBox>,
      );
    },
    onResizeMove(deltaY: number) {
      this.getListBoxes().forEach((listBox) => listBox.onResizeMove(deltaY));
    },
    onResizeEnd() {
      this.getListBoxes().forEach((listBox) => listBox.onResizeEnd());
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
        :compact="compact"
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
        :min-size="constants.MIN_LIST_SIZE"
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
        :min-size="constants.MIN_LIST_SIZE"
        :ariaLabel="rightLabel"
        :disabled="disabled"
        @double-click-on-item="onRightListBoxDoubleClick"
        @double-click-shift="onRightListBoxShiftDoubleClick"
        @key-arrow-left="moveLeft"
        @update:model-value="onRightInput"
      />
      <!--  eslint-enable vue/attribute-hyphenation -->
    </div>
    <ResizeHandle
      v-if="showResizeHandle"
      :number-of-handles="2"
      :handle-width="constants.RESIZE_HANDLE_WIDTH"
      connect-handles-on-resize
      :multiple-handles-handle-gap="`${constants.BUTTON_WIDTH}px`"
      @resize-move="onResizeMove"
      @resize-end="onResizeEnd"
    />
  </div>
</template>

<style lang="postcss" scoped>
.twinlist {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  --button-bar-width: v-bind(`${constants.BUTTON_WIDTH}px`);

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
    --button-bar-max-height: v-bind(
      `${constants.MAX_HEIGHT_BUTTONS_CENTER_ALIGNMENT}px`
    );

    flex: 0 0 var(--button-bar-width);
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    max-height: var(--button-bar-max-height);
  }

  & [role="button"] {
    --button-height: v-bind(`${constants.BUTTON_HEIGHT}px`);

    cursor: pointer;
    width: var(--button-bar-width);
    height: var(--button-height);
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
