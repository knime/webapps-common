<script setup lang="ts">
import { KdsButton } from "@knime/kds-components";

const {
  isFirst = false,
  isLast = false,
  showSortControls = false,
  isHidingControlHeader = false,
} = defineProps<{
  isFirst?: boolean;
  isLast?: boolean;
  showSortControls?: boolean;
  isHidingControlHeader?: boolean;
}>();

defineEmits<{
  moveUp: [];
  moveDown: [];
  delete: [];
}>();
</script>

<template>
  <div
    class="item-controls"
    :style="{ marginTop: isHidingControlHeader ? '0px' : '20px' }"
  >
    <KdsButton
      v-if="showSortControls"
      :disabled="isFirst"
      size="small"
      variant="transparent"
      leading-icon="arrow-up"
      ariaLabel="Move item up"
      @click="$emit('moveUp')"
    />
    <KdsButton
      v-if="showSortControls"
      :disabled="isLast"
      size="small"
      variant="transparent"
      leading-icon="arrow-down"
      ariaLabel="Move item down"
      @click="$emit('moveDown')"
    />
    <KdsButton
      size="small"
      class="trashButton"
      leading-icon="trash"
      variant="transparent"
      ariaLabel="Delete item"
      @click="$emit('delete')"
    />
  </div>
</template>

<style lang="postcss" scoped>
.item-controls {
  display: flex;
  margin-bottom: var(--kds-spacing-container-0-12x);
}
</style>
