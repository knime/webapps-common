<script setup lang="ts">
defineProps<{
  error: string;
}>();
</script>

<template>
  <div :title="error">{{ error }}</div>
</template>

<style lang="postcss" scoped>
div {
  font-weight: 300;
  font-size: 11px;
  line-height: calc(var(--space-base) * 3);
  min-height: calc(var(--space-base) * 3);
  color: var(--theme-color-error);
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Limit to two lines */

  /* for webkit-browsers (e.g. Chrome) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;

  /* for other browsers */
  max-height: 24px;
}
</style>
