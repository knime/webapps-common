<!-- eslint-disable max-lines -->
<script lang="ts">
import { toRef, watch, type PropType } from "vue";
import { useVirtualList } from "@vueuse/core";
import { debounce } from "@knime/utils";
import StyledListItem from "../../StyleListItem/StyledListItem.vue";
import type { Id, PossibleValue, BottomValue } from "../possibleValues";

let count = 0;
const CLICK_META_KEY_TIMEOUT = 250; // ms

export default {
  components: { StyledListItem },
  props: {
    id: {
      type: String,
      default() {
        return `MultiselectListBox-${count++}`;
      },
    },
    modelValue: {
      type: Array as PropType<Id[] | null>,
      default: () => [],
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    withIsEmptyState: {
      default: false,
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
    /**
     * If enabled the single click will allow the user to select multiple items, otherwise this only works with
     * CTRL + Click (similar to <select> html widgets)
     */
    multiselectByClick: {
      type: Boolean,
      default: false,
    },
    /**
     * Bottom values
     */
    withBottomValue: {
      type: Boolean,
      default: false,
    },
    bottomValue: {
      type: Object as PropType<BottomValue>,
      default: () => ({ id: "bottom", text: "Other" }),
      validator(value: BottomValue) {
        return value.hasOwnProperty("id") && value.hasOwnProperty("text");
      },
    },
    /**
     * Controls the size of the list. Number of visible items (for others user need to scroll)
     * 0 means all
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
    ariaLabel: {
      type: String,
      required: true,
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
      validator(values) {
        if (!Array.isArray(values)) {
          return false;
        }
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
  },
  emits: [
    "update:modelValue",
    "doubleClickOnItem",
    "doubleClickShift",
    "keyArrowLeft",
    "keyArrowRight",
  ],
  setup(props) {
    const optionLineHeight = 22;

    const { containerProps, wrapperProps, list, scrollTo } = useVirtualList(
      toRef(props, "possibleValues"),
      {
        itemHeight: optionLineHeight,
      },
    );

    /**
     * Without this watcher, the scroll container will not update its scroll position if necessary
     */
    watch(
      () => props.possibleValues,
      () => {
        if (!containerProps.ref.value) {
          return;
        }
        const scrollTop = containerProps.ref.value?.scrollTop ?? 0;
        scrollTo(
          Math.max(
            Math.min(
              Math.floor(scrollTop / optionLineHeight),
              props.possibleValues.length - 1,
            ),
            0,
          ),
        );
      },
    );

    return {
      optionLineHeight,
      containerProps,
      wrapperProps,
      list,
    };
  },
  data() {
    return {
      selectedValues: this.modelValue,
      // indices for mouse and keyboard nav
      currentKeyNavIndex: 0,
      shiftStartIndex: -1,
      draggingStartIndex: -1,
      draggingInverseMode: false,
    };
  },
  computed: {
    cssStyleSize() {
      // add two pixel to prevent scrollbar bugs
      const pxSize = `${this.size * this.optionLineHeight + 2}px`;
      return this.size > 0 ? { height: pxSize } : {};
    },
    possibleValuesWithBottom() {
      return [
        ...this.possibleValues,
        ...(this.withBottomValue ? [this.bottomValue] : []),
      ];
    },
    bottomIndex() {
      return this.possibleValues.length;
    },
    showEmptyState() {
      return this.withIsEmptyState && this.possibleValues.length === 0;
    },
  },
  watch: {
    modelValue: {
      handler(newValue) {
        this.selectedValues = [...newValue];
      },
      deep: true,
    },
  },
  mounted() {
    window.addEventListener("mouseup", this.onStopDrag);
    // set key nav index to last value

    const lastItem = this.modelValue?.[this.modelValue?.length - 1];
    this.currentKeyNavIndex = this.possibleValues
      .map((x) => x.id)
      .indexOf(lastItem as Id);
  },
  beforeUnmount() {
    window.removeEventListener("mouseup", this.onStopDrag);
  },
  created() {
    // the mac emits the click event  multiple times when the metaKey (cmd/command) is hold
    // this does not work well with the toggling of selected items, therefore we debounce it
    this.createDebouncedHandleCtrlClick();
  },
  methods: {
    createDebouncedHandleCtrlClick() {
      // Create a debounced version of handleCtrlClick using the debounce function
      this.debouncedHandleCtrlClick = debounce((value: Id, index: number) => {
        this.handleCtrlClick(value, index);
      }, CLICK_META_KEY_TIMEOUT);
    },
    // Define debouncedHandleCtrlClick as a method
    debouncedHandleCtrlClick(value: Id, index: number) {
      if (!this.debouncedHandleCtrlClick) {
        // If debouncedHandleCtrlClick is not initialized yet, call createDebouncedHandleCtrlClick
        this.createDebouncedHandleCtrlClick();
      }
      // Call the debounced function
      this.debouncedHandleCtrlClick(value, index);
    },

    isCurrentValue(candidate: Id) {
      return this.selectedValues?.includes(candidate);
    },
    handleCtrlClick(value: Id, index: number) {
      this.currentKeyNavIndex = index;
      this.toggleSelection(value);
    },
    handleShiftClick(value: Id, clickedIndex: number) {
      this.setSelected(
        this.getPossibleValuesInSection(this.currentKeyNavIndex, clickedIndex),
      );
    },
    /**
     * Returns all value ids (String) for two indices no matter which one is the start/end index
     * @param {Number} firstIndex - index a
     * @param {Number} secondIndex - index b
     * @returns {String[]}
     */
    getPossibleValuesInSection(firstIndex: number, secondIndex: number) {
      const start = firstIndex > secondIndex ? secondIndex : firstIndex;
      const end = firstIndex > secondIndex ? firstIndex : secondIndex;
      return this.possibleValuesWithBottom
        .slice(start, end + 1)
        .map((x) => x.id);
    },
    onStartDrag(e: MouseEvent, isBottom = false) {
      if (this.disabled) {
        return;
      }
      // do not start drag if we press shift
      if (e.shiftKey) {
        return;
      }
      // enable inverse mode on ctrl key
      if (e.ctrlKey || e.metaKey) {
        this.draggingInverseMode = true;
      }

      const target = e.target as HTMLElement;
      const index = isBottom
        ? this.bottomIndex
        : target.getAttribute("data-option-index");
      if (index) {
        this.draggingStartIndex = Number(index);
      }
    },
    onDrag(e: MouseEvent) {
      if (this.draggingStartIndex !== -1) {
        // With out HTMLElement type typescript couldn't find getAttribute
        const target = e.target as HTMLElement;
        const dataIndex = target.getAttribute("data-option-index");
        if (!dataIndex) {
          return;
        }
        const index = Number(dataIndex);
        let sectionValues = this.getPossibleValuesInSection(
          this.draggingStartIndex,
          index,
        );
        // inverse mode means we remove all selected values from the current selection
        if (this.draggingInverseMode) {
          sectionValues = (this.selectedValues as Id[]).filter(
            (x) => !sectionValues.includes(x),
          );
        }
        this.setSelected(sectionValues);
      }
    },
    onBottomStartDrag(e: MouseEvent) {
      this.focus();
      this.onStartDrag(e);
    },
    onBottomDrag(e: MouseEvent) {
      this.focus();
      this.onDrag(e);
    },
    onStopDrag() {
      this.draggingStartIndex = -1;
      this.draggingInverseMode = false;
    },
    handleClick($event: MouseEvent, value: Id, index: number) {
      if (this.disabled) {
        return;
      }
      $event.preventDefault();
      if ($event.metaKey) {
        // mac requires debouncing
        this.debouncedHandleCtrlClick(value, index);
        return; // end here
      }
      if ($event.ctrlKey) {
        this.handleCtrlClick(value, index);
        return; // end here
      }
      if ($event.shiftKey) {
        this.handleShiftClick(value, index);
        return; // end here
      }
      // regular click
      if (!this.multiselectByClick) {
        this.selectedValues = [];
      }
      this.currentKeyNavIndex = index;
      this.toggleSelection(value);
    },
    handleDblClick(id: Id, index: number) {
      if (this.disabled) {
        return;
      }
      this.$emit("doubleClickOnItem", id, index);
    },
    handleBottomClick($event: MouseEvent) {
      this.handleClick($event, this.bottomValue.id, this.bottomIndex);
      this.focus();
    },
    handleBottomDblClick() {
      this.handleDblClick(this.bottomValue.id, this.bottomIndex);
    },
    handleShiftDblClick() {
      if (this.disabled) {
        return;
      }
      this.$emit("doubleClickShift", this.selectedValues);
    },
    addToSelection(value: Id) {
      let added = false;
      const selectedValues = this.selectedValues;
      if (!selectedValues?.includes(value)) {
        selectedValues?.push(value);
        added = true;
      }
      this.setSelected(selectedValues as Id[]);
      return added;
    },
    removeFromSelection(value: Id) {
      let removed = false;
      const selectedValues = this.selectedValues;
      if (selectedValues?.includes(value)) {
        selectedValues.splice(selectedValues.indexOf(value), 1);
        removed = true;
      }
      this.setSelected(selectedValues as Id[]);
      return removed;
    },
    toggleSelection(value: Id) {
      if (this.selectedValues?.includes(value)) {
        this.removeFromSelection(value);
      } else {
        this.addToSelection(value);
      }
    },
    setSelectedNoShiftReset(values: Id[]) {
      consola.trace("MultiselectListBox setSelected on", values);
      this.selectedValues = values;
      this.$emit("update:modelValue", values);
    },
    setSelected(values: Id[]) {
      // reset shift start index on every change to selected values but shift operations itself
      this.shiftStartIndex = -1;
      this.setSelectedNoShiftReset(values);
    },
    setSelectedToIndex(index: number) {
      const item = this.possibleValuesWithBottom[index];
      if (item && item.id) {
        this.setSelected([item.id]);
      }
    },
    scrollToCurrent() {
      if (this.currentKeyNavIndex === this.bottomIndex) {
        return;
      }
      this.scrollIntoView(this.currentKeyNavIndex);
    },
    scrollIntoView(index: number, mode = "auto") {
      if (!this.containerProps.ref.value) {
        return;
      }
      const listBoxNode = this.containerProps.ref.value;
      if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
        const scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
        const elementTop = index * this.optionLineHeight;
        const elementBottom = elementTop + this.optionLineHeight;
        const elementIsAboveScreen = elementTop < listBoxNode.scrollTop;
        const elementIsBelowScreen = elementBottom > scrollBottom;
        if (!(elementIsBelowScreen || elementIsAboveScreen)) {
          return;
        }
        const scrollToTopEdge =
          mode === "up" || (mode === "auto" && elementIsAboveScreen);

        if (scrollToTopEdge) {
          listBoxNode.scrollTop = elementTop;
        } else {
          listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
        }
      }
    },
    isOutOfRange(index: number) {
      if (index < 0) {
        return true;
      }
      if (this.withBottomValue) {
        return index > this.bottomIndex;
      } else {
        return index >= this.bottomIndex;
      }
    },
    onArrowDown() {
      if (this.disabled) {
        return;
      }
      const next = this.currentKeyNavIndex + 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onArrowUp() {
      if (this.disabled) {
        return;
      }
      const next = this.currentKeyNavIndex - 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onArrowDownShift() {
      if (this.disabled) {
        return;
      }
      // set start index if this is the first shift up/down op
      if (this.shiftStartIndex === -1) {
        this.shiftStartIndex = this.currentKeyNavIndex;
      }
      const next = this.currentKeyNavIndex + 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedNoShiftReset(
        this.getPossibleValuesInSection(this.shiftStartIndex, next),
      );
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onArrowUpShift() {
      if (this.disabled) {
        return;
      }
      // set start index if this is the first shift up/down op
      if (this.shiftStartIndex === -1) {
        this.shiftStartIndex = this.currentKeyNavIndex;
      }
      const next = this.currentKeyNavIndex - 1;
      if (this.isOutOfRange(next)) {
        return;
      }
      this.setSelectedNoShiftReset(
        this.getPossibleValuesInSection(this.shiftStartIndex, next),
      );
      this.currentKeyNavIndex = next;
      this.scrollToCurrent();
    },
    onEndKey() {
      const next = this.possibleValues.length - 1;
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      if (this.containerProps.ref.value) {
        this.containerProps.ref.value.scrollTop =
          this.containerProps.ref.value.scrollHeight;
      }
    },
    onHomeKey() {
      const next = 0;
      this.setSelectedToIndex(next);
      this.currentKeyNavIndex = next;
      if (this.containerProps.ref.value) {
        this.containerProps.ref.value.scrollTop = 0;
      }
    },
    onArrowLeft() {
      if (this.disabled) {
        return;
      }
      this.$emit("keyArrowLeft", this.selectedValues);
    },
    onArrowRight() {
      if (this.disabled) {
        return;
      }
      this.$emit("keyArrowRight", this.selectedValues);
    },
    onCtrlA() {
      if (this.disabled) {
        return;
      }
      // select all
      this.setSelected(this.possibleValuesWithBottom.map((x) => x.id));
    },
    hasSelection() {
      return (this.selectedValues as Id[]).length > 0;
    },
    getCurrentKeyNavItem() {
      try {
        return this.possibleValues[this.currentKeyNavIndex];
      } catch (e) {
        return {
          id: "",
          text: "",
        };
      }
    },
    generateOptionId(item: PossibleValue) {
      if (!item) {
        return "";
      }
      const id = typeof item.id === "symbol" ? item.id.description : item.id;
      const cleanId = id && (id as string).replace(/[^\w]/gi, "");
      return `option-${this.id}-${cleanId}`;
    },
    focus() {
      if (this.disabled) {
        return;
      }
      this.containerProps.ref.value?.focus();
    },
    clearSelection() {
      if (this.disabled) {
        return;
      }
      this.setSelected([]);
    },
  },
};
</script>

<template>
  <div
    :class="['multiselect-list-box', { invalid: !isValid, disabled }]"
    :style="cssStyleSize"
  >
    <div class="box">
      <ul
        v-bind="containerProps"
        :id="id"
        role="listbox"
        tabindex="0"
        :class="{ disabled, 'empty-box': showEmptyState }"
        :aria-label="ariaLabel"
        :aria-activedescendant="generateOptionId(getCurrentKeyNavItem())"
        @keydown.ctrl.a.prevent.exact="onCtrlA"
        @keydown.up.prevent.exact="onArrowUp"
        @keydown.down.prevent.exact="onArrowDown"
        @keydown.shift.up.prevent.exact="onArrowUpShift"
        @keydown.shift.down.prevent.exact="onArrowDownShift"
        @keydown.left.prevent.exact="onArrowLeft"
        @keydown.right.prevent.exact="onArrowRight"
        @keydown.home.prevent.exact="onHomeKey"
        @keydown.end.prevent.exact="onEndKey"
        @mousedown="onStartDrag"
        @mousemove="onDrag"
      >
        <div v-bind="wrapperProps">
          <StyledListItem
            v-for="{ data: item, index } of list"
            :id="generateOptionId(item)"
            :key="`listbox-${item.id as string}`"
            :text="item.text"
            :data-option-index="index"
            :line-height="optionLineHeight"
            :selected="isCurrentValue(item.id)"
            :invalid="item.invalid"
            :special="item.special"
            :disabled="disabled"
            @click="handleClick($event, item.id, index)"
            @dblclick-shift="handleShiftDblClick()"
            @dblclick-exact="handleDblClick(item.id, index)"
          />
        </div>
      </ul>
      <div v-if="showEmptyState" class="empty-state">
        <component :is="emptyStateComponent" v-if="emptyStateComponent" />
        <span v-else>
          {{ emptyStateLabel }}
        </span>
      </div>
      <div v-if="withBottomValue" role="bottom-box">
        <StyledListItem
          :id="generateOptionId(bottomValue)"
          special
          :text="bottomValue.text"
          :data-option-index="bottomIndex"
          :selected="isCurrentValue(bottomValue.id)"
          :disabled="disabled"
          @click="handleBottomClick"
          @dblclick-shift="handleShiftDblClick()"
          @dblclick-exact="handleBottomDblClick"
          @mousedown="onBottomStartDrag"
          @mousemove="onBottomDrag"
        />
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.multiselect-list-box {
  position: relative; /* required by .invalid::after */
  isolation: isolate;
  display: flex;
  align-items: stretch;
  flex-direction: column;

  &.invalid {
    &::after {
      content: "";
      position: absolute;
      width: 3px;
      left: 0;
      margin: 0;
      top: 0;
      bottom: 0;
      background-color: var(--theme-color-error);
    }
  }

  & .box {
    height: 100%;
    width: 100%;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    font-size: 14px;
    min-height: 22px;
    border: 1px solid var(--knime-stone-gray);

    &:has(:focus:not(.disabled)) {
      border-color: var(--knime-masala);
    }

    & [role="bottom-box"] {
      border-top: 1px solid var(--knime-silver-sand);
      background: var(--theme-multiselect-listbox-background-color);
      flex-grow: 0;
      flex-shrink: 0;
    }
  }

  /* this selector is required to override some * rules which interfere - so do not simplify */
  & ul[role="listbox"] {
    background: var(--theme-multiselect-listbox-background-color);
    overflow-y: auto;
    position: relative;
    padding: 0;
    margin: 0;
    flex-grow: 1;

    &.empty-box {
      background: var(--theme-empty-multiselect-listbox-background-color);
    }

    &:focus {
      outline: none;
    }
  }

  & .empty-state {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    & span {
      color: var(--theme-dropdown-foreground-color);
      font-style: italic;
      font-size: 10px;
    }
  }

  &.disabled {
    opacity: 0.5;
  }
}
</style>
