<script lang="ts">
import "./variables.css";
import { isEmpty } from "lodash-es";

import DropdownIcon from "../../assets/img/icons/arrow-dropdown.svg";
import FunctionButton from "../FunctionButton.vue";
import { computed, ref, toRef, type PropType } from "vue";
import { OnClickOutside } from "@vueuse/components";
import { useSearch, type PossibleValue, type Id } from "./possibleValues";
import CloseIcon from "../../assets/img/icons/close.svg";

let count = 0;
const KEY_DOWN = "ArrowDown";
const KEY_UP = "ArrowUp";
const KEY_HOME = "Home";
const KEY_END = "End";
const KEY_ESC = "Escape";
const KEY_ENTER = "Enter";
const KEY_TAB = "Tab";
const KEY_SHIFT = "Shift";

const TYPING_TIMEOUT = 1000; // in ms

export default {
  components: {
    DropdownIcon,
    OnClickOutside,
    FunctionButton,
    CloseIcon,
  },
  props: {
    id: {
      type: String,
      default() {
        return `Dropdown-${count++}`;
      },
    },
    modelValue: {
      type: String as PropType<Id>,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    placeholder: {
      type: String,
      default: null,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    /**
     * The direction of the dropdown menu. When set to 'up', the menu will appear above the input field.
     * Defaults to 'down'.
     */
    direction: {
      default: "down",
      type: String as PropType<"up" | "down">,
    },
    /**
     * List of possible values. Each item must have an `id` and a `text` property. To use slots an additional
     * slotData object must be passed which contains the data to be displayed.
     *
     * IMPORTANT: All values have to have a slotData object otherwise the slot will not be displayed and the
     * usual text is rendered instead.
     * @example
     * [{
     *   id: 'pdf',
     *   text: 'PDF'
     * }, {
     *   id: 'XLS',
     *   text: 'Excel',
     * }, {
     *   id: 'JPG',
     *   text: 'Jpeg',
     *   slotData: {
     *     fullName: 'Joint Photographic Experts Group',
     *     year: '1992'
     *     description: 'Commonly used method of lossy compression for digital images'
     *   }
     * }]
     */
    possibleValues: {
      type: Array as PropType<PossibleValue[]>,
      default: () => [],
    },
    initialCaseSensitive: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props) {
    const useFilterValues = ref(false);
    const displayTextMap = computed(() => {
      let map = {} as Record<Id, string>;
      for (let value of props.possibleValues) {
        map[value.id] = value.text;
      }
      return map;
    });

    const searchValue = ref(displayTextMap.value[props.modelValue]);

    const filteredPossibleValues = computed(() => {
      if (searchValue.value?.length === 0) {
        return props.possibleValues;
      }

      const filteredItems = useSearch(
        searchValue,
        toRef(props.initialCaseSensitive),
        toRef(props.possibleValues),
      );
      return filteredItems;
    });

    const currentPossibleValues = computed(() => {
      return useFilterValues.value
        ? filteredPossibleValues.value
        : props.possibleValues;
    });
    return {
      filteredPossibleValues,
      searchValue,
      useFilterValues,
      currentPossibleValues,
    };
  },
  data() {
    return {
      typingTimeout: null as null | ReturnType<typeof setTimeout>,
      isExpanded: false,
      searchQuery: "",
      candidate: this.modelValue,
      emptyState: "Nothing found",
      optionRefs: new Map(),
      isActive: false,
      closeIconFocused: false,
      shiftIsPressed: false,
    };
  },
  computed: {
    groupedValues() {
      const groups: Record<string, { label?: string; items: PossibleValue[] }> =
        {};
      for (const item of this.currentPossibleValues) {
        const groupLabel = item.group || "";
        if (!groups[groupLabel]) {
          groups[groupLabel] = { label: item.group, items: [] };
        }
        groups[groupLabel].items.push(item);
      }
      return Object.values(groups);
    },
    orderedGroupedValues() {
      const namedGroups = this.groupedValues.filter(
        (group) => group.items[0].group,
      );
      const unnamedGroups = this.groupedValues.filter(
        (group) => !group.items[0].group,
      );
      return [...namedGroups, ...unnamedGroups];
    },
    flatOrderedValues() {
      return this.orderedGroupedValues.flatMap((group) => group.items);
    },
    selectedIndex() {
      return this.flatOrderedValues.map((x) => x.id).indexOf(this.candidate);
    },
    showPlaceholder() {
      return !this.modelValue;
    },
    displayTextMap() {
      let map = {} as Record<Id, string>;
      for (let value of this.possibleValues) {
        map[value.id] = value.text;
      }
      return map;
    },
    displayText() {
      if (this.showPlaceholder) {
        return this.placeholder;
      } else if (this.displayTextMap.hasOwnProperty(this.modelValue)) {
        return this.displayTextMap[this.modelValue];
      } else {
        return `(MISSING) ${this.modelValue.toString()}`;
      }
    },
    isMissing() {
      return (
        this.modelValue && !this.displayTextMap.hasOwnProperty(this.modelValue)
      );
    },
    hasRightIcon() {
      return this.$slots["icon-right"]?.().length;
    },
    hasOptionTemplate() {
      return this.flatOrderedValues.every(
        (value) => value.slotData && !isEmpty(value.slotData),
      );
    },
    hasNoFilteredPossibleValues() {
      return this.currentPossibleValues.length === 0;
    },

    activeSearch() {
      return this.searchValue?.length > 0;
    },
  },
  watch: {
    filteredPossibleValues(newVal: PossibleValue[]) {
      this.candidate = newVal[0]?.id;
    },
    modelValue(newVal: Id) {
      this.searchValue = this.displayTextMap[newVal];
    },
  },

  methods: {
    updateCandidate(candidate: Id) {
      this.candidate = candidate;
    },
    isCurrentValue(candidate: Id) {
      return this.candidate === candidate;
    },
    setSelected(id: Id) {
      consola.trace("ListBox setSelected on", id);

      /**
       * Fired when the selection changes.
       */
      this.updateCandidate(id);
    },
    getButtonRef() {
      return this.$refs.button as HTMLElement;
    },
    getOptionsRefs() {
      return this.$refs.options as HTMLElement[];
    },
    getListBoxNodeRef() {
      return this.$refs.ul as HTMLElement;
    },
    onOptionClick(id: Id) {
      this.isActive = false;
      this.setSelected(id);
      this.$emit("update:modelValue", id);
      this.isExpanded = false;
      this.getButtonRef().focus();
    },
    scrollTo(id: Id) {
      let listBoxNode = this.getListBoxNodeRef();
      if (listBoxNode.scrollHeight >= listBoxNode.clientHeight) {
        let element = this.optionRefs.get(id);
        if (!element) {
          consola.error(
            `trying to scroll to element with Id ${id.toString()} which does not exist`,
          );
          return;
        }
        let scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
        let elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
        } else if (element.offsetTop < listBoxNode.scrollTop) {
          listBoxNode.scrollTop = element.offsetTop;
        }
      }
    },
    onArrowDown() {
      let next = this.selectedIndex + 1;
      if (next >= this.flatOrderedValues.length) {
        return;
      }
      const nextId = this.flatOrderedValues[next].id;
      this.setSelected(nextId);
      this.scrollTo(nextId);
    },
    onArrowUp() {
      let next = this.selectedIndex - 1;
      if (next < 0) {
        return;
      }
      const nextId = this.flatOrderedValues[next].id;
      this.setSelected(nextId);
      this.scrollTo(nextId);
    },
    onEnter() {
      this.toggleExpanded();

      if (!this.isExpanded) {
        this.$emit("update:modelValue", this.candidate);
        this.useFilterValues = false;
      }
    },
    onEndKey() {
      let next = this.flatOrderedValues.length - 1;
      this.setSelected(this.flatOrderedValues[next].id);
      const listBoxNode = this.getListBoxNodeRef();
      listBoxNode.scrollTop = listBoxNode.scrollHeight;
    },
    onHomeKey() {
      let next = 0;
      this.setSelected(this.flatOrderedValues[next].id);
      this.getListBoxNodeRef().scrollTop = 0;
    },
    selectFirst() {
      const { id } = this.flatOrderedValues[0];
      this.setSelected(id);
      this.getListBoxNodeRef().scrollTop = 0;
      this.candidate = id;
    },
    toggleExpanded() {
      if (this.hasNoFilteredPossibleValues) {
        return;
      }
      if (this.disabled) {
        return;
      }
      this.isExpanded = !this.isExpanded;

      if (this.isExpanded) {
        this.selectFirst();
      } else {
        this.$nextTick(() => this.getButtonRef().focus());
        this.isActive = false;
      }
    },
    handleKeyDownButton(e: KeyboardEvent) {
      /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
      if (
        this.isExpanded &&
        e.key !== KEY_DOWN &&
        e.key !== KEY_UP &&
        e.key !== KEY_ENTER &&
        e.key !== KEY_END &&
        e.key !== KEY_HOME &&
        e.key !== "Shift"
      ) {
        this.isActive = true;
        this.$nextTick(
          () => (this.$refs.searchInput as HTMLInputElement)?.focus(),
        );
      }
      if (e.key === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_END) {
        this.onEndKey();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_HOME) {
        this.selectFirst();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_ESC) {
        if (this.isExpanded) {
          this.toggleExpanded();
        }
        this.getButtonRef().focus();
        this.searchValue = this.displayTextMap[this.modelValue];

        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === KEY_ENTER) {
        this.onEnter();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_SHIFT) {
        this.shiftIsPressed = !this.shiftIsPressed;
      }
      if (e.key === KEY_TAB) {
        if (this.isExpanded && !this.useFilterValues) {
          this.moveFocusPushingTab();
        }
        if (this.useFilterValues && this.isExpanded) {
          (this.$refs.closeButton as HTMLElement).focus();
          if (this.closeIconFocused) {
            this.moveFocusPushingTab();
            return;
          }
          this.closeIconFocused = true;
        }
      }

      this.searchItem(e);
    },

    searchItem(e: KeyboardEvent) {
      if (this.typingTimeout !== null) {
        clearTimeout(this.typingTimeout);
      }
      this.typingTimeout = setTimeout(() => {
        this.searchQuery = "";
      }, TYPING_TIMEOUT);
      this.searchQuery += e.key;
      consola.trace(`Searching for ${this.searchQuery}`);
      const candidate = this.flatOrderedValues.find((item) =>
        item.text.toLowerCase().startsWith(this.searchQuery.toLowerCase()),
      );
      if (candidate) {
        this.setSelected(candidate.id);
      }
    },
    moveFocusPushingTab() {
      if (!this.shiftIsPressed) {
        this.searchValue = this.displayTextMap[this.modelValue];
        this.toggleExpanded();
        this.getButtonRef().focus();
      } else if (this.closeIconFocused) {
        this.$nextTick(
          () => (this.$refs.searchInput as HTMLInputElement)?.focus(),
        );

        this.shiftIsPressed = !this.shiftIsPressed;
        this.useFilterValues = !this.useFilterValues;
        this.closeIconFocused = !this.closeIconFocused;
      }
    },
    hasSelection() {
      return this.selectedIndex >= 0;
    },
    getCurrentSelectedId() {
      try {
        return this.flatOrderedValues[this.selectedIndex].id;
      } catch (e) {
        return "";
      }
    },
    generateId(node: string, itemId: Id | null = null) {
      if (!itemId) {
        return `${node}-${this.id}`;
      }
      let cleanId = String(itemId).replace(/[^\w]/gi, "");
      return `${node}-${this.id}-${cleanId}`;
    },
    clickAway() {
      this.searchValue = this.displayTextMap[this.modelValue];
      this.isActive = false;
      this.isExpanded = false;
    },
    handleSearch(item: string) {
      this.useFilterValues = true;
      this.searchValue = item;
    },
    handleResetInput() {
      this.searchValue = this.displayTextMap[this.modelValue];
      this.toggleExpanded();
    },
  },
};
</script>

<template>
  <OnClickOutside @trigger="clickAway">
    <div
      :id="id"
      :class="[
        'dropdown',
        { collapsed: !isExpanded, invalid: !isValid, disabled, compact },
      ]"
    >
      <div class="button-wrapper">
        <div
          :id="generateId('button')"
          ref="button"
          role="button"
          tabindex="0"
          aria-haspopup="listbox"
          :class="{
            placeholder: showPlaceholder,
            missing: isMissing && !isExpanded,
          }"
          :aria-label="ariaLabel"
          :aria-labelledby="generateId('button')"
          :aria-expanded="isExpanded"
          @click="toggleExpanded"
          @keydown="handleKeyDownButton"
        >
          <div v-if="isActive" class="summary-input-wrapper">
            <input
              ref="searchInput"
              :value="searchValue"
              tabindex="-1"
              role="searchbox"
              class="search-input"
              type="text"
              @input="(e) => handleSearch((e.target as HTMLInputElement).value)"
            />
          </div>
          <span v-else ref="span" :class="{ span: isExpanded }"
            >{{ displayText }}
          </span>
          <div v-if="hasRightIcon" class="loading-icon">
            <slot name="icon-right" />
          </div>
          <FunctionButton
            v-if="isActive"
            ref="closeButton"
            role="closeButton"
            class="button"
            @click="handleResetInput()"
          >
            <CloseIcon class="icon" />
          </FunctionButton>
          <DropdownIcon v-else class="icon" />
        </div>
      </div>
      <ul
        v-show="isExpanded"
        ref="ul"
        role="listbox"
        tabindex="-1"
        :aria-activedescendant="
          isExpanded ? generateId('option', getCurrentSelectedId()) : undefined
        "
        :class="{ 'drops-upwards': direction === 'up' }"
      >
        <div v-if="hasNoFilteredPossibleValues" class="empty-state">
          {{ emptyState }}
        </div>
        <template
          v-for="(group, groupIndex) in orderedGroupedValues"
          :key="groupIndex"
        >
          <span class="group-divider" />
          <li
            v-for="item in group.items"
            :id="generateId('option', item.id)"
            :key="`listbox-${item.id as string}`"
            :ref="(element) => optionRefs.set(item.id, element as HTMLElement)"
            role="option"
            :title="typeof item.title === 'undefined' ? item.text : item.title"
            :class="{
              focused: isCurrentValue(item.id),
              noselect: true,
              empty: item.text.trim() === '',
              'has-option-template': hasOptionTemplate,
            }"
            :aria-selected="isCurrentValue(item.id)"
            @click="onOptionClick(item.id)"
          >
            <template v-if="hasOptionTemplate">
              <slot name="option" :slot-data="item.slotData" />
            </template>
            <template v-else>
              {{ item.text }}
            </template>
          </li>
        </template>
      </ul>
      <input :id="id" type="hidden" :name="name" :value="modelValue" />
    </div>
  </OnClickOutside>
</template>

<style lang="postcss" scoped>
.dropdown {
  position: relative;

  & .button-wrapper div:first-child {
    padding-right: 0;
  }

  & .span {
    background-color: var(--knime-cornflower-semi);
  }

  & .summary-input-wrapper {
    width: 100%;
    cursor: text;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    flex: 1;

    & .search-input {
      all: unset;
      height: var(--inner-height);
      font-size: 13px;
      font-weight: 300;
      line-height: normal;
      flex: 1;
    }
  }

  & .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    padding: 0.5rem;
    cursor: default;
  }

  & .button {
    padding: 12px;
  }

  & button {
    margin-right: 6px;
    padding: 6px;
    cursor: pointer;
  }

  &.collapsed {
    background: var(--theme-dropdown-background-color);

    &.disabled {
      opacity: 0.5;
    }
  }

  &.compact {
    & [role="button"] {
      height: var(--single-line-form-height-compact);
    }

    & .icon {
      top: calc(
        (var(--single-line-form-height-compact) - var(--icon-size)) / 2
      );
      right: var(--space-8);
    }
  }

  &:not(.disabled).collapsed:hover {
    background: var(--knime-silver-sand-semi);
  }

  & .missing {
    color: var(--theme-color-error);
  }

  &.invalid::after {
    content: "";
    position: absolute;
    width: 3px;
    left: 0;
    margin: 0;
    top: 0;
    bottom: 0;
    background-color: var(--theme-color-error);
  }

  & .placeholder {
    color: var(--knime-stone-gray);
    user-select: none;
  }

  /* stylelint-disable-next-line no-descending-specificity */
  & [role="button"] {
    margin: 0;
    border: var(--form-border-width) solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
    height: var(--single-line-form-height);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 10px;

    &:focus {
      outline: none;
    }
  }

  &:not(.collapsed) [role="button"] {
    border-color: var(--knime-masala);
  }

  &:not(.disabled) [role="button"] {
    cursor: pointer;

    &:focus {
      border-color: var(--knime-masala);
    }
  }

  /* stylelint-disable-next-line no-descending-specificity */
  & .icon {
    --icon-size: 18px;

    width: var(--icon-size);
    height: var(--icon-size);
    stroke-width: calc(32px / 18);
    stroke: var(--knime-masala);
    position: absolute;
    right: 10px;
    top: calc((var(--single-line-form-height) - var(--icon-size)) / 2);
    pointer-events: none;
    transition: transform 0.2s ease-in-out;
  }

  & .loading-icon {
    --icon-size: 18;

    display: flex;
    pointer-events: none;

    & :slotted(svg) {
      vertical-align: top;
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);

      /* TODO: See ticket UIEXT-590, the stroke-width mixin should be used here. */
      stroke-width: calc(32px / var(--icon-size));
      stroke: var(--knime-masala);
    }
  }

  &:not(.collapsed) .icon {
    transform: scaleY(-1);
  }

  /* this selector is required to override some * rules interfere (overflow) - so do not simplify */
  & [role="listbox"] {
    overflow-y: auto;
    position: absolute;
    z-index: var(--z-index-common-dropdown-expanded, 2);
    max-height: var(
      --dropdown-max-height,
      calc(22px * 7)
    ); /* show max 7 items. override to change default */

    font-size: 14px;
    min-height: 22px;
    width: 100%;
    padding: 0;
    margin: -1px 0 1px;
    background: var(--theme-dropdown-background-color);
    box-shadow: var(--shadow-elevation-1);
    cursor: pointer;
    outline: none;

    &.drops-upwards {
      bottom: 100%;
    }
  }

  & [role="option"] {
    background: var(--theme-dropdown-background-color);
    color: var(--theme-dropdown-foreground-color);

    & > :slotted(svg) {
      stroke: var(--theme-dropdown-foreground-color);
    }

    &.empty {
      white-space: pre-wrap;
    }

    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-hover);
      }
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-focus);
      }
    }

    &.focused {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-selected);
      }
    }
  }

  & [role="option"]:not(.slotted) {
    display: block;
    width: 100%;
    padding: 0 10px;
    line-height: 22px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &.empty {
      white-space: pre-wrap;
    }
  }

  & .noselect {
    user-select: none;
  }

  & .group-label {
    display: block;
    margin: 5px 10px;
    cursor: default;
    font-weight: 500;
  }

  & .group-divider {
    display: block;
    margin: 10px 10px 5px;
    border-top: 1px solid var(--knime-silver-sand);

    &:first-child {
      display: none;
    }
  }
}
</style>
