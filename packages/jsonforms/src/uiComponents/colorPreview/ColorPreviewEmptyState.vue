<script setup lang="ts">
import { KdsEmptyState } from "@knime/kds-components";
</script>

<template>
  <div class="empty-state-wrapper">
    <KdsEmptyState headline="No colors" />
  </div>
</template>

<style scoped>
.empty-state-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--kds-color-surface-muted);
  border: var(--kds-border-base-subtle);
  border-radius: var(--kds-border-radius-container-0-25x);
}
</style>
