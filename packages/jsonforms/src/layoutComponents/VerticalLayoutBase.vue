<script setup lang="ts">
import type { UISchemaElement } from "@jsonforms/core";

defineProps<{ elements: UISchemaElement[] }>();
</script>

<template>
  <div class="vertical-layout">
    <template v-for="(element, index) in elements" :key="index">
      <slot :element="element" :index="index" />
    </template>
  </div>
</template>

<style scoped lang="postcss">
.vertical-layout {
  display: flex;
  flex-direction: column;
  --vertical-padding: var(--space-16);

  /* TODO: UIEXT-1061 workaround to make the last dialog element fill the remaining height, used in RichTextControl */
  &:last-child {
    flex: 1;
  }

  /* if a dialog starts with a section header we don't need extra top padding, otherwise adding it here */
  &:not(:has(:first-child > .section:first-child)) {
    padding-top: var(--vertical-padding);
    gap: var(--error-message-min-reserved-space);
  }
}
</style>
