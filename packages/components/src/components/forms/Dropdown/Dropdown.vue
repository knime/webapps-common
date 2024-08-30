<script lang="ts">
import { type PropType } from "vue";
import { OnClickOutside } from "@vueuse/components";
import { isEmpty } from "lodash-es";

import DropdownIcon from "@knime/styles/img/icons/arrow-dropdown.svg";
import "../variables.css";

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

const TYPING_TIMEOUT = 1000; // in ms

export default {
  name: "Dropdown",
  components: {
    DropdownIcon,
    OnClickOutside,
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
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      typingTimeout: null as null | ReturnType<typeof setTimeout>,
      isExpanded: false,
      searchQuery: "",
    };
  },
  computed: {
    groupedValues() {
      const groups: Record<string, { label?: string; items: PossibleValue[] }> =
        {};
      for (const item of this.possibleValues) {
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
      return this.flatOrderedValues.map((x) => x.id).indexOf(this.modelValue);
    },
    showPlaceholder() {
      return !this.modelValue;
    },
    displayTextMap() {
      let map = {} as Record<Id, string>;
      for (let value of this.flatOrderedValues) {
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
        return `(MISSING) ${this.modelValue}`;
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
    selectedOption() {
      return this.possibleValues.find((value) => value.id === this.modelValue);
    },
  },

  methods: {
    isCurrentValue(candidate: Id) {
      return this.modelValue === candidate;
    },
    setSelected(id: Id) {
      consola.trace("Dropdown setSelected on", id);

      /**
       * Fired when the selection changes.
       */
      this.$emit("update:modelValue", id);
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
      this.setSelected(id);
      this.isExpanded = false;
      this.getButtonRef().focus();
    },
    scrollTo(optionIndex: number) {
      let listBoxNode = this.getListBoxNodeRef();
      if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
        let element = this.getOptionsRefs()[optionIndex];
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
      this.setSelected(this.flatOrderedValues[next].id);
      this.scrollTo(next);
    },
    onArrowUp() {
      let next = this.selectedIndex - 1;
      if (next < 0) {
        return;
      }
      this.setSelected(this.flatOrderedValues[next].id);
      this.scrollTo(next);
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
    toggleExpanded() {
      if (this.disabled) {
        return;
      }
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.$nextTick(() => this.getListBoxNodeRef().focus());
      }
    },
    handleKeyDownList(e: KeyboardEvent) {
      /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
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
        this.onHomeKey();
        e.preventDefault();
        return;
      }
      if (e.key === KEY_ESC) {
        this.isExpanded = false;
        this.getButtonRef().focus();
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === KEY_ENTER) {
        this.isExpanded = false;
        this.getButtonRef().focus();
        e.preventDefault();
        return;
      }
      this.searchItem(e);
    },
    handleKeyDownButton(e: KeyboardEvent) {
      if (e.key === KEY_ENTER) {
        this.toggleExpanded();
        e.preventDefault();
        return;
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
      this.isExpanded = false;
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
      <div
        :id="generateId('button')"
        ref="button"
        role="button"
        tabindex="0"
        aria-haspopup="listbox"
        :class="{
          placeholder: showPlaceholder,
          missing: isMissing,
          'has-option-template': hasOptionTemplate,
        }"
        :aria-label="ariaLabel"
        :aria-labelledby="generateId('button')"
        :aria-expanded="isExpanded"
        @click="toggleExpanded"
        @keydown="handleKeyDownButton"
      >
        <template v-if="hasOptionTemplate">
          <slot
            name="option"
            :slot-data="selectedOption?.slotData"
            :is-missing="isMissing"
            :selected-value="modelValue"
          />
        </template>
        <template v-else>
          {{ displayText }}
          <div v-if="hasRightIcon" class="loading-icon">
            <slot name="icon-right" />
          </div>
        </template>
        <!-- @vue-ignore -->
        <DropdownIcon class="icon" />
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
        @keydown="handleKeyDownList"
      >
        <template
          v-for="(group, groupIndex) in orderedGroupedValues"
          :key="groupIndex"
        >
          <span class="group-divider" />
          <li
            v-for="item in group.items"
            :id="generateId('option', item.id)"
            :key="`listbox-${item.id}`"
            ref="options"
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
    margin: 0;
    border: var(--form-border-width) solid var(--knime-stone-gray);
    padding: 0 38px 0 10px;
    font-size: 13px;
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

  & [role="button"]:not(.has-option-template) {
    height: var(--single-line-form-height);
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
