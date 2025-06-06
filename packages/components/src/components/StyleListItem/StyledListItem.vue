<script>
export default {
  name: "StyledListItem",
  props: {
    text: {
      type: String,
      default: " ",
    },
    selected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    invalid: {
      type: Boolean,
      default: false,
    },
    /**
     * Styles the item distinct to the other ones by adding a margin, adjusting the font-style and -height and
     * rounding the corners
     */
    special: {
      type: Boolean,
      default: false,
    },
    lineHeight: {
      type: Number,
      default: null,
    },
  },
  emits: [
    "mousedown",
    "mousemove",
    "dblclick-exact",
    "dblclick-shift",
    "click",
    "focus",
  ],
};
</script>

<template>
  <!-- //NOSONAR -->
  <li
    v-bind="$attrs"
    role="option"
    :title="text"
    :style="{
      ...(lineHeight !== null ? { lineHeight: `${lineHeight}px` } : {}),
    }"
    :class="{
      selected,
      invalid,
      empty: !Boolean(text.trim()),
      disabled,
      special,
    }"
    :aria-selected="selected"
    @click="$emit('click', $event)"
    @focus="$emit('focus', $event)"
    @dblclick.shift="$emit('dblclick-shift')"
    @dblclick.exact="$emit('dblclick-exact')"
    @mousedown="$emit('mousedown', $event)"
    @mousemove="$emit('mousemove', $event)"
  >
    {{ text }}
  </li>
</template>

<style lang="postcss" scoped>
[role="option"] {
  display: block;
  padding: 0 10px;
  line-height: 22px;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  background: var(--theme-dropdown-background-color);
  color: var(--theme-dropdown-foreground-color);
  user-select: none;

  &.empty {
    white-space: pre-wrap;
  }

  &.disabled {
    cursor: unset;
  }

  &.selected {
    background: var(--theme-dropdown-background-color-selected);
    color: var(--theme-dropdown-foreground-color-selected);
  }

  /* invalid values */
  &.invalid {
    color: var(--theme-color-error);

    &.selected {
      background: var(--theme-color-error);
      color: var(--theme-dropdown-foreground-color-selected);
    }
  }

  &:not(.disabled, .selected) {
    &:hover {
      background: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);
    }

    &:focus {
      background: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);
    }
  }

  &.special {
    border-radius: 3px;
    font-size: 10px;
    font-style: italic;
    text-align: center;
    margin: 2px;
    padding: 0 3px;
    line-height: 16px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    cursor: pointer;
  }
}
</style>
