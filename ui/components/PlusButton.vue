<script>
import Button from './Button.vue';
import Tooltip from './Tooltip.vue';
import PlusIcon from '../assets/img/icons/plus-small.svg';

export default {
    components: {
        Button,
        Tooltip,
        PlusIcon
    },
    props: {
        /**
         * @see {@link BaseButton.vue}
         */

        title: {
            type: String,
            default: null
        },
        withBorder: {
            type: Boolean,
            default: false
        },
        /**
         * switches colors to use button on a dark background
         */
        onDark: {
            type: Boolean,
            default: false
        },
        /**
         * switches colors
         */
        primary: {
            type: Boolean,
            default: false
        },
        /**
         * smaller font size and padding
         */
        compact: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<template>
  <Component
    :is="title ? 'Tooltip' : 'div'"
    :text="title"
  >
    <Button
      class="floating-button"
      v-bind="[$attrs, $props]"
      v-on="$listeners"
    >
      <PlusIcon />
    </Button>
  </Component>
</template>

<style lang="postcss" scoped>
.floating-button {
  --theme-button-border-radius: 9999px;

  width: 60px;
  height: 60px;
  border: 0;
  cursor: pointer;
  border-radius: 9999px;
  background-color: transparent;
  box-shadow: 0 0 10px var(--knime-gray-dark-semi), 0 0 4px var(--knime-gray-dark-semi);
  display: flex;
  justify-content: center;

  & >>> svg {
    width: 60px;
    height: 60px;
    stroke: var(--knime-dove-gray);
    stroke-width: 1px;
    position: absolute;
    margin: 0;
  }
}
</style>
