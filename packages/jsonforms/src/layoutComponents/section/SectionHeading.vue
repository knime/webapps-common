<script setup lang="ts">
defineProps<{
  titleText: string;
}>();
</script>

<template>
  <div class="section-header">
    <div class="section-header-layout-container">
      <h3>
        {{ titleText }}
      </h3>
      <slot name="right-buttons" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.section-header {
  position: sticky;
  top: 0;
  background-color: var(--knime-gray-ultra-light);
  z-index: 1;
  margin: 0 calc(-1 * var(--horizontal-dialog-padding));

  & .section-header-layout-container {
    border-bottom: 1px solid var(--knime-silver-sand);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - var(--horizontal-dialog-padding) * 2);
    margin: 0 var(--horizontal-dialog-padding);

    & h3 {
      color: var(--knime-masala);
      font-size: 16px;
      line-height: 40px;
      margin: 0;
    }
  }
}
</style>
