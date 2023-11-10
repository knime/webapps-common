<script setup lang="ts">
defineProps<{
  caption: string;
  id: undefined | string;
  scale: boolean;
}>();
</script>

<template>
  <figure v-if="caption" :id="id" :class="{ scale }">
    <slot />
    <figcaption>{{ caption }}</figcaption>
  </figure>
  <slot v-else :id="id" />
</template>

<style scoped>
figure {
  margin: 0;

  &.scale {
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
}
</style>
