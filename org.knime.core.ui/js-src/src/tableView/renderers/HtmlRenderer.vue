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
}
</style>
