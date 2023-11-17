<script setup lang="ts">
import { toRef } from "vue";
import usePaddingTopBottomCssVars from "./paddingTopBottom/useCssVars";
const props = defineProps<{
  content: string;
  paddingTopBottom: number;
}>();

const cssVars = usePaddingTopBottomCssVars(toRef(props, "paddingTopBottom"));
</script>

<template>
  <span :style="cssVars" class="knime-cell-content" v-html="content" />
</template>

<style scoped>
@import url("./paddingTopBottom/styles.css");
</style>
