<script lang="ts">
import { defineComponent } from "vue";

import PlusIcon from "@knime/styles/img/icons/plus-small.svg";

import Tooltip from "../Tooltip/Tooltip.vue";

import Button from "./Button.vue";

export default defineComponent({
  name: "PlusButton",
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

  display: flex;
  justify-content: center;
  width: 60px;
  height: 60px;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  box-shadow:
    0 0 10px var(--knime-gray-dark-semi),
    0 0 4px var(--knime-gray-dark-semi);

  &:hover {
    box-shadow:
      0 0 10px var(--knime-gray-dark-semi),
      0 0 10px var(--knime-gray-dark-semi);
  }

  &.button {
    display: flex;

    & :deep(svg) {
      position: absolute;
      top: 0;
      width: 60px;
      height: 60px;
      margin: 0;
      stroke: var(--knime-dove-gray);
      stroke-width: calc(32px / 60);
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
