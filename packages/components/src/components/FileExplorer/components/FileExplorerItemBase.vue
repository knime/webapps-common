<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FileExplorerItemBase",
  props: {
    isSelected: {
      type: Boolean,
      required: true,
    },

    isDragging: {
      type: Boolean,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<template>
  <tr
    class="file-explorer-item-base"
    :class="{
      selected: !isDragging && isSelected,
      dragging: isDragging && isSelected,
      disabled,
    }"
    data-test-id="file-explorer-item"
  >
    <td class="item-icon">
      <slot name="icon" />
    </td>
    <slot />
  </tr>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.file-explorer-item-base {
  --icon-size: 18;
  --item-padding: 8;
  --item-bg-color: var(--knime-gray-ultra-light);
  --item-font-size: 13px;

  --selection-color: var(--knime-cornflower-dark);
  --selection-bg-color: var(--knime-cornflower-semi);

  user-select: none;
  background: var(--item-bg-color);
  transition: box-shadow 0.15s;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  margin-bottom: 2px;
  align-items: center;

  /* add border that matches background to prevent jumping when the dragging-over styles add a border */
  border: 1px solid var(--item-bg-color);
  font-size: var(--item-font-size);

  &:hover:not(.disabled) {
    box-shadow: var(--shadow-elevation-1);
  }

  & .item-icon {
    padding: calc(calc(var(--item-padding) - 2) * 1px);
    position: relative;

    & :slotted(svg) {
      display: flex;

      @mixin svg-icon-size var(--icon-size);

      stroke: var(--knime-masala);
    }
  }

  &.selected,
  &.dragging {
    color: var(--selection-color);
    background: var(--selection-bg-color);
    border: 1px solid var(--selection-bg-color);

    & .item-icon :slotted(svg) {
      stroke: var(--selection-color);
    }
  }

  &.dragging-over {
    background: var(--knime-porcelain);
    border: 1px solid var(--knime-dove-gray);
  }

  & td,
  & :slotted(td) {
    /* Prevent children from interfering with drag events */
    pointer-events: none;
  }
}
</style>
