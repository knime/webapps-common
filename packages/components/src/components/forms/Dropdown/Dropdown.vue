<script lang="ts">
import { type PropType, computed, nextTick, ref, toRefs, watch } from "vue";
import { OnClickOutside } from "@vueuse/components";
import { isEmpty } from "lodash-es";

import DropdownIcon from "@knime/styles/img/icons/arrow-dropdown.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";

import "../variables.css";
import useSearch from "../../../composables/useSearch";
import FunctionButton from "../../Buttons/FunctionButton.vue";

type Id = string | number;
interface PossibleValue {
  id: Id;
  text: string;
  title?: string;
  group?: string;
  slotData?: {
    [K in keyof any]: string | number | boolean;
  };
}

let count = 0;
const KEY_DOWN = "ArrowDown";
const KEY_UP = "ArrowUp";
const KEY_HOME = "Home";
const KEY_END = "End";
const KEY_ESC = "Escape";
const KEY_ENTER = "Enter";

const expandKeys = [KEY_DOWN, KEY_UP, KEY_HOME, KEY_END, KEY_ENTER];

export default {
  name: "Dropdown",
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
    caseSensitiveSearch: {
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
    const { caseSensitiveSearch, possibleValues } = toRefs(props);
    const useFilterValues = ref(false);
    const displayTextMap = computed(() => {
      let map = {} as Record<Id, string>;
      for (let value of possibleValues.value) {
        map[value.id] = value.text;
      }
      return map;
    });

    const searchValue = ref(displayTextMap.value[props.modelValue]);
    watch(
      () => props.modelValue,
      (newVal: Id) => {
        searchValue.value = displayTextMap.value[newVal];
      },
    );

    const currentPossibleValues = useSearch(
      searchValue,
      caseSensitiveSearch,
      possibleValues,
      useFilterValues,
    );

    return {
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
      slotContainerHeight: 0,
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
      if (this.possibleValues.length === 0) {
        return false;
      }
      return this.possibleValues.every(
        (value) => value.slotData && !isEmpty(value.slotData),
      );
    },
    selectedOption() {
      return this.possibleValues.find((value) => value.id === this.modelValue);
    },
    hasNoFilteredPossibleValues() {
      return this.currentPossibleValues.length === 0;
    },
    nonEmptySearchValue() {
      return this.searchValue?.length > 0;
    },
    possibleValuesIsProvided() {
      return Boolean(this.possibleValues.length);
    },
    isDisabled() {
      return this.disabled || !this.possibleValuesIsProvided;
    },
    closeIconTooltip() {
      return "Clear";
    },
  },
  watch: {
    currentPossibleValues(newVal: PossibleValue[]) {
      this.candidate = newVal[0]?.id;
    },
    isExpanded() {
      this.useFilterValues = false;
    },
  },

  methods: {
    updateCandidate(candidate: Id) {
      this.candidate = candidate;
    },
    isCurrentValue(candidate: Id) {
      return this.candidate === candidate;
    },
    getButtonRef() {
      return this.$refs.button as HTMLElement;
    },
    getOptionsRefs() {
      return this.$refs.options as HTMLElement[];
    },
    getSearchInput() {
      return this.$refs.searchInput as HTMLInputElement;
    },
    getListBoxNodeRef() {
      return this.$refs.ul as HTMLElement;
    },
    emitAndClose(id: Id) {
      this.$emit("update:modelValue", id);
      this.toggleExpanded();
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
      this.updateCandidate(nextId);
      this.scrollTo(nextId);
    },
    onArrowUp() {
      let next = this.selectedIndex - 1;
      if (next < 0) {
        return;
      }
      const nextId = this.flatOrderedValues[next].id;
      this.updateCandidate(nextId);
      this.scrollTo(nextId);
    },
    onEnter() {
      if (
        this.hasNoFilteredPossibleValues ||
        typeof this.candidate === "undefined"
      ) {
        return;
      }
      this.emitAndClose(this.candidate);
    },
    onEndKey() {
      let next = this.flatOrderedValues.length - 1;
      this.updateCandidate(this.flatOrderedValues[next].id);
      const listBoxNode = this.getListBoxNodeRef();
      listBoxNode.scrollTop = listBoxNode.scrollHeight;
    },
    onHomeKey() {
      let next = 0;
      this.updateCandidate(this.flatOrderedValues[next].id);
      this.getListBoxNodeRef().scrollTop = 0;
    },
    toggleExpanded() {
      if (this.isExpanded) {
        this.collapse();
      } else {
        this.expand();
      }
    },
    async expand() {
      if (this.isDisabled) {
        return;
      }
      this.searchValue = this.displayTextMap[this.modelValue];
      if (this.hasOptionTemplate) {
        this.slotContainerHeight =
          (this.$refs.slotContainer as HTMLElement)?.clientHeight ?? 0;
      }
      this.isExpanded = true;
      if (
        this.candidate === this.modelValue &&
        (this.isMissing || this.showPlaceholder)
      ) {
        this.updateCandidate(this.currentPossibleValues[0]?.id);
      }
      await nextTick();
      this.getSearchInput().focus();
      this.getSearchInput().select();
      if (this.candidate) {
        this.scrollTo(this.candidate);
      }
    },
    collapse() {
      this.isExpanded = false;
      this.getButtonRef().focus();
    },
    /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
    handleKeyDownButton(e: KeyboardEvent) {
      if (this.isExpanded) {
        this.handleKeyDownOnExpanded(e);
      } else if (expandKeys.includes(e.key)) {
        this.expand();
        e.preventDefault();
      }
    },
    handleKeyDownOnExpanded(e: KeyboardEvent) {
      if (e.key === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
      }
      if (e.key === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
      }
      if (e.key === KEY_END) {
        this.onEndKey();
        e.preventDefault();
      }
      if (e.key === KEY_HOME) {
        this.onHomeKey();
        e.preventDefault();
      }
      if (e.key === KEY_ESC) {
        this.collapse();
        e.preventDefault();
        e.stopPropagation();
      }
      if (e.key === KEY_ENTER) {
        this.onEnter();
        e.preventDefault();
      }
    },
    hasSelection() {
      return Boolean(this.modelValue && !this.isMissing);
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
    closeDropdown() {
      this.searchValue = this.displayTextMap[this.modelValue];
      this.isExpanded = false;
    },
    handleSearch(item: string) {
      this.useFilterValues = true;
      this.searchValue = item;
    },
    handleResetInput() {
      this.searchValue = "";
      this.getSearchInput().focus();
    },
  },
};
</script>

<template>
  <OnClickOutside @trigger="closeDropdown">
    <div
      :id="id"
      :class="[
        'dropdown',
        {
          collapsed: !isExpanded,
          invalid: !isValid,
          disabled: isDisabled,
          compact,
        },
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
            placeholder: showPlaceholder && !isExpanded,
            missing: isMissing && !isExpanded,
            'has-option-template': hasOptionTemplate && !isExpanded,
          }"
          :style="{
            ...(isExpanded &&
              hasOptionTemplate && {
                height: `calc(${slotContainerHeight}px + 0 * var(--form-border-width))`,
                boxSizing: 'content-box',
              }),
          }"
          :aria-label="ariaLabel"
          :aria-labelledby="generateId('button')"
          :aria-expanded="isExpanded"
          @click="toggleExpanded"
          @keydown="handleKeyDownButton"
        >
          <input
            v-if="isExpanded"
            ref="searchInput"
            :value="searchValue"
            tabindex="0"
            role="searchbox"
            class="search-input"
            type="text"
            @click.stop
            @input="(e) => handleSearch((e.target as HTMLInputElement).value)"
          />
          <div v-else-if="hasOptionTemplate" ref="slotContainer">
            <slot
              name="option"
              :slot-data="selectedOption?.slotData"
              :is-missing="isMissing"
              :selected-value="modelValue"
              :expanded="false"
            />
          </div>
          <span v-else ref="span">{{ displayText }}</span>
          <div class="right">
            <div v-if="hasRightIcon" class="loading-icon">
              <slot name="icon-right" />
            </div>
            <FunctionButton
              v-if="isExpanded && nonEmptySearchValue"
              ref="closeButton"
              title="Close"
              tabindex="0"
              class="button"
              @keydown.enter.stop
              @click.stop="handleResetInput"
            >
              <CloseIcon class="icon" />
            </FunctionButton>
            <FunctionButton
              v-if="!isExpanded || !nonEmptySearchValue"
              class="button"
              :disabled="isDisabled"
              :title="isExpanded ? 'Cancel' : 'Expand'"
              :tabindex="isExpanded ? 0 : -1"
              @click.stop="toggleExpanded"
            >
              <DropdownIcon :class="['dropdown-icon', 'icon']" />
            </FunctionButton>
          </div>
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
            @mouseenter="updateCandidate(item.id)"
            @click="emitAndClose(item.id)"
          >
            <template v-if="hasOptionTemplate">
              <slot name="option" :slot-data="item.slotData" :expanded="true" />
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

  & .search-input {
    outline: none;
    border-style: none;
    font-weight: 300;
    line-height: normal;
    padding: 0;
  }

  & .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    padding: 0.5rem;
    cursor: default;
  }

  & .right {
    display: flex;
    align-items: center;
    gap: 5px;
  }

  &.collapsed {
    background: var(--theme-dropdown-background-color);

    &.disabled {
      opacity: 0.5;
    }
  }

  & .missing {
    color: var(--theme-color-error);
    stroke: var(--theme-color-error);
  }

  & :deep(.missing) {
    color: var(--theme-color-error);
    stroke: var(--theme-color-error);
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
    height: var(--single-line-form-height);
    margin: 0;
    border: var(--form-border-width) solid var(--knime-stone-gray);
    padding: 0 6px 0 10px;
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;

    & .button {
      padding: 4px;
    }

    &:focus {
      outline: none;
    }

    & > :first-child {
      flex: 1;
      min-width: 0;
    }
  }

  &.compact {
    & [role="button"] {
      height: var(--single-line-form-height-compact);

      & .button {
        padding: 2px;
      }
    }
  }

  &:not(.compact) [role="button"].has-option-template {
    height: unset;
  }

  &:not(.disabled).collapsed:hover {
    background: var(--knime-silver-sand-semi);
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

  &:not(.collapsed) .dropdown-icon {
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
      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-hover);
      }
    }

    &:focus {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-focus);
      }
    }

    &.focused {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);

      & :slotted(svg) {
        stroke: var(--theme-dropdown-foreground-color-hover);
      }
    }
  }

  & [role="option"]:not(.slot-option) {
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

  & [role="option"]:has(.slot-option) {
    border-bottom: 1px solid var(--knime-porcelain);
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
