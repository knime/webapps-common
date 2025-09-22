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
    <slot>
      {{ text }}
    </slot>
  </li>
</template>

<style lang="postcss" scoped>
[role="option"] {
  position: relative;
  display: block;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 22px;
  color: var(--theme-dropdown-foreground-color);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  background: var(--theme-dropdown-background-color);

  &.empty {
    white-space: pre-wrap;
  }

  &.disabled {
    cursor: unset;
  }

  &.selected {
    color: var(--theme-dropdown-foreground-color-selected);
    background: var(--theme-dropdown-background-color-selected);
  }

  /* invalid values */
  &.invalid {
    color: var(--theme-color-error);

    &.selected {
      color: var(--theme-dropdown-foreground-color-selected);
      background: var(--theme-color-error);
    }
  }

  &:not(.disabled, .selected) {
    &:hover {
      color: var(--theme-dropdown-foreground-color-hover);
      background: var(--theme-dropdown-background-color-hover);
    }

    &:focus {
      color: var(--theme-dropdown-foreground-color-focus);
      background: var(--theme-dropdown-background-color-focus);
    }
  }

  &.special {
    position: relative;
    padding: 0 3px;
    margin: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 10px;
    font-style: italic;
    line-height: 16px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    border-radius: 3px;
  }
}
</style>
