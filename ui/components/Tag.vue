<script>
export default {
  props: {
    /**
     * If the tags should have hover + cursor styles.
     */
    clickable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <span :class="['tag', { clickable }]">
    <slot />
  </span>
</template>

<style lang="postcss" scoped>
.tag {
  border: 1px solid var(--knime-dove-gray);
  margin-right: 5px;
  margin-bottom: 5px;
  padding: 3px 5px;
  font-size: 14px;
  line-height: 17px;
  display: inline-block;
  font-weight: 500;
  color: var(--knime-dove-gray);

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
      background-color: var(--knime-masala);
      border-color: var(--knime-masala);

      & svg {
        stroke: var(--knime-white);
      }
    }

    &:active {
      color: var(--knime-white);
      background-color: var(--knime-black);
      border-color: var(--knime-black);

      & svg {
        stroke: var(--knime-white);
      }
    }
  }
}
</style>
