<script setup lang="ts">
// Those properties are needed to ensure the correct calculation of auto column sizes and row heights. The max width is
// responsible for the correct width and flex results in the div being as high as its content.
const AUTO_SIZE_STYLES = {
  maxWidth: "fit-content",
  display: "flex",
};

export interface HTMLRendererProps {
  content: string;
  usedForAutoSizeCalculation: true | undefined;
}

const props = defineProps<HTMLRendererProps>();

const additionalStyles = props.usedForAutoSizeCalculation
  ? AUTO_SIZE_STYLES
  : {};
</script>

<template>
  <div class="knime-cell-content" :style="additionalStyles" v-html="content" />
</template>

<style scoped>
.knime-cell-content {
  min-width: min-content;
}
</style>
