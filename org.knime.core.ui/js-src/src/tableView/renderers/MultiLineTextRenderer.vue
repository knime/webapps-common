<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  text: string;
}>();

const lines = computed(() => props.text.split("\n"));
</script>

<template>
  <span class="knime-cell-content">
    <template v-for="(line, ind) in lines">
      {{ line }}<br v-if="ind < lines.length - 1" :key="ind" />
    </template>
  </span>
</template>

<style scoped>
.knime-cell-content {
  word-break: normal;
  display: inline-block;
}
</style>
