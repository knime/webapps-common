<script lang="ts">
import { defineComponent } from "vue";

import ArrowIcon from "@knime/styles/img/icons/arrow-back.svg";

import FileExplorerItemBase from "./FileExplorerItemBase.vue";

export default defineComponent({
  name: "FileExplorerItemBack",
  components: {
    ArrowIcon,
    FileExplorerItemBase,
  },
  props: {
    isDragging: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<template>
  <FileExplorerItemBase
    :is-dragging="isDragging"
    :is-selected="false"
    class="file-explorer-item-back"
    title="Go back"
  >
    <template #icon>
      <ArrowIcon class="arrow-icon" />
    </template>

    <td class="item-name hidden">Go back to parent directory</td>
  </FileExplorerItemBase>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.hidden {
  display: none;
}

.file-explorer-item-back {
  cursor: pointer;

  &:focus {
    outline: none;

    &.keyboard-focus {
      @mixin focus-outline;
    }
  }

  & .arrow-icon {
    stroke: var(--knime-dove-gray);
  }

  &:hover {
    & .arrow-icon {
      stroke: var(--knime-masala);
    }
  }
}
</style>
