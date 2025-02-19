<script setup lang="ts">
import CircleCloseFilled from "@knime/styles/img/icons/circle-close_filled.svg";

defineProps<{
  error: string;
}>();
</script>

<template>
  <div :title="error" class="error">
    <CircleCloseFilled class="icon" />
    {{ error }}
  </div>
</template>

<style lang="postcss" scoped>
.error {
  font-weight: 300;
  font-size: 11px;
  line-height: var(--error-message-single-line-height);
  min-height: var(--error-message-single-line-height);
  color: var(--theme-color-error);
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;

  /* Limit to two lines */

  /* for webkit-browsers (e.g. Chrome) */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;

  /* for other browsers */
  max-height: calc(var(--error-message-single-line-height) * 2);

  & .icon {
    height: var(--error-message-single-line-height);
    vertical-align: middle;
  }
}
</style>
