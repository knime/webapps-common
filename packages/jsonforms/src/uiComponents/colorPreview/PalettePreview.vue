<script setup lang="ts">
import { computed } from "vue";

import type { Palette } from "../ColorPreviewControl.vue";

import ColorPreviewEmptyState from "./ColorPreviewEmptyState.vue";

type Props = {
  palette: Palette;
};

const MAX_COLUMNS = 8;

const props = defineProps<Props>();

const hasPaletteColors = computed(() => props.palette.colors.length > 0);

const columns = computed(() =>
  Math.max(1, Math.min(MAX_COLUMNS, props.palette.colors.length)),
);

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${columns.value}, minmax(0, 1fr))`,
}));
</script>

<template>
  <div class="palette-preview">
    <div v-if="hasPaletteColors" class="palette-grid" :style="gridStyle">
      <div
        v-for="(color, index) in palette.colors"
        :key="index"
        class="color-cell"
        :style="{ background: color }"
      />
    </div>
    <ColorPreviewEmptyState v-else class="empty-state" />
  </div>
</template>

<style scoped>
.palette-preview {
  --palette-grid-entry-height: var(--kds-dimension-component-height-1-5x);
  --palette-grid-gap: var(--kds-spacing-container-0-25x);

  min-height: calc(
    2 * var(--palette-grid-entry-height) + var(--palette-grid-gap)
  );

  & .palette-grid {
    --min-grid-rows: 2;

    display: grid;
    grid-template-rows: repeat(
      var(--min-grid-rows),
      var(--palette-grid-entry-height)
    );
    grid-auto-rows: var(--palette-grid-entry-height);
    gap: var(--palette-grid-gap);

    & .color-cell {
      height: var(--palette-grid-entry-height);
      border-radius: var(--kds-border-radius-container-0-25x);
    }
  }

  & .empty-state {
    height: var(--palette-grid-entry-height);
  }
}
</style>
