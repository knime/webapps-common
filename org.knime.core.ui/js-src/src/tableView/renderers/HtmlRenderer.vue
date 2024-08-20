<script setup lang="ts">
defineProps<{
  content: string;
}>();
</script>

<template>
  <div class="knime-cell-content" v-html="content" />
</template>

<style scoped>
.knime-cell-content {
  min-width: min-content;

  /* Those properties are needed to ensure the correct calculation of auto column sizes and row heights. The max width
  is responsible for the correct width and flex results in the div being as high as its content. */
  max-width: fit-content;
  display: flex;
}
</style>
