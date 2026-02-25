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
  position: relative;

  /* Limit to two lines */

  /* for webkit-browsers (e.g. Chrome) */
  display: -webkit-box;
  min-height: var(--error-message-single-line-height);

  /* for other browsers */
  max-height: calc(var(--error-message-single-line-height) * 2);
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  font-size: 11px;
  font-weight: 300;
  line-height: var(--error-message-single-line-height);
  color: var(--theme-color-error);
  -webkit-box-orient: vertical; /* stylelint-disable-line property-no-deprecated */

  & .icon {
    height: var(--error-message-single-line-height);
    vertical-align: middle;
  }
}
</style>
