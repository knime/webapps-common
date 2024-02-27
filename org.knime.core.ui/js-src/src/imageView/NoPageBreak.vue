<script setup lang="ts">
/**
 * This component and "break-inside: avoid" in the OptionalLabel.vue/OptionalFigure.vue are required due to a chromium
 * bug regarding the size calculation of images when creating PDFs and when the image container (with a label/caption)
 * does not fit completely on a page (due to other elements on the page) (https://issues.chromium.org/issues/41485887).
 */
defineProps<{
  scale: boolean;
}>();
</script>

<template>
  <div :class="{ scale }">
    <slot />
  </div>
</template>

<style scoped>
.scale {
  display: flex;
  flex-direction: column;
  min-height: 0;
}
</style>
