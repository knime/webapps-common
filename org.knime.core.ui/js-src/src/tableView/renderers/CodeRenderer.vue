<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import xml from "highlight.js/lib/languages/xml";

import "./codeRenderer.css";
import type { ColumnContentType } from "../types/Table";

export interface CodeRendererProps {
  content: string;
  language: Extract<ColumnContentType, "json" | "xml">;
}

hljs.registerLanguage("json", json);
hljs.registerLanguage("xml", xml);

const props = defineProps<CodeRendererProps>();

const highlightedCode = computed(
  () => hljs.highlight(props.content, { language: props.language }).value,
);

onBeforeMount(async () => {
  await document.fonts.load("400 1em Roboto Mono");
});
</script>

<template>
  <div class="knime-cell-content">
    <pre><code v-html="highlightedCode" /></pre>
  </div>
</template>

<style scoped>
.knime-cell-content {
  max-width: fit-content;
}

pre {
  margin: 0;
  max-width: fit-content;
}

code {
  font-family: "Roboto Mono", monospace;
  font-weight: 400;
}
</style>
