<script>
import "./variables.css";
import { mixin as VueClickAway } from "vue3-click-away";

import DropdownIcon from "../../assets/img/icons/arrow-dropdown.svg";

let count = 0;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_HOME = 36;
const KEY_END = 35;
const KEY_ESC = 27;
const KEY_ENTER = 13;

const TYPING_TIMEOUT = 1000; // in ms

export default {
  components: {
    DropdownIcon,
  },
  mixins: [VueClickAway],
  props: {
    id: {
      type: String,
      default() {
        return `Dropdown-${count++}`;
      },
    },
    modelValue: {
      type: String,
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
      type: Array,
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
  emits: ["update:modelValue"],
  data() {
    return {
      isExpanded: false,
      searchQuery: "",
    };
  },
  computed: {
    selectedIndex() {
      return this.possibleValues.map((x) => x.id).indexOf(this.modelValue);
    },
    showPlaceholder() {
      return !this.modelValue;
    },
    displayTextMap() {
      let map = {};
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
  },
  created() {
    this.typingTimeout = null;
  },
  methods: {
    isCurrentValue(candidate) {
      return this.modelValue === candidate;
    },
    setSelected(id) {
      consola.trace("ListBox setSelected on", id);

      /**
       * Fired when the selection changes.
       */
      this.$emit("update:modelValue", id);
    },
    onOptionClick(id) {
      this.setSelected(id);
      this.isExpanded = false;
      this.$refs.button.focus();
    },
    scrollTo(optionIndex) {
      let listBoxNode = this.$refs.ul;
      if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
        let element = this.$refs.options[optionIndex];
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
      if (next >= this.possibleValues.length) {
        return;
      }
      this.setSelected(this.possibleValues[next].id);
      this.scrollTo(next);
    },
    onArrowUp() {
      let next = this.selectedIndex - 1;
      if (next < 0) {
        return;
      }
      this.setSelected(this.possibleValues[next].id);
      this.scrollTo(next);
    },
    onEndKey() {
      let next = this.possibleValues.length - 1;
      this.setSelected(this.possibleValues[next].id);
      this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
    },
    onHomeKey() {
      let next = 0;
      this.setSelected(this.possibleValues[next].id);
      this.$refs.ul.scrollTop = 0;
    },
    toggleExpanded() {
      if (this.disabled) {
        return;
      }
      this.isExpanded = !this.isExpanded;
      if (this.isExpanded) {
        this.$nextTick(() => this.$refs.ul.focus());
      }
    },
    handleKeyDownList(e) {
      /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
      if (e.keyCode === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_END) {
        this.onEndKey();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_HOME) {
        this.onHomeKey();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_ESC) {
        this.isExpanded = false;
        this.$refs.ul.blur();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_ENTER) {
        this.isExpanded = false;
        this.$refs.button.focus();
        e.preventDefault();
        return;
      }
      this.searchItem(e);
    },
    handleKeyDownButton(e) {
      if (e.keyCode === KEY_ENTER) {
        this.toggleExpanded();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
        return;
      }
      if (e.keyCode === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
        return;
      }
      this.searchItem(e);
    },
    searchItem(e) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.searchQuery = "";
      }, TYPING_TIMEOUT);
      this.searchQuery += e.key;

      consola.trace(`Searching for ${this.searchQuery}`);

      const candidate = this.possibleValues.find((item) =>
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
        return this.possibleValues[this.selectedIndex].id;
      } catch (e) {
        return "";
      }
    },
    generateId(node, itemId) {
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
  <div
    :id="id"
    v-click-away="clickAway"
    :class="[
      'dropdown',
      { collapsed: !isExpanded, invalid: !isValid, disabled },
    ]"
  >
    <div
      :id="generateId('button')"
      ref="button"
      role="button"
      tabindex="0"
      aria-haspopup="listbox"
      :class="{ placeholder: showPlaceholder, missing: isMissing }"
      :aria-label="ariaLabel"
      :aria-labelledby="generateId('button')"
      :aria-expanded="isExpanded"
      @click="toggleExpanded"
      @keydown="handleKeyDownButton"
    >
      {{ displayText }}
      <div v-if="hasRightIcon" class="loading-icon">
        <slot name="icon-right" />
      </div>
      <DropdownIcon class="icon" />
    </div>
    <ul
      v-show="isExpanded"
      ref="ul"
      role="listbox"
      tabindex="-1"
      :aria-activedescendant="
        isExpanded ? generateId('option', getCurrentSelectedId()) : false
      "
      @keydown="handleKeyDownList"
    >
      <li
        v-for="item of possibleValues"
        :id="generateId('option', item.id)"
        :key="`listbox-${item.id}`"
        ref="options"
        role="option"
        :title="typeof item.title === 'undefined' ? item.text : item.title"
        :class="{
          focused: isCurrentValue(item.id),
          noselect: true,
          empty: item.text.trim() === '',
        }"
        :aria-selected="isCurrentValue(item.id)"
        @click="onOptionClick(item.id)"
      >
        {{ item.text }}
      </li>
    </ul>
    <input :id="id" type="hidden" :name="name" :value="modelValue" />
  </div>
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
    max-height: calc(22px * 7); /* show max 7 items */
    font-size: 14px;
    min-height: 22px;
    width: 100%;
    padding: 0;
    margin: -1px 0 1px;
    background: var(--theme-dropdown-background-color);
    box-shadow: var(--shadow-elevation-1);
    cursor: pointer;
  }

  & [role="option"] {
    display: block;
    width: 100%;
    padding: 0 10px;
    line-height: 22px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    background: var(--theme-dropdown-background-color);
    color: var(--theme-dropdown-foreground-color);

    &.empty {
      white-space: pre-wrap;
    }

    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);
    }

    &.focused {
      background: var(--theme-dropdown-background-color-selected);
      color: var(--theme-dropdown-foreground-color-selected);
    }
  }

  & .noselect {
    user-select: none;
  }
}
</style>
