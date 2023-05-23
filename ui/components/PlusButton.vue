<script lang="ts">
import { defineComponent } from "vue";
import Button from "./Button.vue";
import Tooltip from "./Tooltip.vue";
import PlusIcon from "../assets/img/icons/plus-small.svg";

export default defineComponent({
  components: {
    Button,
    Tooltip,
    PlusIcon,
  },
  inheritAttrs: false,
  props: {
    /**
     * @see {@link Button.vue}
     */

    /**
     * Button's title rendered as tooltip
     * if null, the tooltip won't be rendered
     */
    title: {
      type: String,
      default: null,
    },
  },
});
</script>

<template>
  <Component :is="title ? 'Tooltip' : 'div'" :text="title">
    <Button class="plus-button" v-bind="$attrs">
      <PlusIcon />
    </Button>
  </Component>
</template>

<style lang="postcss" scoped>
.tooltip {
  width: 60px;
}

.plus-button {
  --theme-button-border-radius: 9999px;

  width: 60px;
  height: 60px;
  border: 0;
  cursor: pointer;
  background-color: transparent;
  box-shadow: 0 0 10px var(--knime-gray-dark-semi),
    0 0 4px var(--knime-gray-dark-semi);
  display: flex;
  justify-content: center;

  &:hover {
    box-shadow: 0 0 10px var(--knime-gray-dark-semi),
      0 0 10px var(--knime-gray-dark-semi);
  }

  &.button {
    display: flex;

    & :deep(svg) {
      width: 60px;
      height: 60px;
      stroke: var(--knime-dove-gray);
      stroke-width: calc(32px / 60);
      position: absolute;
      margin: 0;
      top: 0;
    }
  }

  &.primary:hover {
    background-color: var(--theme-button-background-color);

    & :deep(svg) {
      stroke: var(--theme-button-foreground-color);
    }
  }
}
</style>
