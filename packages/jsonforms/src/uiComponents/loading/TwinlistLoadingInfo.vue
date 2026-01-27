<script setup lang="ts">
import { LoadingIcon } from "@knime/components";
</script>

<template>
  <div class="info">
    <span>Loading...</span>
    <LoadingIcon class="icon" />
  </div>
</template>

<style scoped>
.info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;

  & .icon {
    height: 14px;
  }
}
</style>
