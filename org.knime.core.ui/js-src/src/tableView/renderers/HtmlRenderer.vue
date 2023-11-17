<script setup lang="ts">
defineProps<{
  content: string;
}>();
</script>

<template>
  <span class="knime-cell-content" v-html="content" />
</template>
