<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  errors: Array<string>;
}>();
const displayableErrors = computed(() => props.errors.join("; "));
</script>

<template>
  <div :title="displayableErrors">{{ displayableErrors }}</div>
</template>

<style lang="postcss" scoped>
div {
  font-weight: 300;
  font-size: 10px;
  line-height: 12px;
  min-height: 12px;
  color: var(--theme-color-error);
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
