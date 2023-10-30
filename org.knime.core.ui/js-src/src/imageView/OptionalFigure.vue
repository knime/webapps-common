<script setup lang="ts">
defineProps<{
  caption: string;
  id: undefined | string;
}>();
</script>

<template>
  <figure v-if="caption" :id="id" class="image-view-figure">
    <slot />
    <figcaption>{{ caption }}</figcaption>
  </figure>
  <slot v-else :id="id" />
</template>

<style scoped>
.image-view-figure {
  margin: 0;
  height: calc(100% - 19px);
}
</style>
