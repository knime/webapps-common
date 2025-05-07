<script>
import { useId } from "vue";

import StyledListItem from "../../StyleListItem/StyledListItem.vue";

const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_HOME = 36;
const KEY_END = 35;

export default {
  name: "ListBox",
  components: {
    StyledListItem,
  },
  props: {
    id: {
      type: String,
      default() {
        return `ListBox-${useId()}`;
      },
    },
    modelValue: {
      type: String,
      default: "",
    },
    /**
     * Controls the size of the list. Number of visible items (for others user need to scroll)
     * 0 means all
     */
    size: {
      type: Number,
      default: 0,
      validator(value) {
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  data() {
    return {
      selectedIndex: -1,
      invalidPossibleValueIds: [],
      optionLineHeight: 22,
    };
  },
  computed: {
    ulSizeStyle() {
      // add two pixel to prevent scrollbar bugs
      const numToPixel = (n) => `${n * this.optionLineHeight + 2}px`;
      return this.size > 0
        ? { height: numToPixel(this.size) }
        : { minHeight: numToPixel(2) };
    },
    selectableValues() {
      return [
        ...this.invalidPossibleValueIds.map((x) => this.generateInvalidItem(x)),
        ...this.possibleValues,
      ];
    },
  },
  watch: {
    modelValue(newValue) {
      this.updateSelectedIndexAndInvalidValue(newValue);
    },
  },
  mounted() {
    this.updateSelectedIndexAndInvalidValue(this.modelValue);
  },
  methods: {
    updateSelectedIndexAndInvalidValue(value) {
      // update the selected index on start
      const idx = this.selectableValues.findIndex((item) => item.id === value);
      // not found? but the value is truthy ?
      if (idx === -1 && value) {
        // generate and add invalid value
        if (!this.invalidPossibleValueIds.includes(value)) {
          this.invalidPossibleValueIds.push(value);
        }
        // select invalid value
        this.selectedIndex = this.selectableValues.findIndex(
          (item) => item.id === value,
        );
      } else {
        this.selectedIndex = idx;
      }
    },
    isCurrentValue(candidate) {
      return this.modelValue === candidate;
    },
    setSelected(value, index) {
      if (this.disabled) {
        return;
      }
      consola.trace("ListBox setSelected on", value);
      this.selectedIndex = index;

      /**
       * Fired when the selection changes.
       */
      this.$emit("update:modelValue", value);
    },
    scrollToCurrent() {
      const listBoxNode = this.$refs.ul;
      if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
        const element = this.$refs.options[this.selectedIndex];
        const scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
        const elementBottom = element.offsetTop + element.offsetHeight;
        if (elementBottom > scrollBottom) {
          listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
        } else if (element.offsetTop < listBoxNode.scrollTop) {
          listBoxNode.scrollTop = element.offsetTop;
        }
      }
    },
    onArrowDown() {
      if (this.disabled) {
        return;
      }
      const next = this.selectedIndex + 1;
      if (next >= this.selectableValues.length) {
        return;
      }
      this.setSelected(this.selectableValues[next].id, next);
      this.scrollToCurrent();
    },
    onArrowUp() {
      if (this.disabled) {
        return;
      }
      const next = this.selectedIndex - 1;
      if (next < 0) {
        return;
      }
      this.setSelected(this.selectableValues[next].id, next);
      this.scrollToCurrent();
    },
    onEndKey() {
      if (this.disabled) {
        return;
      }
      const next = this.selectableValues.length - 1;
      this.setSelected(this.selectableValues[next].id, next);
      this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
    },
    onHomeKey() {
      if (this.disabled) {
        return;
      }
      const next = 0;
      this.setSelected(this.selectableValues[next].id, next);
      this.$refs.ul.scrollTop = 0;
    },
    handleKeyDown(e) {
      if (this.disabled) {
        return;
      }
      /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
      if (e.keyCode === KEY_DOWN) {
        this.onArrowDown();
        e.preventDefault();
      }
      if (e.keyCode === KEY_UP) {
        this.onArrowUp();
        e.preventDefault();
      }
      if (e.keyCode === KEY_END) {
        this.onEndKey();
        e.preventDefault();
      }
      if (e.keyCode === KEY_HOME) {
        this.onHomeKey();
        e.preventDefault();
      }
    },
    hasSelection() {
      return this.selectedIndex >= 0;
    },
    validate() {
      return { isValid: !this.getCurrentItem().invalid, errorMessage: null };
    },
    getCurrentItem() {
      // selectedIndex might be -1 if value is null for example, we always return an object here
      return this.selectableValues[this.selectedIndex] || { id: "", text: "" };
    },
    generateInvalidItem(id) {
      return {
        id,
        text: `(MISSING) ${id}`,
        invalid: true,
      };
    },
    generateOptionId(item) {
      if (!item || !item.id) {
        return "";
      }
      const cleanId = item.id.replace(/[^\w]/gi, "");
      return `option-${this.id}-${cleanId}`;
    },
  },
};
</script>

<template>
  <div :class="['list-box', { invalid: !isValid, disabled }]">
    <ul
      :id="id"
      ref="ul"
      role="listbox"
      :tabindex="disabled ? -1 : 0"
      :aria-label="ariaLabel"
      :style="ulSizeStyle"
      :aria-activedescendant="generateOptionId(getCurrentItem())"
      @keydown="handleKeyDown"
    >
      <StyledListItem
        v-for="(item, index) of selectableValues"
        :id="generateOptionId(item)"
        :key="`listbox-${item.id}`"
        ref="options"
        :style="{ 'line-height': `${optionLineHeight}px` }"
        :text="item.text"
        :title="item.text"
        :class="{
          focused: isCurrentValue(item.id),
          noselect: true,
          empty: item.text.trim() === '',
        }"
        :aria-selected="isCurrentValue(item.id)"
        :line-height="optionLineHeight"
        :selected="isCurrentValue(item.id)"
        :invalid="item.invalid"
        :special="item.special"
        :disabled="disabled"
        @click="!disabled && setSelected(item.id, index)"
        @focus="!disabled && setSelected(item.id, index)"
      />
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
.list-box {
  position: relative;
  isolation: isolate;

  &.disabled {
    opacity: 0.5;
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

  & [role="listbox"] {
    font-size: 14px;
    min-height: 22px;
    padding: 0;
    margin: 0;
    background: var(--theme-listbox-background-color);
    border: 1px solid var(--knime-stone-gray);

    &:focus {
      outline: none;
      border-color: var(--knime-masala);
    }
  }

  & ul[role="listbox"] {
    overflow-y: auto;
    position: relative;
  }

  & .noselect {
    user-select: none;
  }
}
</style>
