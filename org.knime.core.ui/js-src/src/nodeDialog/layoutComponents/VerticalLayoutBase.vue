<script setup lang="ts">
defineProps<{ elements: object[] }>();
</script>

<template>
  <div class="vertical-layout">
    <div
      v-for="(element, index) in elements"
      :key="index"
      class="vertical-layout-item"
    >
      <slot :element="element" :index="index" />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.vertical-layout {
  display: flex;
  flex-direction: column;
  gap: 20px;

  --vertical-padding: 11px;

  padding-bottom: var(--vertical-padding);

  /* TODO: UIEXT-1061 workaround to make the last dialog element fill the remaining height, used in RichTextInput */

  &:last-child {
    flex: 1;

    & .vertical-layout-item:last-child {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
  }

  /* if a dialog starts with a section header we don't need extra top padding, otherwise adding it here */
  &:not(:has(> :first-child > div > .section:first-child)) {
    padding-top: var(--vertical-padding);
  }
}
</style>
