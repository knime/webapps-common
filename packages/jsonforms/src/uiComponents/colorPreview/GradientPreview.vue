<script setup lang="ts">
import { computed } from "vue";

import type { Gradient } from "../ColorPreviewControl.vue";

import ColorPreviewEmptyState from "./ColorPreviewEmptyState.vue";

type Props = {
  gradient: Gradient;
};

const props = defineProps<Props>();

const hasGradientColors = computed(() => props.gradient.colors.length > 0);

const computedGradient = computed(() => {
  const stops = props.gradient.stops;
  if (stops === null) {
    return props.gradient.colors.join(", ");
  }
  return props.gradient.colors
    .map((color, index) => `${color} ${stops[index]}%`)
    .join(", ");
});

const gradientBackground = computed(
  () => `linear-gradient(to right in lab, ${computedGradient.value})`,
);
</script>

<template>
  <div class="gradient-preview">
    <div
      v-if="hasGradientColors"
      class="gradient-bar"
      :style="{ background: gradientBackground }"
    />
    <ColorPreviewEmptyState v-else />
  </div>
</template>

<style scoped>
.gradient-preview {
  height: var(--kds-dimension-component-height-1-5x);

  & .gradient-bar {
    border-radius: var(--kds-border-radius-container-0-25x);
  }

  & > * {
    height: 100%;
  }
}
</style>
