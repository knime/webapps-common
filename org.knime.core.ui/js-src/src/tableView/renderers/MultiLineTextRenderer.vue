<script setup lang="ts">
import { toRef, computed } from "vue";
import usePaddingTopBottomCssVars from "./paddingTopBottom/useCssVars";

const props = defineProps<{
  text: string;
  paddingTopBottom: number;
}>();

const lines = computed(() => props.text.split("\n"));

const cssVars = usePaddingTopBottomCssVars(toRef(props, "paddingTopBottom"));
</script>

<template>
  <span class="knime-cell-content" :style="cssVars">
    <template v-for="(line, ind) in lines">
      <br v-if="ind > 0" :key="ind" />
      {{ line }}
    </template>
  </span>
</template>

<style scoped>
@import url("./paddingTopBottom/styles.css");

.knime-cell-content {
  white-space: pre;
  word-break: normal;
}
</style>
