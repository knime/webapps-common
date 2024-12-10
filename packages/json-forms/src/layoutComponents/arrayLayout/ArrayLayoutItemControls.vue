<script>
import { FunctionButton } from "@knime/components";
import ArrowDownIcon from "@knime/styles/img/icons/arrow-down.svg";
import ArrowUpIcon from "@knime/styles/img/icons/arrow-up.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";

export default {
  name: "ArrayLayoutItemControls",
  components: {
    TrashIcon,
    FunctionButton,
    ArrowUpIcon,
    ArrowDownIcon,
  },
  props: {
    isFirst: {
      type: Boolean,
      default: false,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    showSortControls: {
      type: Boolean,
      default: false,
    },
    showDeleteButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["moveUp", "moveDown", "delete"],
};
</script>

<template>
  <div class="item-controls">
    <slot name="before" />
    <FunctionButton
      v-if="showSortControls"
      :disabled="isFirst"
      title="Move up"
      @click="$emit('moveUp')"
    >
      <ArrowUpIcon />
    </FunctionButton>
    <FunctionButton
      v-if="showSortControls"
      :disabled="isLast"
      title="Move down"
      @click="$emit('moveDown')"
    >
      <ArrowDownIcon />
    </FunctionButton>
    <FunctionButton
      v-if="showDeleteButton"
      class="trashButton"
      title="Remove"
      @click="$emit('delete')"
    >
      <TrashIcon class="trash" />
    </FunctionButton>
  </div>
</template>

<style lang="postcss" scoped>
.item-controls {
  display: flex;
}
</style>
