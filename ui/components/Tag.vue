<script>
export default {
    props: {
        /**
         * If the tags should have hover + cursor styles.
         */
        clickable: {
            type: Boolean,
            default: false
        }
    }
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
  padding: 0 6px;
  font-size: 10px;
  line-height: 17px;
  display: inline-block;
  font-weight: 500;
  color: var(--knime-dove-gray);

  & svg {
    position: relative;
    top: 1px;
    width: 8px;
    height: 8px;
    stroke-width: calc(32px / 14);
    stroke: var(--knime-dove-gray);
    margin-right: -3px;
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

@media only screen and (max-width: 900px) {
  .tag {
    font-size: 9px;
    line-height: 15px;
  }
}
</style>
