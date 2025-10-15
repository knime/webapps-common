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
  z-index: 1;
  background-color: var(--knime-gray-ultra-light);

  & .section-header-layout-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--knime-silver-sand);

    & h3 {
      margin: 0;
      font-size: 16px;
      line-height: 40px;
      color: var(--knime-masala);
    }
  }
}
</style>
