<script setup lang="ts">
defineProps<{
  caption: string;
  id: undefined | string;
  scale: boolean;
}>();
</script>

<template>
  <figure v-if="caption" :id="id" :class="['figure', { scale }]">
    <slot />
    <figcaption class="figcaption">{{ caption }}</figcaption>
  </figure>
  <slot v-else :id="id" />
</template>

<style scoped>
@media print {
  .figure {
    break-inside: avoid;
  }
}

figure {
  margin: 0;

  &.scale {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  & .figcaption {
    text-overflow: ellipsis;
    font-size: 13px;
    overflow-wrap: break-word;
  }
}
</style>
