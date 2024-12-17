<script setup lang="ts">
import CheckIcon from "@knime/styles/img/icons/check.svg";

interface Props {
  /**
   * If the tags should have hover + cursor styles.
   */
  clickable?: boolean;
  /**
   * If the tag should be displayed as active
   */
  active?: boolean;
}

withDefaults(defineProps<Props>(), {
  clickable: false,
  active: false,
});
</script>

<template>
  <span tabindex="0" :class="['tag', { clickable, active }]">
    <slot /><CheckIcon v-if="clickable && active" class="checkmark" />
  </span>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.tag {
  border: 1px solid var(--knime-dove-gray);
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 3px 5px;
  font-size: 13px;
  line-height: 13px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  color: var(--knime-dove-gray);
  height: auto;
  min-height: 24px;

  &:focus-visible {
    @mixin focus-outline 2, 3;
  }

  & svg {
    position: relative;
    width: 8px;
    height: 8px;
    stroke-width: calc(32px / 8);
    stroke: var(--knime-dove-gray);
    margin: 0 -1px 0 auto;
  }

  &.clickable {
    cursor: pointer;

    &:hover {
      color: var(--knime-white);
      background-color: var(--knime-dove-gray);
      border-color: var(--knime-dove-gray);

      & svg {
        stroke: var(--knime-white);
      }
    }

    &.active,
    &:active {
      color: var(--knime-white);
      background-color: var(--knime-masala);
      border-color: var(--knime-masala);

      & svg {
        stroke: var(--knime-white);
      }
    }

    &.active {
      &:hover {
        background-color: var(--knime-dove-gray);
        border-color: var(--knime-dove-gray);
      }

      & .checkmark {
        width: 18px;
        height: 18px;
        padding-left: 5px;
        stroke-width: 2.4px;
      }
    }
  }
}
</style>
