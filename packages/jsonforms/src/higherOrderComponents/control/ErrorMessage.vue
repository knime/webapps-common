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
  font-weight: 400;
  font-size: 12px;
  line-height: 13px;
  color: var(--theme-color-kudos);
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
