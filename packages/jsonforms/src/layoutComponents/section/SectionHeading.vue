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

<style scoped>
.section-header {
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 0 calc(-1 * var(--horizontal-dialog-padding, 0));
  background-color: var(--kds-color-surface-default);

  & .section-header-layout-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - var(--horizontal-dialog-padding, 0) * 2);
    margin: 0 var(--horizontal-dialog-padding, 0);
    border-bottom: var(--kds-border-base-muted);

    & h3 {
      margin: 0;
      font-size: 16px;
      line-height: 40px;
      color: var(--kds-color-text-and-icon-neutral);
    }
  }
}
</style>
