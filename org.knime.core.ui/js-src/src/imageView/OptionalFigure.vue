<script setup lang="ts">
defineProps<{
  caption: string;
  id: undefined | string;
  scale: boolean;
}>();
</script>

<template>
  <figure v-if="caption" :id="id" :class="['image-view-figure', { scale }]">
    <slot />
    <figcaption>{{ caption }}</figcaption>
  </figure>
  <slot v-else :id="id" />
</template>

<style scoped>
.image-view-figure {
  margin: 0;

  &.scale {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }
}
</style>
