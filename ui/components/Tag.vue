<script>
import CheckIcon from "../assets/img/icons/check.svg";

export default {
    components: {
        CheckIcon
    },
    props: {
        /**
         * If the tags should have hover + cursor styles.
         */
        clickable: {
            type: Boolean,
            default: false
        },
        /**
         * If the tag should be displayed as active
         */
        active: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<template>
  <span :class="['tag', { clickable, active }]">
    <slot /><CheckIcon
      v-if="clickable && active"
      class="checkmark"
    />
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
  display: inline-flex;
  justify-content: center;
  align-items: center;
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
        stroke-width: 2.4px
      }
    }

  }
}
</style>
