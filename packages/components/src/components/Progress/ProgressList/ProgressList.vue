<script setup lang="ts"></script>

<template>
  <div class="progress-list">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.progress-list {
  &:deep(.progress-wrapper) {
    &:not(:first-child) {
      border-top: 1px solid var(--knime-porcelain);
    }
  }
}
</style>
