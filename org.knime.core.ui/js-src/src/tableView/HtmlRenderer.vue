<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  content: string;
  paddingTopBottom: number;
}>();

const cssVars = computed(() => {
  return {
    "--knime-cell-padding-top": `${props.paddingTopBottom}px`,
    "--knime-cell-padding-bottom": `${props.paddingTopBottom}px`,
  };
});
</script>

<template>
  <span :style="cssVars" class="knime-cell-content" v-html="content" />
</template>

<style scoped>
.knime-cell-content {
  padding-top: var(--knime-cell-padding-top);
  padding-bottom: var(--knime-cell-padding-bottom);
  display: inline-block;
}
</style>
